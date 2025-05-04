import app from './firebase-config.js';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth(app);
// Session persistence
setPersistence(auth, browserLocalPersistence);

// Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = 'dashboard.html';
});

// Show/hide splash and landing
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const landing = document.getElementById('landing');
  setTimeout(() => {
    if (splash) splash.remove();
    if (landing) landing.classList.add('show');
  }, 5000);
});

// Helper for messages
function showMessage(msg) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
  } else {
    alert(msg);
  }
}

// Google Login
const googleBtn = document.getElementById('googleLogin');
googleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showMessage('Logging in with Google...');
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => window.location.href = 'dashboard.html')
    .catch(err => showMessage(err.message));
});

// Email Login
const emailBtn = document.getElementById('emailLoginBtn');
emailBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) {
    showMessage('Email and password are required.');
    return;
  }
  showMessage('Logging in...');
  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = 'dashboard.html')
    .catch(err => showMessage(err.message));
});

// Phone Login & OTP
let confirmationResult;
const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);

const sendOtpBtn = document.getElementById('sendOtp');
sendOtpBtn.addEventListener('click', () => {
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    showMessage('Phone number is required.');
    return;
  }
  showMessage('Sending OTP...');
  signInWithPhoneNumber(auth, phone, recaptchaVerifier)
    .then(res => {
      confirmationResult = res;
      document.getElementById('otp').style.display = 'block';
      document.getElementById('verifyOtp').style.display = 'block';
      showMessage('OTP sent.');
    })
    .catch(err => showMessage(err.message));
});

const verifyOtpBtn = document.getElementById('verifyOtp');
verifyOtpBtn.addEventListener('click', () => {
  const code = document.getElementById('otp').value.trim();
  if (!code) {
    showMessage('OTP is required.');
    return;
  }
  showMessage('Verifying OTP...');
  confirmationResult.confirm(code)
    .then(() => window.location.href = 'dashboard.html')
    .catch(err => showMessage(err.message));
});
