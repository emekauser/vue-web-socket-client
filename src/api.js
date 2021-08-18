import axios from "axios";

export default {
  getAllMessages: () => {
    return axios.get("http://localhost:4000/get_messages");
  }
};
