'use strict';

const AutoUpdater = require("nw-autoupdater");
const pkg = require("../package.json");
const updater = new AutoUpdater(pkg, { strategy: "ScriptSwap" });

let win = nw.Window.get();

let isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

class Splash {
  constructor(){
    if(localStorage.getItem("theme") == "white") document.children[0].classList.toggle("theme-white");
    else document.children[0].classList.toggle("theme-dark");
    this.splash = document.querySelector(".splash");
    this.splashMessage = document.querySelector(".splash-message");
    this.splashAuthor = document.querySelector(".splash-author");
    this.message = document.querySelector(".message");
    this.progress = document.querySelector("progress");
    if(localStorage.getItem("theme") == null) localStorage.setItem("theme", "dark");
    var self = this;
    document.addEventListener('DOMContentLoaded', () => { self.startAnimation() });
  }

  async startAnimation(){
    let splashes = [
      { "message": "Super ça marche... Blablabla", "author": "Guillaume" },
      { "message": "Bienvenue dans le nouveau chat", "author": "Guillaume" }
    ]
    let splash = splashes[Math.floor(Math.random() * splashes.length)];
    this.splashMessage.textContent = splash.message;
    this.splashAuthor.children[0].textContent = "@"+splash.author;
    await sleep(100);
    document.querySelector("#splash").style.display = "block";
    await sleep(500);
    this.splash.classList.add("opacity");
    await sleep(500);
    this.splash.classList.add("translate");
    this.splashMessage.classList.add("opacity");
    this.splashAuthor.classList.add("opacity");
    this.message.classList.add("opacity");
    await sleep(1000);
    this.checkUpdate();
  }

  async checkUpdate(){
    if(isDev) return this.startApp();

    const manifest = await fetch(pkg.manifestUrl).then(res => res.json());
    const update = await updater.checkNewVersion(manifest);
    if(!update) return this.startApp();

    updater.on("download", (dlSize, totSize) => {
      this.setProgress(dlSize, totSize);
    });
    updater.on("install", (dlSize, totSize) => {
      this.setProgress(dlSize, totSize);
    });

    this.toggleProgress();
    this.setStatus(`Téléchargement de la mise à jour`);
    const file = await updater.download(manifest);
    this.setStatus(`Décompression de la mise à jour`);
    await updater.unpack(file);
    this.toggleProgress();
    this.setStatus(`Redémarrage`);
    await updater.restartToSwap();
  }
  
  startApp(){
    this.setStatus(`Démarrage du chat`);
    nw.Window.open("src/app.html", {
      "title": "ChatClasse",
      "width": 1280,
      "height": 720,
      "min_width": 1280,
      "min_height": 720,
      "frame": (process.platform == "win32") ? true : true,
      "position": "center",
      "icon": "src/assets/images/icons/icon2.png"
    });
    win.close();
  }

  shutdown(text){
    this.setStatus(`${text}<br>Arrêt dans 5s`);
    let i = 4;
    setInterval(() => {
      this.setStatus(`${text}<br>Arrêt dans ${i--}s`);
      if(i < 0) win.close();
    }, 1000);
  }

  setStatus(text){
    this.message.innerHTML = text;
  }

  toggleProgress(){
    if(this.progress.classList.toggle("show")) this.setProgress(0, 1);
  }

  setProgress(value, max){
    this.progress.value = value;
    this.progress.max = max;
  }
}

new Splash();

function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}
