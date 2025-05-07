// js/authcheck.js
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Redirect to dashboard if already logged in
    window.location.href = 'dashboard.html';
  }
});
