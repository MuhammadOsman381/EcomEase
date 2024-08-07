import { Notyf } from "notyf";
import "notyf/notyf.min.css";

class Helpers {
  // Uncomment and configure these if needed
  static localhost = 'localhost:8000';
  // static server = '13.60.28.134:3001';
  static basePath = `http://${this.localhost}`;
  static apiUrl = `https://ecomease-oaar.onrender.com/api/`;



  static get authUser() {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return {};
    }
  }

  static authHeaders = {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": `${localStorage.getItem("token")}`,
    },
  };

  static authFileHeaders = {
    headers: {
      "Content-Type": "multipart/form-data",
      // "x-access-token": `${localStorage.getItem("token")}`,
    },
  };

  static getItem(key, isJson = false) {
    const item = localStorage.getItem(key);
    if (isJson && item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        return null;
      }
    }
    return item;
  }

  static setItem(key, data, isJson = false) {
    try {
      if (isJson) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.setItem(key, data);
      }
    } catch (e) {
      console.error(`Failed to set ${key} in localStorage`, e);
    }
  }

  static toast = (type, message) => {
    const notyf = new Notyf();
    notyf.open({
      message: message,
      type: type,
      position: { x: "right", y: "top" },
      ripple: true,
      dismissible: true,
      duration: 2000,
    });
  };
}

export default Helpers;
