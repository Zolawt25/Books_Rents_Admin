// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAYxiAMmtZBiXMe_FeFPPLBiTnL7iXBUv0",
	authDomain: "books-9763c.firebaseapp.com",
	projectId: "books-9763c",
	storageBucket: "books-9763c.appspot.com",
	messagingSenderId: "586979015800",
	appId: "1:586979015800:web:1db722ab7ab8312534418d",
	measurementId: "G-LJZ14R5PJ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
