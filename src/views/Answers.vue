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
      <div class="table-container-wrapper-header">
        <v-autocomplete
            class="answer_list__selector"
            dense
            hide-details
            label="Выбрать пользователя"
            :loading="$store.state.AnswersModule.loadingList"
            :disabled="$store.state.AnswersModule.loadingList"
        ></v-autocomplete>
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
          <span>Показано от {{ 1 }} до {{ 5 }} из {{ 5 }} записей</span>
        </div>
        <div class="table-container-wrapper-footer__page">
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
        </div>
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
          <div class="answer_block">
            <span class="answer_block__title">
              Ответ:
            </span>
            <span class="answer_block__value">
              {{ JSON.parse(detail.value_answer) ? JSON.parse(detail.value_answer) : detail.detailed_response }}
            </span>
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
  }),
  mounted() {
    this.getItems()
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
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
  display: flex;
  column-gap: 15px;
  //flex-direction: column;
  //row-gap: 5px;
  &__title {
    color: darkgrey;
  }
  &__value {
    font-weight: 600;
  }
}
</style>
