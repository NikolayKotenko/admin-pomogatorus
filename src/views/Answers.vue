<template>
  <div class="table-container">

<!--    <div class="table-container-buttons">-->
<!--      <v-btn-->
<!--        color="blue lighten-1"-->
<!--        class="text-capitalize"-->
<!--        :small="isMobile"-->
<!--        :loading="$store.state.AnswersModule.loadingList"-->
<!--        :disabled="$store.state.AnswersModule.loadingList"-->
<!--      >-->
<!--        <v-icon small color="white">mdi-alert-circle-outline</v-icon>-->
<!--        <span class="table-container-buttons__text"-->
<!--          >Место для функциональных кнопок</span-->
<!--        >-->
<!--      </v-btn>-->
<!--      <v-btn-->
<!--        color="green lighten-1"-->
<!--        class="text-capitalize"-->
<!--        :small="isMobile"-->
<!--        :loading="$store.state.AnswersModule.loadingList"-->
<!--        :disabled="$store.state.AnswersModule.loadingList"-->
<!--      >-->
<!--        <v-icon small color="white">mdi-plus-circle-outline</v-icon>-->
<!--        <span class="table-container-buttons__text">Кнопка 1</span>-->
<!--      </v-btn>-->
<!--      <v-btn-->
<!--        color="error"-->
<!--        class="text-capitalize"-->
<!--        :small="isMobile"-->
<!--        :loading="$store.state.AnswersModule.loadingList"-->
<!--        :disabled="$store.state.AnswersModule.loadingList"-->
<!--      >-->
<!--        <v-icon small color="white">mdi-trash-can-outline</v-icon>-->
<!--        <span class="table-container-buttons__text">Кнопка 2</span>-->
<!--      </v-btn>-->
<!--    </div>-->

    <div class="table-container-wrapper">
      <div class="table-container-wrapper-header header-column">
        <v-autocomplete
          class="answer_list__selector"
          dense
          hide-details
          placeholder="Начните ввод"
          :loading="$store.state.AnswersModule.loadingList"
          :disabled="$store.state.AnswersModule.loadingList"
          prepend-inner-icon="mdi-magnify"
          hide-no-data
          label="Поиск..."
          :search-input.sync="search"
          @update:search-input="getValues()"
          :items="itemsArray"
          item-text="text"
          item-value="query"
          return-object
          clearable
          @change="getItems()"
          v-model="filterQuery"
          no-filter
        >
          <template v-slot:selection="data">
            <v-chip v-bind="data.attrs" :input-value="data.selected" small>
              {{ data.item.text }} - {{ data.item.category }}
            </v-chip>
          </template>
          <template v-slot:item="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-item-content v-text="data.item"></v-list-item-content>
            </template>
            <template v-else>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.text"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="data.item.category"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="answer_list__date"
              v-model="date"
              placeholder="Выберите дату"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            scrollable
            locale="ru-RU"
            first-day-of-week="1"
            :max="maxDate"
            range
          >
            <v-btn text color="red darken-1" @click="modal = false">
              Отмена
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="
                date = null;
                $refs.dialog.save(date);
                getItems();
              "
            >
              Очистить
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="
                $refs.dialog.save(date);
                getItems();
              "
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </div>
      <div class="table_list">
        <AnswersList
          @showModalAnswer="showModalAnswer"
          @sortItems="sortItems"
        />
      </div>
      <div class="table-container-wrapper-footer">
