'use strict';

import Firebase from '../lib/Firebase.js';

class Home {
  static id = "home";
  constructor() {
    this.firebase = new Firebase();
    this.messagesContent = document.getElementById("messages-content");
    this.firebase.db.ref("messages").on("child_added", snapshot => {
      const message = snapshot.val();
      const sender = message.sender || "Anonymous";
      const text = message.message || "";
      const html = `
        <div class="message">
          <div class="message-sender">${sender}</div>
          <div class="message-text">${text}</div>
        </div>
      `;
      this.messagesContent.insertAdjacentHTML("beforeend", html);
    });
  }
  async init(popup){
    var self = this;
    document.getElementById("message").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        var messageInput = document.getElementById("message");
        var message = messageInput.value.trim();
        if (message !== "") {
          messageInput.value = "";
          self.sendMessage(message);
        }
      }
    });
    this.popup = popup;
  }
  async sendMessage(message) {
    try
    {
      window.logger.chat.log('[CHAT] Message send:', message);
      this.firebase.db.ref("messages").push().set({
        "message": message,
        "sender": 'Guillaume'
      });
    }
    catch(error)
    {
      window.logger.chat.log('[CHAT] Error while sending message:', error);
    }
  }
}

function sleep(ms){
  return new Promise((r) => { setTimeout(r, ms) });
}

export default Home;
