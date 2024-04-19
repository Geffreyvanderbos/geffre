---
category: obsidian
created: 2023-05-09
title: Highlight callouts in Obsidian
updated: 2024-04-19
---

I use various plugins and apps (like [Zotero](https://www.zotero.org/), [Omnivore](https://omnivore.app/), and [Snipd](https://www.snipd.com/)) to bring information into my Obsidian vault.

By default, most apps use bullet lists to separate imported highlights, which I find finicky to work with. 

I prefer using callouts to organise my information. However, there's no native highlight callout, so I use custom callouts with the following CSS Snippet: 

```css
.callout[data-callout="highlight"] {
    --callout-color: var(--callout-question);
    --callout-icon: lucide-highlighter
}
```

All the information now arrives in my vault in the same format. This helps me use Note Refactor and other plugins to process the notes further and eventually turn them into atomic notes.