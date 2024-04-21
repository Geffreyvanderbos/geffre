---
category:
  - obsidian
created: 2024-04-21
title: External files in Obsidian Vault without duplicating
updated: 2024-04-21
---
I use symbolic links (symlinks) to add several folders to my Obsidian vault that are not in my vault's directory. For example, this website's content. As well as my Zotero PDF collection.

To create symlinks between folders on macOS, Linux, and Windows, you use the following commands:

**macOS and Linux:**
1. Open the Terminal.
2. Use the `ln` command to create a symlink. The syntax is:
   ```sh
   ln -s /path/to/target /path/to/symlink
   ```
3. Replace `/path/to/target` with the full path to the original folder, and `/path/to/symlink` with the location where you want the symlink to appear. In my case, my Obsidian folder.

**Example:**
```sh
ln -s /Users/johndoe/Documents/Project /Users/johndoe/Desktop/ProjectShortcut
```

**Windows:**
1. Open Command Prompt or PowerShell with administrator privileges.
2. Use the `mklink` command to create a symlink. The syntax is:
   ```sh
   mklink /D C:\path\to\symlink C:\path\to\target
   ```
3. `/D` indicates a directory symlink. Replace `C:\path\to\target` with the full path to the original folder and `C:\path\to\symlink` with the location where you want the symlink to be created.

**Example:**
```sh
mklink /D C:\Users\johndoe\Desktop\ProjectShortcut C:\Users\johndoe\Documents\Project
```

These commands create a symlink between folders, allowing you to access the same content from different locations without duplicating files. It's pretty cool.