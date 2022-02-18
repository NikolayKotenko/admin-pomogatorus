<template>
  <div class="question">
    <v-form
        class="form"
        ref="form"
    >
      <div class="question_content">
        <div class="question_title">
          <v-text-field
              class="question_title__name"
              dense
              hide-details
              placeholder="Введите наименование"
              required
              v-model="getNewQuestion.name.value"
              solo
              flat
              @focus="onFocus(getNewQuestion.name)"
              @focusout="outFocus(getNewQuestion.name)"
          >
            <template slot="append">
              <v-icon size="20" class="question_title__name__icon" :color="getNewQuestion.name.focused ? 'primary' : ''">
                mdi-lead-pencil
              </v-icon>
            </template>
          </v-text-field>
          <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: getNewQuestion.title.focused}">
          Подсказка
        </span>
            <v-textarea
                class="question_title_help__description"
                :class="{inputFocused: getNewQuestion.title.focused}"
                placeholder="Введите подсказку для вопроса"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="getNewQuestion.title.value"
                @focus="onFocus(getNewQuestion.title)"
                @focusout="outFocus(getNewQuestion.title)"
            ></v-textarea>
          </div>
          <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: getNewQuestion.article.focused}">
          Разъясняющий текст
        </span>
            <v-textarea
                class="question_title_help__description"
                :class="{inputFocused: getNewQuestion.article.focused}"
                placeholder="Введите разъясняющий текст"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="getNewQuestion.article.value"
                @focus="onFocus(getNewQuestion.article)"
                @focusout="outFocus(getNewQuestion.article)"
            ></v-textarea>
          </div>
          <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: getNewQuestion.purpose_of_question.focused}">
          Цель вопроса
        </span>
            <v-textarea
                class="question_title_help__description"
                :class="{inputFocused: getNewQuestion.purpose_of_question.focused}"
                placeholder="Введите цель вопроса"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="getNewQuestion.purpose_of_question.value"
                @focus="onFocus(getNewQuestion.purpose_of_question)"
                @focusout="outFocus(getNewQuestion.purpose_of_question)"
            ></v-textarea>
          </div>
        </div>
        <div class="question_main">
          <div class="question_main_selector">
          <span class="question_main_selector__title" :class="{focused: getNewQuestion.id_type_answer.focused}">
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
                v-model="getNewQuestion.id_type_answer.value"
                @change="onSelect()"
                @focus="onFocus(getNewQuestion.id_type_answer)"
                @focusout="outFocus(getNewQuestion.id_type_answer)"
            ></v-autocomplete>
          </div>
          <div class="question_main_wrapper" v-if="getNewQuestion.id_type_answer.value !== null">
            <transition-group name="list">
              <div
                  class="question_main_wrapper__item"
                  v-for="answer in getNewQuestion.value_type_answer"
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
                    @focus="onFocus(getNewQuestion.id_type_answer, answer.id);"
                    @focusout="outFocus(getNewQuestion.id_type_answer, answer.id)"
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
                    @focus="onFocus(getNewQuestion.id_type_answer, answer.id)"
                    @focusout="outFocus(getNewQuestion.id_type_answer, answer.id)"
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
              v-model="getNewQuestion.state_detailed_response"
          ></v-checkbox>
          <v-checkbox
              hide-details
              class="question_settings__checkbox"
              label="Наличие вложения в ответе"
              v-model="getNewQuestion.state_attachment_response"
          ></v-checkbox>
        </div>
        <!-- Tags Component -->
        <question-tags/>
      </div>
      <div class="question_footer">
        <v-btn
            color="red darken-1"
            text
        >
          Очистить
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            v-if="$route.params.action === 'create'"
        >
          Создать
        </v-btn>
      </div>
    </v-form>

    <!--  MODALS  -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import QuestionTags from "./QuestionTags";

export default {
  name: "CreateQuestion",
  components: {QuestionTags},
  data: () => ({
    lastIdAnswer: 1,
  }),
  mounted() {
    this.initializeQuery()
    this.getTypes()
  },
  watch: {
    '$store.state.QuestionsModule.newQuestion.value_type_answer': {
      // eslint-disable-next-line no-unused-vars
      handler(oldValue, newValue) {
        if (Array.isArray(this.$store.state.QuestionsModule.newQuestion.value_type_answer)) {
          if (this.$store.state.QuestionsModule.newQuestion.value_type_answer[this.$store.state.QuestionsModule.newQuestion.value_type_answer.length - 1]?.answer) {
            this.addVariable()
          } else if (
              this.$store.state.QuestionsModule.newQuestion.value_type_answer[this.$store.state.QuestionsModule.newQuestion.value_type_answer.length - 2]?.answer === '' &&
              this.$store.state.QuestionsModule.newQuestion.value_type_answer[this.$store.state.QuestionsModule.newQuestion.value_type_answer.length - 2]?.commentary === ''
          ) {
            this.$store.state.QuestionsModule.newQuestion.value_type_answer.splice(this.$store.state.QuestionsModule.newQuestion.value_type_answer.length - 1, 1)
          }
        }
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
        'getNewQuestion',
        'getListTypesOfQuestions'
    ]),
  },
  methods: {
    initializeQuery() {
      if (Object.keys(this.$route.query).length && Object.keys(this.$route.query).includes('id_question')) {
        this.$store.dispatch('getDetailQuestion', this.$route.query.id_question)
      }
    },
    getTypes() {
      this.$store.dispatch('setListTypesQuestions')
    },
    onSelect() {
      if (this.$store.state.QuestionsModule.newQuestion.id_type_answer.value === 5) {
        this.$store.state.QuestionsModule.newQuestion.value_type_answer = []
        this.$store.state.QuestionsModule.newQuestion.value_type_answer.push(new this.answerVariable(this.lastIdAnswer))
      } else this.$store.state.QuestionsModule.newQuestion.value_type_answer = []
    },
    addVariable() {
      this.lastIdAnswer++
      this.$store.state.QuestionsModule.newQuestion.value_type_answer.push(new this.answerVariable(this.lastIdAnswer))
    },
    onFocus(obj, id) {
      obj.focused = true
      if (id) {
        console.log(id)
        let index = this.$store.state.QuestionsModule.newQuestion.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) {
          this.$store.state.QuestionsModule.newQuestion.value_type_answer[index].focused = true
          console.log(this.$store.state.QuestionsModule.newQuestion.value_type_answer[index].focused)
        }
      }
    },
    outFocus(obj, id) {
      obj.focused = false
      if (id) {
        let index = this.$store.state.QuestionsModule.newQuestion.value_type_answer.findIndex(elem => {
          return elem.id === id
        })
        if (index !== -1) this.$store.state.QuestionsModule.newQuestion.value_type_answer[index].focused = false
      }
    },
    answerVariable(id,) {
      this.id = id
      this.answer = ''
      this.commentary = ''
      this.showComentary = true
      this.focused = false
    },
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
