---
category: obsidian
created: 2023-04-16
title: Display recent files in Obsidian Vault
updated: 2024-04-19
popular: true
---

A Dataview snippet that displays your vault's recent files:

```js
$=dv.list(dv.pages('').sort(f=>f.file.mtime.ts,"desc").limit(10).file.link)`
```

Change the number in `limit(10)` to the amount of files you'd like to show up.