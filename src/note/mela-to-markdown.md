---
category: scripts
title: Mela to Markdown (Python script)
created: 2024-04-09
updated: 2024-04-19
---

I adore [Mela](https://mela.recipes/) as my recipe manager and meal planner. We use it every single day. 

For safekeeping my recipes, I wrote a python script that converts Mela their export to Markdown.

1. Export Mela recipes under `Settings > General`. (Only iOS / iPadOS)
2. Transfer the .melarecipes file to your computer.
3. Rename .melarecipes to .zip.
4. Extract to preferred folder. There should be a list of `.melarecipe` files.
5. Add the following Python script to the directory. In the script, under "Define your directories", define where you'd like to store the Markdown recipe and the respective image. (NOTE: the relative path to the image will be parsed in the Markdown.)
6. Run the Python script.

```python
import json
import os
import base64
from datetime import datetime

# Define your directories
json_dir = './Recipes'  # Correct path to your JSON files
markdown_dir = './Markdown'  # Output directory for Markdown files
images_dir = './Attachments/recipeImages'  # Directory to store images

# Ensure the Markdown and images directories exist
os.makedirs(markdown_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)
print(f"Markdown directory is set at {markdown_dir}")
print(f"Images will be stored in {images_dir}")

def save_image(title, base64_string):
    """Decode base64 image and save as a JPG file."""
    img_data = base64.b64decode(base64_string)
    img_filename = f"{title}.jpg".replace(" ", "_")
    img_path = os.path.join(images_dir, img_filename)
    with open(img_path, 'wb') as img_file:
        img_file.write(img_data)
    return img_path

def convert_recipe_to_markdown(json_file):
    print(f"Processing file: {json_file}")
    
    try:
        with open(json_file, 'r', encoding='utf-8') as file:
            recipe = json.load(file)
    except Exception as e:
        print(f"Error reading file {json_file}: {e}")
        return

    # Frontmatter
    markdown_content = "---\n"
    markdown_content += "category: recipeNotes\n"
    markdown_content += f"title: {recipe['title']}\n"
    markdown_content += f"created: {datetime.now().strftime('%Y-%m-%d')}\n"  # Assuming creation date is now
    markdown_content += f"updated: {datetime.now().strftime('%Y-%m-%d')}\n"  # Assuming last updated is now
    markdown_content += "---\n\n"

    markdown_content += f"# {recipe['title']}\n\n{recipe.get('text', 'No description available.')}\n\n"
    
    if recipe.get('images'):
        image_path = save_image(recipe['title'], recipe['images'][0])
        markdown_content += f"![{recipe['title']}]({image_path})\n\n"
    
    if 'ingredients' in recipe:
        markdown_content += "---\n\n- " + recipe['ingredients'].replace('\n', '\n- ') + "\n\n"
    else:
        markdown_content += "---\n\nNo ingredients listed.\n\n"
    
    instructions = recipe.get('instructions', 'No instructions provided.')
    steps = instructions.split('\n')
    formatted_steps = [f"- {step}" for step in steps if step.strip()]
    formatted_instructions = '\n'.join(formatted_steps)
    markdown_content += "---\n\n" + formatted_instructions + "\n"


    #  markdown_content += "---\n\n" + recipe.get('instructions', 'No instructions provided.') + "\n"

    markdown_filename = os.path.join(markdown_dir, f"{recipe['title']}.md")
    
    try:
        with open(markdown_filename, 'w', encoding='utf-8') as md_file:
            md_file.write(markdown_content)
        print(f"Successfully wrote {markdown_filename}")
    except Exception as e:
        print(f"Error writing to file {markdown_filename}: {e}")

# Check if the JSON directory exists
if not os.path.exists(json_dir):
    print(f"JSON directory {json_dir} does not exist. Please check the path.")
else:
    # Loop through all files in the JSON directory
    files_processed = 0
    for filename in os.listdir(json_dir):
        if filename.endswith('.melarecipe'):
            convert_recipe_to_markdown(os.path.join(json_dir, filename))
            files_processed += 1
    
    if files_processed == 0:
        print("No .melarecipe files found in the directory.")
    else:
        print(f"All recipes processed. {files_processed} files converted.")
```
