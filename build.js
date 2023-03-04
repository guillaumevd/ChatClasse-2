const { nwbuild } = require("nw-builder");

nwbuild({
  srcDir: "./src/**/*",
  mode: "build",
  version: "latest",
  flavor: "normal",
  platform: "linux",
  arch: "x64",
  outDir: "./build",
  cache: false,
  app: {
    name: "Some Product",
    icon: "./src/assets/images/icons/icon.png",
    company: "Some Company",
    fileDescription: "Process Name",
    productName: "Some Product",
    legalCopyright: "Copyright 2017",
  },
});