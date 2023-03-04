'use strict';

const admin = require('firebase-admin');


class Firebase {
  constructor(){
    window.logger.chat.log('[FIREBASE] Firebase module imported');
    this.config = {
      apiKey: "AIzaSyDlGc9IanhpgBpv3xcltTTgiwWPWQEm8Rs",
      authDomain: "chatclassev1.firebaseapp.com",
      databaseURL: "https://chatclassev1-default-rtdb.europe-west1.firebasedatabase.app/",
      projectId: "chatclassev1",
      storageBucket: "chatclassev1.appspot.com",
      messagingSenderId: "112200356485",
      appId: "1:112200356485:web:8cdd81ff85493eb8668fec"
    };
    this.init();
  }
  async init() {
    try
    {
      admin.initializeApp(this.config);
      this.db = admin.database();
      window.logger.chat.log('[FIREBASE] Firebase started');
    }
    catch(error) 
    {
      window.logger.chat.log('[FIREBASE] Firebase ERROR:', error);
    }
  }
}

export default Firebase;
