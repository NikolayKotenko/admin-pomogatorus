<template>
  <div class="question">
    <v-form
        class="form"
        ref="form"
    >
<!--      @submit.prevent="onSubmit" -->
      <div class="question_content">
        <div class="question_title">
          <v-text-field
              class="question_title__name"
              dense
              hide-details
              placeholder="Введите наименование"
              v-model="newQuestion.name.value"
              solo
              flat
              @focus="onFocus(newQuestion.name)"
              @focusout="outFocus(newQuestion.name)"
              :loading="$store.state.QuestionsModule.loadingQuestion"
              :class="{invalid: !newQuestion.name.value && $v.newQuestion.name.$dirty && !$v.newQuestion.name.required}"
              @change="onChange"
          >
            <template slot="append">
              <v-icon size="20" class="question_title__name__icon" :color="newQuestion.name.focused ? 'primary' : ''">
                mdi-lead-pencil
              </v-icon>
            </template>
          </v-text-field>
          <small
              v-if="!newQuestion.name.value && $v.newQuestion.name.$dirty && !$v.newQuestion.name.required"
              style="color: lightcoral"
          >
            Поле обязательно для заполнения
          </small>
          <div class="question_title_help">
            <span class="question_title_help__title" :class="{focused: newQuestion.title.focused}">
              Подсказка
            </span>
            <v-textarea
                class="question_title_help__description"
                :class="{inputFocused: newQuestion.title.focused}"
                placeholder="Введите подсказку для вопроса"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newQuestion.title.value"
                @focus="onFocus(newQuestion.title)"
                @focusout="outFocus(newQuestion.title)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                @change="onChange"
            ></v-textarea>
          </div>
          <div class="question_title_help">
          <span class="question_title_help__title" :class="{focused: newQuestion.article.focused}">
            Разъясняющий текст
          </span>
            <v-textarea
                class="question_title_help__description"
                :class="{inputFocused: newQuestion.article.focused}"
                placeholder="Введите разъясняющий текст"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newQuestion.article.value"
                @focus="onFocus(newQuestion.article)"
                @focusout="outFocus(newQuestion.article)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                @change="onChange"
            ></v-textarea>
          </div>
          <div class="question_title_help">
          <span class="question_title_help__title" :class="{focused: newQuestion.purpose_of_question.focused}">
            Цель вопроса
          </span>
            <v-textarea
                class="question_title_help__description"
                :class="{
                inputFocused: newQuestion.purpose_of_question.focused,
                invalid: !newQuestion.purpose_of_question.value && $v.newQuestion.purpose_of_question.$dirty && !$v.newQuestion.purpose_of_question.required
                }"
                placeholder="Введите цель вопроса"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newQuestion.purpose_of_question.value"
                @focus="onFocus(newQuestion.purpose_of_question)"
                @focusout="outFocus(newQuestion.purpose_of_question)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                @change="onChange"
            ></v-textarea>
            <small
                v-if="!newQuestion.purpose_of_question.value && $v.newQuestion.purpose_of_question.$dirty && !$v.newQuestion.purpose_of_question.required"
                style="color: lightcoral"
            >
              Поле обязательно для заполнения
            </small>
          </div>
        </div>

        <!-- SELECTOR & INPUT'S -->
        <div class="question_main">
          <div class="question_main_selector">
            <span class="question_main_selector__title" :class="{focused: newQuestion.id_type_answer.focused}">
              Тип ответа
            </span>
            <v-select
                outlined
                dense
                hide-details
                placeholder="Выберите тип"
                :items="getListTypesOfQuestions"
                item-text="name"
                item-value="id"
                v-model="newQuestion.id_type_answer.value"
                @change="onSelect(); onChange()"
                @focus="onFocus(newQuestion.id_type_answer)"
                @focusout="outFocus(newQuestion.id_type_answer)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                :class="{invalidSelector: !newQuestion.id_type_answer.value && $v.newQuestion.id_type_answer.$dirty && !$v.newQuestion.id_type_answer.required}"
            ></v-select>
            <small
                v-if="!newQuestion.id_type_answer.value && $v.newQuestion.id_type_answer.$dirty && !$v.newQuestion.id_type_answer.required"
                style="color: lightcoral"
            >
              Поле обязательно для заполнения
            </small>
          </div>
          <!-- INPUTS -->
          <template v-if="newQuestion.id_type_answer.value !== 1 && newQuestion.id_type_answer.value !== 2 && !!newQuestion.id_type_answer.value">
            <div class="question_main_wrapper" v-if="newQuestion.id_type_answer.value !== 6 && newQuestion.id_type_answer.value !== 7">
              <transition-group name="list">
                <div
                    class="question_main_wrapper__item"
                    v-for="answer in newQuestion.value_type_answer"
                    :key="answer.id"
                >
                  <v-text-field
                      class="question_main_wrapper__item__value"
                      :class="{inputFocused: answer.focused}"
                      placeholder="Введите значение"
                      auto-grow
                      rows="1"
                      dense
                      hide-details
                      flat
                      solo
                      :append-icon="answer.showComentary ? 'mdi-menu-right' : 'mdi-menu-down'"
                      @click:append="answer.showComentary = !answer.showComentary"
                      v-model="answer.answer"
                      @focus="onFocus(newQuestion.id_type_answer, answer.id);"
                      @focusout="outFocus(newQuestion.id_type_answer, answer.id)"
                      @change="onChange"
                  >
                  </v-text-field>
                  <div class="divider" v-if="answer.showComentary"></div>
                  <v-textarea
                      class="question_main_wrapper__item__description"
                      :class="{inputFocused: answer.focused}"
                      placeholder="Введите примечание"
                      auto-grow
                      rows="1"
                      dense
                      hide-details
                      flat
                      solo
                      v-model="answer.commentary"
                      v-if="answer.showComentary"
                      @focus="onFocus(newQuestion.id_type_answer, answer.id)"
                      @focusout="outFocus(newQuestion.id_type_answer, answer.id)"
                      @change="onChange"
                  ></v-textarea>
                </div>
              </transition-group>
            </div>
            <div
                class="question_main_wrapper"
                :class="{rangeError: rangeError}"
                v-else
            >
              <transition-group name="list">
                <div
                    class="question_main_wrapper__item"
                    v-for="answer in newQuestion.value_type_answer"
                    :key="answer.id"
                >
                  <v-text-field
                      class="question_main_wrapper__item__value"
                      :class="{inputFocused: answer.focused}"
                      :placeholder="answer.placeholder"
                      auto-grow
                      rows="1"
                      dense
                      hide-details
                      flat
                      solo
                      v-model="answer.answer"
                      @focus="onFocus(newQuestion.id_type_answer, answer.id);"
                      @focusout="outFocus(newQuestion.id_type_answer, answer.id)"
                      type="number"
                      @change="onChange"
                  >
                    <template slot="prepend-inner">
                      <v-icon small :color="answer.focused ? 'black' : ''" @click="rangeEdit('minus', answer)">
                        mdi-minus
                      </v-icon>
                    </template>
                    <template slot="append">
                      <v-icon small :color="answer.focused ? 'black' : ''" @click="rangeEdit('plus', answer)">
                        mdi-plus
                      </v-icon>
                    </template>
                  </v-text-field>
                </div>
              </transition-group>
            </div>
            <small v-if="rangeError" style="color: lightcoral">
              Неккоректные значения
            </small>
          </template>
        </div>
        <div class="question_settings">
          <v-checkbox
              hide-details
              class="question_settings__checkbox"
              label="Допускается развернутый ответ"
              v-model="newQuestion.state_detailed_response"
              :loading="$store.state.QuestionsModule.loadingQuestion"
              @change="onChange"
          ></v-checkbox>
          <v-checkbox
              hide-details
              class="question_settings__checkbox"
              label="Наличие вложения в ответе"
              v-model="newQuestion.state_attachment_response"
              :loading="$store.state.QuestionsModule.loadingQuestion"
              @change="onChange"
          ></v-checkbox>
        </div>
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
          <template v-if="Object.keys(this.$store.state.QuestionsModule.nonEditState).length">
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
          <v-btn
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
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

