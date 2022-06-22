<template>
  <div class="answer_list">
    <v-autocomplete
      class="answer_list__selector"
      dense
      hide-details
      label="Выбрать пользователя"
    ></v-autocomplete>
    <div class="answer_list__table">
      <span>Ответы пользователей:</span>
      <AnswersList/>
      <v-progress-circular
        v-if="false"
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import AnswersList from "../components/answers/AnswersList";
export default {
  name: "Answers",
  components: {AnswersList}
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
</style>
