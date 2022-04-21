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
        return await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: 'follow', // manual, *follow, error
            // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(bodyFormData) // body data type must match "Content-Type" header
        })
            .then(response => response.json())
            .then(response => {
                return new Logging(response)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            // .catch(err => {
            //     console.log(url);
            //     return new Logging(err.response.data);
            // })
    }

    static async get () {}

}