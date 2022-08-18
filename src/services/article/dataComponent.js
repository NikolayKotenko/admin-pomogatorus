export default class DataComponent {
    create(type, data) {
        let data_component
        if (type === 'question' || type === 'questions') {
            data_component = new Element_question(data)
        } else if (type === 'image') {
            data_component = new Element_image(data)
        } else if (type === 'auth') {
            data_component = new Element_auth(data)
        }
        return data_component
    }
}

class Element_question {
    constructor (data) {
        const {name, id, index_questions} = data

        this.name = name
        this.id = id
        this.index_questions = index_questions
    }
}

class Element_image {
    constructor (data) {
        const {name, src, index_image} = data

        this.name = name
        this.src = src
        this.index_image = index_image
    }
}

class Element_auth {
    constructor (data) {
        const {name, index_auth} = data

        this.name = name
        this.index_auth = index_auth
    }
}
