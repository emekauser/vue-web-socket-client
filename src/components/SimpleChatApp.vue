<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div v-if="!submitted">
        <div>
          <img
            class="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <input
          type="text"
          id="name"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          required
          v-model="user.name"
          name="title"
          placeholder="Name"
        />

        <button
          @click="openChat"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
        >
          Submit
        </button>
        <h4 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ users.length }} users online
        </h4>
        <div v-for="(user, i) in users" :key="i">
          <p>{{ user.name }}</p>
        </div>
      </div>

      <div v-else>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Chat room
        </h2>
        <ul class="messages">
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

        <div style="bottom: 0px;" class="w-full flex">
          <input
            id="input"
            autocomplete="off"
            v-model="message"
            class="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
            placeholder="Eneter message"
          />
          <button @click="sendMessage" class="m-2" style="outline: none;">
            <svg
              class="svg-inline--fa text-indigo-600 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="paper-plane"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
              />
            </svg>
          </button>
        </div>
      </div>
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

  mounted() {
    API.getActiveUsers().then(response => {
      this.users = response.data["data"];
    });
  },

  updated() {
    scrollToBottom();
  },

  data() {
    return {
      user: {
        name: null
      },
      users: [],
      submitted: false,
      messages: [],
      message: null
    };
  },
  methods: {
    openChat() {
      if (!this.user.name) {
        return alert("Enter name");
      }

      this.submitted = true;
      this.initiateSocket();
      socket.emit("start", this.user.name);

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

      socket.on("error", data => {
        alert(data);
      });

      socket.on("message", data => {
        this.messages.push(data);
        scrollToBottom();
      });
    }
  }
};

function scrollToBottom() {
  const messagesUL = document.querySelector(".messages");
  messagesUL.scrollTop = messagesUL.scrollHeight;
}
</script>

<style>
.messages {
  height: 500px;
  overflow-y: scroll;
}
</style>