import { mapGetters } from 'vuex'

import QuestionTags from "./QuestionTags";

export default {
  name: "CreateQuestion",
  components: {QuestionTags},
  validations: {
    newQuestion: {
      name: {
        value: {required}
      },
      purpose_of_question: {
        value: {required}
      },
      id_type_answer: {
        value: {required}
      }
    },
    validationGroup: ['newQuestion.name.value', 'newQuestion.id_type_answer.value', 'newQuestion.purpose_of_question.value']
  },
  data: () => ({
    lastIdAnswer: 1,
    debounceTimeout: null,
    rangeError: false,
    newQuestion: {
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
    deleteStorage: false,
  }),
  mounted() {
    this.initializeQuery()
    this.initializeStorage()
    this.getTypes()
  },
  watch: {
    'newQuestion.value_type_answer': {
      // eslint-disable-next-line no-unused-vars
      handler(oldValue, newValue) {
        if (Array.isArray(this.newQuestion.value_type_answer)) {
          if (this.newQuestion.id_type_answer.value !== 6 && this.newQuestion.id_type_answer.value !== 7) {
            if (this.newQuestion.value_type_answer[this.newQuestion.value_type_answer.length - 1]?.answer) {
              this.addVariable()
            } else if (
                this.newQuestion.value_type_answer[this.newQuestion.value_type_answer.length - 2]?.answer === '' &&
                this.newQuestion.value_type_answer[this.newQuestion.value_type_answer.length - 2]?.commentary === ''
            ) {
              this.newQuestion.value_type_answer.splice(this.newQuestion.value_type_answer.length - 1, 1)
            }
          } else {
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
              this.rangeError = (parseInt(this.newQuestion.value_type_answer[0].answer) > parseInt(this.newQuestion.value_type_answer[1].answer));
            }, 500)
          }
        }
      },
      deep: true
    },
    '$store.state.QuestionsModule.newQuestion._all_tags': {
      handler() {
        this.newQuestion._all_tags = this.$store.state.QuestionsModule.newQuestion._all_tags
        this.onChange()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
        'getListTypesOfQuestions'
    ]),
    computedValidations() {
      return (
          (!this.newQuestion.name.value && this.$v.newQuestion.name.$dirty && !this.$v.newQuestion.name.required) ||
          (!this.newQuestion.purpose_of_question.value && this.$v.newQuestion.purpose_of_question.$dirty && !this.$v.newQuestion.purpose_of_question.required) ||
          (!this.newQuestion.id_type_answer.value && this.$v.newQuestion.id_type_answer.$dirty && !this.$v.newQuestion.id_type_answer.required) ||
          (this.rangeError)
      )
    },
  },
  methods: {
    initializeQuery() {
      if (Object.keys(this.$route.query).length && Object.keys(this.$route.query).includes('question_id')) {
        this.$store.dispatch('getDetailQuestion', this.$route.query.question_id).then(() => {
          if (this.$store.state.QuestionsModule.newQuestion.name) {
            this.newQuestion = this.$store.state.QuestionsModule.newQuestion
            if (Array.isArray(this.$store.state.QuestionsModule.newQuestion.value_type_answer)) {
              this.lastIdAnswer = this.$store.state.QuestionsModule.newQuestion.value_type_answer.length
            }
          }
        })
      }
    },
    initializeStorage() {
      if (Object.keys(this.$route.params).length && Object.keys(this.$route.params).includes('action')) {
        if (this.$route.params.action === 'create') {
          if (localStorage.getItem('question') !== null) {
            this.$store.dispatch('getFromLocalStorage').then(() => {
              this.newQuestion = this.$store.state.QuestionsModule.newQuestion
              this.onChange()
            })
          }
        }
      }
    },
    getTypes() {
      this.$store.dispatch('setListTypesQuestions')
    },
    onSelect() {
      if (this.newQuestion.id_type_answer.value === 6 || this.newQuestion.id_type_answer.value === 7) {
        this.newQuestion.value_type_answer = []
        this.newQuestion.value_type_answer.push(new this.AnswerRangeMin(this.lastIdAnswer))
        this.lastIdAnswer++
        this.newQuestion.value_type_answer.push(new this.AnswerRangeMax(this.lastIdAnswer))
      } else if (this.newQuestion.id_type_answer.value !== 1 && this.newQuestion.id_type_answer.value !== 2) {
        this.newQuestion.value_type_answer = []
        this.newQuestion.value_type_answer.push(new this.AnswerVariable(this.lastIdAnswer))
      } else this.newQuestion.value_type_answer = []
    },
    addVariable() {
      this.lastIdAnswer++
      this.newQuestion.value_type_answer.push(new this.AnswerVariable(this.lastIdAnswer))
    },
    onFocus(obj, id) {
      obj.focused = true
      if (id) {
        let index = this.newQuestion.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) {
          this.newQuestion.value_type_answer[index].focused = true
        }
      }
    },
    outFocus(obj, id) {
      obj.focused = false
      if (id) {
        let index = this.newQuestion.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) this.newQuestion.value_type_answer[index].focused = false
      }
    },
    resetFields() {
      this.deleteStorage = true
      for (let key in this.newQuestion) {
        if (typeof this.newQuestion[key] === 'object' && this.newQuestion[key] !== null) {
          if (Array.isArray(this.newQuestion[key])) {
            this.newQuestion[key] = []
          } else this.newQuestion[key].value = ''
        } else {
          if (key === 'value_type_answer') {
            this.newQuestion[key] = null
          } else this.newQuestion[key] = 0
        }
      }
      this.lastIdAnswer = 1
      this.$store.dispatch('removeLocalStorage')
      setTimeout(() => {
        this.deleteStorage = false
      }, 500)
    },
    onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
        this.$store.dispatch('createQuestion', this.newQuestion).then(() => {
          this.$store.dispatch('removeLocalStorage')
          this.$router.push({
            path: '/questions'
          })
        })
    },
    saveDifferences() {
        this.$store.dispatch('updateQuestion', this.newQuestion).then(() => {
          this.$router.push({
            path: '/questions'
          })
        })
    },
    deleteQuestion() {
      this.$store.dispatch('deleteQuestion', this.newQuestion).then(() => {
        this.deleteModal = false
        this.$router.push({
          path: '/questions'
        })
      })
    },
    onChange() {
      if (!this.deleteStorage) {
        if (this.$route.params?.action === 'create') {
          this.$store.dispatch('setLocalStorage', this.newQuestion)
        }
      }
    },
    rangeEdit(action, answer) {
      if (action === 'plus') {
        if (!answer.answer) {
          this.$nextTick(() => {
            answer.answer = 1
          })
        } else {
          this.$nextTick(() => {
            answer.answer = parseInt(answer.answer)+1
          })
        }
      } else {
        if (!answer.answer) {
          this.$nextTick(() => {
            answer.answer = 0
          })
        } else if (parseInt(answer.answer) > 0) {
          this.$nextTick(() => {
            answer.answer = parseInt(answer.answer)-1
          })
        } else this.$nextTick(() => {
          answer.answer = 0
        })
      }
    },

    /* CONSTRUCTORS */
    AnswerVariable(id) {
      this.id = id
      this.answer = ''
      this.commentary = ''
      this.showComentary = true
      this.focused = false
    },
    AnswerRangeMin(id) {
      this.id = id
      this.answer = ''
      this.commentary = ''
      this.showComentary = true
      this.focused = false
      this.placeholder = 'Введите минимальное значение'
    },
    AnswerRangeMax(id) {
      this.id = id
      this.answer = ''
      this.commentary = ''
      this.showComentary = true
      this.focused = false
      this.placeholder = 'Введите максимальное значение'
    },
  },
  beforeDestroy() {
    this.$store.state.QuestionsModule.newQuestion._all_tags = []
    this.$store.commit('reset_questions_tags')
  }
}
</script>

