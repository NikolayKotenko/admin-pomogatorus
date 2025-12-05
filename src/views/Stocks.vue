<template>
  <div class="table-container stocks">
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

                  <!-- DROPZONE -->
                  <v-btn
                    :disabled="$store.state.loadingRequestGeneral"
                    @click="
                      $refs.StockDropZone.removeAllFiles();
                      stateDropzone = true;
                      insertDropzoneData();
                    "
                  >
                    Изображение
                    <v-icon
                      color="grey lighten-1"
                      style="transform: rotate(45deg)"
                      >mdi-paperclip</v-icon
                    >
                    [{{ dropzone_uploaded.length }}]
                  </v-btn>
                  <v-dialog
                    v-model="stateDropzone"
                    :eager="true"
                    max-width="600"
                  >
                    <v-card>
                      <v-card-title>
                        <span v-if="!dropzone_uploaded.length" class="text-h7"
                          >Загрузите изображение</span
                        >
                        <span v-else class="text-h7"
                          >Изображение уже загружено</span
                        >
                      </v-card-title>
                      <v-card-text class="dialog_dropzone">
                        <div
                          v-show="!dropzone_uploaded.length"
                          class="dialog_dropzone_wrapper"
                        >
                          <vue-dropzone
                            id="dropzone"
                            ref="StockDropZone"
                            :options="options"
                            :useCustomSlot="true"
                            @vdropzone-success="successData"
                            @vdropzone-sending="sendingData"
                          >
                            <h3 class="dropzone-custom-title">
                              <v-icon
                                color="grey lighten-1"
                                size="120"
                                style="transform: rotate(45deg)"
                              >
                                mdi-paperclip
                              </v-icon>
                            </h3>
                            <div class="subtitle" style="color: darkgrey">
                              Для вставки изображения перетащите файл в зону или
                              нажмите на скрепку
                            </div>
                          </vue-dropzone>
                        </div>
                        <template>
                          <div
                            v-for="(item, index) in dropzone_uploaded"
                            :key="index"
                            class="dialog_dropzone_inputs"
                          >
                            <v-img :src="item.full_path" contain></v-img>
                            <span class="dialog_dropzone_inputs__label">
                              {{ item.filename }}</span
                            >
                            <InputStyled
                              :data="item.alt_image"
                              :index-array="index"
                              :is-disabled="$store.state.loadingRequestGeneral"
                              :is-loading="$store.state.loadingRequestGeneral"
                              :placeholder="'alt-наименование изображения'"
                              @update-input="setAlt"
                            />
                            <InputStyled
                              :data="item.title_image"
                              :index-array="index"
                              :is-disabled="$store.state.loadingRequestGeneral"
                              :is-loading="$store.state.loadingRequestGeneral"
                              :placeholder="'подпись изображения'"
                              @update-input="setTitle"
                            />
                          </div>
                        </template>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          v-if="dropzone_uploaded.length"
                          :disabled="$store.state.loadingRequestGeneral"
                          :loading="$store.state.loadingRequestGeneral"
                          color="blue darken-1"
                          text
                          @click="removedFile()"
                        >
                          Очистить
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          :disabled="$store.state.loadingRequestGeneral"
                          :loading="$store.state.loadingRequestGeneral"
                          color="green darken-1"
                          text
                          @click="
                            stateDropzone = false;
                            updateDropZoneImage();
                          "
                        >
                          Готово
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { mapActions, mapMutations, mapState } from "vuex";
import InputStyled from "@/components/common/InputStyled.vue";
import Request from "@/services/request";

export default {
  name: "Stocks",
  components: {
    InputStyled,
    vueDropzone: vue2Dropzone,
  },
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
    dropzone_uploaded: [],
    stateDropzone: false,
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
    options() {
      return {
        url: this.$store.state.BASE_URL + "/entity/files",
        // url: 'https://httpbin.org/post',
        destroyDropzone: false,
        duplicateCheck: true,
        headers: {
          Authorization: this.$store.getters.getToken,
        },
      };
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
      this.setEntryData(row);
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
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.StockDropZone.manuallyAddFile(
          this.dropzone_uploaded[0],
          this.dropzone_uploaded[0].full_path
        );
      });
    },
    /* DROPZONE */
    sendingData(file, xhr, formData) {
      formData.append("uuid", file.upload.uuid);
      formData.append("id_stock", this.curEntry.id);
    },
    async successData(file, response) {
      console.log("successData");
      console.log(response);
      const formatObj = Object.assign({}, response.data);
      this.dropzone_uploaded.push(formatObj);

      await this.$store.dispatch("onSubmit", {}, { root: true });
      await this.$router
        .replace({
          path: this.$route.path,
          query: this.$route.query,
        })
        .catch(() => {});
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      await Request.put(
        this.$store.state.BASE_URL +
          "/entity/files/" +
          this.dropzone_uploaded[0].id,
        this.dropzone_uploaded[0]
      );
    },
    async removedFile() {
      if (!this.dropzone_uploaded.length) return false;

      await this.$store.dispatch(
        "deleteFileGeneral",
        this.dropzone_uploaded[0].id
      );
      this.dropzone_uploaded = [];
      this.$refs.StockDropZone.removeAllFiles();
    },
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value;
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value;
    },
  },
  watch: {
    "curEntry._images": {
      handler(newValue) {
        this.dropzone_uploaded = [];
        if (!newValue) return false;
        this.dropzone_uploaded = newValue;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container-wrapper-main {
  grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
</style>
