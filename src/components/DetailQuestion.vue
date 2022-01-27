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
        >
          <template slot="append">
            <v-icon size="20" class="question_title__name__icon">mdi-lead-pencil</v-icon>
          </template>
        </v-text-field>
        <div class="question_title_help">
        <span class="question_title_help__title">
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
              v-model="question.title"
          ></v-textarea>
        </div>
        <div class="question_title_help">
        <span class="question_title_help__title">
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
              v-model="question.article"
          ></v-textarea>
        </div>
        <div class="question_title_help">
        <span class="question_title_help__title">
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
              v-model="question.purpose_of_question"
          ></v-textarea>
        </div>
      </div>
      <div class="question_main">
        <div class="question_main_selector">
          <span class="question_main_selector__title">
            Тип ответа
          </span>
          <v-autocomplete
              outlined
              dense
              hide-details
              :items="$store.state.listTypesOfQuestions"
              item-text="name"
              item-value="id"
              v-model="question.id_type_answer"
              @change="onSelect()"
          ></v-autocomplete>
        </div>
        <div class="question_main_wrapper" v-if="question.id_type_answer !== null">
          <div
              class="question_main_wrapper__item"
              v-for="{answer, index} in question.value_type_answer"
              :key="index"
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
                append-icon="mdi-menu-right"
                v-model="answer.answer"
            ></v-text-field>
            <div class="divider"></div>
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
            ></v-textarea>
          </div>
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
          <v-chip>
            <v-icon left>
              mdi-close
            </v-icon>
            Эстетические предпочтения
          </v-chip>
          <v-chip>
            <v-icon left>
              mdi-close
            </v-icon>
            Выявление платежеспособности
          </v-chip>
          <v-chip>
            <v-icon left>
              mdi-close
            </v-icon>
            Котельная
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
      title: '',
      article: '',
      purpose_of_question: '',
      id_type_answer: null,
      state_detailed_response: 0,
      state_attachment_response: 0,
      value_type_answer: null,
    },
    id: 1,
  }),
  mounted() {
    this.getTypes()
  },
  watch: {

  },
  methods: {
    getTypes() {
      this.$store.dispatch('setListTypesQuestions')
    },
    onSelect() {
      if (this.id_type_answer === 5) {
        this.value_type_answer = []
        this.value_type_answer.push(new this.answerVariable(this.id))
      }
    },
    answerVariable(id,) {
      this.id = id
      this.answer = ''
      this.commentary = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.question {
  padding: 10px;
  height: 100%;
  .form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    .question_title {
      &__name {
        padding-bottom: 7px;
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
      .question_title_help {
        display: flex;
        flex-direction: column;
        //padding-top: 7px;
        &__title {
          color: black;
          font-weight: 600;
        }
        &__description {
          color: lightgray;
          font-size: 13px;
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
        &__item {
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
        display: flex;
        flex-direction: column;
        row-gap: 10px;
      }
    }
  }
}
::v-deep .v-text-field {
  margin: 0 !important;
}
</style>
