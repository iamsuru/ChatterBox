import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyAyqJp1MHcbB5TgxTuSJpHr3NCKJ0sxy74",
    authDomain: "chatterbox-87e86.firebaseapp.com",
    projectId: "chatterbox-87e86",
    storageBucket: "chatterbox-87e86.appspot.com",
    messagingSenderId: "954441983448",
    appId: "1:954441983448:web:f7037769c16c6091ef7ead"
};

const app = initializeApp(firebaseConfig);

export const fileDatabase = getStorage(app)