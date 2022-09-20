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
              v-model="filters.question"
              :disabled="$store.state.AnswersModule.loadingList"
              :items="$store.state.QuestionsModule.listQuestions"
              :loading="$store.state.AnswersModule.loadingList"
              dense
              hide-details
              item-text="name"
              label="Выбрать вопрос"
              return-object
              solo
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Пользователь:</span>
          <v-autocomplete
              :disabled="$store.state.AnswersModule.loadingList"
              :loading="$store.state.AnswersModule.loadingList"
              dense
              hide-details
              label="Выбрать пользователя"
              solo
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Партнер:</span>
          <v-autocomplete
              :disabled="$store.state.AnswersModule.loadingList"
              :loading="$store.state.AnswersModule.loadingList"
              dense
              hide-details
              label="Выбрать партнера"
              solo
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Статья:</span>
          <v-autocomplete
              v-model="filters.article"
              :disabled="$store.state.AnswersModule.loadingList"
              :items="$store.state.ArticleModule.listArticles"
              :loading="$store.state.AnswersModule.loadingList"
              dense
              hide-details
              item-text="name"
              label="Выбрать статью"
              return-object
              solo
          ></v-autocomplete>
        </div>
        <div class="filters_wrapper__elem">
          <span class="filters_wrapper__elem__label">Дата создания:</span>
          <v-text-field
              v-model="filters.date"
              :disabled="$store.state.AnswersModule.loadingList"
              :loading="$store.state.AnswersModule.loadingList"
              dense
              hide-details
              label="2022-07-31"
              solo
          ></v-text-field>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="red darken-1" text>Сбросить</v-btn>
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
      this.$store.commit("changeShowFilters", true);
      this.$store.dispatch("setListQuestions");
      this.$store.dispatch("setListArticles");
    },
  },
};
</script>

<style lang="scss" scoped></style>
