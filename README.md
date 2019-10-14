# Modul 5 TF4016 Industrial Internet of Things - Engineering Physics #
Created by: IIOT Lecture Assistant

Features:
1. MQTT over WebSocket with mosca
2. 3 data chart using chart.js with 10 data window
3. 4 LED state toggle + indicator

How to run:
1. Edit address and port in <b> /public/script/script.js </b> to broker address and port (3000 for default)
2. Edit port in <b> /index.js </b> to desired communication port (default 3000 for MQTT over WebSocket) and run in terminal:
```
node index.js
```
3. Edit SSID, password, and broker address in <b> /modul5_esp8266/modul5_esp8266.ino </b> to desired SSID and broker. Upload it for <b>Wemos D1 Mini</b> at baud rate <b>115200</b>
4. To use dummy data for publisher, edit broker address and port in <b> /publisher.js </b> to desired broker address and run in terminal:
```
node publisher.js
```
