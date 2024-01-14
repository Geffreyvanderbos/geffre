---
category: obsidian
created: 2023-08-17
title: My Zotero research paper template
updated: 2023-08-17
---

I use Zotero to organise my research papers on musicology and music technology. To import the highlights I make to Obsidian, I use a community plugin called Zotero Integration.

You can assign a template for this import. My template starts with a link to the Zotero PDF, so I can open the research paper's PDF directly via the Obsidian note. Then, there's an abstract note, which helps remind me what the paper is about.

Next, there's a loop with my custom [highlighting callout in Obsidian](/note/highlights-callouts-obsidian). This loop goes through all the annotations and highlights I've made. It adds images, comments, and the page number of the PDF where each highlight occurred. By clicking the linked annotation, I can jump straight to that page in Zotero's PDF for more context.

You can set up this research paper template in the Zotero Integration plugin by choosing an import format and adding the following note as  the template file.

```js
{% raw %}
---
title: "{{title}}"
author: "{{authors}}{{directors}}"
aliases:
  - "{{citekey}}"
category:
  - referenceNotes
tags: 
type: researchPapers
---

> 🔗 Zotero: {{pdfZoteroLink}}

{% if abstractNote -%}
> [!abstract]
> {{abstractNote}}
> {%- endif %}

{% for annotation in annotations -%}
> [!highlight]
> {% if annotation.annotatedText -%}
> “{{annotation.annotatedText | escape}}”
> [Page {{annotation.page}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.page}}&annotation={{annotation.id}})
> {%- endif %}
> {% if annotation.imageRelativePath -%}
> ![{{limageRelativePath}}]
> {%- endif %}
> {% if annotation.comment -%}
> {{annotation.comment}}
> {%- endif %}

{% endfor -%}
{% endraw %}
```