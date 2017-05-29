# JSFiddle Archiver

## Introduction

JSFiddle Archiver is a Node.JS script that can be used to download the whole version history of a fiddle hosted at [JSFiddle](https://jsfiddle.net/) to a new git repository.

## Requirements

- Node.js
- `git` on $PATH
- ID of a JSFiddle (This is the section of the URL immediatly after the domain name; the bold part of the following example URL: http://jsfiddle.net/**jUVfS**/30/)

## Usage

1. Check out or download jsfiddle.js
1. Open a terminal / command prompt to the location of jsfiddle.js
1. Run `node jsfiddle.js`
1. When prompted enter the ID of the fiddle and hit return

At this point a folder will be created using the ID of the fiddle. A git repoistory will be initialised in the folder and a README.md created / commited. Each version of the fiddle will then be commited as seperate commits to the git repository. When `not found` appears in the output the last version has been commited.

## Known Issues

- When the last version of a fiddle has been commited an error message stating `not found` appears. This is expected, and means the script has finished. Press **CTRL+C** to terminate the script.
- After the script has finished the created repository will contain an uncomitted delete of **index.html**. `git reset --hard` should be used within the repository to restore the deleted file.
- If a fiddle version is the same as the previous version a warning will shown in the script output. The version will be skipped from the git repository since git requires at least a change to make a commit.