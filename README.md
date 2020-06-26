
## initiales setup um sortierungsliste zu schreiben

## setup with intellij via filewatcher (webstorm, phpstorm, ...)

Neuen custom `File Watcher` erstellen via [Settings > Tools > File Watchers > `+` > custom](https://www.jetbrains.com/help/webstorm/using-file-watchers.html#ws_creating_file_watchers) und wie folgt einrichten:

![](./docs/sort-class-name-via-intellij-file-watcher.png)

1. `Program:` => path to node-binary
2. `Arguments` 
    - `sort-class-names.js` (script from this repo - you need to copy it into your workspace)
    - (empty space to seperate the script from its argument)
    - `$FilePath$` which is the currently edited file
3. `Output paths to refres:` => $FilePath$
4. `Working Directory:` => $ProjectFileDir$ (so that the node-script can use the node_modules folder correctly with the correct wrking dir)
5. disable `Auto-save edited files to trigger the watcher`