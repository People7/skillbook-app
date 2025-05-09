// js/authcheck.js
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// ✅ Check if user is already authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ Redirect if logged in
    window.location.href = 'dashboard.html';
  }
});
