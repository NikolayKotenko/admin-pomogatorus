<template>
  <div class="detail_container">
    <v-container>
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyled
          :current-rules="$store.state.requiredFieldRules"
          :data="$store.state.Brands.brand.name"
          :is-clearable="true"
          :is-disabled="
            $store.state.loadingRequestGeneral ||
            !$store.getters.stateEditCreate($route.query.action)
          "
          :is-outlined="true"
          :is-required="true"
          :item-text="'name'"
          :item-value="'id'"
          :placeholder="'Имя бренда'"
          class="mb-5"
          @update-input="setData"
          @change-input="onSubmitLocal"
        />
      </template>
      <template v-else>
        <v-autocomplete
          v-model="$store.state.Brands.brand"
          :disabled="$store.state.loadingRequestGeneral"
          :items="$store.state.Brands.listBrands"
          :loading="$store.state.loadingRequestGeneral"
          class="mb-5"
          dense
          hide-details
          item-text="name"
          item-value="id"
          label="Выберите бренд"
          outlined
          return-object
          :menu-props="{ maxHeight: '80vh' }"
        >
        </v-autocomplete>
      </template>

      <InputStyled
        :data="$store.state.Brands.brand.description"
        :is-disabled="
          $store.state.loadingRequestGeneral ||
          !$store.getters.stateEditCreate($route.query.action)
        "
        :is-outlined="true"
        persistent-placeholder
        :placeholder="'Введите описани бренда'"
        class="mb-5"
        @update-input="setBrandDescription"
      />

      <v-btn
        :disabled="
          $store.state.loadingRequestGeneral || $route.query.action !== 'edit'
        "
        @click="
          $refs.TagDropZone.removeAllFiles();
          stateDropzone = true;
          insertDropzoneData();
        "
      >
        Изображение
        <v-icon color="grey lighten-1" style="transform: rotate(45deg)"
          >mdi-paperclip</v-icon
        >
        [{{ dropzone_uploaded.length }}]
      </v-btn>
      <v-dialog v-model="stateDropzone" :eager="true" max-width="600">
        <v-card>
          <v-card-title>
            <span v-if="!dropzone_uploaded.length" class="text-h7"
              >Загрузите изображение</span
            >
            <span v-else class="text-h7">Изображение уже загружено</span>
          </v-card-title>
          <v-card-text class="dialog_dropzone">
            <div
              v-show="!dropzone_uploaded.length"
              class="dialog_dropzone_wrapper"
            >
              <vue-dropzone
                id="dropzone"
                ref="TagDropZone"
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
                  Для вставки изображения перетащите файл в зону или нажмите на
                  скрепку
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
              :disabled="
                $store.state.loadingRequestGeneral ||
                !$store.getters.stateEditCreate($route.query.action)
              "
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
    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
          v-if="$store.state.Brands.brand.id"
          :disabled="
            $store.state.loadingRequestGeneral || !$store.state.Brands.brand.id
          "
          color="red darken-1"
          text
          @click="$store.dispatch('stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
          v-if="$route.query.action"
          :disabled="$store.state.loadingRequestGeneral"
          color="white darken-1"
          text
          @click="$router.push({ path: $route.meta.returnLink.path })"
        >
          Отменить
        </v-btn>

        <v-btn
          :disabled="!$store.getters.stateEditCreate($route.query.action)"
          class="detail_footer__save_btn"
          color="blue darken-1"
          text
          @click.prevent="onSubmitLocal()"
        >
          Сохранить
        </v-btn>
      </v-container>
    </footer>

    <v-dialog v-model="$store.state.TagsModule.deleteModal" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important"
            >Вы точно хотите удалить тэг?</span
          >
        </v-card-title>
        <v-card-actions>
          <v-btn
            :disabled="$store.state.loadingRequestGeneral"
            :loading="$store.state.loadingRequestGeneral"
            color="blue darken-1"
            text
            @click="$store.dispatch('stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="$store.state.loadingRequestGeneral"
            :loading="$store.state.loadingRequestGeneral"
            color="red darken-1"
            text
            @click="deleteLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import InputStyled from "@/components/common/InputStyled.vue";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import Request from "@/services/request";
import brandsStore from "@/store/modules/brands";

const _store = brandsStore.state;
export default defineComponent({
  components: { vueDropzone: vue2Dropzone, InputStyled },
  name: "Brands",
  data: () => ({
    stateDropzone: false,
    dropzone_uploaded: [],
  }),
  async mounted() {
    await this.$store.dispatch("getListBrands", this.$route.params.id);
    await this.$store.dispatch("setTitle", this.$store.state.Brands.brand.name);
  },
  computed: {
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
  watch: {
    "$store.state.Brands.brand.id": {
      handler(newValue) {
        if (this.$route.query.action === "create") return false;

        const currentQuery = this.$route.query;
        const idEntry = newValue ? newValue : "";
        this.$router
          .replace({
            path: "/brands/" + idEntry,
            query: currentQuery,
          })
          .catch(() => {});

        this.$store.dispatch("setTitle", this.$store.state.Brands.brand.name);
      },
    },
    "$route.query.action": {
      handler(newValue) {
        if (newValue === "create") {
          this.$store.dispatch("clearBrand");
        }
      },
    },
    "$route.params.id": {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch("clearBrand");
        }
      },
    },
    "$store.state.Brands.brand.e_client_files": {
      handler(newValue) {
        if (!newValue) return false;
        this.dropzone_uploaded = [];
        this.dropzone_uploaded = newValue;
      },
    },
  },
  methods: {
    setData(value) {
      this.$store.state.Brands.brand.name = value;
    },
    setBrandDescription(value) {
      this.$store.state.Brands.brand.description = value;
    },
    sendingData(file, xhr, formData) {
      formData.append("uuid", file.upload.uuid);
      formData.append("id_brand", _store.brand.id);
    },
    async successData(file, response) {
      const formatObj = Object.assign({}, response.data);
      this.dropzone_uploaded.push(formatObj);

      await this.$store.dispatch("onSubmitBrands", {}, { root: true });
      await this.$router
        .replace({
          path: this.$route.path,
          query: this.$route.query,
        })
        .catch(() => {});
    },
    async onSubmitLocal() {
      await this.$store.dispatch("onSubmitBrands", {}, { root: true });
      if (this.$route.query.action === "create") {
        await this.$router
          .replace({
            path: this.$route.path + "/" + this.$store.state.Brands.brand.id,
            query: { action: "edit" },
          })
          .catch(() => {});
      } else {
        await this.$router
          .replace({ path: this.$route.meta.returnLink.path })
          .catch(() => {});
      }
    },

    //DROPZONE
    async removedFile() {
      if (!this.dropzone_uploaded.length) return false;

      await this.$store.dispatch(
        "deleteFileGeneral",
        this.dropzone_uploaded[0].id
      );
      this.dropzone_uploaded = [];
      this.$refs.TagDropZone.removeAllFiles();
    },
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.TagDropZone.manuallyAddFile(
          this.dropzone_uploaded[0],
          this.dropzone_uploaded[0].full_path
        );
      });
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
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value;
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value;
    },
    async deleteLocal() {
      await this.$store.dispatch("deleteBrand");
      await this.$router.push({ path: "/brands" }).catch(() => {});
    },
  },
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/detail";
</style>
