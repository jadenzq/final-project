// Firebase 配置和初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyCPC6aCEzTydqiDvXtXQ8S67ZxDuseCrdk",
  authDomain: "final-3cf98.firebaseapp.com",
  projectId: "final-3cf98",
  storageBucket: "final-3cf98.firebasestorage.app",
  messagingSenderId: "540018380553",
  appId: "1:540018380553:web:9ec2fd28769cf4e6fb4dd8"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
