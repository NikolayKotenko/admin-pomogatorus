<template>
  <div class="questions">
    <div class="questions_wrapper">
      <div
          class="questions_wrapper__item"
          v-for="(question, index) in test"
          :key="index"
      >
        <div class="questions_wrapper__item__top" :class="{filterShow: show_filter}">
          <div class="questions_wrapper__item__top__title" :class="{filterShow: show_filter}">
            <span>
              {{question.name}}
            </span>
            <span>

            </span>
          </div>
          <div class="questions_wrapper__item__top__icons">

          </div>
        </div>
        <div class="questions_wrapper__item__bottom">
          <div class="questions_wrapper__item__bottom__date" :class="{filterShow: show_filter}">
            {{question.updated_at}}
          </div>
          <div class="questions_wrapper__item__bottom__code" :class="{filterShow: show_filter}">
            {{question.name_param_env}}
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer_input">
        <input>
      </div>
      <div class="footer_filter">
        <v-icon x-large color="grey" @click="show_filter = !show_filter">
          mdi-filter-outline
        </v-icon>
      </div>
    </div>
    <v-bottom-sheet
        v-model="show_filter"
        overlay-opacity="0.1"
        overlay-color="black"
    >
      <v-sheet
          class="text-center filter_modal"
          height="80vh"
      >
        <div class="filter_modal_header">
          <div class="filter_modal_header__close">
            <v-icon x-large @click="show_filter = !show_filter">
              mdi-close
            </v-icon>
          </div>
        </div>
        <div class="filter_modal_filters">
          <div class="filter_modal_filters__item">
            <div class="filter_modal_filters__item__title">
              Выбор разделов:
            </div>
            <div class="filter_modal_filters__item__chips">
              <v-chip-group>

              </v-chip-group>
            </div>
          </div>
        </div>
        <div class="filter_modal_footer">
          <div class="filter_modal_footer_input">
            <input>
          </div>
          <div class="filter_modal_footer_filter">
            <v-icon x-large color="grey" @click="show_filter = !show_filter">
              mdi-filter-outline
            </v-icon>
          </div>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: "Questions",
  data: () => ({
    test: [
      {
        "id": 1,
        "name_param_env": "kotly_da_ili_da",
        "name": "xingxiang",
        "purpose_of_question": "Узнать чего нибудь",
        "title": null,
        "article": null,
        "id_type_answer": 1,
        "value_type_answer": "\"{'sdf': 'sdf'}\"",
        "state_detailed_response": 0,
        "state_attachment_response": 0,
        "created_at": "2022-01-23T16:58:33.000000Z",
        "updated_at": "2022-01-23T16:58:33.000000Z",
        "typeanswer": {
          "id": 1,
          "code": "stroka",
          "name": "Строка ",
          "created_at": null,
          "updated_at": null
        }
      }
    ],
    show_filter: false,
  }),
  mounted() {
    this.getQuestions()
  },
  computed: {

  },
  methods: {
    getQuestions() {
      // this.$store.dispatch('setListQuestions')
    }
  },
}
</script>

<style lang="scss" scoped>
.questions {
  display: flex;
  flex-direction: column;
  height: 100%;
  .questions_wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px 10px;
    &__item {
      display: flex;
      flex-direction: column;
      width: 100%;
      &__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #539ee0;
        &__title {
          color: #539ee0;
        }
      }
      &__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        padding-top: 2px;
        &__date {
          color: #7c8c99;
        }
        &__code {
          color: #cad5de;
        }
      }
    }
  }
  .footer {
    border-top: 3px solid darkgray;
    padding: 10px 20px;
    height: 70px;
    background: #e3e6e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 10px;
    .footer_input {
      flex: 1;
      width: 100%;
      padding-left: 10px;
      input {
        border: 2px solid lightgray;
        width: 100%;
        height: 30px;
        background: #FFFFFF;
      }
    }
  }
}
.filter_modal {
  display: flex;
  flex-direction: column;
  border-top: 3px solid darkgray;
  background: #e3e6e9;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .filter_modal_header {
    position: relative;
    height: 35px;
    width: 100%;
    &__close {
      position: absolute;
      right: 5px;
    }
  }
  .filter_modal_filters {
    flex: 1;
    height: 100%;
    width: 100%;
    padding: 0 10px 5px 10px;
    &__item {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: flex-start;
      &__title {
        display: flex;
        color: #539ee0;
        border-bottom: 2px solid #539ee0;
        padding-bottom: 5px;
        width: 100%;
        font-weight: 600;
      }
    }
  }
  .filter_modal_footer {
    width: 100%;
    display: flex;
    height: 70px;
    border-top: 3px solid darkgray;
    column-gap: 10px;
    padding: 10px 20px;
    justify-content: space-between;
    align-items: center;
    .filter_modal_footer_input {
      flex: 1;
      width: 100%;
      padding-left: 10px;
      input {
        border: 2px solid lightgray;
        width: 100%;
        height: 30px;
        background: #FFFFFF;
      }
    }
  }
}
.filterShow {
  color: lightgray !important;
  opacity: 0.8;
  border-color: rgba(211, 211, 211, 0.5) !important;
  //border-color: lightgray !important;
}
</style>
