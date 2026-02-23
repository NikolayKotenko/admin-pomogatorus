import Request from "@/services/request";
import { jsonParseDepth } from "@/helpers/jsonParseDepth";

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
  state_allow_attachments: 1,
  value_type_answer: null,
  _all_tags: [],
  mtomtags: [],
  m_to_m_tags_tech_task: [],
  activity: 0,
  question_image_helper: null,
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
      state_allow_attachments: 1,
      value_type_answer: null,
      _all_tags: [],
      mtomtags: [],
      activity: 0,
      question_image_helper: null,
      id_article_cross_link: null,
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

      setFlatValue(result, [
        "name",
        "title",
        "article",
        "purpose_of_question",
        "id_type_answer",
      ]);
      setValueTypeAnswer(result["value_type_answer"]);

      state.nonEditState = Object.assign({}, state.newQuestion);

      function setFlatValue(result, arrRequiredKeys) {
        for (let key in result) {
          if (arrRequiredKeys.includes(key)) {
            // console.log(`${key} - ${result[key]}`);
            state.newQuestion[key] = {
              value: result[key],
              focused: false,
            };
          } else state.newQuestion[key] = result[key];
        }
      }

      function setValueTypeAnswer(valueTypeAnswer) {
        state.newQuestion["value_type_answer"] = [];

        if (!valueTypeAnswer) return;

        let parsed = jsonParseDepth(valueTypeAnswer);
        parsed.forEach((elem) => {
          state.newQuestion["value_type_answer"].push(new AnswerVariable(elem));
        });
      }
    },
    clear_new_question(state) {
      state.newQuestion = defaultQuestion;
    },

    /* LOCAL_STORAGE */
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
          defaultQuestion,
        );
        this.state.QuestionsModule.newQuestion = JSON.parse(
          localStorage.getItem("question"),
        );
      }
    },
  },
  actions: {
    /* LIST_QUESTION */
    async setListQuestions({ commit, state }) {
      return new Promise((resolve, reject) => {
        state.loadingList = true;

        const selectQuery = [
          "id",
          "activity",
          "name",
          "title",
          "state_detailed_response",
          "state_attachment_response",
          "created_at",
          "value_type_answer",
          "_all_tags",
          "updated_at",
          "question_image_helper",
        ];
        const query = Request.modifyQuery([], selectQuery);
        Request.get(`${this.state.BASE_URL}/entity/questions` + query)
          .then((response) => {
            commit("set_list_questions", response.data);
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
        this.state.BASE_URL + "/entity/questions-list-config-date",
      )
        .then((response) => {
          commit("set_list_config_date", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setFilteredListQuestions({ state, commit }, filterQuery) {
      return new Promise((resolve, reject) => {
        state.loadingList = true;

        const selectQuery = [
          "id",
          "activity",
          "name",
          "title",
          "state_detailed_response",
          "state_attachment_response",
          "created_at",
          "value_type_answer",
          "_all_tags",
          "updated_at",
          "question_image_helper",
        ];
        const query = Request.modifyQuery(filterQuery, selectQuery);
        Request.get(`${this.state.BASE_URL}/entity/questions` + query)
          .then((response) => {
            console.log(response);
            commit("set_list_questions", response.data);
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
    async getGeneralTagsQuestion({ commit, state }, selectQuery) {
      return new Promise((resolve) => {
        state.tagsLoaded = true;

        const query = Request.modifyQuery([], selectQuery);
        Request.get(`${this.state.BASE_URL}/dictionary/tags${query}`)
          .then((response) => {
            state.tagsLoaded = false;
            commit("set_list_general_tags_question", response.data);
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
        let bodyFormData = {};
        bodyFormData["name"] = newTag;

        Request.post(`${this.state.BASE_URL}/dictionary/tags`, bodyFormData)
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
                let tagsFormData = {};
                tagsFormData["id_tag"] = tag.id;
                tagsFormData["id_question"] = finded[0].id;
                // tagsFormData.append('id_answer', finded[0].id_type_answer)
                Request.post(`${this.state.BASE_URL}/m-to-m/tags`, tagsFormData)
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

        Request.delete(`${this.state.BASE_URL}/m-to-m/tags/${id}`)
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
      Request.get(`${this.state.BASE_URL}/dictionary/type-answers`)
        .then((response) => {
          commit("set_list_types_questions", response.data);
        })
        .catch(() => {
          console.log("test");
        });
    },
    async getDetailQuestion({ commit, state, dispatch }, id) {
      state.loadingQuestion = true;

      const selectsQuestions = [
        "*",
        "_all_tags",
        "mtomtags",
        "m_to_m_tags_tech_task",
        "question_image_helper",
      ];
      const queryQuestions = Request.modifyQuery([], selectsQuestions);
      const response = await Request.get(
        `${this.state.BASE_URL}/entity/questions/${id}${queryQuestions}`,
      );
      commit("set_new_question", response.data);

      const filters = { flag_engineering_system: true };
      const selectsTags = ["*"];
      const queryTags = Request.modifyQuery(filters, selectsTags);
      const responseTags = await dispatch("getUniversalListTag", queryTags, {
        root: true,
      });
      commit("set_list_general_tags_question", responseTags.data);

      state.loadingQuestion = false;
    },
    async createQuestion({ dispatch, state }, data) {
      state.loadingRequest = true;
      state.loadingQuestion = true;
      let bodyFormData = {};
      for (let key in data) {
        if (
          key === "state_attachment_response" ||
          key === "state_detailed_response"
        ) {
          if (data[key]) {
            bodyFormData[key] = "1";
          } else bodyFormData[key] = "0";
        } else if (typeof data[key] === "object") {
          if (Array.isArray(data[key])) {
            console.log(data[key]);
            let arr = [];
            data[key].forEach((elem) => {
              if (elem.answer) {
                arr.push(elem);
              }
            });
            bodyFormData[key] = JSON.stringify(arr);
          } else {
            if (data[key] && data[key].value) {
              bodyFormData[key] = data[key].value;
            }
          }
        } else bodyFormData[key] = data[key];
      }
      bodyFormData["name_param_env"] = "";
      console.log(bodyFormData);

      const response = await Request.post(
        `${this.state.BASE_URL}/entity/questions`,
        bodyFormData,
      );
      if (response.codeResponse >= 400) {
        //handle error
        state.loadingRequest = false;
        state.loadingQuestion = false;
        return response;
      }
      //handle success
      state.loadingRequest = false;
      await dispatch("setListQuestions");
      await dispatch("createRelationTagQuestion", data.name.value);
      state.loadingQuestion = false;
      return response;
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

        Request.put(
          `${this.state.BASE_URL}/entity/questions/${data.id}`,
          requestData,
        )
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            state.loadingQuestion = false;
            dispatch("setListQuestions").then(() => {
              dispatch("createRelationTagQuestion", data.name.value).then(
                () => {
                  resolve();
                },
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
        Request.delete(`${this.state.BASE_URL}/entity/questions/${data.id}`)
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
      return state.newQuestion.mtomtags;
    },
    getTechTagsQuestion(state) {
      return state.newQuestion.m_to_m_tags_tech_task;
    },
  },
};
