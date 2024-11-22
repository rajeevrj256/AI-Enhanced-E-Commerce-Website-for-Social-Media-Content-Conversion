// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSnP9CHFuyWbLks94MEB4ftGGqpehpR5A",
  authDomain: "capable-hexagon-441007-b3.firebaseapp.com",
  projectId: "capable-hexagon-441007-b3",
  storageBucket: "capable-hexagon-441007-b3.firebasestorage.app",
  messagingSenderId: "245851933394",
  appId: "1:245851933394:web:da43556a8f6b48b7adbb0b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);