<template>
  <div class="question_agent">
    <div class="question_agent__selector">
      <v-autocomplete
          outlined
          dense
          hide-details
          placeholder="Выберите агента"
          :loading="$store.state.loadingAgents"
          :disabled="$store.state.loadingAgents"
          hide-no-data
          label="Помощник назначения агента"
          :items="$store.state.listAgents"
          item-text="last_name"
          item-value="id"
          return-object
          clearable
          v-model="agent"
          @focus="$emit('onFocus', true)"
          @focusout="$emit('outFocus', false)"
      ></v-autocomplete>
    </div>
    <div class="question_agent__result" v-if="!!agent">
      <div class="question_agent__result__block">
        <span class="question_agent__result__block__title">КОД агента: </span>
        <span class="question_agent__result__block__value">{{ agent.last_name }}</span>
      </div>
      <div class="question_agent__result__block">
        <span class="question_agent__result__block__title">URL агента: </span>
        <span class="question_agent__result__block__value">{{ agent.first_name }}</span>
      </div>
      <div class="question_agent__result__example">
        <span class="question_agent__result__example__title">Для вставки партнерского вопроса необходимо написать вариант ответа и добавить соответсвтующую запись вида: </span>
        <span class="question_agent__result__example__value">{{ example }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AgentList",
  data: () => ({
    agent: null,
  }),
  mounted() {
    this.$store.dispatch('getListAgents')
  },
  computed: {
    example() {
      return `<a href="${this.agent?.firs_name ? this.agent.firs_name : '...'}" id="${this.agent.last_name}"></a>`
    }
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.question_agent {
  &__selector {

  }
  &__result {
    padding: 15px 25px;
    background: #f3f3f3;
    border-radius: 5px;
    margin-top: 6px;
    font-weight: 600;
    font-size: 0.9em;
    &__block {
      display: flex;
      column-gap: 6px;
      &__title {
        color: darkgrey;
      }
      &__value {

      }
    }
    &__example {
      padding-top: 5px;
      &__title {
        font-weight: 400;
      }
      &__value {
        font-size: 1rem;
      }
    }
  }
}
</style>
