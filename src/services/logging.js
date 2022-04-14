export default class Logging {
    //Если удобно пользоваться конструктором
    constructor(request) {
        const {message, data, meta, links, codeResponse, systemErrors} = request;

        this.message = message;
        this.data = data;
        this.meta = meta;
        this.links = links;
        this.codeResponse = codeResponse;
        this.systemErrors = systemErrors;
    }

    /**
     * @param {any} request Принимает в себя либо один объект реквест либо массив реквестов.
     * @return {array} message, Возвращает строку в виде либо склеенных сообщений либо в виде одного.
     */
    static getMessage (request) {
        if (!Array.isArray(request))
            return request.message

        return request.map(elem => {
            return elem.message
        }).join("<br>")
    }

    /**
     * @param {any} request Принимает в себя либо один объект реквест либо массив реквестов.
     * @return {Boolean} true|false, Возвращает в зависимости от codeResponse - Булево.
     */
    static checkExistErr (request) {
        console.log(request);
        if (!Array.isArray(request))
            return Boolean(request.codeResponse >= 400)

        return request.some(elem => {
            return elem.codeResponse >= 400
        });
    }
}