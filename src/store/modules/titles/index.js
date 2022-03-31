import axios from "axios";

export default {
    state: {
        /* INSERT COMPONENT */
        listComponents: [],
        loadingModalList: false,
        selectedComponent: {},
        countQuestion: 0,
        willShow: true,

        /* TEST */
        fonts: [],
        dataFromChild: '',
    },
    mutations: {
        change_list_components(state, result) {
            state.listComponents = result
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
        getListComponents({commit, state}, params) {
            return new Promise((resolve, reject) => {
                state.loadingModalList = true
                axios.get(`${this.state.BASE_URL}/entity/${params}`)
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
