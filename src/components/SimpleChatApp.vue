<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          required
          v-model="user.name"
          name="title"
        />
      </div>

      <button @click="openChat">Submit</button>
    </div>

    <div v-else>
      <h4>You are welcome</h4>
      <ul>
        <li v-for="(chat, i) in messages" :key="i">
          <Message
            :data="{
              message: chat.message,
              name: chat.name,
              created_at: chat.created_at
            }"
          />
        </li>
      </ul>

      <input id="input" autocomplete="off" v-model="message" />
      <button @click="sendMessage">
        Send
      </button>
    </div>
  </div>
</template>

<script>
import API from "../api";
import Message from "./Message.vue";
import { io } from "socket.io-client";

let socket = null;

export default {
  name: "simple-chat-app",
  components: {
    Message
  },
  data() {
    return {
      user: {
        name: null
      },
      submitted: false,
      messages: [],
      message: null
    };
  },
  methods: {
    openChat() {
      this.submitted = true;
      this.initiateSocket();

      API.getAllMessages()
        .then(response => {
          this.messages = response.data["data"];
        })
        .catch(e => {
          console.log(e);
        });
    },

    sendMessage() {
      socket.emit("message", {
        message: this.message,
        name: this.user.name
      });
      this.message = null;
    },

    initiateSocket() {
      socket = io("ws://localhost:4000", {
        path: "/rockay_socket",
        transports: ["websocket"]
      });

      socket.on("success", data => {
        console.log(data);
      });

      socket.on("error", data => {
        console.log(data);
      });

      socket.on("message", data => {
        console.log(data);
        this.messages.push(data);
      });
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding-bottom: 3rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
}

#form {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 3rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}
#input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}
#input:focus {
  outline: none;
}
#form > button {
  background: #333;
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
  color: #fff;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
#messages > li {
  padding: 0.5rem 1rem;
}
#messages > li:nth-child(odd) {
  background: #efefef;
}
</style>
