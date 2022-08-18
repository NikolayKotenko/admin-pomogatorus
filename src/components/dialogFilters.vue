<template>
  <v-card>
    <v-card-title>
      <span>Выберите фильтры</span>
    </v-card-title>
    <v-card-text>
      <div class="filters_wrapper">
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Вопрос:</span>
          <v-autocomplete
              solo
              dense
              hide-details
              label="Выбрать вопрос"
              :items="$store.state.QuestionsModule.listQuestions"
              item-text="name"
              return-object
              v-model="filters.question"
              :loading="$store.state.AnswersModule.loadingList"
              :disabled="$store.state.AnswersModule.loadingList"
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Пользователь:</span>
          <v-autocomplete
              solo
              dense
              hide-details
              label="Выбрать пользователя"
              :loading="$store.state.AnswersModule.loadingList"
              :disabled="$store.state.AnswersModule.loadingList"
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Партнер:</span>
          <v-autocomplete
              solo
              dense
              hide-details
              label="Выбрать партнера"
              :loading="$store.state.AnswersModule.loadingList"
              :disabled="$store.state.AnswersModule.loadingList"
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Статья:</span>
          <v-autocomplete
              solo
              dense
              hide-details
              label="Выбрать статью"
              :items="$store.state.ArticleModule.listArticles"
              item-text="name"
              return-object
              v-model="filters.article"
              :loading="$store.state.AnswersModule.loadingList"
              :disabled="$store.state.AnswersModule.loadingList"
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Дата создания:</span>
          <v-text-field
              solo
              dense
              hide-details
              label="2022-07-31"
              v-model="filters.date"
              :loading="$store.state.AnswersModule.loadingList"
              :disabled="$store.state.AnswersModule.loadingList"
          ></v-text-field>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="red darken-1">Сбросить</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary">Применить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "dialogFilters",
  data: () => ({
    filters: {
      question: {},
      user: {},
      agent: {},
      article: {},
      date: null,
    },
  }),
  methods: {
    showFilters() {
      this.$store.commit('changeShowFilters', true)
      this.$store.dispatch('setListQuestions')
      this.$store.dispatch('setListArticles')
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
