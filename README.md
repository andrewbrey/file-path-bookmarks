file-path-bookmarks
=============================

A simple file path bookmark management utility

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/file-path-bookmarks.svg)](https://npmjs.org/package/file-path-bookmarks)
[![Downloads/week](https://img.shields.io/npm/dw/file-path-bookmarks.svg)](https://npmjs.org/package/file-path-bookmarks)
[![License](https://img.shields.io/npm/l/file-path-bookmarks.svg)](https://github.com/file-path-bookmarks/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g file-path-bookmarks
$ file-path-bookmarks COMMAND
running command...
$ file-path-bookmarks (-v|--version|version)
file-path-bookmarks/1.0.3 linux-x64 node-v12.16.1
$ file-path-bookmarks --help [COMMAND]
USAGE
  $ file-path-bookmarks COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`file-path-bookmarks add [PATH]`](#file-path-bookmarks-add-path)
* [`file-path-bookmarks configure`](#file-path-bookmarks-configure)
* [`file-path-bookmarks find [NAME]`](#file-path-bookmarks-find-name)
* [`file-path-bookmarks help [COMMAND]`](#file-path-bookmarks-help-command)
* [`file-path-bookmarks list`](#file-path-bookmarks-list)
* [`file-path-bookmarks remove [PATH]`](#file-path-bookmarks-remove-path)

## `file-path-bookmarks add [PATH]`

add a new file path bookmark

```
USAGE
  $ file-path-bookmarks add [PATH]

ARGUMENTS
  PATH  absolute file path of bookmark (defaults to pwd)

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of this bookmark (will be converted to lower case)

EXAMPLE
  $ file-path-bookmarks add
  $ file-path-bookmarks add /some/absolute/path
```

_See code: [src/commands/add.ts](https://github.com/andrewbrey/file-path-bookmarks/blob/v1.0.3/src/commands/add.ts)_

## `file-path-bookmarks configure`

show or update bookmark configuration

```
USAGE
  $ file-path-bookmarks configure

OPTIONS
  -h, --help  show CLI help
  -s, --show  show current configuration

EXAMPLE
  $ file-path-bookmarks configure
  $ file-path-bookmarks configure --show
```

_See code: [src/commands/configure.ts](https://github.com/andrewbrey/file-path-bookmarks/blob/v1.0.3/src/commands/configure.ts)_

## `file-path-bookmarks find [NAME]`

find a saved bookmark

```
USAGE
  $ file-path-bookmarks find [NAME]

ARGUMENTS
  NAME  bookmark name to search for

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ file-path-bookmarks find "project folder"
  $ file-path-bookmarks find blog
```

_See code: [src/commands/find.ts](https://github.com/andrewbrey/file-path-bookmarks/blob/v1.0.3/src/commands/find.ts)_

## `file-path-bookmarks help [COMMAND]`

display help for file-path-bookmarks

```
USAGE
  $ file-path-bookmarks help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `file-path-bookmarks list`

list all file path bookmarks

```
USAGE
  $ file-path-bookmarks list

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ file-path-bookmarks list
```

_See code: [src/commands/list.ts](https://github.com/andrewbrey/file-path-bookmarks/blob/v1.0.3/src/commands/list.ts)_

## `file-path-bookmarks remove [PATH]`

remove an existing file path bookmark

```
USAGE
  $ file-path-bookmarks remove [PATH]

ARGUMENTS
  PATH  absolute file path of bookmark (defaults to pwd)

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ file-path-bookmarks remove
  $ file-path-bookmarks remove /some/absolute/path
```

_See code: [src/commands/remove.ts](https://github.com/andrewbrey/file-path-bookmarks/blob/v1.0.3/src/commands/remove.ts)_
<!-- commandsstop -->
