import qs from "qs";
import axios from "axios";
import Request from "@/services/request";

/* DEFAULT STATE */
const defaultQuestion = {
  id: 1,
  name: {
    value: "",
    focused: false,
  },
  title: {
    value: "",
    focused: false,
  },
  article: {
    value: "",
    focused: false,
  },
  purpose_of_question: {
    value: "",
    focused: false,
  },
  id_type_answer: {
    value: null,
    focused: false,
  },
  state_detailed_response: 0,
  state_attachment_response: 0,
  value_type_answer: null,
  _all_tags: [],
  mtomtags: [],
};

/* CONSTRUCTORS */
function AnswerVariable(answer) {
  this.id = answer.id;
  this.answer = answer.answer;
  this.commentary = answer.commentary;
  this.showComentary = true;
  this.focused = false;
  this.dataEnv = answer.dataEnv;
}

export default {
  state: {
    /* LIST QUESTIONS */
    listQuestions: [],
    listTypesOfQuestions: [],
    listConfigDate: [],
    loadingList: false,
    questionNotification: "",

    /* DETAIL QUESTION */
    loadingQuestion: false,
    loadingRequest: false,
    newQuestion: {
      id: 1,
      name: {
        value: "",
        focused: false,
      },
      title: {
        value: "",
        focused: false,
      },
      article: {
        value: "",
        focused: false,
      },
      purpose_of_question: {
        value: "",
        focused: false,
      },
      id_type_answer: {
        value: null,
        focused: false,
      },
      state_detailed_response: 0,
      state_attachment_response: 0,
      value_type_answer: null,
      _all_tags: [],
      mtomtags: [],
    },
    nonEditState: {},

    /* TAGS */
    listGeneralTags: [],
    tagsLoaded: false,
    createdTag: {},
    showCreateTag: false,
    newTag: "",
    tagSearch: null,
    tagError: {
      isError: false,
      errObj: {},
    },
    showAddTag: false,
  },
  mutations: {
    /* LIST QUESTIONS */
    set_list_questions(state, result) {
      state.listQuestions = [];
      if (Array.isArray(result)) {
        state.listQuestions = result;
      } else {
        for (let key in result) {
          state.listQuestions.push(result[key]);
        }
      }
    },
    set_list_config_date(state, result) {
      state.listConfigDate = [];
      state.listConfigDate = result;
    },

    /* DETAIL QUESTION */
    set_list_types_questions(state, result) {
      state.listTypesOfQuestions = [];
      state.listTypesOfQuestions = result;
    },
    set_list_general_tags_question(state, result) {
      state.listGeneralTags = [];
      state.listGeneralTags = result;
    },
    reset_questions_tags(state) {
      state.tagsLoaded = false;
      state.createdTag = {};
      state.showCreateTag = false;
      state.newTag = "";
      state.tagSearch = null;
      state.tagError = {
        isError: false,
        errObj: {
          name: "",
        },
      };
      state.showAddTag = false;
    },
    set_new_question(state, result) {
      state.newQuestion = Object.assign({}, defaultQuestion);
      for (let key in result) {
        if (
          key === "name" ||
          key === "title" ||
          key === "article" ||
          key === "purpose_of_question" ||
          key === "id_type_answer"
        ) {
          state.newQuestion[key] = {
            value: result[key],
            focused: false,
          };
        } else if (key === "value_type_answer") {
          // FIXME: парсинг чет страдает
          // if (result['id_type_answer'] !== 1 && result['id_type_answer'] !== 2) {
          let parsed = null;
          parsed = JSON.parse(JSON.parse(result[key]));
          if (Array.isArray(parsed)) {
            state.newQuestion[key] = [];
            parsed.forEach((elem) => {
              state.newQuestion[key].push(new AnswerVariable(elem));
            });
          } else {
            state.newQuestion[key] = [];
          }
          // } else {
          //     state.newQuestion[key] = JSON.parse(result[key])
          // }
        } else state.newQuestion[key] = result[key];
      }
      state.nonEditState = Object.assign({}, state.newQuestion);
    },

    /* LOCAL_STORAGE */
    // eslint-disable-next-line no-unused-vars
    set_local_storage({ state }, object) {
      localStorage.setItem("question", JSON.stringify(object));
    },
    remove_local_storage() {
      localStorage.removeItem("question");
    },
    get_from_local_storage() {
      if (localStorage.getItem("question") !== null) {
        this.state.QuestionsModule.newQuestion = Object.assign(
          {},
          defaultQuestion
        );
        this.state.QuestionsModule.newQuestion = JSON.parse(
          localStorage.getItem("question")
        );
      }
    },
  },
  actions: {
    /* LIST_QUESTION */
    async setListQuestions({ commit, state }) {
      // return new Promise((resolve, reject) => {
      //     Request.get(
      //         this.state.BASE_URL+'/entity/questions')
      //         .then((response) => {
      //             console.log('setListQuestions response')
      //             console.log(response)
      //             commit('set_list_questions', response.data.data)
      //             state.loadingList = false
      //             resolve()
      //         })
      //         .catch((error) => {
      //             console.log(error)
      //             state.loadingList = false
      //             reject(error)
      //         })
      // })
      // return await Request.get(
      //     this.state.BASE_URL+'/entity/questions')
      //     .then((response) => {
      //         console.log('setListQuestions response')
      //         console.log(response)
      //         commit('set_list_questions', response.data.data)
      //         state.loadingList = false
      //     })
      //     .catch((error) => {
      //         console.log(error)
      //         state.loadingList = false
      //     })
      return new Promise((resolve, reject) => {
        state.loadingList = true;
        axios
          .get(`${this.state.BASE_URL}/entity/questions`, {
            headers: {
              Authorization: "666777",
            },
          })
          .then((response) => {
            commit("set_list_questions", response.data.data);
            state.loadingList = false;
            resolve();
          })
          .catch((error) => {
            console.log("test");
            state.loadingList = false;
            reject(error);
          });
      });
    },
    async setListConfigDate({ commit }) {
      return await Request.get(
        this.state.BASE_URL + "/entity/questions-list-config-date"
      )
        .then((response) => {
          console.log("setListConfigDate response");
          console.log(response);
          commit("set_list_config_date", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setFilteredListQuestions({ state, commit }, data) {
      return new Promise((resolve, reject) => {
        state.loadingList = true;

                const {tag, updated_at, name, activity} = data

                const filter = {}
                filter['filter[tag]'] = tag
                filter['filter[updated_at]'] = updated_at
                filter['filter[name]'] = name
                filter['filter[activity]'] = activity

        axios
          .get(`${this.state.BASE_URL}/entity/questions`, {
            headers: {
              Authorization: "666777",
            },
            params: {
              ...filter,
            },
          })
          .then((response) => {
            console.log(response);
            commit("set_list_questions", response.data.data);
            state.loadingList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingList = false;
            commit("set_list_questions", []);
            state.questionNotification = error.response.data.message;
            reject(error);
          });
      });
    },

    /* TAGS */
    async getGeneralTagsQuestion({ commit, state }) {
      return new Promise((resolve) => {
        state.tagsLoaded = true;
        axios
          .get(`${this.state.BASE_URL}/dictionary/tags`, {
            headers: {
              Authorization: "666777",
            },
          })
          .then((response) => {
            state.tagsLoaded = false;
            commit("set_list_general_tags_question", response.data.data);
            resolve();
          })
          .catch(() => {
            state.tagsLoaded = false;
            resolve();
            console.log("test");
          });
      });
    },
    async setNewTagToListQuestion({ dispatch, state }, newTag) {
      return new Promise((resolve) => {
        state.tagsLoaded = true;
        let bodyFormData = new FormData();
        bodyFormData.append("name", newTag);
        axios
          .post(`${this.state.BASE_URL}/dictionary/tags`, bodyFormData, {
            headers: {
              Authorization: "666777",
            },
          })
          .then((response) => {
            //handle success
            console.log(response);
            dispatch("getGeneralTagsQuestion").then(() => {
              state.createdTag = state.listGeneralTags.find((elem) => {
                return elem.name === newTag;
              });
              state.tagsLoaded = false;
              resolve();
            });
          })
          .catch((response) => {
            //handle error
            state.tagsLoaded = false;
            resolve();
            console.log(response.body);
          });
      });
    },
    createRelationTagQuestion({ state }, name) {
      return new Promise((resolve, reject) => {
        if (state.newQuestion._all_tags.length) {
          let finded = state.listQuestions.filter((elem) => {
            return elem.name === name;
          });
          if (finded.length) {
            console.log(finded);
            state.newQuestion._all_tags.forEach((tag) => {
              let mtmIndex = state.newQuestion.mtomtags.findIndex((elem) => {
                return elem.id_tag === tag.id;
              });
              if (mtmIndex === -1) {
                let tagsFormData = new FormData();
                tagsFormData.append("id_tag", tag.id);
                tagsFormData.append("id_question", finded[0].id);
                // tagsFormData.append('id_answer', finded[0].id_type_answer)
                axios
                  .post(`${this.state.BASE_URL}/m-to-m/tags`, tagsFormData, {
                    headers: {
                      Authorization: "666777",
                    },
                  })
                  .then((response) => {
                    console.log(response);
                    resolve();
                  })
                  .catch((error) => {
                    console.log(error);
                    reject(error);
                  });
              }
            });
          }
        }
        resolve();
      });
    },
    deleteRelationTagQuestion({ state }, id) {
      return new Promise((resolve, reject) => {
        state.loadingQuestion = true;

        const options = {
          method: "DELETE",
          url: `${this.state.BASE_URL}/m-to-m/tags/${id}`,
          headers: {
            Authorization: "666777",
          },
        };

        axios(options)
          .then((response) => {
            //handle success
            state.loadingQuestion = false;
            resolve();
            console.log(response);
          })
          .catch((error) => {
            //handle error
            state.loadingQuestion = false;
            reject(error);
          });
      });
    },

    /* DETAIL_QUESTION */
    async setListTypesQuestions({ commit }) {
      axios
        .get(`${this.state.BASE_URL}/dictionary/type-answers`, {
          headers: {
            Authorization: "666777",
          },
        })
        .then((response) => {
          commit("set_list_types_questions", response.data.data);
        })
        .catch(() => {
          console.log("test");
        });
    },
    async getDetailQuestion({ commit, state }, id) {
      state.loadingQuestion = true;
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.state.BASE_URL}/entity/questions/${id}`, {
            headers: {
              Authorization: "666777",
            },
          })
          .then((response) => {
            commit("set_new_question", response.data.data);
            state.loadingQuestion = false;
            resolve();
          })
          .catch((error) => {
            //handle error
            state.loadingQuestion = false;
            reject(error);
            console.log(error.body);
          });
      });
    },
    async createQuestion({ dispatch, state }, data) {
      return new Promise((resolve) => {
        state.loadingRequest = true;
        state.loadingQuestion = true;
        let bodyFormData = new FormData();
        for (let key in data) {
          if (
            key === "state_attachment_response" ||
            key === "state_detailed_response"
          ) {
            if (data[key]) {
              bodyFormData.append(key, "1");
            } else bodyFormData.append(key, "0");
          } else if (typeof data[key] === "object") {
            if (Array.isArray(data[key])) {
              console.log(data[key]);
              let arr = [];
              data[key].forEach((elem) => {
                if (elem.answer) {
                  arr.push(elem);
                }
              });
              bodyFormData.append(key, JSON.stringify(arr));
            } else {
              if (data[key].value) {
                bodyFormData.append(key, data[key].value);
              }
            }
          } else bodyFormData.append(key, data[key]);
        }
        bodyFormData.append("name_param_env", "");
        console.log(bodyFormData);
        axios
          .post(`${this.state.BASE_URL}/entity/questions`, bodyFormData, {
            headers: {
              Authorization: "666777",
            },
          })
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            dispatch("setListQuestions").then(() => {
              dispatch("createRelationTagQuestion", data.name.value).then(
                () => {
                  state.loadingQuestion = false;
                  resolve();
                }
              );
            });
            console.log(response);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            state.loadingQuestion = false;
            resolve();
            console.log(response.body);
          });
      });
    },
    updateQuestion({ dispatch, state }, data) {
      return new Promise((resolve) => {
        state.loadingRequest = true;
        state.loadingQuestion = true;
        const requestData = {};
        for (let key in data) {
          if (key === "value_type_answer") {
            if (Array.isArray(data[key])) {
              let arr = [];
              let obj = {};
              data[key].map((elem) => {
                console.log(elem);
                if (elem.answer || elem.dataEnv) {
                  console.log(elem.dataEnv);
                  obj.id = elem.id;
                  obj.answer = elem.answer;
                  obj.commentary = elem.commentary;
                  obj.dataEnv = elem.dataEnv;
                  arr.push(obj);
                  obj = {};
                }
              });
              requestData[key] = JSON.stringify(arr);
            } else requestData[key] = data[key];
          } else if (
            key === "state_attachment_response" ||
            key === "state_detailed_response"
          ) {
            if (data[key]) requestData[key] = 1;
            else requestData[key] = 0;
          } else {
            if (typeof data[key] === "object" && !Array.isArray(data[key])) {
              if (data[key] !== null && data[key].value) {
                requestData[key] = data[key].value;
              }
            } else requestData[key] = data[key];
          }
        }

        const options = {
          method: "PUT",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "666777",
          },
          data: qs.stringify(requestData),
          url: `${this.state.BASE_URL}/entity/questions/${data.id}`,
        };
        axios(options)
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            state.loadingQuestion = false;
            dispatch("setListQuestions").then(() => {
              dispatch("createRelationTagQuestion", data.name.value).then(
                () => {
                  resolve();
                }
              );
            });
            console.log(response);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            state.loadingQuestion = false;
            resolve();
            console.log(response.body);
          });
      });
    },
    deleteQuestion({ state }, data) {
      state.loadingRequest = true;
      return new Promise((resolve) => {
        const options = {
          method: "DELETE",
          url: `${this.state.BASE_URL}/entity/questions/${data.id}`,
          headers: {
            Authorization: "666777",
          },
        };

        axios(options)
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            resolve();
            console.log(response);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            resolve();
            console.log(response.body);
          });
      });
    },

    /* LOCAL_STORAGE */
    setLocalStorage({ commit }, object) {
      commit("set_local_storage", object);
    },
    removeLocalStorage({ commit }) {
      commit("remove_local_storage");
    },
    getFromLocalStorage({ commit }) {
      return new Promise((resolve) => {
        commit("get_from_local_storage");
        resolve();
      });
    },
  },
  getters: {
    getListTypesOfQuestions(state) {
      return state.listTypesOfQuestions;
    },
    getTagsQuestion(state) {
      return state.newQuestion._all_tags;
    },
  },
};
