// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDS6oRCGu8BW3fXnpp6L4AhkNJ4OsGpwtk",
  authDomain: "skillbook-3fa41.firebaseapp.com",
  projectId: "skillbook-3fa41",
  storageBucket: "skillbook-3fa41.appspot.com",
  messagingSenderId: "599549421075",
  appId: "1:599549421075:web:9092eeb6bc3765baebc1e6",
  measurementId: "G-3VKK01HXE6"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

// ✅ Export core Firebase services
export { app, db, messaging };

// ✅ Request Notification Token (without user auth)
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BKYkg8gINiuvd4JN0I0ht5_uXK_5V-H2Owk4mG5e2FtCVhHO0yJHKbbNnfWsJm7Pp6M8F_5HKdOl-MFt3nOtrKo"
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      // Store token anonymously if needed, or link to session later
    } else {
      console.warn("⚠️ No registration token available. Request permission.");
    }
  } catch (err) {
    console.error("❌ Error getting FCM token: ", err);
  }
};

// ✅ Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("📩 Message received in foreground: ", payload);
});
