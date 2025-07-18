<template>
  <div class="questions">
    <div class="questions_wrapper universal_list">
      <div
        v-for="(article, index) in $store.state.ArticleModule.listArticles"
        :key="index"
        class="questions_wrapper__item"
      >
        <div
          :class="{ filterShow: show_filter }"
          class="questions_wrapper__item__top"
        >
          <div
            :class="{ filterShow: show_filter }"
            class="questions_wrapper__item__top__title"
          >
            <div
              class="questions_wrapper__item__top__title__icon"
              @click="setVisible(article)"
            >
              <template v-if="article.activity === 0">
                <v-icon class="activity_icon">mdi-eye-off</v-icon>
              </template>

              <template v-else>
                <v-icon class="activity_icon">mdi-eye</v-icon>
              </template>
            </div>
            <span @click="onShowDetailArticle(article)">
              {{ article.name }}
            </span>
            <span class="questions_wrapper__item__top__title__quantity"> </span>
          </div>
          <div class="questions_wrapper__item__top__icons"></div>
        </div>
        <div class="questions_wrapper__item__bottom universal_date">
          <div
            :class="{ filterShow: show_filter }"
            class="questions_wrapper__item__bottom__date"
          >
            {{ article.created_at }}
          </div>
          <div
            :class="{ filterShow: show_filter }"
            class="questions_wrapper__item__bottom__date"
          >
            {{ article.updated_at }}
          </div>
        </div>
      </div>

      <v-alert
        v-if="
          !$store.state.ArticleModule.loadingList &&
          ($store.state.ArticleModule.listArticles === null ||
            !$store.state.ArticleModule.listArticles.length)
        "
        class="err-msg"
        text
        type="error"
      >
        {{ computedErrMsg }}
      </v-alert>
    </div>
    <v-sheet class="footer">
      <div class="footer_input">
        <InputStyled
          :class="{ inputFocused: filterValueFocused }"
          :data="filters.name"
          :is-flat="true"
          :is-solo="true"
          :placeholder="'Поиск в выбранных разделах'"
          @update-input="setName"
          @on-focus="
            () => {
              onFocus();
            }
          "
          @out-focus="
            () => {
              outFocus();
            }
          "
        ></InputStyled>
      </div>
      <div class="footer_filter">
        <v-icon
          :color="!!show_filter ? 'blue' : 'grey'"
          x-large
          @click="show_filter = !show_filter"
        >
          mdi-filter-outline
        </v-icon>
      </div>
    </v-sheet>

    <!-- LOADER -->
    <v-overlay
      :absolute="true"
      :value="
        $store.state.QuestionsModule.loadingList ||
        $store.state.ArticleModule.loadingList
      "
      :z-index="207"
    >
      <v-progress-circular
        v-if="
          $store.state.QuestionsModule.loadingList ||
          $store.state.ArticleModule.loadingList
        "
        :indeterminate="true"
        :size="70"
        color="blue"
        style="margin: auto"
        width="4"
      ></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="show_filter" content-class="bottom_filters">
      <transition appear name="slide-y-reverse-transition">
        <v-sheet v-show="show_filter" class="text-center filter_modal">
          <div class="filter_modal_header">
            <div class="filter_modal_header__close">
              <v-icon color="blue" x-large @click="show_filter = !show_filter">
                mdi-close
              </v-icon>
            </div>
          </div>
          <div class="filter_modal_filters">
            <div class="filter_modal_filters__item">
              <div class="filter_modal_filters__item__title">Активность:</div>
              <div class="filter_modal_filters__item__chips">
                <v-radio-group v-model="filters.activity">
                  <v-radio label="Активен" value="true"></v-radio>
                  <v-radio label="Не активен" value="false"></v-radio>
                  <v-radio :value="null" label="Все"></v-radio>
                </v-radio-group>
              </div>
            </div>
            <div class="filter_modal_filters__item">
              <div class="filter_modal_filters__item__title">
                Выбор разделов:
              </div>
              <div class="filter_modal_filters__item__chips">
                <v-chip-group v-model="filters.tag" column multiple>
                  <v-chip
                    v-for="tag in $store.state.ArticleModule.listGeneralTags"
                    :key="tag.id"
                    :value="tag.code"
                    color="#f2f5f7"
                  >
                    <v-icon
                      v-if="filters.tag.includes(tag.code)"
                      color="grey darken-2"
                      left
                    >
                      mdi-check-bold
                    </v-icon>
                    <v-icon v-else color="grey darken-2" left>
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
import InputStyled from "../components/common/InputStyled";
import Request from "@/services/request";

export default {
  name: "Articles.vue",
  components: { InputStyled },
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
    this.getConfigDate();
    this.getTags();
    this.initializeQuery();
  },
  watch: {
    filters: {
      handler() {
        if (!this.getFromQuery) {
          this.getFilteredArticles();
          this.changeQuery();
        }
      },
      deep: true,
    },
  },
  computed: {
    computedErrMsg() {
      return this.$store.state.ArticleModule.questionNotification
        ? this.$store.state.ArticleModule.questionNotification
        : "Ничего не найдено";
    },
  },
  methods: {
    setVisible(article) {
      article.activity = article.activity === 0 ? 1 : 0;

      this.saveArticle(article);
    },
    setName(value) {
      this.filters.name = value;
    },

    saveArticle(article) {
      this.$store.dispatch("updateArticle", { data: article, isEditor: false });
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
    onShowDetailArticle(article) {
      this.$router.push({
        name: "DetailArticles",
        params: { action: "edit" },
        query: { article_id: article.id },
      });
    },
    getConfigDate() {
      this.$store.dispatch("setListConfigDate");
    },
    getTags() {
      this.$store.dispatch("getGeneralTagsArticle");
    },
    getFilteredArticles() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        const selectQuery = [
          "id",
          "name",
          "code",
          "activity",
          "created_at",
          "updated_at",
        ];
        const query = Request.modifyQuery(this.filters, selectQuery);
        this.$store.dispatch("setFilteredListArticles", query);
      }, 500);
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
        this.getFilteredArticles();
      });
    },
    onFocus() {
      this.filterValueFocused = true;
    },
    outFocus() {
      this.filterValueFocused = false;
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
        align-items: center;
        border-bottom: 2px solid #539ee0;
        transition: all 0.4s ease-in-out;

        &__title {
          color: #539ee0;
          transition: all 0.4s ease-in-out;

          &__quantity {
            color: lightcoral;
            transition: all 0.4s ease-in-out;
          }

          &__icon {
            cursor: pointer;
            transition: all 0.4s ease-in-out;

            &:hover {
              .activity_icon {
                color: lighten(rgba(0, 0, 0, 0.54), 10%);
              }
            }
          }
        }

        &__icons {
          padding-bottom: 2px;
          transition: all 0.4s ease-in-out;
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
</style>
