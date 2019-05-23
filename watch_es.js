


const shell = require("shelljs"); 
const watch = require("watch");

watch.watchTree("./components", (f, curr, prev) =>{
  shell.exec("yarn build:es");
  shell.exec("yarn build:css");
});