<style lang="scss" scoped>
//@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap');

.list-enter-active, .list-leave-active {
  transition: all .8s;
}

.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.question {
  padding: 10px;
  height: 100%;

  .form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    justify-content: space-between;
    height: 100%;

    .question_content {
      display: flex;
      flex-direction: column;
      row-gap: 5px;

      .question_title {
        &__name {
          margin-bottom: 7px !important;
          border-bottom: 2px solid #1976d2;
          border-radius: 0;
          color: #1976d2 !important;
          transition: all .6s ease-in-out;
        }

        ::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
          padding: 0 !important;
        }

        ::v-deep .v-textarea textarea {
          color: gray;
          margin: 0 !important;
        }

        ::v-deep .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
          min-height: 30px !important;
        }

        ::v-deep .v-text-field input {
          color: #1976d2 !important;
          font-size: 16px !important;
          font-weight: 600;
          letter-spacing: 0.6px;
        }

        ::v-deep .v-text-field input::placeholder {
          color: gray;
          font-size: 14px !important;
          font-weight: 400;
          letter-spacing: 0;
        }

        .question_title_help {
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

      .question_main {
        padding-bottom: 7px;

        .question_main_selector {
          display: flex;
          flex-direction: column;
          row-gap: 5px;

          ::v-deep .v-input {
            font-size: 13px !important;
            font-weight: 500;
          }

          ::v-deep .v-text-field input {
            font-size: 14px !important;
          }

          &__title {
            color: #7e8d9a;
            font-weight: 600;
          }
        }

        .question_main_wrapper {
          border: 1px solid lightgray;
          border-radius: 5px;
          border-bottom: none;
          transition: all .8s ease-in-out;

          &__item {
            border-bottom: 1px solid lightgray;

            &__value {
              font-size: 14px;
              ::v-deep input {
                color: darkgray;
                transition: all .6s ease-in-out;
              }
            }

            ::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
              padding: 0 6px !important;
            }

            .divider {
              border-bottom: 1px dashed;
              width: 15%;
              margin-left: 6px;
            }

            &__description {
              font-size: 14px;
              ::v-deep textarea {
                color: darkgray;
                transition: all .6s ease-in-out;
              }
            }
          }
        }
        .rangeError {
          border: 1px solid lightcoral !important;
          .question_main_wrapper__item {
            border-bottom: unset;
          }
          ::v-deep input {
            color: lightcoral;
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
