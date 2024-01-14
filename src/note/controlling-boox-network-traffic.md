---
category: technology
created: 2023-01-14
title: Controlling Boox Network Traffic
updated: 2023-01-14
---

One challenge I have with my Boox Leaf2 is the fact that it has some substantial background traffic. They're constantly phoning home. Many people don't think it's suspicious, but it could be sending your data to a server in China. I decided I don't want it to constantly  communicate with their telemetry servers, including QQ.com and Alibaba.com. So, I shut that down.

The issue is the communication happens at the root level, and we don't have default root access to these devices. I needed a non-root access solution, and there is: an app called [NetGuard](https://netguard.me/).

NetGuard is a no-root firewall allowing complete control over network traffic. It creates a VPN on your device and routes all traffic through it, discarding unwanted traffic.

NetGuard is open-source; all source code is available for viewing. I use the 'pro' version, which you get after donating a few euros. I can view blocked traffic logs, filter traffic on an IP or protocol basis, receive new app notifications if something new tries to phone out undetected.

You can download NetGuard directly from their [GitHub](https://github.com/M66B/NetGuard/releases) and sideload it onto your Android device. Get the APK and transfer it via USB. If enabled, you can get it via the Google Play Store, as well.

I block all traffic except for the apps I actually use. Like [Omnivore](https://omnivore.app/), [Obsidian](https://obsidian.md), and the web browser. By the way, you'll have to turn off Netguard periodically to see if there are any firmware updates.

![Boox Leaf2 with custom illustration of our family](/note/images/boox-leaf2.png)