<!--        <div class="table-container-wrapper-footer__counter">-->
<!--          &lt;!&ndash;          <Selector/>&ndash;&gt;-->
<!--          <span-->
<!--            >Показано от {{ $store.state.AnswersModule.listAnswers.length }} до-->
<!--            {{ $store.state.AnswersModule.listAnswers.length }} из-->
<!--            {{ $store.state.AnswersModule.listAnswers.length }} записей</span-->
<!--          >-->
<!--        </div>-->
        <!--        <div class="table-container-wrapper-footer__page">
          <v-btn
              elevation="0"
              class="text-capitalize"
              :small="isMobile"
              :disabled="$store.state.AnswersModule.loadingList"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
            <span>Предыдущая</span>
          </v-btn>
          <v-btn
              elevation="0"
              class="text-capitalize"
              :small="isMobile"
              :disabled="$store.state.AnswersModule.loadingList"
          >
            {{1}}
          </v-btn>
          <v-btn
              elevation="0"
              class="text-capitalize"
              :small="isMobile"
              :disabled="$store.state.AnswersModule.loadingList"
          >
            <span>Следующая</span>
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </div>-->
      </div>
    </div>

    <!-- MODALS -->
    <v-dialog
      v-model="$store.state.AnswersModule.showDetailAnswer"
      v-if="$store.state.AnswersModule.showDetailAnswer"
      scrollable
    >
      <v-card>
        <v-card-title style="display: inline-flex; flex-wrap: nowrap; width: 100%;">
          <span class="text-h6" style="margin: auto">{{ detail.e_question.name }}</span>
          <v-icon @click="$store.state.AnswersModule.showDetailAnswer = false;">mdi-close-thick</v-icon>
        </v-card-title>

        <v-card-text>
          <div class="sub_child">
            <div class="sub_child_block">
              <span class="sub_child_block__value">
                {{ emailUser }}
              </span>
              <v-icon
                :class="{ showUserInfo: showUserInfo }"
                @click="showUserInfo = !showUserInfo"
                :disabled="!detail.user || !Object.keys(detail.user).length"
                >mdi-arrow-down-drop-circle-outline</v-icon
              >
            </div>
            <div
              v-if="
                showUserInfo && (detail.user || Object.keys(detail.user).length)
              "
            >
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title"
                  >Зарегистрирован:</span
                >
                <span class="sub_child_detail_block__value">{{
                  dateRegistration
                }}</span>
              </div>
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Имя:</span>
                <span class="sub_child_detail_block__value">{{
                  detail.user.first_name ? detail.user.first_name : "-"
                }}</span>
              </div>
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Фамилия:</span>
                <span class="sub_child_detail_block__value">{{
                  detail.user.last_name ? detail.user.last_name : "-"
                }}</span>
              </div>
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Телефон:</span>
                <span class="sub_child_detail_block__value">{{
                  detail.user.telephone ? detail.user.telephone : "-"
                }}</span>
              </div>
            </div>
          </div>
          <div class="answer_block">
            <span class="answer_block__title"> Ответ: </span>
            <span class="answer_block__value" v-html="answer(detail)"> </span>
          </div>
          <div class="answer_block">
            <span class="answer_block__title"> Статья: </span>
            <span class="answer_block__value">
              {{ (detail.e_article) ? detail.e_article.name : '' }}
            </span>
          </div>
          <div class="answer_block">
            <span class="answer_block__title"> Создан: </span>
            <span class="answer_block__value">
              {{ detail.created_at }}
            </span>
          </div>
          <div class="answer_block">
            <span class="answer_block__title"> Изменен: </span>
            <span class="answer_block__value">
              {{ detail.updated_at }}
            </span>
          </div>
          <div class="sub_child">
            <div class="sub_child_block">
              <span class="sub_child_block__title">
                Файлы [{{ detail.e_client_files.length }}]
              </span>
              <v-icon
                :class="{ showUserInfo: showFiles }"
                @click="showFiles = !showFiles"
                :disabled="!detail.e_client_files.length"
                >mdi-arrow-down-drop-circle-outline</v-icon
              >
            </div>
            <div
              v-if="showFiles && detail.e_client_files.length"
              class="files__detail"
            >
              <card-list-files :files="detail.e_client_files" v-if="detail.e_client_files.length"></card-list-files>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDetail()">
            Закрыть
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import Vue from "vue";
import AnswersList from "../components/answers/AnswersList";
import CardListFiles from "../components/CardListFiles";

Vue.use(VueViewer);

