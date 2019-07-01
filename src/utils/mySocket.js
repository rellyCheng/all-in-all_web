import io from "socket.io-client";
import token from "@/utils/token";
let socket;
// let userId = JSON.parse(sessionStorage.getItem("currentUser")).userId;
let website = "all-web";
const connectSocket = () => {
  socket = io.connect(
    SERVER_IP.SOCKET + `?token=${token.get()}&website=${website}`
  );
};
export { connectSocket };
export { socket };
