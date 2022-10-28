import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtp7OYbdsHA5FEGKCJ5jqjY7xvKv7DFVo",
  authDomain: "vue-invoice-app-62f1e.firebaseapp.com",
  projectId: "vue-invoice-app-62f1e",
  storageBucket: "vue-invoice-app-62f1e.appspot.com",
  messagingSenderId: "99719160950",
  appId: "1:99719160950:web:ba4c2ab91304278e68ab57",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
