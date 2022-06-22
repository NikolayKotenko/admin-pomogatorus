<template>
  <div class="table-container">
    <div class="table-container-buttons">
      <v-btn
          color="green lighten-1"
          class="text-capitalize"
          @click="createCompany()"
      >
        <v-icon small color="white">mdi-plus-circle</v-icon>
        <span class="table-container-buttons__text">Добавить</span>
      </v-btn>
      <v-btn
          color="error"
          class="text-capitalize"
          @click="deleteCompany()"
          :disabled="!selectedItems.length"
      >
        <v-icon small color="white">mdi-trash-can</v-icon>
        <span class="table-container-buttons__text">Удалить выбранное</span>
      </v-btn>
    </div>
    <div class="table-container-wrapper">
      <div class="table-container-wrapper-header">
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
      <table class="table-container-wrapper-main ten_columns">
        <thead class="table-container-wrapper-main-header">
          <tr>
            <th class="table-container-wrapper-main-header__title">
              <v-checkbox
                  class="table-container-wrapper-main-header__title__checkbox"
                  dense hide-details
                  @click="selectAll()"
              ></v-checkbox>
              <img
                  class="table-container-wrapper-main-header__title__sort"
                  :src="require('/src/assets/svg/sort_arrow.svg')" alt=""
                  style="position: absolute; top: 5px; right: 5px"
              >
