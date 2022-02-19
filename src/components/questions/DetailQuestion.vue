<template>
  <div class="question">
    <v-form
        class="form"
        ref="form"
        @submit.prevent="onSubmit"
    >
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
          >
            <template slot="append">
              <v-icon size="20" class="question_title__name__icon" :color="newQuestion.name.focused ? 'primary' : ''">
                mdi-lead-pencil
              </v-icon>
            </template>
          </v-text-field>
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
            ></v-textarea>
          </div>
          <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: newQuestion.purpose_of_question.focused}">
          Цель вопроса
        </span>
            <v-textarea
                class="question_title_help__description"
                :class="{inputFocused: newQuestion.purpose_of_question.focused}"
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
            ></v-textarea>
          </div>
        </div>
        <div class="question_main">
          <div class="question_main_selector">
          <span class="question_main_selector__title" :class="{focused: newQuestion.id_type_answer.focused}">
            Тип ответа
          </span>
            <v-autocomplete
                outlined
                dense
                hide-details
                placeholder="Выберите тип"
                :items="getListTypesOfQuestions"
                item-text="name"
                item-value="id"
                v-model="newQuestion.id_type_answer.value"
                @change="onSelect()"
                @focus="onFocus(newQuestion.id_type_answer)"
                @focusout="outFocus(newQuestion.id_type_answer)"
                :loading="$store.state.QuestionsModule.loadingQuestion"
            ></v-autocomplete>
          </div>
          <div class="question_main_wrapper" v-if="newQuestion.id_type_answer.value !== null">
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
                ></v-textarea>
              </div>
            </transition-group>
          </div>
        </div>
        <div class="question_settings">
          <v-checkbox
              hide-details
              class="question_settings__checkbox"
              label="Допускается развернутый ответ"
              v-model="newQuestion.state_detailed_response"
              :loading="$store.state.QuestionsModule.loadingQuestion"
          ></v-checkbox>
          <v-checkbox
              hide-details
              class="question_settings__checkbox"
              label="Наличие вложения в ответе"
              v-model="newQuestion.state_attachment_response"
              :loading="$store.state.QuestionsModule.loadingQuestion"
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
          >
            Очистить
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              type="submit"
          >
            Создать
          </v-btn>
        </template>
        <template v-else>
          <v-btn
              color="red darken-1"
              text
          >
            Удалить
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
          >
            Сохранить изменения
          </v-btn>
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
  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'

import QuestionTags from "./QuestionTags";

export default {
  name: "CreateQuestion",
  components: {QuestionTags},
  data: () => ({
    lastIdAnswer: 1,
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
      tags: [],
    },
  }),
  validations: {
    newQuestion: {
      name: {
        value: {required}
      }
    },
    validationGroup: ['newQuestion.name.value']
  },
  mounted() {
    this.initializeQuery()
    this.getTypes()
  },
  watch: {
    'newQuestion.value_type_answer': {
      // eslint-disable-next-line no-unused-vars
      handler(oldValue, newValue) {
        if (Array.isArray(this.newQuestion.value_type_answer)) {
          if (this.newQuestion.value_type_answer[this.newQuestion.value_type_answer.length - 1]?.answer) {
            this.addVariable()
          } else if (
              this.newQuestion.value_type_answer[this.newQuestion.value_type_answer.length - 2]?.answer === '' &&
              this.newQuestion.value_type_answer[this.newQuestion.value_type_answer.length - 2]?.commentary === ''
          ) {
            this.newQuestion.value_type_answer.splice(this.newQuestion.value_type_answer.length - 1, 1)
          }
        }
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
        'getListTypesOfQuestions'
    ]),
  },
  methods: {
    initializeQuery() {
      if (Object.keys(this.$route.query).length && Object.keys(this.$route.query).includes('id_question')) {
        this.$store.dispatch('getDetailQuestion', this.$route.query.id_question).then(() => {
          if (this.$store.state.QuestionsModule.newQuestion.name) {
            this.newQuestion = this.$store.state.QuestionsModule.newQuestion
          }
        })
      }
    },
    getTypes() {
      this.$store.dispatch('setListTypesQuestions')
    },
    onSelect() {
      if (this.newQuestion.id_type_answer.value === 5) {
        this.newQuestion.value_type_answer = []
        this.newQuestion.value_type_answer.push(new this.answerVariable(this.lastIdAnswer))
      } else this.newQuestion.value_type_answer = []
    },
    addVariable() {
      this.lastIdAnswer++
      this.newQuestion.value_type_answer.push(new this.answerVariable(this.lastIdAnswer))
    },
    onFocus(obj, id) {
      obj.focused = true
      if (id) {
        console.log(id)
        let index = this.newQuestion.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) {
          this.newQuestion.value_type_answer[index].focused = true
          console.log(this.newQuestion.value_type_answer[index].focused)
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
    answerVariable(id,) {
      this.id = id
      this.answer = ''
      this.commentary = ''
      this.showComentary = true
      this.focused = false
    },
    onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
    }
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
            transition: all .6s ease-in-out;

            ::v-deep textarea {
              line-height: 20px;
              font-weight: 500;
            }
          }
        }
      }

      .question_main {
        padding-bottom: 7px;

        .question_main_selector {
          display: flex;
          flex-direction: column;
          row-gap: 5px;

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
      //position: absolute;
      //bottom: 0;
      display: flex;
      justify-content: space-between
    }
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
</style>
