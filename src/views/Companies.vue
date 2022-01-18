<template>
  <div class="companies-container">
    <div class="companies-container-buttons">

    </div>
    <div class="companies-container-wrapper">
      <div class="companies-container-wrapper-header">
        <div class="companies-container-wrapper-header__views">

        </div>
        <div class="companies-container-wrapper-header__search">

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
                  :src="require('/src/assets/svg/sort_arrow.svg')" alt="">
            </th>
            <th
                class="companies-container-wrapper-main-header__title"
                v-for="(title, index) in titles"
                :key="index"
            >
              <span class="companies-container-wrapper-main-header__title__text">{{ title.TEXT }}</span>
              <img
                  class="companies-container-wrapper-main-header__title__sort"
                  :src="require('/src/assets/svg/sort_arrow.svg')" alt="">
            </th>
            <th class="companies-container-wrapper-main-header__title">
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
          <td style="width: 100px; height: 70px">
            <img :src="(row.LOGO)" style="object-fit: contain; width: 100%; height: 100%">
          </td>
          <td>

          </td>
        </tr>
        </tbody>
<!--        <v-data-table
            :headers="headers"
            :items="desserts"
            sort-by="calories"
            class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>My CRUD</v-toolbar-title>
              <v-divider
                  class="mx-4"
                  inset
                  vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                  v-model="dialog"
                  max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                  >
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
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
                              v-model="editedItem.name"
                              label="Dessert name"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.calories"
                              label="Calories"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.fat"
                              label="Fat (g)"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.carbs"
                              label="Carbs (g)"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.protein"
                              label="Protein (g)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn
                color="primary"
                @click="initialize"
            >
              Reset
            </v-btn>
          </template>
        </v-data-table>-->
      </table>
    </div>

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
        INSTAGRAM: 'https://instagram.com/gidruss_official',
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
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.desserts = [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
        },
      ]
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped>
//::v-deep .v-data-table-header {
//  background: #f9fafc !important;
//}

table {
  display: grid;
  border-collapse: collapse;
  min-width: 100%;
  grid-template-columns:
    minmax(150px, 1fr)
    minmax(150px, 1.67fr)
    minmax(150px, 1.67fr)
    minmax(150px, 1.67fr)
    minmax(150px, 3.33fr)
    minmax(150px, 1.67fr)
    minmax(150px, 3.33fr)
    minmax(150px, 1.67fr)
    minmax(150px, 1.67fr)
    minmax(150px, 1.67fr);
}

thead,
tbody,
tr {
  display: contents;
}

th,
td {
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  //position: sticky;
  top: 0;
  background: #6c7ae0;
  text-align: left;
  font-weight: normal;
  font-size: 1.1rem;
  color: white;
  img {
    width: 10px;
    height: 10px;
  }
}

th:last-child {
  border: 0;
}

td {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #808080;
}

tr:nth-child(even) td {
  //background: #f8f6ff;
}

.companies-container {
  width: 100%;
  height: 100%;
  background: #eef2f5;
  .companies-container-buttons {
    padding-bottom: 20px;
  }
  .companies-container-wrapper {
    max-width: 1420px;
    background: #FFFFFF;
    box-shadow: 0  0 5px rgba(0, 0, 0, 0.2);
    margin: 0 auto;
    .companies-container-wrapper-header {
      &__views {

      }
      &__search {

      }
    }
    /*.companies-container-wrapper-main {
      width: 100%;
      .companies-container-wrapper-main-header {
        background: #f9fafc;
        border-bottom: 1px solid rgba(211,211,211, .6);
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        &__title {
          display: grid;
          grid-template-columns: auto auto;
          align-items: end;
          border: 1px solid;
          //column-gap: 5px;
          width: 100%;
          height: 100%;
          padding: 0 5px;
          &__checkbox {
          }
          &__sort {
            margin-top: 5px;
            width: 10px;
            height: 10px;
            justify-self: end;
            align-self: start;
          }
          &__text {
            color: gray;
            font-size: 14px;
          }
        }
      }
      .companies-container-wrapper-main-items {
        width: 100%;
        height: 80px;
        overflow: hidden;
        display: grid;
        grid-template-columns: 5% 1fr 2fr 0.5fr 1fr 1fr 1fr 2fr 1fr 1fr;
        align-items: end;
        justify-items: start;
        //padding: 0 5px 5px 5px;
        //padding-bottom: 5px;
        font-size: 14px;
        color: gray;
        //border-bottom: 1px solid rgba(211,211,211, .4);
        div {
          display: grid;
          width: 100%;
          height: 100%;
          border: 1px solid;
          padding: 0 5px;
        }
      }
    }*/
  }
}
</style>
