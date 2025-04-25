// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDS6oRCGu8BW3fXnpp6L4AhkNJ4OsGpwtk",
  authDomain: "skillbook-3fa41.firebaseapp.com",
  projectId: "skillbook-3fa41",
  storageBucket: "skillbook-3fa41.appspot.com",
  messagingSenderId: "599549421075",
  appId: "1:599549421075:web:9092eeb6bc3765baebc1e6",
  measurementId: "G-3VKK01HXE6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // change to your icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
