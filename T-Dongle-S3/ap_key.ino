
#include "Arduino.h"
#include "SD_MMC.h"
#include "WiFi.h"
//#include "logo.h"
// #include "lv_driver.h"
#include "pin_config.h"
#include <EEPROM.h>
#include <esp_now.h>

/* external library */
/* To use Arduino, you need to place lv_conf.h in the \Arduino\libraries directory */
#include "OneButton.h" // https://github.com/mathertel/OneButton
#include "TFT_eSPI.h"  // https://github.com/Bodmer/TFT_eSPI

// #include "lv_conf.h"
// #include "lvgl.h"    // https://github.com/lvgl/lvgl
#include <FastLED.h> // https://github.com/FastLED/FastLED

#define display_orientation_offset 0
#define sn_offset                  1
#define ssid_offset                20
#define esp_now_offset             40
#define ap_ip_offset               41

// hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE
#define HSV_RED                    0
#define HSV_GREEN                  100
#define HSV_BLUE                   150
#define HSV_SATURATE               255

TFT_eSPI tft = TFT_eSPI();
CRGB leds;
OneButton button(BTN_PIN, true);

#define PRINT_STR(str, x, y)                                                                                                                         \
  do {                                                                                                                                               \
                                                                                                                                                     \
    tft.drawString(str, x, y);                                                                                                                       \
    y += 8;                                                                                                                                          \
  } while (0);

