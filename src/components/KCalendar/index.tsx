import { Platform } from "react-native";

let KCalendar: any;

if (Platform.OS === "web") {
  KCalendar = require("./index.web").default;
} else {
  KCalendar = require("./index.native").default;
}

export default KCalendar;
