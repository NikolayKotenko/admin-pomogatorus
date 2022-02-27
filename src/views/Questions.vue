<template>
  <div class="questions">
    <div class="questions_wrapper">
      <div
          class="questions_wrapper__item"
          v-for="(question, index) in $store.state.QuestionsModule.listQuestions"
          :key="index"
      >
        <div class="questions_wrapper__item__top" :class="{filterShow: show_filter}">
          <div class="questions_wrapper__item__top__title" :class="{filterShow: show_filter}">
            <span @click="onShowDetailQuestion(question)">
              {{question.name}}
            </span>
            <span class="questions_wrapper__item__top__title__quantity">
              [3]
            </span>
          </div>
          <div class="questions_wrapper__item__top__icons">
            <v-icon color="grey lighten-1">
              mdi-comment-text
            </v-icon>
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

      <v-alert
          v-if="$store.state.QuestionsModule.listQuestions === null || !$store.state.QuestionsModule.listQuestions.length"
          type="error"
          text
          class="err-msg"
      >
        {{ $store.state.QuestionsModule.questionNotification }}
      </v-alert>
    </div>
    <v-sheet class="footer">
      <div class="footer_input">
        <v-text-field
            solo
            flat
            dense
            hide-details
            placeholder="Поиск в выбранных разделах"
            v-model="filters.name"
            :class="{inputFocused: filterValueFocused}"
            @focus="onFocus()"
            @focusout="outFocus()"
        ></v-text-field>
      </div>
      <div class="footer_filter">
        <v-icon x-large :color="!!show_filter ? 'blue' : 'grey'" @click="show_filter = !show_filter">
          mdi-filter-outline
        </v-icon>
      </div>
    </v-sheet>


    <!-- LOADER -->
    <v-overlay
        :z-index="201"
        :absolute="true"
        :value="$store.state.QuestionsModule.loadingList"
    >
      <v-progress-circular
          style="margin: auto"
          width="4"
          :size="70"
          color="blue"
          :indeterminate="true"
          v-if="$store.state.QuestionsModule.loadingList"
      ></v-progress-circular>
    </v-overlay>

    <v-sheet
        v-model="show_filter"
        class="bottom_filters"
    >
      <transition appear name="slide-y-reverse-transition">
      <v-sheet
          v-show="show_filter"
          class="text-center filter_modal"
          height="80vh"
      >
        <div class="filter_modal_header">
          <div class="filter_modal_header__close">
            <v-icon x-large @click="show_filter = !show_filter" color="blue">
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
              <v-chip-group
                  column
                  multiple
                  v-model="filters.tag"
              >
                <v-chip
                    color="#f2f5f7"
                    v-for="tag in $store.state.QuestionsModule.listGeneralTags"
                    :key="tag.id"
                    :value="tag.code"
                >
                  <v-icon left color="grey darken-2" v-if="filters.tag.includes(tag.code)">
                    mdi-check-bold
                  </v-icon>
                  <v-icon left color="grey darken-2" v-else>
                    mdi-close-thick
                  </v-icon>
                  {{ tag.name }}
                </v-chip>
              </v-chip-group>
            </div>
          </div>
          <div class="filter_modal_filters__item">
            <div class="filter_modal_filters__item__title">
              Дата последнего редактирования:
            </div>
            <div class="filter_modal_filters__item__chips">
              <v-radio-group
                  v-model="filters.updated_at"
              >
                <v-radio
                    v-for="(variable, index) in $store.state.QuestionsModule.listConfigDate"
                    :key="index"
                    :label="variable.text"
                    :value="variable.value"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
      </v-sheet>
      </transition>
    </v-sheet>
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
    filterValueFocused: false,
    filters: {
      name: null,
      updated_at: null,
      tag: [],
    },
    queryObject: {},
    debounceTimeout: null,
    getFromQuery: false
  }),
  mounted() {
    this.getQuestions()
    this.getConfigDate()
    this.getTags()
    this.initializeQuery()
  },
  computed: {

  },
  watch: {
    filters: {
      handler() {
        if (!this.getFromQuery) {
          this.getFilteredQuestions()
          this.changeQuery()
        }
      },
      deep: true
    }
  },
  methods: {
    getQuestions() {
      this.$store.dispatch('setListQuestions')
    },
    getConfigDate() {
      this.$store.dispatch('setListConfigDate')
    },
    getTags() {
      this.$store.dispatch('getGeneralTags')
    },
    getFilteredQuestions() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.dispatch('setFilteredListQuestions', this.filters)
      }, 500);
    },
    onShowDetailQuestion(question) {
      this.$router.push({
        name: 'DetailQuestion',
        params: {action: 'edit'},
        query: {question_id: question.id}
      })
    },
    initializeQuery() {
      this.getFromQuery = true
      if (Object.keys(this.$route.query).length) {
        for (let key in this.filters) {
          if (Object.keys(this.$route.query).includes(key) && this.$route.query[key] !== null) {
            if (key === 'tag') {
              if (Array.isArray(this.$route.query[key])) {
                // console.log()
                this.filters[key] = []
                this.filters[key].push(...this.$route.query[key])
              } else {
                this.filters[key] = []
                this.filters[key].push(this.$route.query[key])
              }
            } else {
              if (key === 'updated_at') {
                this.filters[key] = parseInt(this.$route.query[key])
              } else {
                this.filters[key] = this.$route.query[key]
              }
            }
          }
        }
      }
      setTimeout(() => {
        this.getFromQuery = false
        this.getFilteredQuestions()
      })
    },
    changeQuery() {
      for (let key in this.filters) {
        if (Array.isArray(this.filters[key])) {
          if (this.filters[key].length) {
            this.queryObject[key] = this.filters[key]
          } else delete this.queryObject[key]
        } else {
          if (this.filters[key]) {
            this.queryObject[key] = this.filters[key]
          } else delete this.queryObject[key]
        }
      }
      this.$router.push({
        path: this.$route.path,
        query: {...this.queryObject}
      })
    },
    onFocus() {
      this.filterValueFocused = true
    },
    outFocus() {
      this.filterValueFocused = false
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
        transition: all .4s ease-in-out;
        &__title {
          color: #539ee0;
          transition: all .4s ease-in-out;
          &__quantity {
            color: lightcoral;
            transition: all .4s ease-in-out;
          }
        }
        &__icons {
          padding-bottom: 2px;
          transition: all .4s ease-in-out;
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
    z-index: 207;
    .footer_input {
      flex: 1;
      width: 100%;
      margin-left: 10px;
      border: 2px solid lightgray;
      border-radius: 5px;
      ::v-deep .v-text-field input {
        font-weight: 500;
        color: darkgray;
        transition: color .5s ease-in-out;
      }
    }
    .inputFocused {
      ::v-deep input {
        color: #202020 !important;
      }
    }
  }
}
.bottom_filters {
  ::v-deep .v-sheet {
    position: absolute;
    bottom: 0;
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
  z-index: 206;
  overflow: hidden;
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
    padding: 0 10px 70px 10px;
    overflow: scroll;
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
      &__chips {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 10px 20px;

        ::v-deep label {
          font-weight: 500;
          color: #242424;
          opacity: 0.9;
        }
        ::v-deep .v-chip .v-chip__content {
          min-width: 100% !important;
        }
        ::v-deep .v-chip.v-size--default {
          width: 100%;
          border: 2px solid lightgray !important;
        }
        ::v-deep .v-chip-group--column .v-slide-group__content {
          row-gap: 5px;
        }
      }
    }
  }
}
.filterShow {
  color: lightgray !important;
  opacity: 0.8;
  border-color: rgba(211, 211, 211, 0.5) !important;
}

::v-deep .v-dialog__content {
  z-index: 206 !important;
}

//::v-deep .slide-y-reverse-transition-enter-active {
//  transition: opacity .6s !important;
//}
//::v-deep .slide-y-reverse-transition-leave-active {
//  transition: opacity .6s !important;
//}
</style>
