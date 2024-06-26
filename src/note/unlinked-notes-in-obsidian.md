---
category: obsidian
created: 2023-04-15
title: List unlinked notes in Obsidian
updated: 2024-04-19
---


Sometimes, I want to have a list of notes haven't been linked up yet.

With Obsidian their new Bookmark plugin it's easy to save a regex search for notes without the wiki links. You can even add a query for specific folders.

Here's the regex.

```regex
-/\[\[[a-zA-Z0-9 \-\|\.,]+\]\]/
```

Searching specific folders is simple, as well. The query is:

```regex 
path:"YOURFOLDERHERE"  -/\[\[[a-zA-Z0-9 \-\|\.,]+\]\]/
```

Replace the "YOURFOLDERHERE" with the folder where you want to search.

Tip: AND is not a supported search operator. A space is the AND operator.

A nice extra: it works on Canvas with the inline search.

```query
path:"02 Notes" -/\[\[[a-zA-Z0-9 \-\|\.,]+\]\]/
```