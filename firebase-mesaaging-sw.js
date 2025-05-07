import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js';

const firebaseConfig = {
  apiKey: "AIzaSyDS6oRCGu8BW3fXnpp6L4AhkNJ4OsGpwtk",
  authDomain: "skillbook-3fa41.firebaseapp.com",
  projectId: "skillbook-3fa41",
  storageBucket: "skillbook-3fa41.appspot.com",
  messagingSenderId: "599549421075",
  appId: "1:599549421075:web:9092eeb6bc3765baebc1e6",
  measurementId: "G-3VKK01HXE6"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'  // Update if your logo is in a different path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const notificationTitle = payload.notification?.title || 'Skillbook Notification';
const notificationOptions = {
  body: payload.notification?.body || 'You have a new message.',
  icon: '/logo.png'
};

