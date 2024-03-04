// for Lilygo TTGO T-Dongle
#include "Arduino.h"
#include "WiFi.h"
#include "pin_config.h"
#include <EEPROM.h>
#include <esp_now.h>

/* external library */
/* To use Arduino, you need to place lv_conf.h in the \Arduino\libraries directory */
#include "OneButton.h" // https://github.com/mathertel/OneButton
#include "TFT_eSPI.h"  // https://github.com/Bodmer/TFT_eSPI
#include <FastLED.h> // https://github.com/FastLED/FastLED

#define display_orientation_offset 0
#define ssid_num_offset 2
#define channel_offset 4


// hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE
#define HSV_RED 0
#define HSV_GREEN 100
#define HSV_BLUE 150
#define HSV_SATURATE 255

bool esp_now_enabled;
uint8_t lcd_orientation = 1;
int state = 0; // 0:normal, 1:esp_now, 2: for future



TFT_eSPI tft = TFT_eSPI();       // LCD pins are defined in pin_config.h
CRGB leds;
OneButton button(BTN_PIN, true); // BTN_PIN is 0 defined in pin_config.h

// 舊的奇怪用法
// #define PRINT_STR(str, x, y)                                                                                                                         \
//   do {                                                                                                                                               \
//                                                                                                                                                      \
//     tft.drawString(str, x, y);                                                                                                                       \
//     y += 8;                                                                                                                                          \
//   } while (0);

char ssid[20] = "ESP32-Access-Point";
const char *password = "123456789";
byte setting_ssid, setting_channel;

int connected_stations =0;

void print_to_LCD(String str, int x, int y){
  tft.drawString(str, x, y);
  y += 8;
}

void led_task(void *param){
  while (1){
    static uint8_t hue = 0;
    leds = CHSV(hue++, 0XFF, 100);
    FastLED.show();
    delay(50);
  }
}

byte read_ssid_num(){
  return EEPROM.read(ssid_num_offset);
}
void write_ssid_num(byte ssid_num){
  EEPROM.write(ssid_num_offset, ssid_num);
  EEPROM.commit();
}

byte read_channel(){
  return EEPROM.read(channel_offset);
}

void write_channel(byte channel){
  EEPROM.write(channel_offset, channel);
  EEPROM.commit();
}

void clickHandler(){
  switch (state){
    case 0:
      lcd_orientation = (lcd_orientation + 2) % 4;
      EEPROM.write(0, lcd_orientation);
      EEPROM.commit();
      main_screen(lcd_orientation);
      break;
    case 1:
      setting_ssid++;
      if (setting_ssid > 8) setting_ssid = 1;
      set_ssid_screen();
      break;
    case 2:
      setting_channel++;
      if (setting_channel > 14) setting_channel = 1;
      set_channel_screen();
      break;
    default:
      break;
  }

}

void longPressHandler(){
  switch (state){
    case 0:
      setting_ssid = read_ssid_num();
      setting_channel = read_channel();
      state = 1;
      set_ssid_screen();
      break;
    case 1:
      state = 2;
      set_channel_screen();
      break;
    case 2:
      write_ssid_num(setting_ssid);
      write_channel(setting_channel);
      ESP.restart();
      break;
    default:
      break;
  }
}
void main_screen(uint8_t lcd_orientation){
  tft.setRotation(lcd_orientation);

  tft.fillScreen(TFT_BLACK);

  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  print_to_LCD(ssid, 0, 0);

  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  print_to_LCD("Channel: "+String(read_channel()), 0, 29); 
}


void set_ssid_screen(){
  tft.fillScreen(TFT_BLACK);

  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  print_to_LCD("Set SSID:", 0, 0);

  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  print_to_LCD("SA00"+String(setting_ssid), 0, 32);
}

void set_channel_screen(){
  tft.fillScreen(TFT_BLACK);

  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  print_to_LCD("Set Channel:", 0, 0);

  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  print_to_LCD(String(setting_channel), 0, 32);
}

void setup(){
  Serial.begin(115200);

  button.attachClick(clickHandler);
  button.attachLongPressStart(longPressHandler);

  button.setPressMs(1000); // long press time

  // Read display orientation from EEPROM
  EEPROM.begin(4096);
  int data = EEPROM.read(0);
  // for test if EEPROM id empty, 
  // data = 255;
  if (data > 3)  {
    Serial.println("init EEPROM ");
    EEPROM.write(0, 1); // lcd_orientation = 1
    EEPROM.write(ssid_num_offset, 1);
    EEPROM.write(channel_offset, 1);
    EEPROM.commit();
  }
  else lcd_orientation = data;


  //  Initialise TFT
  pinMode(TFT_LEDA_PIN, OUTPUT); // 似乎沒必要，先留著
  digitalWrite(TFT_LEDA_PIN, 0); // 似乎沒必要，先留著
  tft.init();
  tft.setTextFont(4);

  // BGR ordering is typical
  FastLED.addLeds<APA102, LED_DI_PIN, LED_CI_PIN, BGR>(&leds, 1);
  // xTaskCreatePinnedToCore(led_task, "led_task", 1024, NULL, 1, NULL, 1); // Arduino使用的是ESP32的Core1，Core0被用来处理wifi和Ble。
  leds = CHSV(HSV_BLUE, HSV_SATURATE, 20); // hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE, Full saturation, Brightness: 20 is OK
  FastLED.show();

  Serial.printf("CPU freq: %d MHz\n", getCpuFrequencyMhz());

  state=0; // 0: main, 1: setting ssid, 0: setting channel

  // read ssid_num and cheanel from EEPROM
  ssid[0]='S'; ssid[1]='A'; ssid[2]='0'; ssid[3]='0'; 
  ssid[4]=48+read_ssid_num(); ssid[5]=0;

  Serial.println(ssid);
  Serial.println(read_channel());

  //bool softAP(const char* ssid, const char* passphrase = NULL, int channel = 1, int ssid_hidden = 0, int max_connection = 4);
  //WiFi.softAP(ssid, password); // Remove the password parameter, if you want the AP (Access Point) to be open
  // Channel 14 問題： ESP32-S3 若指定 Channel 14，會有 [  1191][E][WiFiAP.cpp:168] softAP(): set AP config failed
  WiFi.softAP(ssid, password, read_channel(), 0, 10); // ssid, passphrase, channel, ssid_hidden, max_connection
                                        // Remove the password parameter, if you want the AP (Access Point) to be open

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  main_screen(lcd_orientation);

}

void loop(){
  button.tick();
  delay(50);                               
  if (state==0) {
    //Serial.println(connected_stations);
    if (WiFi.softAPgetStationNum()!=connected_stations) {
      connected_stations = WiFi.softAPgetStationNum();
      tft.setTextColor(TFT_ORANGE, TFT_BLACK);
      print_to_LCD("Clients: "+ String(connected_stations), 0, 58);
    }
  }
}
