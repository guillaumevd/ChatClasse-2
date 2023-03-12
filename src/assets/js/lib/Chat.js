'use strict';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';

//Don't work
class Chat {
  constructor() {
    // Your web app's Firebase configuration
    this.firebaseConfig = {
      apiKey: "AIzaSyDlGc9IanhpgBpv3xcltTTgiwWPWQEm8Rs",
      authDomain: "chatclassev1.firebaseapp.com",
      databaseURL: "https://chatclassev1-default-rtdb.europe-west1.firebasedatabase.app/",
      projectId: "chatclassev1",
      storageBucket: "chatclassev1.appspot.com",
      messagingSenderId: "112200356485",
      appId: "1:112200356485:web:8cdd81ff85493eb8668fec"
    };
    // Initialize Firebase
    try {
      const firebase = initializeApp(this.firebaseConfig);
      window.logger.chat.log("[FIREBASE] Firebase initialized successfully.");
    } catch (error) {
      window.logger.chat.error("[FIREBASE] Error initializing Firebase:", error);
    }

  }
}

export default Chat;
