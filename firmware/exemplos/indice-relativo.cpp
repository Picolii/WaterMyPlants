#include <Arduino.h>

// Calibração inicial de um único sensor/vaso, em 19/10/2026.
const int SENSOR = 34;
const int VALOR_SECO = 3060;
const int VALOR_UMIDO = 2107;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SENSOR, ADC_11db);
}

void loop() {
  long soma = 0;

  for (int i = 0; i < 20; i++) {
    soma += analogRead(SENSOR);
    delay(10);
  }

  int leitura = soma / 20;
  float indice = 100.0f * (VALOR_SECO - leitura)
                 / (VALOR_SECO - VALOR_UMIDO);
  indice = constrain(indice, 0.0f, 100.0f);

  Serial.printf("Leitura: %d | Indice relativo: %.1f%%\n", leitura, indice);
  delay(800);
}
