'use strict';

import AccDatabase from '../lib/AccDatabase.js';
import Microsoft from '../lib/Microsoft.js';

class Account {
  static id = "account";

  async init(popup){
    this.accounts = await new AccDatabase().init();
    this.microsoft = new Microsoft(this.accounts);
    this.accMicrosoftDiv = document.querySelector("div#microsoft.accounts div");
    this.connect = document.querySelector(".connect-bg");
    this.popup = popup;

    this.initClick();
    this.initAccounts();
  }

  async initAccounts(){
    console.log("[Account] Initializing Accounts...");
    let accounts = await this.accounts.getAll();
    if(accounts[0]){
      if((await this.accounts.getAll()).length == 0) return localStorage.removeItem("selected");
      if(localStorage.getItem("selected") == null) localStorage.setItem("selected", accounts[0].uuid);
      this.changeProfile(localStorage.getItem("selected"), false);
      this.selected = document.getElementById(localStorage.getItem("selected"));
      this.selected.classList.toggle("active");
    }
  }

  addAccount(account){
    let div = document.createElement("div");
    div.classList.add("account");
    div.id = account.uuid;
    div.innerHTML = `
      <img class="acc-image" src="https://mc-heads.net/avatar/${account.uuid}/"/>
      <div class="acc-username">${account.username}</div>
      <div class="acc-email">${account.email}</div>
      <div class="acc-delete icon-account-delete"></div>
    `
    return div;
  }

  async changeProfile(uuid, off){
    let side = document.querySelector(".account-side");
    if(off){
      side.ariaLabel = "non connecté"
    } else {
      let acc = await this.accounts.get(uuid);
      side.ariaLabel = acc.username;
    }
    side.innerHTML = `
      <img class="account-side-img" src="https://mc-heads.net/avatar/${uuid}/"/>
      <div class="account-side-connected ${off ? "red" : "green"}"></div>
    `
  }

  initClick(){
    let changeSelected = (uuid) => {
      this.changeProfile(uuid, false);
      localStorage.setItem("selected", uuid);
      this.selected.classList.toggle("active");
      (this.selected = document.getElementById(uuid)).classList.toggle("active");
    }

    this.accMicrosoftDiv.addEventListener("click", async (event) => {
      console.log('tt');
      let uuid = event.target.id;0
      console.log(event.target);
      if(localStorage.getItem("selected") == uuid) return;
      if(event.target.classList.contains("acc-delete")){
        let account = await this.accounts.get(event.path[1].id);
        return this.popup.showPopup(`Supprimer ${account.username}`, `Êtes-vous sûr de vouloir supprimer le compte <b>${account.username}</b> ?`, "warning", {value: "Oui", func: async () => {
          console.log(`[Account] Deleting ${account.username} (${account.uuid}) microsoft account...`);
          await this.microsoft.invalidate(event.path[1].id);  
          this.accMicrosoftDiv.removeChild(event.path[1]);
          let accounts = await this.accounts.getAll();
          if(accounts[0] && accounts[0].uuid != event.path[1].id) changeSelected(accounts[0].uuid);
          else {
            this.changeProfile("c06f89064c8a49119c29ea1dbd1aab82", true);
            return localStorage.removeItem("selected")
          };
        }}, {value: "Annuler"});
      }
      changeSelected(event.target.id);
    });

    let addMicrosoftAcc = document.querySelector("div#microsoft.accounts #add");
    addMicrosoftAcc.addEventListener("click", async () => {
      console.log('tt');
      let auth = await this.microsoft.authenticate(this.popup);
      if(auth.cancel) return;
      console.log(`[Account] Adding ${auth.username} (${auth.uuid}) microsoft account...`);
      if(!document.getElementById(auth.uuid)){
        let div = this.addAccount(auth);
        this.accMicrosoftDiv.appendChild(div);
      }
      this.changeProfile(auth.uuid, false);
      localStorage.setItem("selected", auth.uuid);
      if(this.selected) this.selected.classList.toggle("active");
      (this.selected = document.getElementById(auth.uuid)).classList.toggle("active");
    });

  }
}

export default Account;
