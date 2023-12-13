// Simulate iBox receiver for Lilygo TTGO T-Dongle
#include "Arduino.h"
// #include "SD_MMC.h"
#include "WiFi.h"
#include "pin_config.h"
#include <esp_now.h>

/* external library */
/* To use Arduino, you need to place lv_conf.h in the \Arduino\libraries directory */
#include "TFT_eSPI.h" // https://github.com/Bodmer/TFT_eSPI

// #include "lv_conf.h"
// #include "lvgl.h"    // https://github.com/lvgl/lvgl
#include <FastLED.h> // https://github.com/FastLED/FastLED
// hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE
#define HSV_RED 0
#define HSV_GREEN 100
#define HSV_BLUE 150
#define HSV_SATURATE 255

TFT_eSPI tft = TFT_eSPI();
CRGB leds;

void print_to_LCD(String str, int x, int y)
{
  tft.drawString(str, x, y);
  y += 8;
}

void lcd_info(uint8_t lcd_orientation)
{
  String ssid;

  tft.setRotation(lcd_orientation);

  tft.fillScreen(TFT_RED);
  int32_t x = 0, y = 15;
  tft.setTextColor(TFT_WHITE, TFT_RED);
  print_to_LCD("Listen to ESP-NOW", x, y);

  // x = 0;
  // y = 45;
  // tft.setTextColor(TFT_WHITE, TFT_RED);
  // print_to_LCD(sn, x, y);
}

// callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status)
{
  Serial.print("Last Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}

// callback function that will be executed when data is received
typedef struct test_struct
{
  int x;
  int y;
} test_struct;
test_struct myData;
void OnDataRecv(const uint8_t *mac, const uint8_t *incomingData, int len)
{
  memcpy(&myData, incomingData, sizeof(myData));
  Serial.print("Bytes received: ");
  Serial.println(len);
  Serial.print("x: ");
  Serial.println(myData.x);
  Serial.print("y: ");
  Serial.println(myData.y);
  Serial.println();

  char buffer[40];
  sprintf(buffer, "x:%d, y:%d", myData.x, myData.y); 
  print_to_LCD(buffer, 0, 45);
}

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
esp_now_peer_info_t peerInfo;
test_struct test;

uint8_t lcd_orientation = 1;
int state = 0; // 0:normal, 1:esp_now, 2: for future
void setup()
{
  Serial.begin(115200);

  //  Initialise TFT
  tft.init();
  tft.setTextFont(2);

  // BGR ordering is typical
  FastLED.addLeds<APA102, LED_DI_PIN, LED_CI_PIN, BGR>(&leds, 1);
  leds = CHSV(HSV_BLUE, HSV_SATURATE, 20); // hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE, Full saturation, Brightness: 20 is OK
  FastLED.show();

  lcd_info(lcd_orientation);

  tft.setTextFont(4);

  WiFi.mode(WIFI_STA);

  Serial.println(WiFi.macAddress());

  if (esp_now_init() != ESP_OK)
  {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_send_cb(OnDataSent);
  esp_now_register_recv_cb(OnDataRecv);

  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  peerInfo.ifidx = WIFI_IF_STA; // 沒這行會有 Failed to add peer 問題
  // register first peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  if (esp_now_add_peer(&peerInfo) != ESP_OK)
  {
    Serial.println("Failed to add peer");
    return;
  }

  Serial.println("Listen to ESP_NOW packages");
}

void loop()
{
}
