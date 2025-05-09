import { db, auth, requestForToken } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Helper to show messages
function showMessage(msg) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
  } else {
    alert(msg);
  }
}

// ✅ Handle Sign-Up
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
      // ✅ Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Set display name
      await updateProfile(user, { displayName: name });

      // ✅ Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        phone: phone.toString(),
        createdAt: new Date()
      });

      // ✅ Request FCM token
      await requestForToken();

      // ✅ Redirect to dashboard
      window.location.href = 'dashboard.html';

    } catch (error) {
      console.error(error);
      showMessage(error.message);
    }
  });
}
