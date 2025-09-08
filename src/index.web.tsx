import { AppRegistry } from "react-native";
import App from "./App";

/* Firebase (only web) */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDW9P8xHeJiqJk-K3AVyzH6gwz4H1WdJbo",
  authDomain: "kazaswap.firebaseapp.com",
  projectId: "kazaswap",
  storageBucket: "kazaswap.appspot.com",
  messagingSenderId: "285118816831",
  appId: "1:285118816831:web:ccddcc21bc1e1ee3d34e8a",
  measurementId: "G-JJZ8RS3NMP"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

import "react-datepicker/dist/react-datepicker.css";
import "./components/DatePicker/datepickerOverrides.css";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  rootTag: document.getElementById("react-root"),
});
