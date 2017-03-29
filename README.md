# NYCSCC-map-viewer
Map viewer front-end from SUNY-ESF

## Prerequisites
* NodeJS
  * https://nodejs.org/en/download/
* Grunt
  * http://gruntjs.com/getting-started


## Getting Started
  Install node and checkout the NYCSCC-map-viewer repository.  In the repository run ``` npm install ```
  That will install all the dependencies locally that are required.
  
  The src/index.html file is what you can point at to develop locally.  It should reference other CSS / JS files in the src directory.
  
  When packinging the distribution - the src/index.html file is inlined and minified to dist/map_viewer.html

## Workflow
 The src files are built using
 `` grunt ```
 The output is placed in dist in the file:
 ``` dist/map_viewer.html ```
 
 
 

