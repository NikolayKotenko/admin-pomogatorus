<template>
  <div class="table-container">
    <div class="table-container-buttons">
      <v-btn
          color="blue lighten-1"
          class="text-capitalize"
          :small="isMobile()"
      >
        <v-icon small color="white">mdi-alert-circle-outline</v-icon>
        <span class="table-container-buttons__text">Место для функциональных кнопок</span>
      </v-btn>
      <v-btn
          color="green lighten-1"
          class="text-capitalize"
          :small="isMobile()"
      >
        <v-icon small color="white">mdi-plus-circle-outline</v-icon>
        <span class="table-container-buttons__text">Добавить</span>
      </v-btn>
      <v-btn
          color="error"
          class="text-capitalize"
          :small="isMobile()"
      >
        <v-icon small color="white">mdi-trash-can-outline</v-icon>
        <span class="table-container-buttons__text">Удалить выбранное</span>
      </v-btn>
    </div>
    <div class="table-container-wrapper">
      <v-autocomplete
          class="answer_list__selector"
          dense
          hide-details
          label="Выбрать пользователя"
      ></v-autocomplete>
      <div class="table_list">
        <AnswersList/>
        <v-progress-circular
            v-if="false"
            :size="50"
            color="primary"
            indeterminate
        ></v-progress-circular>
      </div>
      <div class="table-container-wrapper-footer">
        <div class="table-container-wrapper-footer__counter">
          <span>Показано от {{ 1 }} до {{ 5 }} из {{ 5 }} записей</span>
        </div>
        <div class="table-container-wrapper-footer__page">
          <v-btn
              elevation="0"
              class="text-capitalize"
              :small="isMobile()"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
            <span>Предыдущая</span>
          </v-btn>
          <v-btn
              elevation="0"
              class="text-capitalize"
              :small="isMobile()"
          >
            {{1}}
          </v-btn>
          <v-btn
              elevation="0"
              class="text-capitalize"
              :small="isMobile()"
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
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ 'Детальный ответ' }}</span>
        </v-card-title>
        <v-card-text>
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
export default {
  name: "Answers",
  components: {AnswersList},
  data: () => ({
  }),
  methods: {
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
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
</style>