// import Selector from "../components/table/Selector";
export default {
  name: "Answers",
  components: { AnswersList, CardListFiles },
  data: () => ({
    detail: {},
    showUserInfo: false,
    showFiles: false,
    date: null,
    selected: null,
    modal: false,
    search: null,
    debounceTimeout: null,
    filterQuery: null,
    sortQuery: null,
    viewerOptions: {
      navbar: false,
      tooltip: true,
      movable: false,
      zoomable: false,
      rotatable: true,
      scalable: false,
      transition: false,
      fullscreen: true,
      keyboard: false,
    },
  }),
  mounted() {
    this.initialDate();
    this.getItems();
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    emailUser() {
      return this.detail.user?.email
        ? this.detail.user.email
        : "Отсутствует почта";
    },
    dateRegistration() {
      return this.detail.user?.created_at
        ? new Date(this.detail.user.created_at).toJSON().slice(0, 10)
        : "Отсутствует информация";
    },
    maxDate() {
      return new Date().toJSON().slice(0, 10);
    },
    itemsArray() {
      if (!this.$store.state.AnswersModule.listVariables.length) return [];
      const arr = [];
      let category = "";
      this.$store.state.AnswersModule.listVariables.forEach((elem) => {
        if (elem.category === category) {
          arr.push(elem);
        } else {
          if (arr.length) arr.push({ divider: true });
          category = elem.category;
          arr.push({ header: category });
          arr.push(elem);
        }
      });
      return arr;
    },
    refactoredDate() {
      if (!this.date) return null;
      return this.date.slice().sort((a, b) => {
        return new Date(a) - new Date(b);
      });
    },
  },
  methods: {
    initialDate() {
      const today = new Date();
      const nowDay = new Date().toJSON().slice(0, 10);
      const agoDay = new Date(today.getTime());
      agoDay.setDate(today.getDate() - 2);
      this.date = [];
      this.date.push(agoDay.toJSON().slice(0, 10));
      this.date.push(nowDay);
    },
    isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    answer(row) {
      if (!row) return "";
      if (!row.value_answer) {
        return row.detailed_response
          ? row.detailed_response
          : "Ничего не найдено";
      }
      if (this.isJson(row.value_answer)) {
        let parsed = JSON.parse(row.value_answer);
        if (this.isJson(parsed)) parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) {
          return parsed.join(" ");
        } else {
          return parsed
            ? parsed
            : row.detailed_response
            ? row.detailed_response
            : "Ничего не найдено";
        }
      }
    },
    sortItems(title) {
      const { VALUE, SORT } = title;
      this.sortQuery = { [VALUE]: SORT };
      this.getItems();
    },
    getValues() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        if (!this.search) return;
        this.$store.dispatch("getListVariables", this.search);
      }, 600);
    },
    getItems() {
      this.$store.dispatch("getListAnswers", {
        queryObj: this.filterQuery,
        date: this.refactoredDate,
        sort: this.sortQuery,
      });
    },
    showModalAnswer(object) {
      this.detail = object;
      this.$store.commit("changeShowDetailAnswer", true);
    },
    closeDetail() {
      this.$store.commit("changeShowDetailAnswer", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
@import "src/assets/styles/table";

.answer_block {
  display: grid;
  grid-template-columns: 50% auto;
  &__title {
    color: darkgrey;
    word-break: break-all;
  }
  &__value {
    font-weight: 600;
    word-break: break-all;
  }
}
.sub_child {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 5px;
  margin-bottom: 2px;
  .sub_child_block {
    display: flex;
    justify-content: space-between;
    &__title {
      font-size: 1.1em;
      color: lightcoral;
    }
    &__value {
      font-size: 1.1em;
      font-weight: 600;
      text-decoration: underline;
      color: #539ee0;
    }
  }
  .sub_child_detail_block {
    display: grid;
    grid-template-columns: 50% auto;
    &__title {
      color: darkgrey;
    }
    &__value {
      font-weight: 600;
    }
  }
  .sub_child_detail_image {
    display: flex;
    flex-direction: column;
    row-gap: 5px;

    &__wrapper {
      display: flex;
      align-content: center;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      height: 110px;
      max-width: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 5px;
        background-color: #ffffff;
      }
    }
  }
}
.showUserInfo {
  transform: scaleY(-1);
}

::v-deep .v-select.v-input--dense .v-chip {
  margin: 0 4px 4px 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .v-autocomplete.v-select.v-input--is-focused input {
  min-width: 2px;
}
::v-deep .v-select__selections {
  flex-wrap: nowrap;
}
</style>

<style lang="scss">
.v-dialog{
  margin-top: 80px;
}
</style>