<!--            <span class="resize-handle"></span>-->
            </th>
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
<!--              <span class="resize-handle"></span>-->
            </th>
            <th class="table-container-wrapper-main-header__title actions">
              <span class="table-container-wrapper-main-header__title__text">Доступные действия</span>
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
            <v-checkbox
                dense hide-details
                v-model="row.SELECTED"
                @click="setSelect(row)"
            ></v-checkbox>
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
            <img :src="(row.LOGO)" alt="" style="object-fit: contain; width: 100%; height: 100%">
          </td>
          <td class="buttons">
            <v-btn
                color="blue lighten-1"
                class="text-capitalize"
                style="font-size: 12px"
                @click="onEditCard(row)"
            >
              <v-icon small color="white">mdi-pencil-box-multiple</v-icon>
              <span class="table-container-buttons__text">Изменить</span>
            </v-btn>
            <v-btn
                color="error"
                class="text-capitalize"
                @click="onDelCard(row)"
            >
              <v-icon small color="white">mdi-trash-can</v-icon>
              <span class="table-container-buttons__text">Удалить</span>
            </v-btn>
            <v-btn
                color="orange lighten-1"
                class="text-capitalize"
                @click="onShowCard(row)"
            >
              <v-icon small color="white">mdi-eye</v-icon>
              <span class="table-container-buttons__text">Просмотр</span>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="table-container-wrapper-footer">
        <div class="table-container-wrapper-footer__counter">
          <span>Показано от {{ 1 }} до {{ 5 }} из {{ 5 }} записей</span>
        </div>
        <div class="table-container-wrapper-footer__page">
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
            {{1}}
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
          <span class="text-h5">{{ companyTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      hide-details
                      clearable
                      label="Имя компании"
                      v-model="curCompany.NAME"
                      :rules="nameRules"
                      :disabled="!editable"
                      required
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      hide-details
                      clearable
                      label="Адрес компании"
                      v-model="curCompany.ADDRESS"
                      :disabled="!editable"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      hide-details
                      clearable
                      label="Email"
                      v-model="curCompany.EMAIL"
                      :disabled="!editable"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      hide-details
                      clearable
                      label="Телефон компании"
                      v-model="curCompany.TELEPHONE"
                      :disabled="!editable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      hide-details
                      clearable
                      label="Сайт компании"
                      v-model="curCompany.WEB"
                      :disabled="!editable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      hide-details
                      clearable
                      label="Инстаграм компании"
                      v-model="curCompany.INSTAGRAM"
                      :disabled="!editable"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-file-input
                      accept="image/*"
                      label="Логотип компании"
                      clearable
                      v-model="file"
                      :disabled="!editable"
                  ></v-file-input>
                <!-- @change="showLog(file)" -->
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="closeCard()"
          >
            Закрыть
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="saveCreate()"
          >
            Сохранить изменения
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="delCard"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Вы точно хотите удалить компанию?</span>
        </v-card-title>
        <v-card-text>
          {{ companyTitle }} будет удалена из списка компаний со всеми данными
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="deleteCard()"
          >
            Да
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="delCard = false"
          >
            Нет
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
        TEXT: 'Адрес компании',
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
        SELECTED: false,
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
        SELECTED: false,
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
        SELECTED: false,
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
        SELECTED: false,
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
        SELECTED: false,
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
        SELECTED: false,
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
        SELECTED: false,
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
    curCompany: {},
    companyTitle: 'Новая кмопания',
    valid: false,
    nameRules: [
      v => !!v || 'Обязательное поле',
      v => v.length <= 30 || 'Не должно содержать больше 30 символов',
    ],
    file: [],
    // currentImage: undefined,
    // previewImage: undefined,
    // progress: 0,
    // message: "",
    imageInfos: [],
    delCard: false,
    editable: true,
    allSelected: false,
    selectedItems: [],
  }),
  created () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    createCompany() {
      for (let key in this.listItems[0]) {
        if (key === 'ID') {
          this.curCompany['ID'] = this.listItems.length + 1
        } else {
          this.curCompany[key] = ''
        }
      }
      this.companyTitle = 'Новая кмопания'
      this.showCard = true
    },
    onEditCard(row) {
      for (let key in row) {
        this.curCompany[key] = row[key]
      }
      this.companyTitle = row['NAME']
      this.showCard = true
    },
    onDelCard(row) {
      this.delCard = true
      this.companyTitle = row.NAME
      this.curCompany.ID = row.ID
    },
    deleteCard() {
      let index = this.listItems.findIndex(i => {
        return i.ID === this.curCompany.ID
      })
      if (index !== -1) this.listItems.splice(index, 1)
      this.delCard = false
    },
    onShowCard(row) {
      for (let key in row) {
        this.curCompany[key] = row[key]
      }
      this.companyTitle = row['NAME']
      this.editable = false
      this.showCard = true
    },
    closeCard() {
      this.showCard = false
      this.editable = true
    },
    saveCreate() {
      if (this.listItems.map(elem => elem.ID).includes(this.curCompany.ID)) {
        this.listItems.map(elem => {
          if (elem.ID === this.curCompany.ID) {
            for (let key in this.curCompany) {
              elem[key] = this.curCompany[key]
            }
          }
        })
      } else {
        this.listItems.push(Object.assign({}, this.curCompany))
      }
      this.showCard = false
    },
    selectAll() {
      if (this.allSelected) {
        this.listItems.forEach(elem => {
          elem.SELECTED = false
        })
        this.selectedItems = []
        this.allSelected = false
      } else {
        this.listItems.forEach(elem => {
          elem.SELECTED = true
          this.selectedItems.push(elem.ID)
        })
        this.allSelected = true
      }
    },
    deleteCompany() {
      if (this.selectedItems.length) {
        this.selectedItems.forEach(id => {
          let index = this.listItems.findIndex(i => {
            return i.ID === id
          })
          if (index !== -1) this.listItems.splice(index, 1)
        })
      }
    },
    setSelect(row) {
      if (row.SELECTED) {
        this.selectedItems.push(row.ID)
      } else {
        let index = this.selectedItems.findIndex(i => {
          return i === row.ID
        })
        if (index !== -1) this.selectedItems.splice(index, 1)
      }
    },


    /* Для добавления изображений */

/*    showLog(image) {
      this.currentImage = image;
      this.previewImage = URL.createObjectURL(this.currentImage);
      this.progress = 0;
      this.message = "";
    }*/
    /*upload() {
      if (!this.currentImage) {
        this.message = "Please select an Image!";
        return;
      }
      this.progress = 0;
      UploadService.upload(this.currentImage, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
          .then((response) => {
            this.message = response.data.message;
            return UploadService.getFiles();
          })
          .then((images) => {
            this.imageInfos = images.data;
          })
          .catch((err) => {
            this.progress = 0;
            this.message = "Could not upload the image! " + err;
            this.currentImage = undefined;
          });
    },*/
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/table";
</style>
