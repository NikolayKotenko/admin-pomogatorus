import axios from "axios";
import Logging from "@/services/logging";

/**
 * TODO я честно пытался подключить сюда store но не получилось
 * https://stackoverflow.com/questions/47571543/access-store-outside-of-component-vuejs
 */
export default class Request {

    static bodyFromData(paramBody) {
        let bodyFormData = new FormData()

        for (const [key, value] of Object.entries(paramBody)) {
            console.log(`${key}: ${value}`);
            bodyFormData.append(key, value)
        }
        return bodyFormData;
    }

    static async post (url, bodyFormData) {
        return await axios.post(url, bodyFormData)
            .then((response) => {
                console.log(url);
                return new Logging(response.data);
            })
            .catch(err => {
                console.log(url);
                return new Logging(err.response.data);
            })
    }

    static async get () {}

}