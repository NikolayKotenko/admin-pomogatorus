<template>
  <div class="table-container">
    <div class="table-container-buttons">
      <v-btn
          color="blue lighten-1"
          class="text-capitalize"
          :small="isMobile"
          :loading="$store.state.AnswersModule.loadingList"
          :disabled="$store.state.AnswersModule.loadingList"
      >
        <v-icon small color="white">mdi-alert-circle-outline</v-icon>
        <span class="table-container-buttons__text">Место для функциональных кнопок</span>
      </v-btn>
      <v-btn
          color="green lighten-1"
          class="text-capitalize"
          :small="isMobile"
          :loading="$store.state.AnswersModule.loadingList"
          :disabled="$store.state.AnswersModule.loadingList"
      >
        <v-icon small color="white">mdi-plus-circle-outline</v-icon>
        <span class="table-container-buttons__text">Кнопка 1</span>
      </v-btn>
      <v-btn
          color="error"
          class="text-capitalize"
          :small="isMobile"
          :loading="$store.state.AnswersModule.loadingList"
          :disabled="$store.state.AnswersModule.loadingList"
      >
        <v-icon small color="white">mdi-trash-can-outline</v-icon>
        <span class="table-container-buttons__text">Кнопка 2</span>
      </v-btn>
    </div>
    <div class="table-container-wrapper">
      <div class="table-container-wrapper-header header-column">
        <v-autocomplete
            class="answer_list__selector"
            dense
            hide-details
            placeholder="Поиск..."
            :loading="$store.state.AnswersModule.loadingList"
            :disabled="$store.state.AnswersModule.loadingList"
            prepend-inner-icon="mdi-magnify"
        >
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
              first-day-of-week=1
              :max="maxDate"
          >
            <v-spacer></v-spacer>
            <v-btn
                text
                color="primary"
                @click="modal = false"
            >
              Cancel
            </v-btn>
            <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </div>
      <div class="table_list">
        <AnswersList
            v-if="!$store.state.AnswersModule.loadingList || $store.state.AnswersModule.loadingList"
            @showModalAnswer="showModalAnswer"
        />
        <v-progress-circular
            v-else
            :size="50"
            color="primary"
            indeterminate
        ></v-progress-circular>
      </div>
      <div class="table-container-wrapper-footer">
        <div class="table-container-wrapper-footer__counter">
<!--          <Selector/>-->
          <span>Показано от {{ $store.state.AnswersModule.listAnswers.length }} до {{ $store.state.AnswersModule.listAnswers.length }} из {{ $store.state.AnswersModule.listAnswers.length }} записей</span>
        </div>
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
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ detail.e_question.name }}</span>
        </v-card-title>
        <v-card-text>
          <div class="sub_child">
            <div class="sub_child_block">
              <span class="sub_child_block__value">
                {{ emailUser }}
              </span>
              <v-icon :class="{showUserInfo: showUserInfo}" @click="showUserInfo = !showUserInfo" :disabled="!detail.user || !Object.keys(detail.user).length">mdi-arrow-down-drop-circle-outline</v-icon>
            </div>
            <div v-if="showUserInfo && (detail.user || Object.keys(detail.user).length)">
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Зарегистрирован:</span>
                <span class="sub_child_detail_block__value">{{ dateRegistration }}</span>
              </div>
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Имя:</span>
                <span class="sub_child_detail_block__value">{{ detail.user.first_name ? detail.user.first_name : '-' }}</span>
              </div>
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Фамилия:</span>
                <span class="sub_child_detail_block__value">{{ detail.user.last_name ? detail.user.last_name : '-'}}</span>
              </div>
              <div class="sub_child_detail_block">
                <span class="sub_child_detail_block__title">Телефон:</span>
                <span class="sub_child_detail_block__value">{{ detail.user.telephone ? detail.user.telephone : '-' }}</span>
              </div>
            </div>
          </div>
          <div class="answer_block">
            <span class="answer_block__title">
              Ответ:
            </span>
            <span class="answer_block__value">
              {{ JSON.parse(detail.value_answer) ? JSON.parse(detail.value_answer) : detail.detailed_response }}
            </span>
          </div>
          <div class="answer_block">
            <span class="answer_block__title">
              Статья:
            </span>
            <span class="answer_block__value">
              {{ detail.e_article.name }}
            </span>
          </div>
          <div class="answer_block">
            <span class="answer_block__title">
              Создан:
            </span>
            <span class="answer_block__value">
              {{ detail.created_at }}
            </span>
          </div>
          <div class="answer_block">
            <span class="answer_block__title">
              Изменен:
            </span>
            <span class="answer_block__value">
              {{ detail.updated_at }}
            </span>
          </div>
          <div class="sub_child">
            <div class="sub_child_block">
              <span class="sub_child_block__title">
                Файлы [{{ detail.e_client_files.length }}]
              </span>
              <v-icon :class="{showUserInfo: showFiles}" @click="showFiles = !showFiles" :disabled="!detail.e_client_files.length">mdi-arrow-down-drop-circle-outline</v-icon>
            </div>
            <div v-if="showFiles && detail.e_client_files.length" class="files__detail">
              <div class="sub_child_detail_image">
                <div
                    class="sub_child_detail_image__wrapper"
                    v-for="(img, index) in detail.e_client_files"
                    :key="index"
                >
                  <img
                      :alt="img.filename"
                      :src="`${$store.state.BASE_URL}${img.full_path}`"
                  >
                </div>

              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="closeDetail()"
          >
            Закрыть
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AnswersList from "../components/answers/AnswersList";
// import Selector from "../components/table/Selector";
export default {
  name: "Answers",
  components: {AnswersList},
  data: () => ({
    detail: {},
    showUserInfo: false,
    showFiles: false,
    date: null,
    selected: null,
    modal: false,
  }),
  mounted() {
    this.getItems()
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    emailUser() {
      return this.detail.user?.email ? this.detail.user.email : 'Отсутствует почта'
    },
    dateRegistration() {
      return this.detail.user?.created_at ? new Date(this.detail.user.created_at).toJSON().slice(0,10) : 'Отсутствует информация'
    },
    maxDate() {
      return new Date().toJSON().slice(0,10)
    }
  },
  methods: {
    getItems() {
      this.$store.dispatch('getListAnswers', {
        id_question: '',
        id_user: '',
        id_agent_utm: '',
        id_article: '',
        created_at: '',
        name: '',
        updated_at: '',
        sort_created_at: '',
      })
    },
    showModalAnswer(object) {
      this.detail = object
      this.$store.commit('changeShowDetailAnswer', true)
    },
    closeDetail() {
      this.$store.commit('changeShowDetailAnswer', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
@import "src/assets/styles/table";

.answer_block {
  display: grid;
  grid-template-columns: 50% auto;
  &__title {
    color: darkgrey;
  }
  &__value {
    font-weight: 600;
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
      height: 65px;
      max-width: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 5px;
        background-color: #FFFFFF;
      }
    }
  }
}
.showUserInfo {
  transform: scaleY(-1);
}

.filters_wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 15px;

  ::v-deep .v-text-field__slot {
    width: 100% !important;
  }
  ::v-deep .v-label theme--light {
    width: 100% !important;
  }

  &__elem {

    &__label {

    }
  }
}
</style>
