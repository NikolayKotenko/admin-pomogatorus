<template>
  <div>
    <!-- Ваша дропзона -->
    <div v-if="!dropzone_uploaded.length" class="dialog_dropzone_wrapper">
      <vue-dropzone
        v-if="!loading_dropzone"
        id="specDropzone"
        ref="myVueDropzone"
        :options="dropzoneOptions"
        :use-custom-slot="true"
        @vdropzone-success="successData"
        @vdropzone-sending="sendingData"
      >
        <h3 class="dropzone-custom-title">
          <v-icon
            color="grey lighten-1"
            size="120"
            style="transform: rotate(45deg)"
          >
            mdi-image-filter-center-focus
          </v-icon>
        </h3>
        <div class="subtitle" style="color: darkgrey">
          Загрузите схему для спецификации (1 изображение) размером 810px х
          455px
        </div>
        <div class="subtitle" style="color: red" v-if="invalidWidthHeight">
          Cхема должна быть размером: 810px (ширина) х 455px (высота)
        </div>
      </vue-dropzone>

      <!-- Превью загруженного изображения -->
      <div
        v-if="dropzone_uploaded.length"
        class="dialog_dropzone_wrapper__upload"
        @click="triggerUpload()"
      >
        <v-icon
          color="grey lighten-1"
          size="60"
          style="transform: rotate(45deg)"
        >
          mdi-image-filter-center-focus
        </v-icon>
      </div>
    </div>

    <!-- Инпуты для первого изображения (как у вас) -->
    <template v-if="dropzone_uploaded.length">
      <div class="dialog_dropzone_inputs">
        <span class="dialog_dropzone_inputs__label">
          [{{ dropzone_uploaded[0].filename }}] Схема спецификации
        </span>
        <v-text-field
          v-model="dropzone_uploaded[0].title_image"
          placeholder="Название схемы"
          label="Название схемы (опционально)"
          class="mb-2"
        />
      </div>
    </template>

    <!-- Редактор хотспотов (только после загрузки) -->
    <div v-if="dropzone_uploaded.length" class="editor-section mt-6">
      <!-- Превью с хотспотами -->
      <div ref="imageWrapper" class="diagram-wrapper" @click="onImageClick">
        <img
          :src="dropzone_uploaded[0].url"
          class="diagram-image"
          :style="isAddingHotspot ? 'cursor: crosshair;' : ''"
          alt="Схема спецификации"
          @load="onImageLoad"
          :width="dropzone_uploaded[0].image_width"
          :height="dropzone_uploaded[0].image_height"
        />
        <!-- Метки -->
        <div
          v-for="(spot, index) in hotspots"
          :key="spot.id"
          class="hotspot-dot"
          :class="{ saved: spot.saved }"
          :style="{ left: spot.x + 'px', top: spot.y + 'px' }"
          @click.stop="editHotspot(index)"
        >
          {{ index + 1 }}
        </div>
      </div>

      <!-- Кнопка добавления метки -->
      <div class="controls mt-4">
        <v-btn
          color="primary"
          :disabled="isAddingHotspot || !imageLoaded || hasUnsavedHotspot"
          @click="startAddHotspot"
        >
          {{
            isAddingHotspot ? "Кликните по изображению..." : "Добавить метку"
          }}
        </v-btn>
        <v-btn
          v-if="hotspots.length"
          color="warning"
          class="ml-2"
          :loading="isDeletingAll"
          :disabled="isDeletingAll"
          @click="clearAllHotspots"
        >
          {{ isDeletingAll ? "Удаление..." : `Очистить (${hotspots.length})` }}
        </v-btn>
      </div>

      <!-- Форма активной метки -->
      <div v-if="editedIndex !== null" class="edit-form mt-4 pa-4 border">
        <h4>
          Метка {{ editedIndex + 1 }} ({{ hotspots[editedIndex].x }}%,
          {{ hotspots[editedIndex].y }}%)
        </h4>

        <v-autocomplete
          v-model="hotspots[editedIndex].idsFamilies"
          :items="families"
          item-text="name"
          item-value="id"
          label="Семейства (можно выбрать несколько)"
          clearable
          multiple
          chips
          small-chips
          deletable-chips
          class="mb-2"
          :disabled="true || hotspots[editedIndex].isLoading"
        />

        <v-autocomplete
          v-model="hotspots[editedIndex].idsNomenclatures"
          :items="products"
          :item-text="getProductDisplayName"
          item-value="id"
          label="Номенклатура (можно выбрать несколько)"
          clearable
          multiple
          chips
          small-chips
          deletable-chips
          class="mb-2"
          :disabled="hotspots[editedIndex].isLoading"
        />

        <div class="d-flex">
          <v-btn
            small
            color="success"
            :disabled="
              !hasChanges(editedIndex) || hotspots[editedIndex].isLoading
            "
            :loading="hotspots[editedIndex].isLoading"
            @click="saveCurrentHotspot"
          >
            Сохранить изменения
          </v-btn>

          <v-spacer />

          <v-btn small color="error" @click="removeHotspot(editedIndex)">
            Удалить
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import Request from "@/services/request";

