<template>
  <table class="table-container-wrapper-main" :class="{four_columns: !isMobile, three_columns: isMobile}">
    <thead class="table-container-wrapper-main-header">
    <tr>
      <th
          v-if="!isMobile"
          class="table-container-wrapper-main-header__title"
          data-type="text-short"
      >
      #
      <th
          class="table-container-wrapper-main-header__title"
          v-for="(title, index) in titles"
          :key="index"
          data-type="text-short"
      >
        <span class="table-container-wrapper-main-header__title__text">{{ title.TEXT }}</span>
        <img
            class="table-container-wrapper-main-header__title__sort"
            :src="require('/src/assets/svg/sort_arrow.svg')" alt=""
            style="position: absolute; top: 5px; right: 5px"
        >
      </th>
    </tr>
    </thead>
    <tbody
        class="table-container-wrapper-main-items"
    >
    <tr
        v-for="(row, index) in $store.state.AnswersModule.listAnswers"
        :key="index"
        @click="showDetail(row)"
    >
      <td v-if="!isMobile">
        {{index+1}}
      </td>
      <td>
        {{ nameAnswer(row) }}
      </td>
      <td>
        {{ answer(row) }}
      </td>
      <td>
        {{ row.updated_at }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "AnswersList",
  data: () => ({
    titles: [
      {
        ID: 1,
        TEXT: 'Заголовок вопроса',
        VALUE: 'name',
      },
      {
        ID: 2,
        TEXT: 'Ответ',
        VALUE: 'answer',
      },
      {
        ID: 3,
        TEXT: 'Дата ответа',
        VALUE: 'dateAnswer',
      },
    ],
  }),
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
  },
  methods: {
    showDetail(object) {
      if (object.e_question?.name) this.$emit('showModalAnswer', object);
    },
    nameAnswer(row) {
      return row.e_question?.name ? row.e_question?.name : 'Ошибка в записи ответа'
    },
    answer(row) {
      return JSON.parse(row.value_answer) ? JSON.parse(row.value_answer) : row.detailed_response
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
@import "src/assets/styles/table";
</style>
