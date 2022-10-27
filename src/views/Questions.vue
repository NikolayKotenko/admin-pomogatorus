<template>
  <div class="questions">
    <div class="questions_wrapper universal_list">
      <div
        class="questions_wrapper__item"
        v-for="(question, index) in $store.state.QuestionsModule.listQuestions"
        :key="index"
      >
        <div class="questions_wrapper__item__top" :class="{filterShow: show_filter}">
          <div class="questions_wrapper__item__top__title" :class="{filterShow: show_filter}">
            <v-icon class="activity_icon" v-show="question.activity === 0">mdi-eye-off</v-icon>
            <span @click="onShowDetailQuestion(question)">
              {{ question.name }}
            </span>
            <span class="questions_wrapper__item__top__title__quantity">
              [{{ computedAnswersCount(question) }}]
            </span>
          </div>
          <div class="questions_wrapper__item__top__icons">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="grey lighten-1"
                  v-if="question.title"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-comment-text
                </v-icon>
              </template>
              <span>Заполнено поле комментарий</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="grey lighten-1"
                  v-if="question.state_detailed_response"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-pencil-box-outline
                </v-icon>
              </template>
              <span>Возможность дать развернутый ответ</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="grey lighten-1"
                  style="transform: rotate(45deg)"
                  v-if="question.state_attachment_response"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-paperclip
                </v-icon>
              </template>
              <span>Возможность осуществлять вложение</span>
            </v-tooltip>
          </div>
        </div>
        <div class="questions_wrapper__item__bottom universal_date">
          <div class="questions_wrapper__item__bottom__date" :class="{filterShow: show_filter}">
            {{question.created_at}}
          </div>
          <div
            class="questions_wrapper__item__bottom__date"
            :class="{ filterShow: show_filter }"
          >
            {{ question.updated_at }}
          </div>
        </div>
      </div>

      <v-alert
        v-if="
          !$store.state.QuestionsModule.loadingList &&
          ($store.state.QuestionsModule.listQuestions === null ||
            !$store.state.QuestionsModule.listQuestions.length)
        "
        type="error"
        text
        class="err-msg"
      >
        {{ computedErrMsg }}
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
          :class="{ inputFocused: filterValueFocused }"
          @focus="onFocus()"
          @focusout="outFocus()"
        ></v-text-field>
      </div>
      <div class="footer_filter">
        <v-icon
          x-large
          :color="!!show_filter ? 'blue' : 'grey'"
          @click="show_filter = !show_filter"
        >
          mdi-filter-outline
        </v-icon>
      </div>
    </v-sheet>

    <!-- LOADER -->
    <v-overlay
      :z-index="207"
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

    <v-dialog
        v-model="show_filter"
        content-class="bottom_filters"
    >
      <transition appear name="slide-y-reverse-transition">
        <v-sheet
          v-show="show_filter"
          class="text-center filter_modal"
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
              Активность:
            </div>
            <div class="filter_modal_filters__item__chips">
              <v-radio-group
                  v-model="filters.activity"
              >
                <v-radio
                    label="Активен"
                    value="true"
                ></v-radio>
                <v-radio
                    label="Не активен"
                    value="false"
                ></v-radio>
                <v-radio
                    label="Все"
                    :value="null"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
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
                    <v-icon
                      left
                      color="grey darken-2"
                      v-if="filters.tag.includes(tag.code)"
                    >
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
                <v-radio-group v-model="filters.updated_at">
                  <v-radio
                    v-for="(variable, index) in $store.state.QuestionsModule
                      .listConfigDate"
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
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Questions",
  data: () => ({
    show_filter: false,
    filterValueFocused: false,
    filters: {
      name: null,
      updated_at: null,
      tag: [],
      activity: null,
    },
    queryObject: {},
    debounceTimeout: null,
    getFromQuery: false,
  }),
  mounted() {
    // this.getQuestions()
    this.getConfigDate();
    this.getTags();
    this.initializeQuery();
  },
  computed: {
    computedErrMsg() {
      return this.$store.state.QuestionsModule.questionNotification
        ? this.$store.state.QuestionsModule.questionNotification
        : "Ничего не найдено";
    },
  },
  watch: {
    filters: {
      handler() {
        if (!this.getFromQuery) {
          this.getFilteredQuestions();
          this.changeQuery();
        }
      },
      deep: true,
    },
  },
  methods: {
    getQuestions() {
      this.$store.dispatch("setListQuestions");
    },
    getConfigDate() {
      this.$store.dispatch("setListConfigDate");
    },
    getTags() {
      this.$store.dispatch("getGeneralTagsQuestion");
    },
    getFilteredQuestions() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.dispatch("setFilteredListQuestions", this.filters);
      }, 500);
    },
    onShowDetailQuestion(question) {
      this.$router.push({
        name: "DetailQuestion",
        params: { action: "edit" },
        query: { question_id: question.id },
      });
    },
    initializeQuery() {
      this.getFromQuery = true;
      if (Object.keys(this.$route.query).length) {
        for (let key in this.filters) {
          if (
            Object.keys(this.$route.query).includes(key) &&
            this.$route.query[key] !== null
          ) {
            if (key === "tag") {
              if (Array.isArray(this.$route.query[key])) {
                this.filters[key] = [];
                this.filters[key].push(...this.$route.query[key]);
              } else {
                this.filters[key] = [];
                this.filters[key].push(this.$route.query[key]);
              }
            } else {
              if (key === "updated_at") {
                this.filters[key] = parseInt(this.$route.query[key]);
              } else {
                this.filters[key] = this.$route.query[key];
              }
            }
          }
        }
      }
      setTimeout(() => {
        this.getFromQuery = false;
        this.getFilteredQuestions();
      });
    },
    changeQuery() {
      for (let key in this.filters) {
        if (Array.isArray(this.filters[key])) {
          if (this.filters[key].length) {
            this.queryObject[key] = this.filters[key];
          } else delete this.queryObject[key];
        } else {
          if (this.filters[key]) {
            this.queryObject[key] = this.filters[key];
          } else delete this.queryObject[key];
        }
      }
      this.$router.push({
        path: this.$route.path,
        query: { ...this.queryObject },
      });
    },
    onFocus() {
      this.filterValueFocused = true;
    },
    outFocus() {
      this.filterValueFocused = false;
    },
    computedAnswersCount(question) {
      if (question.value_type_answer !== null) {
        let result = JSON.parse(JSON.parse(question.value_type_answer));
        if (Array.isArray(result)) {
          if (result.length) {
            return result.length;
          } else {
            return 1;
          }
        } else {
          if (JSON.parse(question.value_type_answer) !== null) {
            return JSON.parse(question.value_type_answer).length;
          } else return 0;
        }
      } else return 0;
    },
  },
};
</script>

<style lang="scss">
@import "src/assets/styles/main";
</style>

<style lang="scss" scoped>
.questions {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;
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
        border-bottom: 2px solid #539ee0;
        transition: all 0.4s ease-in-out;
        align-items: flex-start;
        &__title {
          color: #539ee0;
          transition: all 0.4s ease-in-out;
          &__quantity {
            color: lightcoral;
            transition: all 0.4s ease-in-out;
          }
        }
        &__icons {
          //padding-bottom: 2px;
          transition: all 0.4s ease-in-out;
          display: flex;
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
    position: sticky;
    bottom: 0;
    min-width: 100%;
    .footer_input {
      flex: 1;
      width: 100%;
      margin-left: 10px;
      border: 2px solid lightgray;
      border-radius: 5px;
      ::v-deep .v-text-field input {
        font-weight: 500;
        color: darkgray;
        transition: color 0.5s ease-in-out;
      }
    }
    .inputFocused {
      ::v-deep input {
        color: #202020 !important;
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
