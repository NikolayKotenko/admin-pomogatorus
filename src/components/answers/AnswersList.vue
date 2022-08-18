<template>
  <div>
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
              v-if="title.VALUE !== 'answer'"
              class="table-container-wrapper-main-header__title__sort"
              :src="require('/src/assets/svg/sort_arrow.svg')" alt=""
              style="position: absolute; top: 5px; right: 5px"
              @click="startSort(title)"
          >
        </th>
      </tr>
      </thead>
      <tbody
          class="table-container-wrapper-main-items"
          v-if="!!$store.state.AnswersModule.listAnswers.length && !$store.state.AnswersModule.loadingList"
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
        <td v-html="answer(row)">
        </td>
        <td>
          {{ row.updated_at }}
        </td>
      </tr>
      </tbody>
    </table>
    <v-alert
        text
        prominent
        type="error"
        v-if="!$store.state.AnswersModule.listAnswers.length && !$store.state.AnswersModule.loadingList"
    >Список пуст</v-alert>
    <div class="loaderList" v-else-if="$store.state.AnswersModule.loadingList">
      <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
      ></v-progress-circular>
    </div>
  </div>
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
        SORT: 'asc'
      },
      {
        ID: 2,
        TEXT: 'Ответ',
        VALUE: 'answer',
      },
      {
        ID: 3,
        TEXT: 'Дата ответа',
        VALUE: 'created_at',
        SORT: 'asc'
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
    isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    answer(row) {
      if (!row) return ""
      if (!row.value_answer) {
        return row.detailed_response ? row.detailed_response : "Ничего не найдено"
      }
      if (this.isJson(row.value_answer)) {
        let parsed = JSON.parse(row.value_answer)
        if (this.isJson(parsed)) parsed = JSON.parse(parsed)
        if (Array.isArray(parsed)) {
          return parsed.join(" ")
        } else {
          return parsed ? parsed : row.detailed_response ? row.detailed_response : "Ничего не найдено"
        }
      }
    },
    startSort(title) {
      this.$emit('sortItems', title)
      const index = this.titles.findIndex(elem => {
        return elem.VALUE === title.VALUE
      })
      if (index !== -1) {
        let value = (title.SORT === 'asc') ? 'desc' : 'asc'
        this.titles[index].SORT = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
@import "src/assets/styles/table";
</style>
