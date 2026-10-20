// Registro do primeiro teste. Não é uma segunda unidade do firmware atual.
#include <Arduino.h>

const int SENSOR = 34;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SENSOR, ADC_11db);
}

void loop() {
  Serial.print("Sensor de solo: ");
  Serial.println(analogRead(SENSOR));
  delay(1000);
}
