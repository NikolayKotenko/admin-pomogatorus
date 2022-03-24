import axios from "axios";

export default {
    state: {
        fonts: [],
    },
    mutations: {
        changeFonts(state, result) {
            state.fonts = result.data.items
        },
    },
    actions: {
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
