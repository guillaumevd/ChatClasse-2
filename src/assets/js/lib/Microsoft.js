'use strict';

const win = nw.Window.get();


class Microsoft {
  constructor(accDB){
    this.db = accDB;
    this.loading = document.querySelector(".loading-bg");
    this.information = document.querySelector(".loading-bg .information");
  }

  async authenticate(popup){
    this.information.textContent = "En attente de Microsoft";
    this.loading.classList.toggle("show");
    console.log('Signed Up Successfully !');

    
    // this.db.add(profile.id, profile.name, profile.id, mcLogin.access_token, "microsoft", oauth2.refresh_token, refresh_date);
    this.loading.classList.toggle("show");
    return {username: profile.name, uuid: profile.id, email: profile.id};
  }

}

export default Microsoft;
