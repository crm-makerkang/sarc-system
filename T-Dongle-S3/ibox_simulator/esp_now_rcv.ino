// Simulate iBox receiver for Lilygo TTGO T-Dongle
#include "Arduino.h"
#include "WiFi.h"
#include "pin_config.h"
#include <EEPROM.h>
#include <esp_now.h>

/* external library */
/* To use Arduino, you need to place lv_conf.h in the \Arduino\libraries directory */
#include "TFT_eSPI.h"  // https://github.com/Bodmer/TFT_eSPI
#include "OneButton.h" // https://github.com/mathertel/OneButton

#define display_orientation_offset 0
#define sn_offset 1
#define ssid_offset 20
#define esp_now_offset 40
#define ap_ip_offset 41

#include <FastLED.h> // https://github.com/FastLED/FastLED
// hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE
#define HSV_RED 0
#define HSV_GREEN 100
#define HSV_BLUE 150
#define HSV_SATURATE 255

TFT_eSPI tft = TFT_eSPI();
CRGB leds;
OneButton button(BTN_PIN, true); // BTN_PIN is 0 defined in pin_config.h

typedef struct esp_now_struct
{
  int seq_num;
  char esp_now_msg[40];
} esp_now_struct;
esp_now_struct broadcast_data;

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
esp_now_peer_info_t peerInfo;
esp_now_struct test;
bool esp_now_enabled;

uint8_t lcd_orientation = 1;
int32_t x = 0, y = 5;
int state = 0; // 0:normal, 1:esp_now, 2: for future

String read_ssid()
{
  int snStrLen = EEPROM.read(ssid_offset);
  Serial.printf("raed_ssid ssid_len %d\n", snStrLen);
  if (snStrLen > 20)
  {
    return "No SSID";
  }

  char chars[snStrLen + 1];

  for (int i = 0; i < snStrLen; i++)
  {
    chars[i] = EEPROM.read(ssid_offset + 1 + i);
  }
  chars[snStrLen] = '\0';
  return String(chars);
}

void write_ssid(String ssid)
{
  int ssidStrLen = ssid.length();
  EEPROM.write(ssid_offset, ssidStrLen);
  for (int i = 0; i < ssidStrLen; i++)
  {
    EEPROM.write(ssid_offset + 1 + i, ssid[i]);
  }
  EEPROM.commit();
}

String read_apip()
{
  int snStrLen = EEPROM.read(ap_ip_offset);
  if (snStrLen > 20)
  {
    return "No AP IP";
  }

  char chars[snStrLen + 1];

  for (int i = 0; i < snStrLen; i++)
  {
    chars[i] = EEPROM.read(ap_ip_offset + 1 + i);
  }
  chars[snStrLen] = '\0';
  return String(chars);
}

void write_apip(String ap_ip)
{
  int apipStrLen = ap_ip.length();
  EEPROM.write(ap_ip_offset, apipStrLen);
  for (int i = 0; i < apipStrLen; i++)
  {
    EEPROM.write(ap_ip_offset + 1 + i, ap_ip[i]);
  }
  EEPROM.commit();
}

bool get_esp_now()
{
  int data = EEPROM.read(esp_now_offset);
  if (data == 255)
  {                                  // 255 is blank
    EEPROM.write(esp_now_offset, 0); // 0 is disable, 1 is enable
    EEPROM.commit();
  }
  return (data == 255) ? 0 : data;
}

void set_esp_now(bool on_off)
{
  if (on_off)
  {
    EEPROM.write(esp_now_offset, 1); // 1 is enable
  }
  else
  {
    EEPROM.write(esp_now_offset, 0); // 0 is disable
  }
  EEPROM.commit();
}

void print_to_LCD(String str, int x, int y)
{
  tft.drawString(str, x, y);
  y += 8;
}

void lcd_info(uint8_t lcd_orientation)
{
  String mode, line2, line3;
  uint32_t BG_COLOR = 0, FG_COLOR = 0;

  if (state == 0)
  {
    BG_COLOR = TFT_BLACK;
    FG_COLOR = TFT_GREEN;
    mode = "iBox:";
    line2 = "Connecting...";
    line3 = "";
  }
  else
  {
    BG_COLOR = TFT_RED;
    FG_COLOR = TFT_WHITE;
    mode = "ESP-NOW:";
    line2 = "Listening...";
    line3 = "";
  }

  tft.setRotation(lcd_orientation);
  tft.fillScreen(BG_COLOR);
  tft.setTextColor(FG_COLOR, BG_COLOR);

  print_to_LCD(mode, x, y);

  tft.setTextColor(TFT_WHITE, BG_COLOR);
  x = 0, y = 30;
  print_to_LCD(line2, x, y);

  x = 0, y = 55;
  print_to_LCD(line3, x, y);
}

// callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status)
{
  Serial.print("Last Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}

// callback function that will be executed when data is received
void OnDataRecv(const uint8_t *mac, const uint8_t *incomingData, int len)
{
  memcpy(&broadcast_data, incomingData, sizeof(broadcast_data));
  Serial.print("Bytes received: ");
  Serial.println(len);
  Serial.print("seq_num: ");
  Serial.println(broadcast_data.seq_num);
  Serial.println(String(broadcast_data.esp_now_msg).substring(6, 12));
  Serial.println();

  char buffer[40];
  sprintf(buffer, "Packer#:%d\n", broadcast_data.seq_num);
  print_to_LCD(buffer, 0, 30);
  print_to_LCD(broadcast_data.esp_now_msg, 0, 55);
}

void clickHandler()
{
  if (state == 0)
  {
    Serial.println("Click");
  }
  else
  {
    // verify and store ssid to EEPROM
    String ssid_to_write = String(broadcast_data.esp_now_msg).substring(6, 12);
    Serial.printf("SSID %s, %s\n", ssid_to_write, ssid_to_write.substring(0, 2));
    if (ssid_to_write.length() < 6 || ssid_to_write.substring(0, 2) != "SA")
    {
      Serial.println("SSID is not valid");
      return;
    }
    else
    {
      write_ssid(ssid_to_write);
      set_esp_now(0);
      ESP.restart();
    }
  }
}
void longPressStartHandler()
{
  Serial.println("long press enter esp_now mode");
  if (state == 0)
    set_esp_now(1);
  ESP.restart();
}

void setup()
{
  Serial.begin(115200);
  EEPROM.begin(4096);

  esp_now_enabled = get_esp_now();
  if (esp_now_enabled)
    state = 1;

  // One click for change the display orientation
  button.attachClick(clickHandler);
  button.attachLongPressStart(longPressStartHandler);
  button.setPressMs(3000); // long press 5s

  //  Initialise TFT
  tft.init();
  tft.setTextFont(4);

  // BGR ordering is typical
  FastLED.addLeds<APA102, LED_DI_PIN, LED_CI_PIN, BGR>(&leds, 1);
  leds = CHSV(HSV_BLUE, HSV_SATURATE, 20); // hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE, Full saturation, Brightness: 20 is OK
  FastLED.show();

  lcd_info(lcd_orientation);

  // tft.setTextFont(4);

  Serial.printf("espnow is %d\n", esp_now_enabled);

  WiFi.mode(WIFI_STA);

  Serial.println(WiFi.macAddress());

  if (state == 0)
  {
    // EEPROM.write(ssid_offset, 55);
    // EEPROM.commit();
    String eeprom_ssid = read_ssid();
    Serial.printf("eeprom ssid %s\n", eeprom_ssid);
    // String aaa="Hello";
    // write_ssid(aaa);
    // Serial.printf("ssid %s\n",read_ssid());

    // assert error eeprom_ssid = "AA0001";
    if (eeprom_ssid.substring(0, 2) != "SA")
    {
      Serial.println("ssid is invalid");
      tft.setTextColor(TFT_RED, TFT_BLACK);
      print_to_LCD("Pls CHK SSID", 0, 30);
      print_to_LCD("BAD SSID", 0, 55);
    }
    else
    {
      Serial.println("Normal mode - connect to wifi");
      print_to_LCD(eeprom_ssid, 0, 55);
      WiFi.begin(eeprom_ssid.c_str(), "123456789");
      while (WiFi.status() != WL_CONNECTED)
      {
        Serial.print(".");
        for (int i = 0; i < 10; i++)
        {
          button.tick();
          delay(50);
        }
      }

      print_to_LCD("Connected to", 0, 30);
      Serial.println("");
      Serial.print("IP位址:");
      Serial.println(WiFi.localIP()); // 讀取IP位址
      Serial.print("WiFi RSSI:");
      Serial.println(WiFi.RSSI()); // 讀取WiFi強度
    }
  }
  else if (state == 1)
  {

    Serial.println(read_ssid());
    if (esp_now_init() != ESP_OK)
    {
      Serial.println("Error initializing ESP-NOW");
      return;
    }

    esp_now_register_send_cb(OnDataSent);
    esp_now_register_recv_cb(OnDataRecv);

    // peerInfo.channel = 0;
    // peerInfo.encrypt = false;
    // peerInfo.ifidx = WIFI_IF_STA; // 沒這行會有 Failed to add peer 問題
    // register first peer, receiver 可以不用 register peer
    // memcpy(peerInfo.peer_addr, broadcastAddress, 6);
    // if (esp_now_add_peer(&peerInfo) != ESP_OK)
    // {
    //   Serial.println("Failed to add peer");
    //   return;
    // }

    Serial.println("Listen to ESP_NOW packages");
  }
}

unsigned long previousMillis = 0;
unsigned long currentMillis = 0;
const long interval = 2000;
char rssi_buffer[40];
void loop()
{
  button.tick();
  delay(50);
  currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    // 讀取RSSI數值
    int rssi = WiFi.RSSI();
    
    Serial.print("RSSI: ");
    Serial.println(rssi);


    sprintf(rssi_buffer, ":%d\n", rssi);
    print_to_LCD(rssi_buffer, 90,55);
    
  }
}
