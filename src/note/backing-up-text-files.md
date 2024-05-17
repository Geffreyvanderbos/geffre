---
category:
  - technology
created: 2023-12-03
title: Exporting Tasks from Things 3 Database to Plain Text
updated: 2024-05-17
---

This guide is written for Things on MacOS. There is a way to [get your database on iOS or iPad](https://culturedcode.com/things/support/articles/2982272/#gqevu). However, I can't guarantee the script will work with it.

## Step 1: Locating Your Things 3 Database
Before you can use the script, you need to locate your Things 3 database:

1. Quit Things 3 app on your Mac.
2. Click on 'Finder' in your Dock.
3. In the menu bar, select Go → Go to Folder.
4. Paste this path: ~/Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac/
5. Press the Return key.
6. Open the folder named ThingsData-xxxxx.
7. Copy (do not move) the Things Database.thingsdatabase to your desired location. Like your desktop. Or a custom folder in documents.
8. To access the database, CTRL + click on the bundle and select 'Show Package Contents'. The file main.sqlite is your database.

## Step 2: Setting Up the Python Environment
Make sure you have Python installed on your Mac. You can find instruction on [installing Python here](https://docs.python.org/3/using/mac.html).

## Step 3: Running the Script
1. Save the Python script below this note, call it `things2plaintext.py`. I recommend saving it in the same directory as your main.sqlite.
2. Open your terminal.
3. Navigate ([how?](https://www.macworld.com/article/221277/command-line-navigating-files-folders-mac-terminal.html)) to the directory where you saved the script.
4. Run the script by typing `python things2plaintext.py`.

## Step 4: Using the Script
1. When prompted, enter the path of your Things 3 database. If it's in the same directory, type `main.sqlite`.
2. Choose the export format: type 1 for Markdown or 2 for [Todo.txt](https://todotxt.org/).
3. The script will connect to your database and export the tasks to a file named exported_tasks.txt in the same directory.

## Troubleshooting
If you encounter any errors, ensure that the database path is correct and that the right Python is installed. Raise [an issue on our Github](https://github.com/Geffreyvanderbos/plaintextjournal), when you are stuck.

I hope this helped making your tasks more resistent to time.

```python
import sqlite3
import os

def get_database_path():
    return input("Enter the path of your Things 3 database (main.sqlite): ")

def choose_export_format():
    choice = input("Choose export syntax (1 for Markdown, 2 for todo.txt): ")
    return 'markdown' if choice == '1' else 'todo.txt'

def connect_to_database(path):
    try:
        return sqlite3.connect(path)
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def fetch_tasks(cursor):
    query = """
    SELECT title, status
    FROM TMTask
    WHERE trashed = 0 AND status IN (0, 3, 2)
    """
    cursor.execute(query)
    return cursor.fetchall()

def task_status(status):
    return {
        0: 'Not Yet Done',
        3: 'Done',
        2: 'Canceled'
    }.get(status, 'Unknown')

def format_task(task, format_type):
    title, status = task

    # Define the status markers and prefixes
    status_markers = {
        0: ('', ''),             # Not Yet Done
        3: ('x ', ''),           # Done
        2: ('x ', 'canceled ')   # Canceled
    }
    
    # Get the appropriate marker and prefix for the task status
    marker, prefix = status_markers.get(status, ('', ''))

    if format_type == 'markdown':
        return f"- [{marker.strip()}] {prefix}{title}\n"
    else:  # todo.txt format
        # Only add a space after the marker if it's not empty
        space = ' ' if marker else ''
        return f"{marker}{space}{prefix}{title}\n"

def main():
    db_path = get_database_path()
    export_format = choose_export_format()
    connection = connect_to_database(db_path)

    if connection:
        cursor = connection.cursor()
        tasks = fetch_tasks(cursor)

        tasks = [(title, status) for title, status in tasks if title.strip()]

        with open("exported_tasks.txt", "w") as file:
            for task in tasks:
                file.write(format_task(task, export_format))

        print("Tasks exported successfully.")
        connection.close()

if __name__ == "__main__":
    main()
```