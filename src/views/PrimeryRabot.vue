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
            <td>{{ row.code }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.description }}</td>
            <td>
              <img
                v-if="row._image"
                :src="row._image.thumb_path"
                alt=""
                class="main_img"
                style="object-fit: contain; width: 100%; height: 100%"
              />
            </td>
            <td>{{ row.created_at }}</td>
            <td>{{ row.updated_at }}</td>
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
    <v-dialog
      v-model="showCard"
      width="1200"
      @keydown.esc="closeCreateModal"
      @click:outside="closeCreateModal"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important"
            >Создать/редактировать спецификацию</span
          >
          <v-spacer />
          <v-btn icon @click="closeCreateModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <!-- DROPZONE -->
                  <PrimeryRabotEditor />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="delCard"
      max-width="600"
      @keydown.esc="sayModalNoDeleteCard"
      @click:outside="sayModalNoDeleteCard"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Вы точно хотите удалить эту запись ?</span>
        </v-card-title>
        <v-card-text>
          {{ curEntry.name }} будет удалена из списка со всеми данными
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteCard()"> Да</v-btn>
          <v-btn color="blue darken-1" text @click="sayModalNoDeleteCard()"
            >Нет</v-btn
          >
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
import PrimeryRabotEditor from "@/components/primery-rabot/PrimeryRabotEditor.vue";

export default {
  name: "PrimeryRabot",
  components: {
    PrimeryRabotEditor,
    InputStyled,
    vueDropzone: vue2Dropzone,
  },
  data: () => ({
    titles: [
      { ID: 1, TEXT: "Код (url)", VALUE: "code" },
      { ID: 2, TEXT: "Имя", VALUE: "name" },
      { ID: 3, TEXT: "Описание", VALUE: "description" },
      { ID: 5, TEXT: "Изображение", VALUE: "_image" },
      { ID: 6, TEXT: "Дата создания", VALUE: "created_at" },
      { ID: 7, TEXT: "Дата обновления", VALUE: "updated_at" },
    ],
    changeCount: [5, 10, 15, 20, 25],
    selectedCount: 10,
    page: 1,
    selectedItems: [],
    showCard: false,
    delCard: false,
    valid: false,
    datePicker: false,
    dropzone_uploaded: [],
    stateDropzone: false,
  }),
  created() {
    this.getListEntries();
  },
  computed: {
    ...mapState({
      listItems: (state) => state.PrimeryRabot.listEntries,
      listBrands: (state) => state.Brands.listBrands,
    }),
    curEntry: {
      get() {
        return this.$store.state.PrimeryRabot.entry;
      },
      set(value) {
        this.$store.commit("PrimeryRabot/setEntryData", value);
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
    ...mapActions("PrimeryRabot", [
      "getListEntries",
      "createEntry",
      "updateEntry",
      "deleteEntry",
      "clearEntry",
    ]),
    ...mapMutations("PrimeryRabot", ["setEntryData", "clearEntry"]),
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
      this.setEntryData(row);
    },
    async closeCreateModal() {
      this.showCard = false;
      this.editable = true;
      this.clearEntry();
      await this.getListEntries();
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
      //по сути после удаления файла вызывается Cascade удаление спецификации, а за ней и удаление точек это спецификации
      await this.$store.dispatch("deleteFile", this.curEntry._image.id);
      await this.deleteEntry();
      await this.getListEntries();
      this.delCard = false;
    },
    sayModalNoDeleteCard() {
      this.delCard = false;
      this.clearEntry();
    },
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.PrimeryRabotDropZone.manuallyAddFile(
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
      this.$refs.PrimeryRabotDropZone.removeAllFiles();
    },
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value;
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value;
    },
  },
  watch: {
    "curEntry._image": {
      handler(newValue) {
        this.dropzone_uploaded = [];
        if (!newValue) return false;
        this.dropzone_uploaded = newValue;
      },
    },
    showCard: {
      handler(v) {
        if (v === false) {
          this.clearEntry();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container-wrapper-main {
  grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
</style>
