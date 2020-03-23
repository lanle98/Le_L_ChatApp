// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId(sID) {
  vm.socketID = sID;
}

function runNotification(packet) {
  vm.notifications.push(packet)
}



function appendNewMessage(msg) {
  vm.messages.push(msg);
}

//this is our main Vue instance
const vm = new Vue({
  data: {
    socketID: "",
    messages: [],
    message: "",
    nickName: "",
    notifications: [],
    nameIsNotSet: true
  },

  methods: {
    dispatchMessage() {
      //emit a message event and send the message to the server
      console.log("handle send message");
      socket.emit("chat_message", {
        content: this.message,
        name: this.nickName || "anonymus"
      });
      this.message = "";
    },

    setName() {
      if (this.nickName !== '') {
        this.nameIsNotSet = false
      } else {
        document.querySelector('#nickname').classList.add('wiggle')
        setTimeout(() => {
          document.querySelector('#nickname').classList.remove('wiggle')
        }, 200)
      }
    }
  },

  components: {
    newmessage: ChatMessage
  },

  mounted() {
    console.log("mounted");
  }
}).$mount("#app");

//some event handling -> these events are coming from the server
socket.addEventListener("connected", setUserId);
socket.addEventListener("user_disconnect", runNotification);
socket.addEventListener("user_connected", runNotification);
socket.addEventListener("new_message", appendNewMessage);
