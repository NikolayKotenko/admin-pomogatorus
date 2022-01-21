<template>
  <div class="companies-container">
    <div class="companies-container-buttons">
      <v-btn
          color="green lighten-1"
          class="text-capitalize"
      >
        <v-icon small color="white">mdi-plus-circle</v-icon>
        <span class="companies-container-buttons__text">Добавить</span>
      </v-btn>
      <v-btn
          color="error"
          class="text-capitalize"
      >
        <v-icon small color="white">mdi-trash-can</v-icon>
        <span class="companies-container-buttons__text">Удалить выбранное</span>
      </v-btn>
    </div>
    <div class="companies-container-wrapper">
      <div class="companies-container-wrapper-header">
        <div class="companies-container-wrapper-header__views">
          Показать
          <v-select
              dense
              solo
              hide-details
              height="20"
              :menu-props="{ bottom: true, offsetY: true }"
              :items="changeCount"
              v-model="selectedCount"
          ></v-select>
          записей
        </div>
        <div class="companies-container-wrapper-header__search">
          Поиск:
          <v-text-field
              hide-details
              dense
              solo
              height="20"
              label=""
          ></v-text-field>
        </div>
      </div>
      <table class="companies-container-wrapper-main">
        <thead class="companies-container-wrapper-main-header">
          <tr>
            <th class="companies-container-wrapper-main-header__title">
              <v-checkbox
                  class="companies-container-wrapper-main-header__title__checkbox"
                  dense hide-details
              ></v-checkbox>
              <img
                  class="companies-container-wrapper-main-header__title__sort"
                  :src="require('/src/assets/svg/sort_arrow.svg')" alt=""
                  style="position: absolute; top: 5px; right: 5px"
              >
<!--            <span class="resize-handle"></span>-->
            </th>
            <th
                class="companies-container-wrapper-main-header__title"
                v-for="(title, index) in titles"
                :key="index"
                data-type="text-short"
            >
              <span class="companies-container-wrapper-main-header__title__text">{{ title.TEXT }}</span>
              <img
                  class="companies-container-wrapper-main-header__title__sort"
                  :src="require('/src/assets/svg/sort_arrow.svg')" alt=""
                  style="position: absolute; top: 5px; right: 5px"
              >
