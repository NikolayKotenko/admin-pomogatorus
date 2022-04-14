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
              :loading="$store.state.TitlesModule.loadingArticle"
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
            <span class="detail-wrapper__content__title__help__title" :class="{focused: newArticle.short_header.focused}">
              Короткое наименование
            </span>
            <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{inputFocused: newArticle.short_header.focused, invalid: !newArticle.short_header.value && $v.newArticle.short_header.$dirty && !$v.newArticle.short_header.required}"
                placeholder="Введите короткое наименование"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.short_header.value"
                @focus="onFocus(newArticle.short_header)"
                @focusout="outFocus(newArticle.short_header)"
                :loading="$store.state.TitlesModule.loadingArticle"
                @input="saveDBQuestion(newArticle)"
            ></v-textarea>
            <small
                v-if="!newArticle.short_header.value && $v.newArticle.short_header.$dirty && !$v.newArticle.short_header.required"
                style="color: lightcoral"
            >
              Поле обязательно для заполнения
            </small>
          </div>
          <div class="detail-wrapper__content__title__help">
            <span class="detail-wrapper__content__title__help__title" :class="{focused: newArticle.purpose_of_article.focused}">
              Описание статьи
            </span>
            <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{inputFocused: newArticle.purpose_of_article.focused}"
                placeholder="Введите описание статьи"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.purpose_of_article.value"
                @focus="onFocus(newArticle.purpose_of_article)"
                @focusout="outFocus(newArticle.purpose_of_article)"
                :loading="$store.state.TitlesModule.loadingArticle"
                @input="saveDBQuestion(newArticle)"
            ></v-textarea>
          </div>
          <div class="detail-wrapper__content__title__help">
            <span class="detail-wrapper__content__title__help__title" :class="{focused: newArticle.preview.focused}">
              Анонс
            </span>
            <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{ inputFocused: newArticle.preview.focused }"
                placeholder="Введите анонс"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.preview.value"
                @focus="onFocus(newArticle.preview)"
                @focusout="outFocus(newArticle.preview)"
                :loading="$store.state.TitlesModule.loadingArticle"
                @input="saveDBQuestion(newArticle)"
            ></v-textarea>
          </div>
        </div>

        <!-- TEXTAREA -->
        <text-redactor :newArticle="newArticle" :deletedContent="deletedContent"/>

        <!-- Tags Component -->
        <question-tags/>

      </div>
      <div class="question_footer">
        <template v-if="$route.params.action === 'create'">
          <v-btn
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
          </v-btn>
        </template>
        <template v-else>
          <template v-if="Object.keys(this.$store.state.TitlesModule.nonEditState).length">
            <v-btn
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
            </v-btn>
          </template>
        </template>
      </div>
      <!-- LOADER -->
      <v-overlay
          :z-index="2"
          :absolute="true"
          :value="$store.state.TitlesModule.loadingArticle"
      >
        <v-progress-circular
            style="margin: auto"
            width="4"
            :size="70"
            color="blue"
            :indeterminate="true"
            v-if="$store.state.TitlesModule.loadingArticle"
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
          <v-btn
              color="blue darken-1"
              text
              @click="deleteModal = false"
              :disabled="$store.state.TitlesModule.loadingRequest"
              :loading="$store.state.TitlesModule.loadingRequest"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="red darken-1"
              text
              :disabled="$store.state.TitlesModule.loadingRequest"
              :loading="$store.state.TitlesModule.loadingRequest"
              @click="deleteArticle"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import TextRedactor from "./TextRedactor";
import QuestionTags from "../questions/QuestionTags";

/* INDEXEDDB */
const DB_NAME = 'articlesDB'
const STORAGE_NAME = 'article'
const DB_VERSION = 1
let DB;

