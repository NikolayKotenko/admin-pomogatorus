<template>
  <table class="table-container-wrapper-main three_columns">
    <thead class="table-container-wrapper-main-header">
    <tr>
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
        v-for="(row, index) in listItems"
        :key="index"
    >
      <td>
        {{ row.NAME }}
      </td>
      <td>
        {{ row.ANSWER }}
      </td>
      <td>
        {{ row.DATE_ANSWER }}
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
    listItems: [
      {
        ID: 1,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'НАЗВАНИЕ ВОПРОСА',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_officialdasdasda/sadasdasd',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
      {
        ID: 2,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'НАЗВАНИЕ ВОПРОСА',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
      {
        ID: 3,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'НАЗВАНИЕ ВОПРОСА',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
      {
        ID: 4,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'НАЗВАНИЕ ВОПРОСА',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
      {
        ID: 5,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
      {
        ID: 6,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
      {
        ID: 7,
        CODE: 'GIDRUSS',
        SELECTED: false,
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
        ANSWER: 'Ответ пользователя',
        DATE_ANSWER: '24/06/2022'
      },
    ],
  }),
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
@import "src/assets/styles/table";
</style>
