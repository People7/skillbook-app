import { db, auth } from './firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Handle Sign-Up
const signUpButton = document.getElementById('signUpButton');
signUpButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const phone = document.getElementById('phone').value.trim();

  // Check if all fields are filled
  if (!name || !email || !password || !phone) {
    showMessage('Please fill all fields.');
    return;
  }

  try {
    // Sign up with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user's profile with their name
    await updateProfile(user, { displayName: name });

    // Save user info to Firestore under 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      phone: phone,
      createdAt: new Date(),
    });

    // Redirect to dashboard after successful sign-up
    window.location.href = 'dashboard.html';
  } catch (error) {
    showMessage(error.message);
  }
});

// Show message helper function
function showMessage(msg) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
  } else {
    alert(msg);
  }
}
