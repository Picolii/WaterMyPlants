#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>

#if __has_include("secrets.h")
#include "secrets.h"
#else
#include "secrets.example.h"
#endif

#include "page.h"

// Calibração inicial de um único sensor/vaso, em 19/10/2026.
const int SENSOR = 34;
const int VALOR_SECO = 3060;
const int VALOR_UMIDO = 2107;

const uint32_t INTERVALO_AMOSTRA_MS = 10;
const uint32_t INTERVALO_LEITURA_MS = 1000;
const uint32_t INTERVALO_WIFI_MS = 20000;
const uint8_t TOTAL_AMOSTRAS = 20;

WebServer server(80);
uint32_t ultimaAmostra = 0;
uint32_t ultimoCiclo = 0;
uint32_t ultimaTentativaWiFi = 0;
uint32_t horarioLeitura = 0;
long soma = 0;
uint8_t amostras = 0;
int leitura = 0;
float indice = 0;
bool leituraPronta = false;
bool wifiConfigurado = false;
bool servidorIniciado = false;

void atualizarSensor(uint32_t agora) {
  if (amostras < TOTAL_AMOSTRAS && agora - ultimaAmostra >= INTERVALO_AMOSTRA_MS) {
    ultimaAmostra = agora;
    soma += analogRead(SENSOR);
    amostras++;
  }

  if (amostras == TOTAL_AMOSTRAS && agora - ultimoCiclo >= INTERVALO_LEITURA_MS) {
    leitura = soma / TOTAL_AMOSTRAS;
    indice = 100.0f * (VALOR_SECO - leitura) / (VALOR_SECO - VALOR_UMIDO);
    indice = constrain(indice, 0.0f, 100.0f);
    horarioLeitura = agora;
    leituraPronta = true;
    Serial.printf("Leitura: %d | Indice relativo: %.1f%%\n", leitura, indice);
    soma = 0;
    amostras = 0;
    ultimoCiclo = agora;
  }
}

void enviarLeitura() {
  const uint32_t agora = millis();
  String json = "{\"device_id\":\"watermyplants-esp32-01\",\"calibration_id\":\"solo-inicial-2026-10-19\",\"ready\":";
  json += leituraPronta ? "true" : "false";
  json += ",\"raw\":";
  json += leituraPronta ? String(leitura) : "null";
  json += ",\"relative_percent\":";
  json += leituraPronta ? String(indice, 1) : "null";
  json += ",\"sample_age_ms\":";
  json += leituraPronta ? String(agora - horarioLeitura) : "null";
  json += ",\"uptime_ms\":" + String(agora);
  json += ",\"wifi_rssi_dbm\":" + String(WiFi.RSSI());
  json += "}";
  server.sendHeader("Cache-Control", "no-store");
  server.send(200, "application/json; charset=utf-8", json);
}

void atualizarWiFi(uint32_t agora) {
  if (!wifiConfigurado) return;

  if (WiFi.status() == WL_CONNECTED) {
    if (!servidorIniciado) {
      server.begin();
      servidorIniciado = true;
      Serial.print("Wi-Fi conectado! Abra no celular, na mesma rede: http://");
      Serial.println(WiFi.localIP());
    }
    server.handleClient();
    return;
  }

  if (servidorIniciado) {
    server.stop();
    servidorIniciado = false;
    Serial.println("Wi-Fi desconectado. A leitura local continua; tentando reconectar.");
  }

  if (agora - ultimaTentativaWiFi >= INTERVALO_WIFI_MS) {
    ultimaTentativaWiFi = agora;
    Serial.println("Tentando conectar ao Wi-Fi (2,4 GHz)...");
    WiFi.reconnect();
  }
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SENSOR, ADC_11db);

  server.on("/", HTTP_GET, []() {
    server.sendHeader("Cache-Control", "no-store");
    server.send_P(200, "text/html; charset=utf-8", PAGINA);
  });
  server.on("/api/leitura", HTTP_GET, enviarLeitura);
  server.onNotFound([]() {
    server.send(404, "text/plain; charset=utf-8", "Rota inexistente");
  });

  wifiConfigurado = WIFI_SSID[0] != '\0';
  if (wifiConfigurado) {
    WiFi.persistent(false);
    WiFi.mode(WIFI_STA);
    WiFi.setAutoReconnect(true);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    ultimaTentativaWiFi = millis();
    Serial.println("Conectando ao Wi-Fi. As leituras continuam durante a tentativa.");
  } else {
    Serial.println("Wi-Fi não configurado. Preencha include/secrets.h e grave novamente.");
  }
}

void loop() {
  atualizarSensor(millis());
  atualizarWiFi(millis());
  delay(2);
}
