---
category: smarthome
created: 2024-03-17
title: Display Airplay Now-Playing on old Android Tablet with MQTT
updated: 2024-03-17
---

Repurposed my Nexus 7 into a display for showing what's currently playing via Apple Airplay.

![Alt text](../images/now-playing-on-android-tablet-1.jpeg)

It has three components: 
1. [Shairport-Sync](https://github.com/mikebrady/shairport-sync)  that enables Airplay on my 'dumb amp and speakers'.
2. Shairport-Sync provides song data to my existing [Mosquitto MQTT broker](https://cedalo.com/blog/mosquitto-docker-configuration-ultimate-guide/).
3. A Node.js server that gets the MQTT information and makes it available as a webpage.

All run in Docker containers on my [Thinclient T630](https://support.hp.com/us-en/document/c05240287) “homelab” running Ubuntu Server. You can run this as easily on an Raspberry Pi or equivalent solutions.

An USB cable runs from the Homelab to my [SMSL Q5 Pro](https://duckduckgo.com/?q=audio+near+me&iaxm=places) amplifier. (Support your local, independent audio equipment store.)

If you want to replicate it, you'll need a bit of technical knowledge. As this is my configuration and yours will be different. Find the contact form on my [about page](/about) if you need help setting it up for yourself. 

I have skipped the setup of the MQTT broker. It's a standard configuration.

## Shairport-Sync
This is my Shairport-Sync docker-compose file:

```yaml
version: '3'
services:
  shairport-sync:
    container_name: shairport
    image: mikebrady/shairport-sync:latest
    network_mode: host
    volumes:
      - /home/geffrey/shairport/shairport-sync.conf:/etc/shairport-sync.conf
      - /home/geffrey/shairport/metadata:/tmp
    devices:
      - /dev/snd
    environment:
      - AIRPLAY_NAME="KEF Speakers"
    restart: unless-stopped
```

And the shairport-sync.conf file looks as follows:

```json
general =
{
  name = "KEF Speakers";
  default_airplay_volume = -24.0;
};

metadata =
{
  enabled = "yes";
  include_cover_art = "yes";
  cover_art_cache_directory = "/tmp/shairport-sync/.cache/coverart";
  pipe_name = "/tmp/shairport-sync-metadata";
  pipe_timeout = 5000;
};

mqtt =
{
        enabled = "yes";
        hostname = "192.168.1.200";        
        port = 1883;
				// [Authentication Settings Redacted for security reasons]
        topic = "shairport";
        publish_raw = "yes";
        publish_parsed = "yes";        
        publish_cover = "yes";        
        enable_remote = "yes";
};

alsa =
{
  output_device = "sysdefault:CARD=AMP";
  output_format = "auto";
  output_rate = "auto";
};

```

## Node.js Server to Display MQTT info
A Node.js project pulls the MQTT info and displays it on a webpage (served from /public/index.html in the same directory).

```javascript
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MQTT Broker Configuration
const mqttBrokerUrl = 'mqtt://192.168.1.200:1883'; 
const mqttTopics = ['shairport/artist', 'shairport/album', 'shairport/cover', 'shairport/title'];

// Connect to MQTT Broker
const mqttClient = mqtt.connect(mqttBrokerUrl);
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(mqttTopics, (err) => {
        if (err) {
            console.error('Error subscribing to MQTT topics:', err);
        } else {
            console.log(`Subscribed to MQTT topics: ${mqttTopics.join(', ')}`);
        }
    });
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Handle MQTT messages
mqttClient.on('message', (topic, message) => {
    // Check the topic to determine the type of data
    if (topic === 'shairport/cover') {
        // Send cover art binary data to WebSocket clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    } else {
        // For other topics, send the data as is
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ topic, message: message.toString() }));
            }
        });
    }
});

// Start the server
const port = process.env.PORT || 9999;
server.listen(port, () => {
    console.log(`Server running on http://192.168.1.200:${port}`);
});
```

The HTML and CSS on the webpage is a bit ugly. Didn't find the will to refactor it. (The CSS prefixes are for older webview options on my Android tablet.)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shairport Data</title>
    <style>
    /*
    * Prefixed by https://autoprefixer.github.io
    * PostCSS: v8.4.14,
    * Autoprefixer: v10.4.7
    * Browsers: last 6 versions
    */

    body {
            font-family: Arial, Helvetica, sans-serif;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #000;
            color: #fff;
            overflow: hidden;
        }

    #fullscreen-coverart {
        background-position: center;
        background-size: cover;
        top: -350px;
        bottom: -350px;
        left: -350px;
        right: -350px;
        position: fixed;
        -webkit-filter: blur(200px) saturate(.6);
                filter: blur(200px) saturate(.6);
        overflow: hidden;
    }

    #data-container {
        z-index: 999;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        opacity: 0;
        -webkit-transition: opacity 1s ease-in;
        -o-transition: opacity 1s ease-in;
        transition: opacity 1s ease-in;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
            -ms-flex-direction: row;
                flex-direction: row;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 18px;
        overflow: hidden;
        -webkit-box-shadow:
            0px 2.2px 2.2px rgba(0, 0, 0, 0.042),
            0px 5.4px 5.3px rgba(0, 0, 0, 0.061),
            0px 10.1px 10px rgba(0, 0, 0, 0.075),
            0px 18.1px 17.9px rgba(0, 0, 0, 0.089),
            0px 33.8px 33.4px rgba(0, 0, 0, 0.108),
            0px 81px 80px rgba(0, 0, 0, 0.15)
        ;
                box-shadow:
            0px 2.2px 2.2px rgba(0, 0, 0, 0.042),
            0px 5.4px 5.3px rgba(0, 0, 0, 0.061),
            0px 10.1px 10px rgba(0, 0, 0, 0.075),
            0px 18.1px 17.9px rgba(0, 0, 0, 0.089),
            0px 33.8px 33.4px rgba(0, 0, 0, 0.108),
            0px 81px 80px rgba(0, 0, 0, 0.15)
        ;
        width: 720px;
        -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.07);
    }

    #cover {
        width: 240px;
        height: 240px;
        -o-object-fit: cover;
            object-fit: cover;
    }

    #info {
        padding: 30px;
        width: 420px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
    }

    #nothingplaying {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
    }

    #title {
        font-size: 34px;
        font-weight: bold;
        margin-bottom: 8px;
    }

    p { margin: 0;}

    #artist {
        font-size: 26px;
        opacity: 0.7;
    }

    #album {
        font-size: 26px;
        margin-top: 9px;
        opacity: 0.7;
    }

    #title, #artist, #album {
        display: block;
        width: 420px;
        overflow: hidden;
        white-space: nowrap;
        -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            }
    </style>
</head>
<body>
    <div id="fullscreen-coverart" style="background-image: url('')"></div>
    <p id="nothingplaying">Didn't receive what's playing, yet.</p>
    <div id="data-container">
        <img id="cover" src="" alt="Cover Art">
        <div id="info">
            <p id="title">Title</p>
            <p id="artist">Artist</p>
            <p id="album">Album</p>
        </div>
    </div>

    <script>
        const ws = new WebSocket('ws://192.168.1.200:9999'); // Update with your server URL

        ws.onmessage = (event) => {
            if (event.data instanceof Blob) {
                // Handle cover art data
                const coverUrl = URL.createObjectURL(event.data);
                document.getElementById('cover').src = coverUrl;

                // Convert Blob to data URL for background image
                const reader = new FileReader();
                reader.onload = () => {
                    const coverDataUrl = reader.result;
                    document.getElementById('fullscreen-coverart').style.backgroundImage = `url(${coverDataUrl})`;
                };
                reader.readAsDataURL(event.data);

            } else {
                // Parse and handle other data
                const data = JSON.parse(event.data);
                if (data.topic === 'shairport/title') {
                    document.getElementById('title').textContent = data.message;
                } else if (data.topic === 'shairport/artist') {
                    document.getElementById('artist').textContent = data.message;
                } else if (data.topic === 'shairport/album') {
                    document.getElementById('album').textContent = data.message;
                }

                // Show the data container
                document.getElementById('data-container').style.opacity = 1;
                document.getElementById('nothingplaying').style.display = "none";
            }
        };
    </script>
</body>
</html>
``` 

## Node.js as a Systemd service
After, I created a systemd service file to make sure the node.js server is 'always on'.

```bash
sudo nano /etc/systemd/system/shairport-web.service
```

With the following script.

```bash
[Unit]
Description=Shairport Web
After=network.target

[Service]
User=geffrey
WorkingDirectory=/home/geffrey/shairport-web/
ExecStart=/home/geffrey/.nvm/versions/node/v21.7.1/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then, make sure it automatically starts on boot:

```bash
sudo systemctl enable shairport-web.service
```

## Fully Kiosk Pro app on Nexus 7
The Nexus 7, using the [Fully Kiosk app](https://www.fully-kiosk.com/en/#download-box), shows this page and features an screen auto-off function after 5 minutes and wakes when it detects a face with the front-camera. You'll need the paid (≈ €10) version for this functionality.