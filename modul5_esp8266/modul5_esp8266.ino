/*
 Basic ESP8266 MQTT example

 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.

 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.

 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.

const char* ssid = "ssid";
const char* password = "password";
const char* mqtt_server = "ip_address";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
String msg, msgtopic;
char msg1[50];
char msg2[50];
char msg3[50];
int value1 = 0;
int value2 = 0;
int value3 = 0;

void setup_wifi() {
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  // Waiting until connected
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic ");
  Serial.print(topic);
  Serial.print(": ");
  msgtopic = String((char*)topic);
  msg = "";
  for (int i = 0; i < length; i++) { // Concat payload char to string (msg)
    msg += (char)payload[i];
  }

  if(msgtopic == "topic/ledstatus1"){
    if(msg == "true"){
      Serial.println("high");
      digitalWrite(LED_BUILTIN, !HIGH);
    }
    else {
      Serial.println("low");
      digitalWrite(LED_BUILTIN, !LOW);
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.publish("topic/sensor1", "0"); //Send first confirmation message if connected
      client.subscribe("topic/ledstatus1");
      client.subscribe("topic/ledstatus2");
      client.subscribe("topic/ledstatus3");
      client.subscribe("topic/ledstatus4");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    value1 = random(10,100);
    value2 = random(10,30);
    value3 = random(300,1200);
    snprintf (msg1, 50, "%d", value1);
    snprintf (msg2, 50, "%d", value2);
    snprintf (msg3, 50, "%d", value3);
    Serial.print("Publish message: ");
    Serial.print(msg1);
    Serial.print(" | ");
    Serial.print(msg2);
    Serial.print(" | ");
    Serial.println(msg3);
    client.publish("topic/sensor1", msg1);
    client.publish("topic/sensor2", msg2);
    client.publish("topic/sensor3", msg3);
  }
}
