<template>
  <div class="question">
    <v-form
        class="form"
        ref="form"
    >
      <div class="question_title">
        <v-text-field
            class="question_title__name"
            dense
            hide-details
            placeholder="Введите наименование"
            required
            v-model="question.name"
            solo
            flat
        >
          <template slot="append">
            <v-icon size="20" class="question_title__name__icon">mdi-lead-pencil</v-icon>
          </template>
        </v-text-field>
        <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: question.title.focused}">
          Подсказка
        </span>
          <v-textarea
              class="question_title_help__description"
              placeholder="Введите подсказку для вопроса"
              auto-grow
              rows="1"
              dense
              hide-details
              flat
              solo
              v-model="question.title.value"
              @focus="onFocus(question.title)"
              @focusout="outFocus(question.title)"
          ></v-textarea>
        </div>
        <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: question.article.focused}">
          Разъясняющий текст
        </span>
          <v-textarea
              class="question_title_help__description"
              placeholder="Введите разъясняющий текст"
              auto-grow
              rows="1"
              dense
              hide-details
              flat
              solo
              v-model="question.article.value"
              @focus="onFocus(question.article)"
              @focusout="outFocus(question.article)"
          ></v-textarea>
        </div>
        <div class="question_title_help">
        <span class="question_title_help__title" :class="{focused: question.purpose_of_question.focused}">
          Цель вопроса
        </span>
          <v-textarea
              class="question_title_help__description"
              placeholder="Введите цель вопроса"
              auto-grow
              rows="1"
              dense
              hide-details
              flat
              solo
              v-model="question.purpose_of_question.value"
              @focus="onFocus(question.purpose_of_question)"
              @focusout="outFocus(question.purpose_of_question)"
          ></v-textarea>
        </div>
      </div>
      <div class="question_main">
        <div class="question_main_selector">
          <span class="question_main_selector__title" :class="{focused: question.id_type_answer.focused}">
            Тип ответа
          </span>
          <v-autocomplete
              outlined
              dense
              hide-details
              placeholder="Выберите тип"
              :items="$store.state.listTypesOfQuestions"
              item-text="name"
              item-value="id"
              v-model="question.id_type_answer.value"
              @change="onSelect()"
              @focus="onFocus(question.id_type_answer)"
              @focusout="outFocus(question.id_type_answer)"
          ></v-autocomplete>
        </div>
        <div class="question_main_wrapper" v-if="question.id_type_answer.value !== null">
          <transition-group name="list">
            <div
                class="question_main_wrapper__item"
                v-for="answer in question.value_type_answer"
                :key="answer.id"
            >
              <v-text-field
                  class="question_main_wrapper__item__value"
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
                  @focus="onFocus(question.id_type_answer)"
                  @focusout="outFocus(question.id_type_answer)"
              >
              </v-text-field>
              <div class="divider" v-if="answer.showComentary"></div>
              <v-textarea
                  class="question_main_wrapper__item__description"
                  placeholder="Введите примечание"
                  auto-grow
                  rows="1"
                  dense
                  hide-details
                  flat
                  solo
                  v-model="answer.commentary"
                  v-if="answer.showComentary"
                  @focus="onFocus(question.id_type_answer)"
                  @focusout="outFocus(question.id_type_answer)"
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
            v-model="question.state_detailed_response"
        ></v-checkbox>
        <v-checkbox
            hide-details
            class="question_settings__checkbox"
            label="Наличие вложения в ответе"
            v-model="question.state_attachment_response"
        ></v-checkbox>
      </div>
      <div class="question_tags">
      <span class="question_tags__title">
        Разделы
      </span>
        <div class="question_tags__wrapper">
          <v-chip
              class="question_tags__wrapper__chip"
              v-for="item in question.tags"
              :key="item.id"
          >
            <v-icon left @click="removeTag(item)">
              mdi-close
            </v-icon>
            {{ item.name }}
          </v-chip>
        </div>
        <div class="question_tags__bottom">
          <v-chip color="green lighten-1" text-color="white">
            <v-icon left color="white">
              mdi-plus
            </v-icon>
            Новый тег
          </v-chip>
        </div>
      </div>
      <div class="question_footer">
<!--        <v-btn>-->
<!--          Создать-->
<!--        </v-btn>-->
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "CreateQuestion",
  data: () => ({
    question: {
      name: '',
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
      tags: [
        {
          id: 1,
          name: 'Эстетические предпочтения'
        },
        {
          id: 2,
          name: 'Выявление платежеспособности'
        },
        {
          id: 3,
          name: 'Котельная'
        },
      ],
    },
    id: 1,
  }),
  mounted() {
    this.getTypes()
  },
  watch: {
    'question.value_type_answer': {
      // eslint-disable-next-line no-unused-vars
      handler(oldValue, newValue) {
        if (Array.isArray(this.question.value_type_answer)) {
          if (this.question.value_type_answer[this.question.value_type_answer.length-1]?.answer) {
            this.addVariable()
          } else if (this.question.value_type_answer[this.question.value_type_answer.length-2]?.answer === '') {
            this.question.value_type_answer.splice(this.question.value_type_answer.length-1, 1)
          }
        }
      },
      deep: true
    },
  },
  methods: {
    getTypes() {
      this.$store.dispatch('setListTypesQuestions')
    },
    onSelect() {
      if (this.question.id_type_answer.value === 5) {
        this.question.value_type_answer = []
        this.question.value_type_answer.push(new this.answerVariable(this.id))
      } else this.question.value_type_answer = []
    },
    addVariable() {
      this.id++
      this.question.value_type_answer.push(new this.answerVariable(this.id))
    },
    onFocus(obj) {
      obj.focused = true
    },
    outFocus(obj) {
      obj.focused = false
    },
    removeTag(item) {
      let index = this.question.tags.findIndex(elem => {
        return elem.id === item.id
      })
      if (index !== -1) this.question.tags.splice(index, 1)
    },

    answerVariable(id,) {
      this.id = id
      this.answer = ''
      this.commentary = ''
      this.showComentary = true
    }
  }
}
</script>

<style lang="scss" scoped>
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
          //background: #f9f9f9 !important;
          //transition: background 0.25s, border-color 0.25s, color 0.25s;
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
          }
          ::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
            padding: 0 6px!important;
          }
          .divider {
            border-bottom: 1px dashed;
            width: 15%;
            margin-left: 6px;
          }
          &__description {
            font-size: 14px;
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
    .question_tags {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      &__title {
        color: #7e8d9a;
        font-weight: 600;
      }
      &__wrapper {
        &__chip {
          margin-bottom: 10px;
        }
        &__chip:last-child {
          margin-bottom: 0 !important;
        }
      }
    }
  }
}
::v-deep .v-text-field {
  margin: 0 !important;
}
.focused {
  color: #f7c325 !important;
}
</style>
