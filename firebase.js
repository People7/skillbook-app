// firebase.js
// ——— Firebase Web SDK v11.7.3 ———

import { initializeApp }         from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics }          from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import { getFirestore }          from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getMessaging, getToken, onMessage }
                                 from "https://www.gstatic.com/firebasejs/11.7.3/firebase-messaging.js";

// ▶️  Project configuration
const firebaseConfig = {
  apiKey:            "AIzaSyDS6oRCGu8BW3fXnpp6L4AhkNJ4OsGpwtk",
  authDomain:        "skillbook-3fa41.firebaseapp.com",
  databaseURL:       "https://skillbook-3fa41-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "skillbook-3fa41",
  storageBucket:     "skillbook-3fa41.appspot.com",
  messagingSenderId: "599549421075",
  appId:             "1:599549421075:web:9092eeb6bc3765baebc1e6",
  measurementId:     "G-3VKK01HXE6"
};

// ▶️  Initialize core services
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);
const messaging = getMessaging(app);

// 🛫  Export anything other modules might need
export { app, db, messaging };

/** Request an anonymous FCM registration token. */
export async function requestForToken() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BKYkg8gINiuvd4JN0I0ht5_uXK_5V-H2Owk4mG5e2FtCVhHO0yJHKbbNnfWsJm7Pp6M8F_5HKdOl-MFt3nOtrKo"
    });

    if (currentToken) {
      console.log("✅ FCM token:", currentToken);
      // TODO: send token to your backend / store as needed
    } else {
      console.warn("⚠️  No registration token available – user did not grant permission.");
    }
  } catch (err) {
    console.error("❌  Error retrieving FCM token:", err);
  }
}

// 🔔  Handle messages that arrive when the page is open (foreground)
onMessage(messaging, (payload) => {
  console.log("📩 Foreground message:", payload);
});
