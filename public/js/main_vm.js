// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId(sID, message) {
  vm.socketID = sID;
}

function runDisconnectMessage(packet) {
  console.log(packet);
}

//this is our main Vue instance
const vm = new Vue({
  data: {
    socketID: "",
    messages: [],
    message: "",
    nickName: ""
  },

  methods: {
    dispatchMessage() {
      //emit a message event and send the message to the server
      console.log("handle send message");
      socket.emit("chat_message", {
        content: this.message,
        name: this.nickName || "anonymus"
      });
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
socket.addEventListener("user_disconnect", runDisconnectMessage);
