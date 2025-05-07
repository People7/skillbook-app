import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS6oRCGu8BW3fXnpp6L4AhkNJ4OsGpwtk",
  authDomain: "skillbook-3fa41.firebaseapp.com",
  projectId: "skillbook-3fa41",
  storageBucket: "skillbook-3fa41.appspot.com",  // Corrected bucket name
  messagingSenderId: "599549421075",
  appId: "1:599549421075:web:9092eeb6bc3765baebc1e6",
  measurementId: "G-3VKK01HXE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);
const db = getFirestore(app);

export { app, auth, messaging, db };

// Request FCM Token and save to Firestore
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BKYkg8gINiuvd4JN0I0ht5_uXK_5V-H2Owk4mG5e2FtCVhHO0yJHKbbNnfWsJm7Pp6M8F_5HKdOl-MFt3nOtrKo"
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          fcmToken: currentToken
        }, { merge: true });
      }
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
