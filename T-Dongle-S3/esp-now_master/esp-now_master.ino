// for Lilygo TTGO T-Dongle
#include "Arduino.h"
// #include "SD_MMC.h"
#include "WiFi.h"
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
#define sn_offset 1
#define ssid_offset 20
#define esp_now_offset 40
#define ap_ip_offset 41

// hue:0 -> RED, hue:100 -> GREEN, hue:150 -> BLUE
#define HSV_RED 0
#define HSV_GREEN 100
#define HSV_BLUE 150
#define HSV_SATURATE 255

TFT_eSPI tft = TFT_eSPI();
CRGB leds;
OneButton button(BTN_PIN, true); // BTN_PIN is 0 defined in pin_config.h

// 舊的奇怪用法
// #define PRINT_STR(str, x, y)                                                                                                                         \
//   do {                                                                                                                                               \
//                                                                                                                                                      \
//     tft.drawString(str, x, y);                                                                                                                       \
//     y += 8;                                                                                                                                          \
//   } while (0);

void print_to_LCD(String str, int x, int y)
{
  tft.drawString(str, x, y);
  y += 8;
}

void led_task(void *param)
{
  while (1)
  {
    static uint8_t hue = 0;
    leds = CHSV(hue++, 0XFF, 100);
    FastLED.show();
    delay(50);
  }
}
void scan_wifi_rssi()
{
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  Serial.println("scan start");
  // WiFi.scanNetworks will return the number of networks found
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
  {
    Serial.println("no networks found");
  }
  else
  {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
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

void lcd_info(uint8_t lcd_orientation, bool disp_esp_now)
{
  String ssid = read_ssid();
  String sn = read_sn();
  String ap_ip = read_apip();

  if (ssid == "No SSID")
  {
    ssid = "No SSID";
  }
  else
  {
    ssid = "SSID: " + ssid;
  }

  if (sn == "No S/N")
  {
    sn = "No S/N";
  }
  else
  {
    sn = "S/N: " + sn;
  }

  tft.setRotation(lcd_orientation);

  if (disp_esp_now)
  {
    tft.fillScreen(TFT_RED);
    tft.setTextColor(TFT_WHITE, TFT_RED);
    print_to_LCD(sn, 0, 0);
    print_to_LCD(ssid, 0, 29);
    print_to_LCD(ap_ip, 0, 58);
  }
  else
  {
    tft.fillScreen(TFT_BLACK);
    int32_t x = 0, y = 15;
    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    // PRINT_STR(ssid, x, y)
    print_to_LCD(ssid, x, y);
    x = 14;
    y = 45;
    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    // PRINT_STR(sn, x, y)
    print_to_LCD(sn, x, y);
  }
}

String read_sn()
{
  int snStrLen = EEPROM.read(sn_offset);
  if (snStrLen > 20)
  {
    return "No S/N";
  }

  char chars[snStrLen + 1];

  for (int i = 0; i < snStrLen; i++)
  {
    chars[i] = EEPROM.read(sn_offset + 1 + i);
  }
  chars[snStrLen] = '\0';
  return String(chars);
}

void write_sn(String sn)
{
  int snStrLen = sn.length();
  EEPROM.write(sn_offset, snStrLen);
  for (int i = 0; i < snStrLen; i++)
  {
    EEPROM.write(sn_offset + 1 + i, sn[i]);
  }
  EEPROM.commit();
}

String read_ssid()
{
  int snStrLen = EEPROM.read(ssid_offset);
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

void normal_setup()
{
  // const char *ssid = "ESP32-Access-Point";
  char ssid[20] = "ESP32-Access-Point";
  const char *password = "123456789";

  String eeprom_apip = read_apip();
  int apip_1 = 0;
  int apip_2 = 0;
  int apip_3 = 0;
  int apip_4 = 0;
  int startIndex = 0;
  int periodIndex = 0;
  periodIndex = eeprom_apip.indexOf('.');
  apip_1 = eeprom_apip.substring(startIndex, periodIndex).toInt(); // 192
  startIndex = periodIndex + 1;
  periodIndex = eeprom_apip.indexOf('.', periodIndex + 1);
  apip_2 = eeprom_apip.substring(startIndex, periodIndex).toInt(); // 168
  startIndex = periodIndex + 1;
  periodIndex = eeprom_apip.indexOf('.', periodIndex + 1);
  apip_3 = eeprom_apip.substring(startIndex, periodIndex).toInt(); // 4
  startIndex = periodIndex + 1;
  periodIndex = eeprom_apip.indexOf('.', periodIndex + 1);
  apip_4 = eeprom_apip.substring(startIndex, periodIndex).toInt(); // 1

  Serial.printf("EEPROM APIP:%d.%d.%d.%d\n", apip_1, apip_2, apip_3, apip_4);

  // Remove the password parameter, if you want the AP (Access Point) to be open

  int snStrLen = EEPROM.read(ssid_offset);
  if (snStrLen < 20)
  {
    // char chars[snStrLen + 1];

    for (int i = 0; i < snStrLen; i++)
    {
      ssid[i] = EEPROM.read(ssid_offset + 1 + i);
    }
    ssid[snStrLen] = 0;
  }

  Serial.println(ssid);
  WiFi.softAP(ssid, password);

  IPAddress IP(apip_1, apip_2, apip_3, apip_4);
  IPAddress NMask(255, 255, 255, 0);
  WiFi.softAPConfig(IP, IP, NMask);

  IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);
}

// callback when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status)
{
  Serial.print("Last Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}

// callback function that will be executed when data is received
typedef struct esp_now_struct
{
  int seq_num = 0;
  char esp_now_msg[64];
} esp_now_struct;
esp_now_struct broadcast_data;

void OnDataRecv(const uint8_t *mac, const uint8_t *incomingData, int len)
{
  memcpy(&broadcast_data, incomingData, sizeof(broadcast_data));
  Serial.print("Bytes received: ");
  Serial.println(len);
  Serial.print("seq_num: ");
  Serial.println(broadcast_data.seq_num);
  Serial.print("msg: ");
  Serial.println(broadcast_data.esp_now_msg);
  Serial.println();
}

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
esp_now_peer_info_t peerInfo;
esp_now_struct sendData;
void esp_now_setup()
{
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
}

void clickHandler()
{
  Serial.println("Click");
  int sn_num = read_sn().substring(2, 6).toInt();
  Serial.println(sn_num);

  sn_num++;
  String sn_4digits = String(sn_num);
  if (sn_num < 10)
  {
    sn_4digits = "000" + sn_4digits;
  } else if (sn_num < 100)
  {
    sn_4digits = "00" + sn_4digits;
  } else if (sn_num < 1000)
  {
    sn_4digits = "0" + sn_4digits;
  }
  write_sn("SA" + String(sn_4digits));
  write_ssid("SA" + String(sn_4digits));
  ESP.restart();
}

void longpressHandler()
{
  write_sn("SA0001");
  write_ssid("SA0001");
  ESP.restart();
}

bool esp_now_enabled = true;
uint8_t lcd_orientation = 1;
int state = 1; // 0:normal, 1:esp_now, 2: for future
void setup()
{
  Serial.begin(115200);

  // One click for change the display orientation
  // button.attachClick([]
  //                    {
  //   if (state == 0) {
  //     lcd_orientation = (lcd_orientation + 2) % 4;
  //     EEPROM.write(0, lcd_orientation);
  //     EEPROM.commit();
  //     Serial.printf("Change lcd orientation to %d",lcd_orientation);
  //     lcd_info(lcd_orientation, false);
  //   } else if (state == 1) {
  //     set_esp_now(0); // disable esp-now
  //     ESP.restart();
  //   } });

  button.attachClick(clickHandler);

  // button.attachLongPressStart([]
  //                             {
  //   Serial.println("long press enter esp_now mode");
  //   set_esp_now(1);
  //   ESP.restart(); });

  button.attachLongPressStart(longpressHandler);
  button.setPressMs(3000); // long press 5s

  // Read display orientation from EEPROM
  EEPROM.begin(4096);
  int data = EEPROM.read(0);
  if (data > 3)
  {
    EEPROM.write(0, 1);
    EEPROM.commit();
  }
  else
  {
    lcd_orientation = data;
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

  // esp_now_enabled = get_esp_now();
  // if (esp_now_enabled)
  //   state = 1;

  lcd_info(lcd_orientation, esp_now_enabled);

  Serial.println("Start ESP-NOW State");
  esp_now_setup(); // will not go to loop()

  // switch (state)
  // {
  // case 0: // normal
  //   Serial.println("Start Normal State");
  //   normal_setup();
  //   break;
  // case 1: // esp_now
  //   Serial.println("Start ESP-NOW State");
  //   esp_now_setup(); // will not go to loop()
  //   break;
  // default:
  //   Serial.printf("Unknown state %d\n", state);
  //   break;
  // }
}

void broadcase_esp_now()
{
  sendData.seq_num = sendData.seq_num + 1;

  sprintf(sendData.esp_now_msg, "SSID: %s SN: %s APIP: %s", read_ssid(), read_sn(), read_apip());
  Serial.printf("%s length is %d\n", sendData.esp_now_msg, sizeof(esp_now_struct));

  esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *)&sendData, sizeof(esp_now_struct));

  if (result == ESP_OK)
  {
    Serial.println("Sent with success");
  }
  else
  {
    Serial.println(result);
  }

  for (int i = 0; i < 40; i++)
  {
    button.tick();
    delay(50);
  }
  // delay(2000);
}
void loop()
{
  while (Serial.available() == 0)
  {
    button.tick();
    delay(50);

    if (state == 1)
      broadcase_esp_now();
  }                                          // wait for data available
  String incoming_str = Serial.readString(); // read until timeout (default 1000ms)
  incoming_str.trim();                       // remove any \r \n whitespace at the end of the String
  // Serial.println(incoming_str);
  // Serial.println(incoming_str.length());
  String cmd_str = incoming_str.substring(0, 3);
  String data_str = incoming_str.substring(4, incoming_str.length());
  // Serial.println(cmd_str);
  // Serial.println(data_str);

  if (cmd_str == "GSN") // Get S/N
  {
    Serial.print("CMD is GSN:"); // Get S/N
    Serial.println(read_sn());
  }

  if (cmd_str == "SSN") // Set S/N
  {
    Serial.print("CMD is SSN:"); // Set S/N
    Serial.println(data_str);
    write_sn(data_str);
    //lcd_info(lcd_orientation, esp_now_enabled);
    ESP.restart();
  }

  if (cmd_str == "GID") // Get SSID
  {
    Serial.print("CMD is GID:"); // Get SSID
    Serial.println(read_ssid());
  }

  if (cmd_str == "SID") // Set SSID
  {
    Serial.print("CMD is SID:"); // Set SSID
    Serial.println(data_str);
    write_ssid(data_str);
    //lcd_info(lcd_orientation, esp_now_enabled);
    ESP.restart();
  }

  if (cmd_str == "GIP") // Get AP IP
  {
    Serial.print("CMD is GIP:"); // Get AP IP
    Serial.println(read_apip());
  }

  if (cmd_str == "SIP") // Set AP IP
  {
    Serial.print("CMD is SIP:"); // Set SSID
    Serial.println(data_str);
    write_apip(data_str);
    ESP.restart();
  }

  if (cmd_str == "GEN")
  {
    Serial.print("CMD is GEN:"); // Get ESP_NOW setting
    Serial.println(get_esp_now());
  }

  if (cmd_str == "SEN")
  {
    Serial.print("CMD is SEN:"); // Set ESP_NOW
    if (data_str == "1")
    {
      set_esp_now(true);
    }
    else
    {
      set_esp_now(false);
    }
    ESP.restart();
  }

  if (cmd_str == "RST")
  {
    Serial.print("CMD is RST"); // Reset ESP32
    ESP.restart();
  }
}
