import { db, auth, requestForToken } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Show message helper
function showMessage(msg) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
  } else {
    alert(msg);
  }
}

// Handle Sign-Up
const signUpButton = document.getElementById('signUpButton');
if (signUpButton) {
  signUpButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email || !password || !phone) {
      showMessage('Please fill all fields.');
      return;
    }

    try {
      // Create account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone: phone.toString(),
        createdAt: new Date(),
      });

      // Save FCM token
      await requestForToken();

      // Redirect to dashboard
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error(error);
      showMessage(error.message);
    }
  });
}
