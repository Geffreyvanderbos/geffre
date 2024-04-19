---
category: obsidian
created: 2024-04-03
title: Things3 Overview in Obsidian
updated: 2024-04-19
---

I love how Things 3 does to-dos. [Things3 Today](https://github.com/wudanyang6/obsidian-things3-today) is a pretty simple way to display the the Today overview in an Obsidian panel.

I didn't like how it was styled as much. Below the CSS rewrites that I came up with. Let me know if your specific situation breaks stuff.

[Click here](https://help.obsidian.md/Extending+Obsidian/CSS+snippets) to read about how to add CSS snippets to your Obsidian.

![Before and After of the CSS modifications to the plugin](/note/images/redesign-today-panel.png)

```css
[data-type="things3-today"] .view-content {
	display: flex;
	flex-direction: column-reverse;
}

[data-type="things3-today"] h4, [data-type="things3-today"] a[href="things:///show?id=today"], [data-type="things3-today"] br {
	display: none;
}

[data-type="things3-today"] button {
	margin-top: 1rem;
	max-width: 80px;
	margin-bottom: auto;
}

[data-type="things3-today"] ul {
	padding: 0;
	margin: .25rem 0;
}

[data-type="things3-today"] ul a {
	color: var(--text-normal);
	font-size: var(--metadata-label-font-size);
	vertical-align: top;
}
```

Note: the CSS causes the tasks to be in reverse order.

Hit the button below when you’d like to see more of these tips.