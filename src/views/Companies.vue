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
      <table class="table-container-wrapper-main twelve_columns">
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
          <td>{{ row.name }}</td>
          <td>{{ row.physical_address }}</td>
          <td>{{ row.created_at }}</td>
          <td>{{ row.email }}</td>
          <td>{{ row.telephone }}</td>
          <td>{{ row.site }}</td>
          <td>{{ row.instagram }}</td>
          <td>{{ row.lat || '—' }}</td>  <!-- после инстаграма -->
          <td>{{ row.long || '—' }}</td>  <!-- после широты -->
          <td style="width: 100px">  <!-- теперь логотип -->
            <img
                v-if="row.e_client_files && row.e_client_files[0]"
                :src="row.e_client_files[0].path"
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
            <v-btn
                class="text-capitalize"
                color="orange lighten-1"
                @click="onShowCard(row)"
            >
              <v-icon color="white" small>mdi-eye</v-icon>
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
          <span class="text-h5">{{ companyTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="curCompany.name"
                      :disabled="!editable"
                      :rules="nameRules"
                      clearable
                      label="Имя компании"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="curCompany.physical_address"
                      :disabled="!editable"
                      clearable
                      hide-details
                      label="Адрес компании"
                  ></v-text-field>
                </v-col>
                <v-text-field
                    v-model="curCompany.email"
                    :disabled="!editable"
                    :rules="emailRules"
                    clearable
                    label="Email"
                    style="padding: 0 12px;"
                ></v-text-field>
                <v-col cols="12">
                  <v-text-field
                      v-model="curCompany.telephone"
                      :disabled="!editable"
                      :rules="phoneRules"
                      clearable
                      type="number"
                      label="Телефон компании"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="curCompany.site"
                      :disabled="!editable"
                      clearable
                      hide-details
                      label="Сайт компании"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="curCompany.instagram"
                      :disabled="!editable"
                      clearable
                      hide-details
                      label="Инстаграм компании"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                      v-model="curCompany.description"
                      :disabled="!editable"
                      clearable
                      hide-details
                      label="Описание компании"
                      rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                      v-model="curCompany.ids_brands"
                      :items="listBrands"
                      :disabled="!editable"
                      item-text="name"
                      item-value="id"
                      label="Обслуживаемые бренды"
                      multiple
                      chips
                      clearable
                      hide-details
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="curCompany.lat"
                      :disabled="!editable"
                      :rules="latRules"
                      clearable
                      label="Широта (Latitude)"
                      type="number"
                      step="0.000001"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      v-model="curCompany.long"
                      :disabled="!editable"
                      :rules="longRules"
                      clearable
                      label="Долгота (Longitude)"
                      type="number"
                      step="0.000001"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                      v-model="file"
                      :disabled="!editable"
                      accept="image/*"
                      clearable
                      label="Логотип компании"
                  ></v-file-input>
                  <!-- @change="showLog(file)" -->
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
              :disabled="!valid || !editable"
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
          <span class="text-h5">Вы точно хотите удалить компанию?</span>
        </v-card-title>
        <v-card-text>
          {{ companyTitle }} будет удалена из списка компаний со всеми данными
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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Companies",
  data: () => ({
    titles: [
      { ID: 1, TEXT: "Имя компании", VALUE: "name" },
      { ID: 2, TEXT: "Адрес компании", VALUE: "physical_address" },
      { ID: 3, TEXT: "Дата создания", VALUE: "created_at" },
      { ID: 4, TEXT: "Email", VALUE: "email" },
      { ID: 5, TEXT: "Телефон компании", VALUE: "telephone" },
      { ID: 6, TEXT: "Сайт компании", VALUE: "site" },
      { ID: 7, TEXT: "Инстаграм компании", VALUE: "instagram" },
      { ID: 8, TEXT: "Широта", VALUE: "lat" },
      { ID: 9, TEXT: "Долгота", VALUE: "long" },
      { ID: 10, TEXT: "Логотип компании", VALUE: "logo" },
    ],
    changeCount: [5, 10, 15, 20, 25],
    selectedCount: 10,
    page: 1,
    showCard: false,
    companyTitle: "Новая компания",
    valid: false,
    nameRules: [
      (v) => !!v || "Обязательное поле",
      (v) => !v || v.length <= 100 || "Не должно содержать больше 100 символов",
    ],
    emailRules: [
      (v) => !v || /.+@.+\..+/.test(v) || "Некорректный email"
    ],
    latRules: [
      (v) => !v || (v >= -90 && v <= 90) || "Широта от -90 до 90"
    ],
    longRules: [
      (v) => !v || (v >= -180 && v <= 180) || "Долгота от -180 до 180"
    ],
    phoneRules: [
      (v) => !v || /^[\d\s\-\+\(\)]+$/.test(v) || "Некорректный номер телефона"
    ],
    file: [],
    delCard: false,
    editable: true,
    allSelected: false,
    selectedItems: [],
  }),
  computed: {
    ...mapState({
      listItems: (state) => state.Companies.listCompanies,
      deleteModal: (state) => state.Companies.deleteModal,
      listBrands: (state) => state.Brands.listBrands,
    }),
    curCompany: {
      get() {
        return this.$store.state.Companies.company;
      },
      set(value) {
        this.$store.commit("Companies/setCompanyData", value);
      },
    },
  },
  created() {
    this.loadCompanies();
    this.$store.dispatch("getListBrands");
  },
  methods: {
    ...mapActions("Companies", [
      "getListCompanies",
      "createCompany",
      "updateCompany",
      "deleteCompany",
      "clearCompany",
    ]),
    ...mapMutations("Companies", ["setCompanyData", "clearCompany"]),
    
    async loadCompanies() {
      await this.getListCompanies();
    },
    
    openCreateModal() {
      this.clearCompany();
      this.companyTitle = "Новая компания";
      this.showCard = true;
    },
    
    onEditCard(row) {
      this.setCompanyData({
        id: row.id,
        name: row.name,
        physical_address: row.physical_address,
        email: row.email,
        telephone: row.telephone,
        site: row.site,
        instagram: row.instagram,
        description: row.description,
        lat: row.lat,
        long: row.long,
        ids_brands: row.ids_brands || [],
        e_client_files: row.e_client_files || [],
      });
      this.companyTitle = row.name;
      this.showCard = true;
    },
    
    onDelCard(row) {
      this.delCard = true;
      this.companyTitle = row.name;
      this.setCompanyData({ id: row.id });
    },
    
    async deleteCard() {
      await this.deleteCompany();
      await this.loadCompanies();
      this.delCard = false;
    },
    
    onShowCard(row) {
      this.onEditCard(row);
      this.editable = false;
    },
    
    closeCard() {
      this.showCard = false;
      this.editable = true;
      this.clearCompany();
    },
    
    async saveCreate() {
      if (!this.curCompany.name) return;

      if (this.curCompany.id) {
        await this.updateCompany();
      } else {
        await this.createCompany();
      }

      await this.loadCompanies();
      this.showCard = false;
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
    
    async deleteSelected() {
      if (!this.selectedItems.length) return;

      for (const id of this.selectedItems) {
        this.setCompanyData({ id });
        await this.deleteCompany();
      }

      this.selectedItems = [];
      await this.loadCompanies();
    },
    
    setSelect(row) {
      if (row.SELECTED) {
        this.selectedItems.push(row.id);
      } else {
        const index = this.selectedItems.findIndex((i) => i === row.id);
        if (index !== -1) this.selectedItems.splice(index, 1);
      }
    },
  },
};
</script>



<style lang="scss" scoped>
@import "src/assets/styles/table";
</style>
