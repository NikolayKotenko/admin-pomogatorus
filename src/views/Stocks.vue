<template>
  <div class="table-container">
    <div class="table-container-buttons">
      <v-btn
        class="text-capitalize"
        color="green lighten-1"
        @click="openCreateModal()"
      >
        <v-icon color="white" small>mdi-plus-circle-outline</v-icon>
        <span class="table-container-buttons__text">Добавить</span>
      </v-btn>
      <v-btn
        :disabled="!selectedItems.length"
        class="text-capitalize"
        color="error"
        @click="deleteSelected()"
      >
        <v-icon color="white" small>mdi-trash-can-outline</v-icon>
        <span class="table-container-buttons__text">Удалить выбранное</span>
      </v-btn>
    </div>
    <div class="table-container-wrapper">
      <div class="table-container-wrapper-header">
        <div class="table-container-wrapper-header__views">
          Показать
          <v-select
            v-model="selectedCount"
            :items="changeCount"
            :menu-props="{ bottom: true, offsetY: true }"
            dense
            height="20"
            hide-details
            solo
          ></v-select>
          записей
        </div>
        <div class="table-container-wrapper-header__search">
          Поиск:
          <v-text-field
            dense
            height="20"
            hide-details
            label=""
            solo
          ></v-text-field>
        </div>
      </div>
      <table class="table-container-wrapper-main">
        <thead class="table-container-wrapper-main-header">
          <tr>
            <th class="table-container-wrapper-main-header__title">
              <v-checkbox
                class="table-container-wrapper-main-header__title__checkbox"
                dense
                hide-details
                @click="selectAll()"
              ></v-checkbox>
              <img
                :src="require('/src/assets/svg/sort_arrow.svg')"
                alt=""
                class="table-container-wrapper-main-header__title__sort"
                style="position: absolute; top: 5px; right: 5px"
              />
              <!--            <span class="resize-handle"></span>-->
            </th>
            <th
              v-for="(title, index) in titles"
              :key="index"
              class="table-container-wrapper-main-header__title"
              data-type="text-short"
            >
              <span class="table-container-wrapper-main-header__title__text">{{
                title.TEXT
              }}</span>
              <img
                :src="require('/src/assets/svg/sort_arrow.svg')"
                alt=""
                class="table-container-wrapper-main-header__title__sort"
                style="position: absolute; top: 5px; right: 5px"
              />
              <!--              <span class="resize-handle"></span>-->
            </th>
            <th class="table-container-wrapper-main-header__title actions">
              <span class="table-container-wrapper-main-header__title__text"
                >Доступные действия</span
              >
            </th>
          </tr>
        </thead>
        <tbody class="table-container-wrapper-main-items">
          <tr v-for="(row, index) in listItems" :key="index">
            <td>
              <v-checkbox
                v-model="row.SELECTED"
                dense
                hide-details
                @click="setSelect(row)"
              ></v-checkbox>
            </td>
            <td>{{ row.activity ? "Да" : "Нет" }}</td>
            <td>{{ row.purpose }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.description }}</td>
            <td>{{ row._brands_names.join() }}</td>
            <td>{{ row.end_date }}</td>
            <td>
              <img
                v-if="row._images && row._images[0]"
                :src="row._images[0].thumb_path"
                alt=""
                class="main_img"
                style="object-fit: contain; width: 100%; height: 100%"
              />
            </td>
            <td class="buttons">
              <v-btn
                class="text-capitalize"
                color="blue lighten-1"
                style="font-size: 12px"
                @click="onEditCard(row)"
              >
                <v-icon color="white" small>mdi-pencil-box-multiple</v-icon>
                <span class="table-container-buttons__text">Изменить</span>
              </v-btn>
              <v-btn
                class="text-capitalize"
                color="error"
                @click="onDelCard(row)"
              >
                <v-icon color="white" small>mdi-trash-can</v-icon>
                <span class="table-container-buttons__text">Удалить</span>
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
          <v-btn class="text-capitalize" elevation="0">
            <v-icon small> mdi-chevron-left</v-icon>
            <span>Предыдущая</span>
          </v-btn>
          <v-btn class="text-capitalize" elevation="0">
            {{ 1 }}
          </v-btn>
          <v-btn class="text-capitalize" elevation="0">
            <span>Следующая</span>
            <v-icon small> mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- MODAL  -->
    <v-dialog v-model="showCard" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ curEntry.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    v-model="curEntry.activity"
                    clearable
                    hide-details
                    label="Активность"
                  ></v-checkbox>
                  <br />
                  <v-text-field
                    v-model="curEntry.purpose"
                    clearable
                    label="Цель"
                  ></v-text-field>
                  <v-text-field
                    v-model="curEntry.name"
                    :rules="nameRules"
                    clearable
                    label="Наименование"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="curEntry.description"
                    clearable
                    label="Описание"
                  ></v-text-field>
                  <v-select
                    v-model="curEntry.ids_brands"
                    :items="listBrands"
                    item-text="name"
                    item-value="id"
                    label="Бренды"
                    multiple
                    chips
                    clearable
                    hide-details
                  ></v-select>
                  <br />
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="curEntry.end_date"
                        label="Дата окончания"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="curEntry.end_date"
                      no-title
                      first-day-of-week="1"
                      locale="ru-RU"
                    />
                  </v-menu>
                  <v-file-input
                    v-model="file"
                    accept="image/*"
                    clearable
                    label="Изображение"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCard()">
            Закрыть
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!valid"
            @click="saveCreate()"
          >
            Сохранить изменения
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delCard" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">Вы точно хотите удалить эту запись ?</span>
        </v-card-title>
        <v-card-text>
          {{ curEntry.name }} будет удалена из списка компаний со всеми данными
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteCard()"> Да</v-btn>
          <v-btn color="blue darken-1" text @click="delCard = false">
            Нет
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Stocks",
  data: () => ({
    titles: [
      { ID: 1, TEXT: "Активность", VALUE: "activity" },
      { ID: 2, TEXT: "Цель акции", VALUE: "purpose" },
      { ID: 3, TEXT: "Наименование", VALUE: "name" },
      { ID: 4, TEXT: "Описание", VALUE: "description" },
      { ID: 5, TEXT: "Брэнды", VALUE: "_brands_names" },
      { ID: 6, TEXT: "Дата окончания", VALUE: "end_date" },
      { ID: 7, TEXT: "Картинки", VALUE: "_images" },
    ],
    changeCount: [5, 10, 15, 20, 25],
    selectedCount: 10,
    page: 1,
    selectedItems: [],
    showCard: false,
    delCard: false,
    valid: false,
    nameRules: [
      (v) => !!v || "Обязательное поле",
      (v) => !v || v.length <= 100 || "Не должно содержать больше 100 символов",
    ],
    datePicker: false,
    file: [],
  }),
  created() {
    this.getListEntries();
    this.getListBrands();
  },
  computed: {
    ...mapState({
      listItems: (state) => state.Stocks.listStocks,
      listBrands: (state) => state.Brands.listBrands,
    }),
    curEntry: {
      get() {
        return this.$store.state.Stocks.entry;
      },
      set(value) {
        this.$store.commit("Stocks/setEntryData", value);
      },
    },
  },
  methods: {
    ...mapActions("Stocks", [
      "getListEntries",
      "createEntry",
      "updateEntry",
      "deleteEntry",
      "clearEntry",
    ]),
    ...mapActions("Brands", ["getListBrands"]),
    ...mapMutations("Stocks", ["setEntryData", "clearEntry"]),
    openCreateModal() {
      this.clearEntry();
      this.showCard = true;
    },
    async deleteSelected() {
      if (!this.selectedItems.length) return;

      for (const id of this.selectedItems) {
        this.setEntryData({ id });
        await this.deleteEntry();
      }
      this.selectedItems = [];
      await this.getListEntries();
    },
    selectAll() {
      if (this.allSelected) {
        this.listItems.forEach((elem) => {
          elem.SELECTED = false;
        });
        this.selectedItems = [];
        this.allSelected = false;
      } else {
        this.listItems.forEach((elem) => {
          elem.SELECTED = true;
          this.selectedItems.push(elem.id);
        });
        this.allSelected = true;
      }
    },
    setSelect(row) {
      if (row.SELECTED) {
        this.selectedItems.push(row.id);
      } else {
        const index = this.selectedItems.findIndex((i) => i === row.id);
        if (index !== -1) this.selectedItems.splice(index, 1);
      }
    },
    onEditCard(row) {
      this.setEntryData({
        id: row.id,
        name: row.name,
        purpose: row.purpose,
        description: row.description,
        end_date: row.end_date,
        activity: row.activity,
        ids_families: row.ids_families,
        ids_brands: row.ids_brands,
      });
      this.showCard = true;
    },
    onDelCard(row) {
      this.delCard = true;
      this.setEntryData({ id: row.id });
    },
    closeCard() {
      this.showCard = false;
      this.editable = true;
      this.clearEntry();
    },
    async saveCreate() {
      if (!this.curEntry.name) return;

      if (this.curEntry.id) {
        await this.updateEntry();
      } else {
        await this.createEntry();
      }

      await this.getListEntries();
      this.showCard = false;
    },
    async deleteCard() {
      await this.deleteEntry();
      await this.getListEntries();
      this.delCard = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