export default {
  name: "DetailArticles",
  components: {QuestionTags, TextRedactor},
  validations: {
    newArticle: {
      name: {
        value: {required}
      },
      short_header: {
        value: {required}
      }
    },
    validationGroup: ['newArticle.name.value', 'newArticle.short_header.value']
  },
  data: () => ({
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
    deleteModal: false,
    deleteStorage: false,
    deletedContent: false,
  }),
  mounted() {
    this.initializeQuery()
    this.getDb()
    if (!this.deleteStorage) {
      if (this.$route.params?.action === 'create') {
        this.getDBQuestion()
      }
    }
  },
  watch: {
    '$store.state.TitlesModule.content': {
      handler() {
        this.saveDBQuestion(this.newArticle)
      }
    },
    '$store.state.TitlesModule.newArticle._all_tags': {
      handler() {
        this.newArticle._all_tags = this.$store.state.TitlesModule.newArticle._all_tags
        this.saveDBQuestion(this.newArticle)
      }
    },
  },
  computed: {
    computedValidations() {
      return (
          (!this.newArticle.name.value && this.$v.newArticle.name.$dirty && !this.$v.newArticle.name.required) ||
          (!this.newArticle.short_header.value && this.$v.newArticle.short_header.$dirty && !this.$v.newArticle.short_header.required)
      )
    },
  },
  methods: {
    /* MAIN */
    initializeQuery() {
      if (Object.keys(this.$route.query).length && Object.keys(this.$route.query).includes('article_id')) {
        this.$store.dispatch('getDetailArticle', this.$route.query.article_id).then(() => {
          if (this.$store.state.TitlesModule.newArticle.name) {
            this.newArticle = this.$store.state.TitlesModule.newArticle
          }
        })
      }
    },
    resetFields() {
      this.deleteStorage = true
      for (let key in this.newArticle) {
        if (typeof this.newArticle[key] === 'object' && this.newArticle[key] !== null) {
          if (Array.isArray(this.newArticle[key])) {
            this.newArticle[key] = []
          } else this.newArticle[key].value = ''
        } else {
          if (key === 'value_type_answer') {
            this.newArticle[key] = null
          } else if (key === 'id') {
            this.newArticle[key] = 1
          } else this.newArticle[key] = 0
        }
      }
      this.deletedContent = true

      this.$store.state.TitlesModule.inserted_components = []
      this.$store.state.TitlesModule.countLayout = 0
      this.$store.state.TitlesModule.newArticle._all_tags = []
      this.$store.dispatch('removeLocalStorageArticle')
      this.deleteDBQuestion(this.newArticle)
      setTimeout(() => {
        this.deleteStorage = false
        this.deletedContent = false
      }, 500)
    },
    saveDifferences() {
      this.$store.dispatch('updateArticle', this.newArticle).then(() => {
        this.$router.push({
          path: '/articles'
        })
      })
    },
    deleteArticle() {
      this.$store.dispatch('deleteArticle', this.newArticle).then(() => {
        this.deleteModal = false
        this.$router.push({
          path: '/articles'
        })
      })
    },

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
                this.$nextTick(() => {
                  this.newArticle = question[0]
                  this.$store.state.TitlesModule.content_from_server = question[0].content
                  this.$store.state.TitlesModule.inserted_components = question[0].inserted_components
                  this.$store.state.TitlesModule.newArticle._all_tags = this.newArticle._all_tags
                })
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
      refactored.content = this.$store.state.TitlesModule.content
      refactored.inserted_components = this.$store.state.TitlesModule.inserted_components
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

    /* FOCUS */
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

    /* CRUD */
    onSubmit() {
      console.log(this.$v)
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.deleteDBQuestion(this.newArticle).then(() => {
        this.$store.dispatch('createArticle', this.newArticle).then(() => {
          this.$store.dispatch('removeLocalStorageArticle')
          this.$router.push({
            path: '/articles'
          })
        })
      })
    },
  },
  beforeDestroy() {
    this.$store.state.TitlesModule.newArticle._all_tags = []
  }
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
