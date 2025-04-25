import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDS6oRCGu8BW3fXnpp6L4AhkNJ4OsGpwtk",
  authDomain: "skillbook-3fa41.firebaseapp.com",
  projectId: "skillbook-3fa41",
  storageBucket: "skillbook-3fa41.appspot.com",
  messagingSenderId: "599549421075",
  appId: "1:599549421075:web:9092eeb6bc3765baebc1e6",
  measurementId: "G-3VKK01HXE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const messaging = getMessaging(app);

// Export Firebase services
export { app, auth, messaging };

// Request permission and get FCM token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BKYkg8gINiuvd4JN0I0ht5_uXK_5V-H2Owk4mG5e2FtCVhHO0yJHKbbNnfWsJm7Pp6M8F_5HKdOl-MFt3nOtrKo"
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // Optional: Send this token to your backend server
    } else {
      console.warn("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
};

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received in foreground: ", payload);
});
