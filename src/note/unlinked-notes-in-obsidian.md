---
category: obsidian
created: 2023-04-15
title: List unlinked notes in Obsidian
updated: 2023-04-15
---


Sometimes, I want to have a list of notes haven't been linked up yet.

With #obsidian their new Bookmark plugin it's really easy to just save a regex search for notes without the wiki links. You can even add a query for specific folders.

Here's the regex.

```regex
-/\[\[[a-zA-Z0-9 \-\|\.,]+\]\]/
```

Searching specific folders only is simple, as well. The query is:

```regex 
path:"YOURFOLDERHERE"  -/\[\[[a-zA-Z0-9 \-\|\.,]+\]\]/
```

Replace the "YOURFOLDERHERE" with the folder where you want to search.

Tip: AND is not a supported search operator. A space is already the AND operator.

Also works on Canvas with the inline search query.

```query
path:"02 Notes" -/\[\[[a-zA-Z0-9 \-\|\.,]+\]\]/
```