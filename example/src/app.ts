import "./styles.css";

console.log("JavaScript file loaded");

navigator.serviceWorker.register("./worker.js", {
  type: "module",
});
