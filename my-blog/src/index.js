import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";

const secretKey = process.env.REACT_APP_SECRET_KEY;
const storageBucket = process.env.REACT_APP_STORAGE_BUCKET;
const AppId = process.env.REACT_APP_ID;
const messagingId = process.env.REACT_APP_MESSAGING_ID;

const firebaseConfig = {
  apiKey: secretKey,
  authDomain: "my-blog-app-fs.firebaseapp.com",
  projectId: "my-blog-app-fs",
  storageBucket: storageBucket,
  messagingSenderId: messagingId,
  appId: AppId,
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
