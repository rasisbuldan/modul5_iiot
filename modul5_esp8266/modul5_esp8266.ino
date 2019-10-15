#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.
const char* ssid = "stoorm-iPhone";
const char* password = "hehehehe";
const char* mqtt_server = "172.20.10.8";

WiFiClient espClient;
PubSubClient client(espClient);

long lastMsg = 0;
String msg, msgtopic;
char msg1[50];
char msg2[50];
char msg3[50];
int value1, value2, value3;

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
  Serial.println(msg);
  if(msgtopic == "topic/ledstatus1"){ // if LED button 1 toggled
    if(msg == "true"){
      Serial.println("LED ON");
      digitalWrite(LED_BUILTIN, !HIGH);
    }
    else {
      Serial.println("LED OFF");
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