export default {
  name: "SpecificationEditor",
  components: { vueDropzone: vue2Dropzone },
  props: {
    initialData: { type: Object, default: () => ({}) },
    products: { type: Array, default: () => [] },
  },
  data() {
    return {
      index_uploaded: 1,
      dropzone_uploaded: [],
      loading_dropzone: false,
      previewHtml: null,
      hotspots: [],
      isAddingHotspot: false,
      editedIndex: null,
      imageLoaded: false,
      families: [],
      isDeletingAll: false,
      invalidWidthHeight: false,
    };
  },
  computed: {
    dropzoneOptions() {
      return {
        url: `${this.$store.state.BASE_URL}/entity/files`,
        destroyDropzone: false,
        headers: { Authorization: `666777` },
        duplicateCheck: true,
        maxFiles: 1,
        acceptedFiles: "image/*",
        addRemoveLinks: true,
      };
    },
    hasUnsavedHotspot() {
      return this.hotspots.some((h) => !h.saved);
    },
  },
  mounted() {
    if (this.initialData.imageUrl) {
      this.dropzone_uploaded = [
        {
          id: this.initialData.id,
          url: this.initialData.imageUrl,
          uuid: this.initialData.imageUuid,
          filename: "scheme.jpg",
          title_image: "",
          index: 1,
        },
      ];
      this.hotspots = this.initialData.hotspots || [];
    }
    this.loadFamilies();
  },
  methods: {
    // Дропзона
    sendingData(file, xhr, formData) {
      // if (file.width !== 810 && file.height !== 455) {
      //   console.log("NE PRAVILNO");
      //   this.invalidWidthHeight = true;
      //   return;
      // }
      console.log("sendingData", { file, xhr, formData });
      formData.append("uuid", file.upload.uuid);
      formData.append(
        "id_article",
        this.$store.state.ArticleModule.newArticle?.id
      );
    },
    successData(file, response) {
      console.log("successData file", { file: file, response: response });
      const formatObj = Object.assign({}, response.data);
      console.log("formatObj", formatObj);
      formatObj.index = this.index_uploaded;
      this.index_uploaded++;
      this.dropzone_uploaded = [formatObj];

      this.$nextTick(() => {
        const closeBtn = document.getElementById("close-1");
        if (closeBtn) {
          closeBtn.onclick = () => this.removedFile(1);
        }
      });
    },
    removedFile(id) {
      const index = this.dropzone_uploaded.findIndex(
        (elem) => elem.index === id
      );
      if (index !== -1) {
        this.$store
          .dispatch("deleteFile", this.dropzone_uploaded[index].id)
          .then(() => {
            this.dropzone_uploaded = [];
            this.hotspots = [];
            this.imageLoaded = false;
          });
      }
    },
    setTitle(value, index) {
      if (this.dropzone_uploaded[index]) {
        this.dropzone_uploaded[index].title_image = value;
      }
    },
    triggerUpload() {
      document.getElementById("specDropzone")?.click();
    },

    // Грузим данные
    async loadFamilies() {
      try {
        const selectQuery = Request.ConstructSelectQuery(["*"]);
        const response = await Request.get(
          `${this.$store.state.BASE_URL}/dictionary/nomenclature-family?${selectQuery}`
        );
        this.families = response.data;
      } catch (e) {
        console.error("Ошибка загрузки семейств:", e);
        this.families = [];
      }
    },

    getProductDisplayName(product) {
      return `${product._family?.name || ""} ${product.name}`.trim();
    },

    // Редактирование хотспотов

    startAddHotspot() {
      this.isAddingHotspot = true;
      this.editedIndex = null;
    },
    onImageClick(e) {
      if (!this.isAddingHotspot || !this.imageLoaded) return;

      const rect = this.$refs.imageWrapper.getBoundingClientRect();

      const xPixel = e.clientX - rect.left;
      const yPixel = e.clientY - rect.top;
      console.log("Координаты в пикселях:", {
        xPixel: Math.round(xPixel),
        yPixel: Math.round(yPixel),
        rect,
      });

      this.hotspots.push({
        id: Date.now(),
        x: Math.round(xPixel), // или просто число Math.round(xPixel)
        y: Math.round(yPixel), // или просто число Math.round(yPixel)
        idsNomenclatures: [],
        idsFamilies: [],
        saved: false,
        specificationId: null,
        isLoading: false,
        originalData: null,
      });

      this.editedIndex = this.hotspots.length - 1;
      this.isAddingHotspot = false;
    },
    onImageLoad() {
      this.imageLoaded = true;
    },
    editHotspot(index) {
      const hotspot = this.hotspots[index];

      if (!hotspot.originalData && hotspot.saved) {
        hotspot.originalData = {
          idsNomenclatures: [...(hotspot.idsNomenclatures || [])],
          idsFamilies: [...(hotspot.idsFamilies || [])],
        };
      }

      this.editedIndex = index;
    },
    hasChanges(index) {
      const hotspot = this.hotspots[index];

      if (!hotspot.saved) {
        return (
          hotspot.idsNomenclatures?.length > 0 ||
          hotspot.idsFamilies?.length > 0
        );
      }

      if (!hotspot.originalData) return false;

      const nomenclaturesChanged =
        JSON.stringify([...(hotspot.idsNomenclatures || [])].sort()) !==
        JSON.stringify(
          [...(hotspot.originalData.idsNomenclatures || [])].sort()
        );

      const familiesChanged =
        JSON.stringify([...(hotspot.idsFamilies || [])].sort()) !==
        JSON.stringify([...(hotspot.originalData.idsFamilies || [])].sort());

      return nomenclaturesChanged || familiesChanged;
    },

    removeHotspot(index) {
      this.hotspots.splice(index, 1);
      if (this.editedIndex === index) this.editedIndex = null;
    },
    async clearAllHotspots() {
      if (!confirm(`Удалить все метки (${this.hotspots.length} шт.)?`)) {
        return;
      }

      const savedHotspots = this.hotspots.filter(
        (h) => h.saved && h.specificationId
      );

      if (savedHotspots.length === 0) {
        this.hotspots = [];
        this.editedIndex = null;
        console.log("Метки очищены (несохранённые)");
        return;
      }

      const deletePromises = savedHotspots.map((hotspot) =>
        Request.delete(
          `${this.$store.state.BASE_URL}/entity/specifications/${hotspot.specificationId}`
        ).catch((e) => {
          console.error(`Ошибка удаления метки ${hotspot.specificationId}:`, e);
          return { error: true, id: hotspot.specificationId };
        })
      );

      try {
        const results = await Promise.all(deletePromises);

        const failed = results.filter((r) => r?.error);

        if (failed.length > 0) {
          console.error(
            `Не удалось удалить ${failed.length} из ${savedHotspots.length} меток`
          );
        } else {
          console.log(`Удалено ${savedHotspots.length} меток`);
        }
      } catch (e) {
        console.error("Ошибка при массовом удалении:", e);
      }

      this.hotspots = [];
      this.editedIndex = null;
    },

    // editSavedHotspot (index) {
    //   const hotspot = this.hotspots[index];
    //   hotspot.saved = false;
    //   this.editedIndex = index;
    // },

    async saveHotspot(hotspot) {
      try {
        const response = await Request.post(
          `${this.$store.state.BASE_URL}/entity/specifications`,
          {
            id_image: this.dropzone_uploaded[0].id,
            ids_nomenclatures: hotspot.idsNomenclatures || [],
            ids_families: hotspot.idsFamilies || [],
            hotspot_x: Math.round(hotspot.x),
            hotspot_y: Math.round(hotspot.y),
            quantity: 1,
          }
        );

        if (response.data?.id) {
          hotspot.specificationId = response.data.id;
        }

        return true;
      } catch (e) {
        console.error("Ошибка сохранения метки:", e);
        return false;
      }
    },
    async updateHotspot(hotspot) {
      try {
        await Request.put(
          `${this.$store.state.BASE_URL}/entity/specifications/${hotspot.specificationId}`,
          {
            id_image: this.dropzone_uploaded[0].id,
            ids_nomenclatures: hotspot.idsNomenclatures || [],
            ids_families: hotspot.idsFamilies || [],
            hotspot_x: Math.round(hotspot.x),
            hotspot_y: Math.round(hotspot.y),
            quantity: 1,
          }
        );

        return true;
      } catch (e) {
        console.error("Ошибка обновления метки:", e);
        return false;
      }
    },
    async removeHotspot(index) {
      const hotspot = this.hotspots[index];

      if (hotspot.saved && hotspot.specificationId) {
        try {
          await Request.delete(
            `${this.$store.state.BASE_URL}/entity/specifications/${hotspot.specificationId}`
          );

          this.$toast?.success("Метка удалена");
        } catch (e) {
          console.error("Ошибка удаления метки:", e);
          this.$toast?.error("Ошибка удаления");
          return;
        }
      }

      this.hotspots.splice(index, 1);
      if (this.editedIndex === index) this.editedIndex = null;
    },

    async saveCurrentHotspot() {
      if (this.editedIndex === null) return;

      const hotspot = this.hotspots[this.editedIndex];

      if (!hotspot.idsNomenclatures?.length && !hotspot.idsFamilies?.length) {
        this.$toast?.error("Выберите хотя бы одну номенклатуру или семейство");
        return;
      }

      hotspot.isLoading = true;
      let saved = false;

      if (hotspot.specificationId) {
        saved = await this.updateHotspot(hotspot);
      } else {
        saved = await this.saveHotspot(hotspot);
      }

      hotspot.isLoading = false;

      if (saved) {
        hotspot.saved = true;

        hotspot.originalData = {
          idsNomenclatures: [...(hotspot.idsNomenclatures || [])],
          idsFamilies: [...(hotspot.idsFamilies || [])],
        };

        this.$toast?.success("Метка сохранена");
        this.editedIndex = null;
      } else {
        this.$toast?.error("Ошибка сохранения метки");
      }
    },

    loadExistingSpecification(data) {
      console.log("loadExistingSpecification", data);
      this.dropzone_uploaded = [
        {
          id: data.imageId,
          url: data.imageUrl,
          uuid: data.imageUuid,
          filename: "specification.jpg",
          title_image: "",
          index: 1,
          image_width: data.imageWidth,
          image_height: data.imageHeight,
        },
      ];

      // Добавляем originalData для каждой существующей метки
      this.hotspots = (data.hotspots || []).map((h) => ({
        ...h,
        isLoading: false,
        originalData: {
          idsNomenclatures: [...(h.idsNomenclatures || [])],
          idsFamilies: [...(h.idsFamilies || [])],
        },
      }));

      this.imageLoaded = true;
    },

    // Чистим
    //TODO удалять файл если он не связан с точками?
    clearAllData() {
      this.dropzone_uploaded = [];
      this.hotspots = [];
      this.imageLoaded = false;
      this.isAddingHotspot = false;
      this.editedIndex = null;
      this.index_uploaded = 1;

      if (this.$refs.myVueDropzone && this.$refs.myVueDropzone.dropzone) {
        this.$refs.myVueDropzone.dropzone.removeAllFiles(true);
      }
    },
  },
};
</script>

<style scoped>
/* ваши стили + новые */
.diagram-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  //max-width: 810px;
  //max-height: 455px;
}
.diagram-image {
  max-width: 100%;
  display: block;
}
.hotspot-dot {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.hotspot-dot:hover {
  background: #ff5722;
  transform: translate(-50%, -50%) scale(1.1);
}

.hotspot-dot.saved {
  background: #4caf50; /* зелёный для сохранённых */
}
.hotspot-dot:not(.saved) {
  background: #ff9800; /* оранжевый для несохранённых */
}
</style>
