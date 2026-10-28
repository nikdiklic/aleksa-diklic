import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvOSs4XOXQik9f3mUYPejch6LjYc9FCxk",
  authDomain: "aleksa-diklic.firebaseapp.com",
  projectId: "aleksa-diklic",
  storageBucket: "aleksa-diklic.appspot.com",
  messagingSenderId: "808658760398",
  appId: "1:770b2308bdc9948926d69f",
  measurementId: "G-9JRWN524WX",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);