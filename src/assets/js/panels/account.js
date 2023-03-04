'use strict';

class Account {
  static id = "account";

  async init(popup){
    this.popup = popup;
    this.welcome();
  }
  async welcome(){
    return this.popup.showPopup("Aucun compte", "Vous devez vous connecter à votre compte minecraft avant de pouvoir vous connecter au teamspeak", "warning", { value: "Ok" });
  }
}

function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}

export default Account;
