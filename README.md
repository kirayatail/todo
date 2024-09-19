# todo CLI

[![Coverage Status](https://coveralls.io/repos/github/kirayatail/todo/badge.svg?branch=main)](https://coveralls.io/github/kirayatail/todo?branch=main)

A very simple file-based ToDo app for your command line.

The app uses a couple of simple commands to perform the most popular tasks, 
and for everything else (editing task names, order etc.) a simple text file 
edit will do the trick.

## Installation

`npm install -g git+https://github.com/kirayatail/todo.git`

Optionally, set your favourite text editor in your shell profile file:

```
export EDITOR=code # use VS Code by default
```

## User manual

The main feature is that a stack (last-in-first-out) philosophy is used, 
making it easy to follow the structure where an incoming task takes immediate 
precedence. Secondary commands for queueing tasks as the next in priority 
(without modifying the current task), or last in priority are available.

### todo [name]

Default action. 

**Without parameters:** Display the current task. Remind yourself of what you're (supposed to be) doing. Shortcut for `todo show`

**With parameters:** Create a new task. Shortcut for `todo push`

### todo show

Display the task at the top of the list. A static message will be displayed if the list is empty, no error will be thrown.

### todo list

Show all tasks in a list

Aliases: `todo ls`

### todo push \<name\>

Create a new task and set it as the current task, pushing all other tasks 
down in priority.

Flag `-n, --next`, will set the new task as priority 2.

Aliases: `todo create`, `todo new`

### todo cue \<name\>

Create a new task at the bottom of the list

Aliases: `todo queue`, `todo last`

### todo pop

Removes the current task from the list and sets the next one in line as current

Aliases: `todo done`

### todo edit

Open list as a text file in the default program for the .txt file type. 
If the `EDITOR` variable is set with your favourite text editor, 
that will be prioritized.

Aliases: `todo open`, `todo editor`

## License

This software is provided under the MIT license.

Written by Max Witt 2024