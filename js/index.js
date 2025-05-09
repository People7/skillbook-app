import { auth, db } from './firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Use `auth` directly from firebase.js, already initialized
setPersistence(auth, browserLocalPersistence);

// ✅ Check profile completeness
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
    window.location.href = 'complete-profile.html';
  }
}

// ✅ Auto-redirect if already logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await checkProfile(user);
  }
});

// ✅ Splash screen
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const landing = document.getElementById('landing');
  setTimeout(() => {
    if (splash) splash.remove();
    if (landing) landing.classList.add('show');
  }, 5000);
});

// ✅ Helper for showing messages
function showMessage(msg) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
  } else {
    alert(msg);
  }
}

// ✅ Google login
const googleBtn = document.getElementById('googleLogin');
if (googleBtn) {
  googleBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    showMessage('Logging in with Google...');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await checkProfile(result.user);
    } catch (err) {
      showMessage(err.message);
    }
  });
}

// ✅ Email login
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
      const result = await signInWithEmailAndPassword(auth, email, password);
      await checkProfile(result.user);
    } catch (err) {
      showMessage(err.message);
    }
  });
}

// ✅ Phone login (OTP)
let confirmationResult;

window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => {}
}, auth);

const sendOtpBtn = document.getElementById('sendOtp');
if (sendOtpBtn) {
  sendOtpBtn.addEventListener('click', () => {
    const phone = document.getElementById('phone').value.trim();

    if (!phone) {
      showMessage('Phone number is required.');
      return;
    }

    showMessage('Sending OTP...');
    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
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

// ✅ Register Service Worker for FCM
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}
