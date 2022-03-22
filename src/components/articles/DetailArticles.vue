<template>
  <div class="detail-wrapper">
    <v-form
        class="form"
        ref="form"
    >
      <div class="detail-wrapper__content">
        <div class="detail-wrapper__content__title">
          <v-textarea
              class="detail-wrapper__content__title__name"
              dense
              hide-details
              placeholder="Введите наименование"
              v-model="newArticle.name.value"
              solo
              flat
              auto-grow
              rows="1"
              @focus="onFocus(newArticle.name)"
              @focusout="outFocus(newArticle.name)"
              :loading="$store.state.QuestionsModule.loadingQuestion"
              :class="{invalid: !newArticle.name.value && $v.newArticle.name.$dirty && !$v.newArticle.name.required}"
              @input="saveDBQuestion(newArticle)"
          >
            <template slot="append">
              <v-icon size="20" class="detail-wrapper__content__title__name__icon" :color="newArticle.name.focused ? 'primary' : ''">
                mdi-lead-pencil
              </v-icon>
            </template>
          </v-textarea>
          <small
              v-if="!newArticle.name.value && $v.newArticle.name.$dirty && !$v.newArticle.name.required"
              style="color: lightcoral"
          >
            Поле обязательно для заполнения
          </small>
          <div class="detail-wrapper__content__title__help">
            <span class="detail-wrapper__content__title__help__title" :class="{focused: newArticle.title.focused}">
              Подсказка
            </span>
            <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{inputFocused: newArticle.title.focused}"
                placeholder="Введите подсказку для вопроса"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.title.value"
                @focus="onFocus(newArticle.title)"
                @focusout="outFocus(newArticle.title)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                @input="saveDBQuestion(newArticle)"
            ></v-textarea>
          </div>
          <div class="detail-wrapper__content__title__help">
            <span class="detail-wrapper__content__title__help__title" :class="{focused: newArticle.article.focused}">
              Разъясняющий текст
            </span>
            <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{inputFocused: newArticle.article.focused}"
                placeholder="Введите разъясняющий текст"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.article.value"
                @focus="onFocus(newArticle.article)"
                @focusout="outFocus(newArticle.article)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                @input="saveDBQuestion(newArticle)"
            ></v-textarea>
          </div>
          <div class="detail-wrapper__content__title__help">
            <span class="detail-wrapper__content__title__help__title" :class="{focused: newArticle.purpose_of_question.focused}">
              Цель вопроса
            </span>
            <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{ inputFocused: newArticle.purpose_of_question.focused }"
                placeholder="Введите цель вопроса"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.purpose_of_question.value"
                @focus="onFocus(newArticle.purpose_of_question)"
                @focusout="outFocus(newArticle.purpose_of_question)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                @input="saveDBQuestion(newArticle)"
            ></v-textarea>
          </div>
        </div>

        <!-- TEXTAREA -->
        <text-redactor/>

        <!-- Tags Component -->

      </div>
      <div class="question_footer">
        <template v-if="$route.params.action === 'create'">
<!--          <v-btn
              color="red darken-1"
              text
              @click="resetFields"
          >
            Очистить
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click.prevent="onSubmit"
              :disabled="computedValidations"
          >
            Создать
          </v-btn>-->
        </template>
        <template v-else>
          <template v-if="Object.keys(this.$store.state.QuestionsModule.nonEditState).length">
<!--            <v-btn
                color="red darken-1"
                text
                @click="deleteModal = true"
            >
              Удалить
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click.prevent="saveDifferences()"
            >
              Сохранить изменения
            </v-btn>-->
          </template>
        </template>
      </div>

      <!-- LOADER -->
      <v-overlay
          :z-index="2"
          :absolute="true"
          :value="$store.state.QuestionsModule.loadingQuestion"
      >
        <v-progress-circular
            style="margin: auto"
            width="4"
            :size="70"
            color="blue"
            :indeterminate="true"
            v-if="$store.state.QuestionsModule.loadingQuestion"
        ></v-progress-circular>
      </v-overlay>
    </v-form>

    <!--  MODALS  -->
    <v-dialog
        v-model="deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить вопрос?</span>
        </v-card-title>
        <v-card-actions>
<!--          <v-btn
              color="blue darken-1"
              text
              @click="deleteModal = false"
              :disabled="$store.state.QuestionsModule.loadingRequest"
              :loading="$store.state.QuestionsModule.loadingRequest"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="red darken-1"
              text
              @click="deleteQuestion()"
              :disabled="$store.state.QuestionsModule.loadingRequest"
              :loading="$store.state.QuestionsModule.loadingRequest"
          >
            Да
          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import TextRedactor from "./TextRedactor";

/* INDEXEDDB */
const DB_NAME = 'articlesDB'
const STORAGE_NAME = 'article'
const DB_VERSION = 1
let DB;

