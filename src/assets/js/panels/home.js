'use strict';

import Chat from '../lib/Chat.js';

class Home {
  static id = "home";
  async init(popup){

    const chat = new Chat();

    this.popup = popup;
    this.initLinks();
  }
  initLinks(){
    /* terms */

    let ToU = document.querySelector("#ToU");
    ToU.addEventListener("click", () => {
      nw.Shell.openExternal("https://chatclasse.com/help/cgu");
    });
    let ToS = document.querySelector("#ToS");
    ToS.addEventListener("click", () => {
      nw.Shell.openExternal("https://chatclasse.com/help/cgv");
    });
  }
  
}

function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}

export default Home;
