import Logging from "@/services/logging";
import Vue from "vue";

/**
 * TODO я честно пытался подключить сюда store но не получилось
 * https://stackoverflow.com/questions/47571543/access-store-outside-of-component-vuejs
 */
export default class Request {
  static async request(url, params, method) {
    let options = {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
      headers: {
        Authorization:
          process.env.NODE_ENV === "development"
            ? "666777"
            : "Bearer " + Vue.$cookies.get("accessToken"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };

    if ("GET" === method) {
      if (params !== null) {
        url += "?" + new URLSearchParams(params).toString();
      }
    } else {
      options.body = JSON.stringify(params); // body data type must match "Content-Type" header
    }

    console.log("options.body");
    console.log(options.body);

    return await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        return new Logging(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  static async get(url, params = null) {
    return this.request(url, params, "GET");
  }
  static async post(url, params) {
    return this.request(url, params, "POST");
  }

  static bodyFromData(paramBody) {
    let bodyFormData = new FormData();

    for (const [key, value] of Object.entries(paramBody)) {
      console.log(`${key}: ${value}`);
      bodyFormData.append(key, value);
    }
    return bodyFormData;
  }
}
