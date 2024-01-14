---
category: obsidian
created: 2023-06-23
title: Lay out all Obsidian notes in a grid
updated: 2023-06-23
---

Here's how you can have a grid with all your  notes laid out.

Relies on Minimal Theme, Dataview, and Contextual Typography.

As simple as adding the following to the front-matter:
```css
---
cssClass: cards, table-100, cards-align-bottom
---
```

And then a Dataview query in the note:
```js
TABLE WITHOUT ID link(file.link, title) as Title, date as "Date created"
FROM "02 Notes"
WHERE file != this.file
```