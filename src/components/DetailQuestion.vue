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
          ></v-autocomplete>
        </div>
        <div class="question_main_wrapper" v-show="false">
          <div class="question_main_wrapper__item">
            <v-text-field></v-text-field>
            <div class="divider"></div>
            <v-textarea></v-textarea>
          </div>
        </div>
      </div>
      <div class="question_settings">
        <v-checkbox
            hide-details
            class="question_settings__checkbox"
            label="Допускается развернутый ответ"
        ></v-checkbox>
        <v-checkbox
            hide-details
            class="question_settings__checkbox"
            label="Наличие вложения в ответе"
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

  }),
  mounted() {
    this.getTypes()
  },
  methods: {
    getTypes() {
      this.$store.dispatch('setListTypesQuestions')
    },
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
    row-gap: 10px;
    .question_title {
      &__name {

      }
      .question_title_help {
        display: flex;
        flex-direction: column;
        padding-top: 7px;
        &__title {

        }
        &__description {

        }
      }
    }
    .question_main {

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
