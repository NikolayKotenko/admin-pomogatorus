import Logging from "@/services/logging";
import Vue from "vue";

export default class Request {
  /**
   * @returns {Logging}
   * @param {String} url
   * @param {Object} params
   * @param {String} method
   */
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
      },
    };

    if ("GET" === method) {
      if (params !== null) {
        url += "?" + new URLSearchParams(params).toString();
      }
    } else {
      options.body = JSON.stringify(params); // body data type must match "Content-Type" header
    }
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

  static async put(url, params) {
    return this.request(url, params, "PUT");
  }

  static async delete(url, params) {
    return this.request(url, params, "DELETE");
  }

  static bodyFromData(paramBody) {
    let bodyFormData = new FormData();

    for (const [key, value] of Object.entries(paramBody)) {
      console.log(`${key}: ${value}`);
      bodyFormData.append(key, value);
    }
    return bodyFormData;
  }

  //['id_tag': 1, 'id_prop': 2]
  static ConstructFilterQuery(obj = {}) {
    let result = "";
    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            result += "filter[" + key + "][]=" + item + "&";
          });
        } else {
          result += "filter[" + key + "]=" + value + "&";
        }
      }
    }
    // console.log("ConstructFilterQuery", result);
    return result;
  }
  static ConstructSelectQuery(selects = []) {
    let result = "";
    selects.forEach((item) => {
      result += "select[]=" + item + "&";
    });
    result = result.slice(0, -1);

    // console.log("ConstructSelectQuery", result);
    return result;
  }

  static modifyQuery(filters = {}, selects = []) {
    return (
      "?" +
      this.ConstructFilterQuery(filters) +
      this.ConstructSelectQuery(selects)
    );
  }
}