<!--              <span class="resize-handle"></span>-->
            </th>
            <th class="companies-container-wrapper-main-header__title actions">
              <span class="companies-container-wrapper-main-header__title__text">Доступные действия</span>
            </th>
          </tr>
        </thead>
        <tbody
          class="companies-container-wrapper-main-items"
        >
        <tr
          v-for="(row, index) in listItems"
          :key="index"
        >
          <td>
            <v-checkbox dense hide-details></v-checkbox>
          </td>
          <td>
            {{ row.NAME }}
          </td>
          <td>
            {{ row.ADDRESS }}
          </td>
          <td>
            {{ row.DATE }}
          </td>
          <td>
            {{ row.EMAIL }}
          </td>
          <td>
            {{ row.TELEPHONE }}
          </td>
          <td>
            {{ row.WEB }}
          </td>
          <td>
            {{ row.INSTAGRAM }}
          </td>
          <td style="width: 100px">
            <img :src="(row.LOGO)" style="object-fit: contain; width: 100%; height: 100%">
          </td>
          <td class="buttons">
            <v-btn
                color="blue lighten-1"
                class="text-capitalize"
                style="font-size: 12px"
            >
              <v-icon small color="white">mdi-pencil-box-multiple</v-icon>
              <span class="companies-container-buttons__text" @click="onShowCard()">Изменить</span>
            </v-btn>
            <v-btn
                color="error"
                class="text-capitalize"
            >
              <v-icon small color="white">mdi-trash-can</v-icon>
              <span class="companies-container-buttons__text">Удалить</span>
            </v-btn>
            <v-btn
                color="orange lighten-1"
                class="text-capitalize"
            >
              <v-icon small color="white">mdi-eye</v-icon>
              <span class="companies-container-buttons__text">Просмотр</span>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="companies-container-wrapper-footer">
        <div class="companies-container-wrapper-footer__counter">
          <span>Показано от {{ 1 }} до {{ 5 }} из {{ 5 }} записей</span>
        </div>
        <div class="companies-container-wrapper-footer__page">
          <v-btn
              elevation="0"
              class="text-capitalize"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
            <span>Предыдущая</span>
          </v-btn>
          <v-btn
              elevation="0"
              class="text-capitalize"
          >

          </v-btn>
          <v-btn
              elevation="0"
              class="text-capitalize"
          >
            <span>Следующая</span>
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
<!--          <v-pagination-->
<!--              v-model="page"-->
<!--              :length="6"-->
<!--          ></v-pagination>-->
        </div>
      </div>
    </div>

    <!-- MODAL  -->
    <v-dialog
        v-model="showCard"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Legal first name*"
                    required
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Legal middle name"
                    hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    label="Legal last name*"
                    hint="example of persistent helper text"
                    persistent-hint
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Email*"
                    required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Password*"
                    type="password"
                    required
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
              >
                <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age*"
                    required
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
              >
                <v-autocomplete
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests"
                    multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Companies",
  data: () => ({
    titles: [
      {
        ID: 1,
        TEXT: 'Имя компании',
        VALUE: 'name',
      },
      {
        ID: 2,
        TEXT: 'Адресс компании',
        VALUE: 'address',
      },
      {
        ID: 3,
        TEXT: 'Дата создания',
        VALUE: 'date',
      },
      {
        ID: 4,
        TEXT: 'Email',
        VALUE: 'email',
      },
      {
        ID: 5,
        TEXT: 'Телефон компании',
        VALUE: 'telephone',
      },
      {
        ID: 6,
        TEXT: 'Сайт компании',
        VALUE: 'web',
      },
      {
        ID: 7,
        TEXT: 'Инстаграм компании',
        VALUE: 'instagram',
      },
      {
        ID: 8,
        TEXT: 'Логотип компании',
        VALUE: 'logo',
      },
    ],
    listItems: [
      {
        ID: 1,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_officialdasdasda/sadasdasd',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
      {
        ID: 2,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
      {
        ID: 3,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
      {
        ID: 4,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
      {
        ID: 5,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
      {
        ID: 6,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
      {
        ID: 7,
        CODE: 'GIDRUSS',
        NAME: 'ГИДРУСС',
        ADDRESS: 'г. Челябинск, ул. Пушкина 12, оф.5',
        DATE: '2021-01-17 10:08:00',
        EMAIL: 'gidruss@mail.ru',
        TELEPHONE: '+7 (951) 212-06-88',
        WEB: 'https://gidruss.ru',
        INSTAGRAM: 'https://instagram.com/gidruss_official',
        LOGO: 'https://gidruss.ru/local/templates/gidruss/static/i/logotop2.png',
      },
    ],
    changeCount: [5, 10, 15, 20, 25],
    selectedCount: 10,
    page: 1,
    showCard: false,
  }),
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    onShowCard() {
      this.showCard = true
    },
  },
}
</script>

<style lang="scss" scoped>
.v-input--checkbox.v-input--dense {
  margin-top: 0;
}
.v-input--selection-controls {
  padding: 0;
}

::v-deep .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0 0 0 10px !important;
}

::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details,
::v-deep .v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot {
  margin: 0;
  max-height: 26px;
  min-height: 26px !important;
  display: flex!important;
  flex-direction: column;
  align-items: center!important;
  font-size: 14px !important;
}

::v-deep .v-text-field.v-text-field--enclosed > .v-input__control {
  justify-content: center;
}

.companies-container {
  width: 100%;
  height: 100%;
  background: #eef2f5;
  .companies-container-buttons {
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;
    max-width: 1640px;
    padding-bottom: 15px;
    padding-top: 15px;
    margin: 0 auto;
    span {
      color: #FFFFFF;
      padding-left: 5px;
    }
    .v-btn:not(.v-btn--round).v-size--default {
      min-width: 230px;
    }
  }
  .companies-container-wrapper {
    max-width: 1640px;
    background: #FFFFFF;
    box-shadow: 0  0 5px rgba(0, 0, 0, 0.2);
    margin: 0 auto;
    padding: 30px;

    .companies-container-wrapper-header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      &__views {
        display: flex;
        column-gap: 10px;
        max-width: 200px;
        font-size: 14px;
        color: gray;
        align-items: center;
      }
      &__search {
        display: flex;
        column-gap: 10px;
        max-width: 200px;
        font-size: 14px;
        color: gray;
        align-items: center;
      }
    }

    .companies-container-wrapper-main {
      display: grid;
      border-collapse: collapse;
      min-width: 100%;
      padding-bottom: 20px;
      grid-template-columns:
    minmax(50px, 50px)
    minmax(120px, 1.67fr)
    minmax(120px, 3.33fr)
    minmax(90px, 1.67fr)
    minmax(120px, 2fr)
    minmax(120px, 2fr)
    minmax(120px, 2fr)
    minmax(160px, 3.33fr)
    minmax(90px, 1fr)
    minmax(170px, 3.33fr);

      thead,
      tbody,
      tr {
        display: contents;
      }

      th,
      td {
        padding: 5px 10px;
        overflow: hidden;
      }

      .companies-container-wrapper-main-header__title {
        display: flex;
        justify-content: space-between;
        align-items: end;
        position: sticky;
        top: 0;
        background: #f9fafc;
        border-bottom: 1px solid rgba(211,211,211, .6);
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        text-align: left;
        font-weight: normal;
        font-size: 14px;
        color: gray;
        img {
          width: 10px;
          height: 10px;
        }
      }

      .actions {
        display: flex;
        justify-content: center;
      }

      td {
        display: flex;
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 14px;
        color: gray;
        border-bottom: 1px solid rgba(211,211,211, .4);
        word-break: break-all;
      }

      .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        row-gap: 5px;
        column-gap: 5px;
        .v-btn:not(.v-btn--round).v-size--default {
          min-width: 90px;
          height: 24px;
          padding: 0 5px;
        }
        .companies-container-buttons__text {
          color: #FFFFFF;
          padding-left: 5px;
          font-size: 12px;
        }
      }
    }

    .companies-container-wrapper-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      //color: gray;
      padding-bottom: 10px;
      &__counter {
        opacity: 0.9;
      }
      &__page {
        span {
          font-size: 12px;
        }
        .v-btn:not(.v-btn--round).v-size--default {
          min-width: 40px;
          height: 30px;
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
