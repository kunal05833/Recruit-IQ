// src/services/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { store } from "../redux/store";
import { addNotification } from "../features/notifications/notificationSlice";

let stompClient = null;

export const connectWebSocket = (userId, token) => {
  if (stompClient?.active) return;

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws/notifications"),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,

    onConnect: () => {
      console.info("WebSocket connected ✅");

      // Subscribe to user-specific notifications
      stompClient.subscribe(
        `/user/${userId}/queue/notifications`,
        (message) => {
          try {
            const notif = JSON.parse(message.body);
            store.dispatch(addNotification(notif));

            if (Notification.permission === "granted") {
              new Notification(notif.title || "New notification", {
                body: notif.message,
              });
            }
          } catch (e) {
            console.warn("WebSocket message parse error:", e);
          }
        }
      );

      // Also subscribe to broadcast topic
      stompClient.subscribe("/topic/notifications", (message) => {
        try {
          const notif = JSON.parse(message.body);
          store.dispatch(addNotification(notif));
        } catch (e) {
          console.warn("Broadcast parse error:", e);
        }
      });
    },

    onStompError: (frame) => {
      console.warn("STOMP error:", frame);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  stompClient?.deactivate();
  stompClient = null;
};