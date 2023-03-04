'use strict';

// Panels
import Home from './panels/home.js';
import Parameters from './panels/parameters.js';
import Account from './panels/account.js';

// Libs
import Popup from './lib/Popup.js';
import Logger from './lib/Logger.js';

const fs = require("fs");
const popup = new Popup();

let win = nw.Window.get();

window.isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

class App {
  constructor(){
    this.initWindow();
    console.log("Initializing app...");
    if(localStorage.getItem("theme") == "white") document.children[0].classList.toggle("theme-white");
    else document.children[0].classList.toggle("theme-dark");
    this.createPanels(Home, Parameters, Account);
    if(process.platform == "win32") this.initFrame();
    this.loadMenu();
    setTimeout(() => {
      document.body.classList.remove("hide");
    }, 250);
  }

  initWindow(){
    window.logger = {
      app: new Logger("App", "#FF7F18"),
      chat: new Logger("Chat", "#43B581")
    }

    this.initLogs();

    window.console = window.logger.app;

    window.onerror = (message, source, lineno, colno, error) => {
      console.error(error);
      source = source.replace(`${window.location.origin}/src/`, "");
      let stack = error.stack.replace(new RegExp(`${window.location.origin}/src/`.replace(/\//g, "\\/"), "g"), "").replace(/\n/g, "<br>").replace(/\x20/g, "&nbsp;");
      popup.showPopup("Une erreur est survenue", `
        <b>Erreur:</b> ${error.message}<br>
        <b>Fichier:</b> ${source}:${lineno}:${colno}<br>
        <b>Stacktrace:</b> ${stack}`, "warning",
        {
          value: "Relancer",
          func: () => {
            document.body.classList.add("hide");
            win.reload()
          }
        }
      );
      document.body.classList.remove("hide");
      return true;
    };

    window.onclose = () => {
      localStorage.removeItem("distribution");
    }
  }

  initLogs(){
    let logs = document.querySelector(".log-bg");

    let block = false;
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey && e.shiftKey && e.keyCode == 73 || event.keyCode == 123) && !block && !isDev) {
        logs.classList.toggle("show");
        block = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.ctrlKey && e.shiftKey && e.keyCode == 73 || event.keyCode == 123) block = false;
    });

    let close = document.querySelector(".log-close");

    close.addEventListener("click", () => {
      logs.classList.toggle("show");
    })

    /* app logs */

    let app = document.querySelector("#app.logger");

    app.querySelector(".header").addEventListener("click", () => {
      app.classList.toggle("open");
    });

    let lcontent = app.querySelector(".content");

    logger.app.on("info", (...args) => {
      addLog(lcontent, "info", args);
    });

    logger.app.on("warn", (...args) => {
      addLog(lcontent, "warn", args);
    });

    logger.app.on("debug", (...args) => {
      addLog(lcontent, "debug", args);
    });

    logger.app.on("error", (...args) => {
      addLog(lcontent, "error", args);
    });

    /* chat logs */

    let chat = document.querySelector("#chat.logger");

    chat.querySelector(".header").addEventListener("click", () => {
      chat.classList.toggle("open");
    });

    let mcontent = chat.querySelector(".content");

    logger.chat.on("info", (...args) => {
      addLog(mcontent, "info", args);
    });

    logger.chat.on("warn", (...args) => {
      addLog(mcontent, "warn", args);
    });

    logger.chat.on("debug", (...args) => {
      addLog(mcontent, "debug", args);
    });

    logger.chat.on("error", (...args) => {
      addLog(mcontent, "error", args);
    });

    /* add log */

    function addLog(content, type, args){
      let final = [];
      for(let arg of args){
        if(typeof arg == "string"){
          final.push(arg);
        } else if(arg instanceof Error) {
          let stack = arg.stack.replace(new RegExp(`${window.location.origin}/src/`.replace(/\//g, "\\/"), "g"), "")
          final.push(stack);
        } else if(typeof arg == "object"){
          final.push(JSON.stringify(arg));
        } else {
          final.push(arg);
        }
      }
      let span = document.createElement("span");
      span.classList.add(type);
      span.innerHTML = `${final.join(" ")}<br>`.replace(/\x20/g, "&nbsp;").replace(/\n/g, "<br>");

      content.appendChild(span);
    }
  }

  async loadMenu(){
    let buttons = document.querySelectorAll(".panels .button");
    this.active = document.querySelector("#home.button");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        if(button.id == this.active.id) return;
        if(button.id == "settings"){
          if(this.active.parentElement.id == "stg"){
            this.active.classList.toggle("active");
            (this.active = document.querySelector("#home.button")).classList.toggle("active");
            this.changePanel("home");
          }
          return button.classList.toggle("close");
        }
        this.active.classList.toggle("active");
        (this.active = button).classList.toggle("active");
        this.changePanel(button.id);
      });
    });


    /* white theme easter */
    account.addEventListener("mouseup", (e) => {
      if (e.which == 3 && e.detail == 7){
        document.children[0].classList.toggle("theme-white");
        document.children[0].classList.toggle("theme-dark");
        if(localStorage.getItem("theme") == "white") localStorage.setItem("theme", "dark");
        else localStorage.setItem("theme", "white");
      }
    });

    account.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  createPanels(...panels){
    let panelsElem = document.querySelector("#panels");
    for(let panel of panels){
      console.log(`Initializing ${panel.name} Panel...`);
      let div = document.createElement("div");
      div.id = panel.id;
      if(div.id == "home"){
        this.panel = div;
        div.classList.toggle("active");
      }
      div.innerHTML = fs.readFileSync(`src/panels/${panel.id}.html`, "utf8");
      panelsElem.appendChild(div);
      new panel().init(popup);
    }
  }

  changePanel(id){
    let panel = document.querySelector(`#panels #${id}`);
    this.panel.classList.toggle("active");
    (this.panel = panel).classList.toggle("active");
  }

  initFrame(){
    document.querySelector(".frame").classList.toggle("hide");
    document.querySelector(".dragbar").classList.toggle("hide");

    document.querySelector("#minimize").addEventListener("click", () => {
      win.minimize();
    });

    let maximized = false;
    let maximize = document.querySelector("#maximize");
    maximize.addEventListener("click", () => {
      if(maximized) win.unmaximize();
      else win.maximize();
      maximized = !maximized;
      maximize.classList.toggle("icon-maximize");
      maximize.classList.toggle("icon-restore-down");
    });

    document.querySelector("#close").addEventListener("click", () => {
      win.close();
    })
  }

}

new App();
