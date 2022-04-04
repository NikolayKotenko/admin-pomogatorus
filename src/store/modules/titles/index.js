import axios from "axios";

export default {
    state: {
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