void led_task(void *param) {
  while (1) {
    static uint8_t hue = 0;
    leds = CHSV(hue++, 0XFF, 100);
    FastLED.show();
    delay(50);
  }
}
void scan_wifi_rssi() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  Serial.println("scan start");
  // WiFi.scanNetworks will return the number of networks found
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0) {
    Serial.println("no networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  WiFi.mode(WIFI_OFF);
}

void print_info(uint8_t disp_orientation, bool disp_esp_now) {
  String ssid = read_ssid();
  String sn = read_sn();

  if (ssid == "No SSID") {
    ssid = "No SSID";
  } else {
    ssid = "SSID: " + ssid;
  }

  if (sn == "No S/N") {
    sn = "No S/N";
  } else {
    sn = "S/N: " + sn;
  }

  tft.setRotation(disp_orientation);

  if (disp_esp_now) {
    tft.fillScreen(TFT_RED);
    int32_t x = 0, y = 15;
    tft.setTextColor(TFT_WHITE, TFT_RED);
    PRINT_STR("ESP-NOW", x, y)
    x = 0;
    y = 45;
    tft.setTextColor(TFT_WHITE, TFT_RED);
    PRINT_STR(sn, x, y)
  } else {
    tft.fillScreen(TFT_BLACK);
    int32_t x = 0, y = 15;
    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    PRINT_STR(ssid, x, y)
    x = 14;
    y = 45;
    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    PRINT_STR(sn, x, y)
  }
}

String read_sn() {
  int snStrLen = EEPROM.read(sn_offset);
  if (snStrLen > 20) {
    return "No S/N";
  }

  char chars[snStrLen + 1];

  for (int i = 0; i < snStrLen; i++) {
    chars[i] = EEPROM.read(sn_offset + 1 + i);
  }
  chars[snStrLen] = '\0';
  return String(chars);
}

void write_sn(String sn) {
  int snStrLen = sn.length();
  EEPROM.write(sn_offset, snStrLen);
  for (int i = 0; i < snStrLen; i++) {
    EEPROM.write(sn_offset + 1 + i, sn[i]);
  }
  EEPROM.commit();
}

String read_ssid() {
  int snStrLen = EEPROM.read(ssid_offset);
  if (snStrLen > 20) {
    return "No SSID";
  }

  char chars[snStrLen + 1];

  for (int i = 0; i < snStrLen; i++) {
    chars[i] = EEPROM.read(ssid_offset + 1 + i);
  }
  chars[snStrLen] = '\0';
  return String(chars);
}

void write_ssid(String ssid) {
  int ssidStrLen = ssid.length();
  EEPROM.write(ssid_offset, ssidStrLen);
  for (int i = 0; i < ssidStrLen; i++) {
    EEPROM.write(ssid_offset + 1 + i, ssid[i]);
  }
  EEPROM.commit();
}

String read_apip() {
  int snStrLen = EEPROM.read(ap_ip_offset);
  if (snStrLen > 20) {
    return "No AP IP";
  }

  char chars[snStrLen + 1];

  for (int i = 0; i < snStrLen; i++) {
    chars[i] = EEPROM.read(ap_ip_offset + 1 + i);
  }
  chars[snStrLen] = '\0';
  return String(chars);
}

void write_apip(String ap_ip) {
  int apipStrLen = ap_ip.length();
  EEPROM.write(ap_ip_offset, apipStrLen);
  for (int i = 0; i < apipStrLen; i++) {
    EEPROM.write(ap_ip_offset + 1 + i, ap_ip[i]);
  }
  EEPROM.commit();
}

bool get_esp_now() {
  int data = EEPROM.read(esp_now_offset);
  if (data == 255) {                 // 255 is blank
    EEPROM.write(esp_now_offset, 0); // 0 is disable, 1 is enable
    EEPROM.commit();
  }
  return (data == 255) ? 0 : data;
}

void set_esp_now(bool on_off) {
  if (on_off) {
    EEPROM.write(esp_now_offset, 1); // 1 is enable
  } else {
    EEPROM.write(esp_now_offset, 0); // 0 is disable
  }
  EEPROM.commit();
}

void normal_setup() {
  const char* ssid     = "ESP32-Access-Point";
  const char* password = "123456789";

  // Remove the password parameter, if you want the AP (Access Point) to be open
  WiFi.softAP(ssid, password);

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

}

void esp_now_setup() {}

bool esp_now_enabled;
uint8_t disp_orientation = 1;
int state = 0; // 0:normal, 1:esp_now, 2: for future
void setup() {
  Serial.begin(115200);

  // One click for change the display orientation
  button.attachClick([] {
    if (state == 0) {
      disp_orientation = (disp_orientation + 2) % 4;
      EEPROM.write(0, disp_orientation);
      EEPROM.commit();
      Serial.println(disp_orientation);
      print_info(disp_orientation, false);
    } else if (state == 1) {
      set_esp_now(0); // disable esp-now
      ESP.restart();
    }
  });
  button.attachLongPressStart([] {
    Serial.println("long press enter esp_now mode");
    set_esp_now(1);
    ESP.restart();
  });
  button.setPressMs(5000); // long press 5s

  // Read display orientation from EEPROM
  EEPROM.begin(4096);
  int data = EEPROM.read(0);
  if (data > 3) {
    EEPROM.write(0, 1);
    EEPROM.commit();
  } else {
    disp_orientation = data;
  }

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

  esp_now_enabled = get_esp_now();
  if (esp_now_enabled) state = 1;

  print_info(disp_orientation, esp_now_enabled);

  // if (esp_now_enabled) {
  //   Serial.println("ESP-NOW enabled");
  //   state = 1;
  //   // esp_now_init();
  // } else {
  //   Serial.println("ESP-NOW disabled");
  // }

  switch (state) {
  case 0: // normal
    Serial.println("Start Normal State");
    normal_setup();
    break;
  case 1: // esp_now
    Serial.println("Start ESP-NOW State");
    break;
  default:
    Serial.printf("Unknown state %d\n", state);
    break;
  }
}

void loop() {
  while (Serial.available() == 0) {
    button.tick();
    delay(50);
  }                                          // wait for data available
  String incoming_str = Serial.readString(); // read until timeout (default 1000ms)
  incoming_str.trim();                       // remove any \r \n whitespace at the end of the String
  // Serial.println(incoming_str);
  // Serial.println(incoming_str.length());
  String cmd_str = incoming_str.substring(0, 3);
  String data_str = incoming_str.substring(4, incoming_str.length());
  // Serial.println(cmd_str);
  // Serial.println(data_str);

  if (cmd_str == "GSN") {
    Serial.print("CMD is GSN:"); // Get S/N
    Serial.println(read_sn());
  }

  if (cmd_str == "SSN") {
    Serial.print("CMD is SSN:"); // Set S/N
    Serial.println(data_str);
    write_sn(data_str);
  }

  if (cmd_str == "GID") {
    Serial.print("CMD is GID:"); // Get SSID
    Serial.println(read_ssid());
  }

  if (cmd_str == "SID") {
    Serial.print("CMD is SID:"); // Set SSID
    Serial.println(data_str);
    write_ssid(data_str);
  }

  if (cmd_str == "GIP") {
    Serial.print("CMD is GIP:"); // Get AP IP
    Serial.println(read_apip());
  }

  if (cmd_str == "SIP") {
    Serial.print("CMD is SIP:"); // Set SSID
    Serial.println(data_str);
    write_apip(data_str);
  }

  if (cmd_str == "GEN") {
    Serial.print("CMD is GEN:"); // Get ESP_NOW setting
    Serial.println(get_esp_now());
  }

  if (cmd_str == "SEN") {
    Serial.print("CMD is SEN:"); // Set ESP_NOW
    if (data_str == "1") {
      set_esp_now(true);
    } else {
      set_esp_now(false);
    }
  }

  if (cmd_str == "RST") {
    Serial.print("CMD is RST"); // Reset ESP32
    ESP.restart();
  }
}