export default {
  name: "DetailArticles",
  components: {TextRedactor},
  validations: {
    newArticle: {
      name: {
        value: {required}
      },
    },
    validationGroup: ['newQuestion.name.value']
  },
  data: () => ({
    newArticle: {
      id: 1,
      name: {
        value: '',
        focused: false,
      },
      title: {
        value: '',
        focused: false,
      },
      article: {
        value: '',
        focused: false,
      },
      purpose_of_question: {
        value: '',
        focused: false,
      },
      id_type_answer: {
        value: null,
        focused: false
      },
      state_detailed_response: 0,
      state_attachment_response: 0,
      value_type_answer: null,
      _all_tags: [],
      mtomtags: [],
    },
    deleteModal: false,
  }),
  mounted() {
  },
  methods: {
    /* indexedDB */
    async getDb () {
      return new Promise((resolve, reject) => {
        if (DB) {
          return resolve(DB)
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION)
        request.onerror = e => {
          console.log('Error opening db', e)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Error')
        }
        request.onsuccess = e => {
          DB = e.target.result
          resolve(DB)
        }
        request.onupgradeneeded = e => {
          let db = e.target.result
          db.createObjectStore(STORAGE_NAME, { autoIncrement: true, keyPath: 'id' })
        }
      })
    },
    async deleteDBQuestion (value) {
      const db = await this.getDb()
      return new Promise(resolve => {
        const trans = db.transaction([STORAGE_NAME], 'readwrite')
        trans.oncomplete = () => {
          resolve()
        }
        const store = trans.objectStore(STORAGE_NAME)
        store.delete(value.id)
      })
    },
    async getDBQuestion () {
      if (!this.deleteStorage) {
        if (this.$route.params?.action === 'create') {
          let db = await this.getDb()
          return new Promise(resolve => {
            let trans = db.transaction([STORAGE_NAME], 'readonly')
            trans.oncomplete = () => {
              resolve(question)
            }
            const store = trans.objectStore(STORAGE_NAME)
            const question = []
            store.openCursor().onsuccess = e => {
              const cursor = e.target.result
              if (cursor) {
                question.push(cursor.value)
                cursor.continue()
                this.newQuestion = question[0]
              }
            }
          })
        }
      }
    },
    async saveDBQuestion(value) {
      const refactored = {}
      for (let key in value) {
        if (typeof value[key] === 'object' && value[key] !== null) {
          if (Array.isArray(value[key])) {
            refactored[key] = value[key]
          } else {
            refactored[key] = {}
            refactored[key].value = value[key].value
            refactored[key].focused = false
          }
        } else {
          if (key === 'value_type_answer') {
            refactored[key] = value[key]
          } else if (key === 'id') {
            refactored[key] = value[key]
          } else refactored[key] = value[key]
        }
      }
      if (!this.deleteStorage) {
        if (this.$route.params?.action === 'create') {
          let db = await this.getDb()
          return new Promise(resolve => {
            let trans = db.transaction([STORAGE_NAME], 'readwrite')
            trans.oncomplete = () => {
              resolve()
            }
            let store = trans.objectStore(STORAGE_NAME)
            store.put(refactored)
          })
        }
      }
    },

    onFocus(obj, id) {
      obj.focused = true
      if (id) {
        let index = this.newArticle.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) {
          this.newArticle.value_type_answer[index].focused = true
        }
      }
    },
    outFocus(obj, id) {
      obj.focused = false
      if (id) {
        let index = this.newArticle.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) this.newArticle.value_type_answer[index].focused = false
      }
    },
  },
}
</script>
<style scoped lang="scss">
.list-enter-active, .list-leave-active {
  transition: all .8s;
}

.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.detail-wrapper {
  padding: 10px;
  height: 100%;

  .form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    justify-content: space-between;
    height: 100%;

    .detail-wrapper__content {
      display: flex;
      flex-direction: column;
      row-gap: 5px;

      &__title {
        &__name {
          margin-bottom: 7px !important;
          border-bottom: 2px solid #1976d2;
          border-radius: 0;
          color: #1976d2 !important;
          transition: all .6s ease-in-out;

          ::v-deep textarea {
            color: #1976d2 !important;
            font-size: 16px !important;
            font-weight: 600;
            letter-spacing: 0.6px;
          }
          ::v-deep textarea::placeholder {
            color: gray;
            font-size: 14px !important;
            font-weight: 400;
            letter-spacing: 0;
          }
          ::v-deep .v-input__append-inner {
            margin-top: 0 !important;
            align-self: unset;
          }
          ::v-deep textarea {
            min-height: 26px !important;
            height: 26px !important;
          }
          ::v-deep .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
            min-height: 26px !important;
          }
        }

        ::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
          padding: 0 !important;
        }

        ::v-deep .v-textarea textarea {
          color: gray;
          margin: 0 !important;
        }

        ::v-deep .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
          min-height: 26px;
        }

        ::v-deep .v-text-field input::placeholder {
          color: gray;
          font-size: 14px !important;
          font-weight: 400;
          letter-spacing: 0;
        }

        &__help {
          display: flex;
          flex-direction: column;

          &__title {
            color: black;
            font-weight: 600;
            font-size: 15px;
            transition: color 0.25s ease-in-out;
          }

          &__description {
            color: lightgray;
            font-size: 13px;
            transition: color .6s ease-in-out;
          }
          ::v-deep .v-text-field__slot {
            min-height: 20px !important;
          }
          ::v-deep .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
            min-height: 20px !important;
          }
          ::v-deep textarea {
            line-height: 20px;
            font-weight: 500;
            min-height: 20px !important;
          }
          ::v-deep v-input {
            display: flex !important;
            align-items: center !important;
          }
        }
      }

      .question_settings {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        ::v-deep .v-input--selection-controls {
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    }

    .question_footer {
      display: flex;
      justify-content: space-between
    }
  }
}

.invalid {
  border-bottom: 2px solid lightcoral !important;
  border-radius: unset !important;
  color: lightcoral !important;
  ::v-deep .v-text-field input {
    color: lightcoral !important;
  }
}

.invalidSelector {
  ::v-deep fieldset {
    border-color: lightcoral !important;
  }
}

::v-deep .v-text-field {
  margin: 0 !important;
}

::v-deep .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
  margin-right: 0 !important;
}

.focused {
  color: #f7c325 !important;
}
.inputFocused {
  ::v-deep textarea {
    color: black !important;
  }
  ::v-deep input {
    color: black !important;
  }
}

::v-deep .v-dialog > .v-card > .v-card__title {
  justify-content: center;
}
</style>
