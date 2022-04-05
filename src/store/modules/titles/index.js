// import qs from 'qs';
import axios from "axios";


/* DEFAULT STATE */
/*const defaultTitle = {
    id: 1,
    name: {
        value: '',
        focused: false,
    },
    short_header: {
        value: '',
        focused: false,
    },
    purpose_of_article: {
        value: '',
        focused: false,
    },
    preview: {
        value: '',
        focused: false,
    },
    _all_tags: [],
    mtomtags: [],
}*/

export default {
    state: {
        /* dataToCRUD */
        content: '',
        loadingArticle: false,
        loadingRequest: false,
        newArticle: {
            id: 1,
            name: {
                value: '',
                focused: false,
            },
            short_header: {
                value: '',
                focused: false,
            },
            purpose_of_article: {
                value: '',
                focused: false,
            },
            preview: {
                value: '',
                focused: false,
            },
            _all_tags: [],
            mtomtags: [],
        },
        nonEditState: {},

        /* INSERT COMPONENT */
        listComponents: [],
        loadingModalList: false,
        selectedComponent: {},
        countQuestion: 0,
        willShow: true,
        deletedComponent: 0,

        /* TEST */
        fonts: [],
        dataFromChild: '',
    },
    mutations: {
        /* INSERT COMPONENT */
        change_list_components(state, result) {
            state.listComponents = result
        },
        delete_component_by_id(state, id) {
            state.deletedComponent = id
        },
        changeSelectedComponent(state, {data, index}) {
            const obj = Object.assign({}, {data, index: index})
            state.listComponents.push(obj)
        },

        /* TEST */
        changeFonts(state, result) {
            state.fonts = result.data.items
        },
        changeDataFromChild(state, result) {
            state.dataFromChild = result
        }
    },
    actions: {
        /* CRUD */
        async createArticle({dispatch, state}, data) {
            return new Promise((resolve) => {
                state.loadingRequest = true
                state.loadingArticle = true
                let bodyFormData = new FormData()
                for (let key in data) {
                    if (key === 'value_type_answer') {
                        if (Array.isArray(data[key])) {
                            let arr = []
                            let obj = {}
                            data[key].map(elem => {
                                if (elem.answer) {
                                    obj.id = elem.id
                                    obj.answer = elem.answer
                                    obj.commentary = elem.commentary
                                    arr.push(obj)
                                    obj = {}
                                }
                            })
                            bodyFormData.append(key, JSON.stringify(arr))
                        } else bodyFormData.append(key, data[key])
                    } else {
                        if (typeof data[key] === 'object') {
                            if (data[key].value) {
                                bodyFormData.append(key, data[key].value)
                            }
                        } else bodyFormData.append(key, data[key])
                    }
                }
                bodyFormData.append('name_param_env', '')
                axios.post(`${this.state.BASE_URL}/entity/questions`, bodyFormData, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        //handle success
                        state.loadingRequest = false
                        dispatch('setListQuestions').then(() => {
                            dispatch('createRelationTag', data.name.value).then(() => {
                                state.loadingQuestion = false
                                resolve()
                            })
                        })
                        console.log(response);
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        state.loadingQuestion = false
                        resolve()
                        console.log(response.body);
                    });
            })
        },

        /* INSERT COMPONENT */
        deleteComponent({commit}, id) {
          commit('delete_component_by_id', id)
        },
        getComponentsById({commit, state}, params) {
            return new Promise((resolve, reject) => {

                const {id_question, index} = params

                state.loadingModalList = true
                axios.get(`${this.state.BASE_URL}/entity/questions/${id_question}`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        const data = response.data.data
                        console.log('uploaded COMPONENT')
                        commit('changeSelectedComponent', {data, index})
                        state.loadingModalList = false
                        resolve()
                    })
                    .catch((error) => {
                        state.loadingModalList = false
                        reject(error)
                    })
            })
        },
        getListComponents({commit, state}, params) {
            return new Promise((resolve, reject) => {
                state.loadingModalList = true
                axios.get(`${this.state.BASE_URL}/entity/${params}`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        commit('change_list_components', response.data.data)
                        state.loadingModalList = false
                        resolve()
                    })
                    .catch((error) => {
                        state.loadingModalList = false
                        reject(error)
                    })
            })
        },

        /* TEST */
        testFont({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCnefZ3KzL_qWHIzDin8kUPkmJSzXOZvpM')
                    .then((response) => {
                        console.log(response)
                        commit('changeFonts', response)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
    },
    getters: {}
}
