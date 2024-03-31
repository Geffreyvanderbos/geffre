---
category: scripts
created: 2024-02-13
title: Convert Spotify Library to Markdown
updated: 2024-02-13
popular: true
---

When my Spotify account glitched and my libary showed up empty, I became very aware of the fact my 'music collection' was vendor locked.

To lose the 1200 (!) albums I've saved over the years, was frightening to say the least.

Luckily, under some regulations, Spotify is forced to have your information exportable. Grab it under the *Download your data* heading in [your Spotify privacy settings](https://www.spotify.com/us/account/privacy/).

After a few days, you'll receive a couple of .json files with your streaming history, playlists–and most interesting to me–a list of everything in your Spotify library.

I (or rather, ChatGPT and I) then wrote this Python script that can take in this YourLibrary.json and spit out individual Markdown files for every album in the list. With the artist name, album name and Spotify URI in the frontmatter.

```python
import json
import os
import re

# create front matter and content for Markdown file
def create_markdown_content(artist, album, uri):
    front_matter = f"""---
artist: "{artist.replace('"', "'")}"
album: "{album.replace('"', "'")}"
uri: "{uri}"
---
"""
    return front_matter

# sanitize album names for use as filenames
def sanitize_album_name(album_name):
    # Replace periods at the start with an underscore, thanks Slipknot.
    if album_name.startswith('.'):
        album_name = '_' + album_name[1:]
    # Replace special characters with an underscore, for all normal album names
    album_name = re.sub(r'[\\/*?:"<>|,]', '_', album_name)
    return album_name

# export each album to an individual Markdown file
def export_albums_to_markdown(albums, folder):
    for album in albums:
        artist = album['artist']
        album_name = album['album']
        uri = album['uri']

        # Sanitize album name to be used as a filename
        safe_album_name = sanitize_album_name(album_name)

        # Create Markdown content
        content = create_markdown_content(artist, album_name, uri)

        file_name = os.path.join(folder, f"{safe_album_name}.md")

        # Write the markdown file
        with open(file_name, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Exported: {file_name}")

if __name__ == '__main__':
    # Ask for the JSON file location
    json_file_path = input("Enter the path to YourLibrary.json: ")

    # Check if the 'albums' folder exists, create if not
    folder = 'albums'
    if not os.path.exists(folder):
        os.makedirs(folder)

    # Load and parse the JSON file
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        # Export albums to markdown in the 'albums' folder
        export_albums_to_markdown(data['albums'], folder)
    except FileNotFoundError:
        print(f"No file found at {json_file_path}. Please check the path and try again.")
    except json.JSONDecodeError:
        print(f"Error decoding JSON from file {json_file_path}. Please ensure it's a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
```

To download the coverart of each album, I have a script that is a bit more involved. It uses the Spotify API. Use the form in my site's footer to reach out and I can help you with that, if you like.