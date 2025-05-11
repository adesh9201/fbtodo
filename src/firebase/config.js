// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOWVBLYm2nkQ92csKdLiUUUTgBfXu8SAw", // 🔸 Found in Firebase Console → Project Settings → General tab
  authDomain: "fbtodo-d67e5.firebaseapp.com", // 🔸 authDomain = `${projectId}.firebaseapp.com`
  projectId: "fbtodo-d67e5", // 🔸 Your Project ID
  storageBucket: "fbtodo-d67e5.firebasestorage.app", // 🔸 `${projectId}.appspot.com`
  messagingSenderId: "1017881663828", // 🔸 Your Project Number
  appId: "1:1017881663828:web:12a917c1ebd82edfac50c1", // 🔸 App ID from Firebase Console
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


















// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCOWVBLYm2nkQ92csKdLiUUUTgBfXu8SAw",
//   authDomain: "fbtodo-d67e5.firebaseapp.com",
//   projectId: "fbtodo-d67e5",
//   storageBucket: "fbtodo-d67e5.firebasestorage.app",
//   messagingSenderId: "1017881663828",
//   appId: "1:1017881663828:web:12a917c1ebd82edfac50c1",
//   measurementId: "G-LZTFMC4HDC"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);