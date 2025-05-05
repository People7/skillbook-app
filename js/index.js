import { auth, db } from './firebase.js';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const appAuth = getAuth(); // Ensure it's initialized properly
setPersistence(appAuth, browserLocalPersistence);

// --- Check if profile is complete ---
async function checkProfile(user) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data.name && data.phone) {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'complete-profile.html';
    }
  } else {
    // No data — must complete profile
    window.location.href = 'complete-profile.html';
  }
}

// --- Redirect if already logged in ---
onAuthStateChanged(appAuth, async (user) => {
  if (user) await checkProfile(user);
});

// --- Splash & Landing Display ---
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const landing = document.getElementById('landing');
  setTimeout(() => {
    if (splash) splash.remove();
    if (landing) landing.classList.add('show');
  }, 5000);
});

// --- Show Error/Info Messages ---
function showMessage(msg) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
  } else {
    alert(msg);
  }
}

// --- GOOGLE LOGIN ---
const googleBtn = document.getElementById('googleLogin');
if (googleBtn) {
  googleBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    showMessage('Logging in with Google...');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(appAuth, provider);
      await checkProfile(result.user);
    } catch (err) {
      showMessage(err.message);
    }
  });
}

// --- EMAIL LOGIN ---
const emailBtn = document.getElementById('emailLoginBtn');
if (emailBtn) {
  emailBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      showMessage('Email and password are required.');
      return;
    }

    showMessage('Logging in...');
    try {
      const result = await signInWithEmailAndPassword(appAuth, email, password);
      await checkProfile(result.user);
    } catch (err) {
      showMessage(err.message);
    }
  });
}

// --- PHONE LOGIN ---
let confirmationResult;

window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => {}
}, appAuth);

const sendOtpBtn = document.getElementById('sendOtp');
if (sendOtpBtn) {
  sendOtpBtn.addEventListener('click', () => {
    const phone = document.getElementById('phone').value.trim();

    if (!phone) {
      showMessage('Phone number is required.');
      return;
    }

    showMessage('Sending OTP...');
    signInWithPhoneNumber(appAuth, phone, window.recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        document.getElementById('otp').style.display = 'block';
        document.getElementById('verifyOtp').style.display = 'block';
        showMessage('OTP sent to your number.');
      })
      .catch(err => showMessage(err.message));
  });
}

const verifyOtpBtn = document.getElementById('verifyOtp');
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener('click', async () => {
    const code = document.getElementById('otp').value.trim();

    if (!code) {
      showMessage('OTP is required.');
      return;
    }

    showMessage('Verifying OTP...');
    try {
      const result = await confirmationResult.confirm(code);
      await checkProfile(result.user);
    } catch (err) {
      showMessage(err.message);
    }
  });
}
