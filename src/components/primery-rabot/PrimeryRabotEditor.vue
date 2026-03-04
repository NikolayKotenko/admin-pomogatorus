<template>
  <div>
    <TextAreaStyled
      :data="$store.state.PrimeryRabot.entry.name"
      ref="ref_name_specification"
      is-clearable
      :is-flat="true"
      :placeholder="'Наименование'"
      :rows-count="'1'"
      @update-input="updateEntryLocal('name', $event)"
      :is-loading="$store.state.loadingRequestGeneral"
      :is-disabled="!$store.state.PrimeryRabot.entry.id"
    ></TextAreaStyled>
    <v-text-field
      v-model="$store.state.PrimeryRabot.entry.code"
      label="code - это url детальной страницы"
      disabled
      hide-details
    ></v-text-field>
    <TextAreaStyled
      :data="$store.state.PrimeryRabot.entry.description"
      :is-flat="true"
      :placeholder="'Описание'"
      :rows-count="'1'"
      class="pt-5 pb-5"
      @update-input="updateEntryLocal('description', $event)"
      :is-loading="$store.state.loadingRequestGeneral"
      :is-disabled="!$store.state.PrimeryRabot.entry.id"
    ></TextAreaStyled>
    <!-- Ваша дропзона -->
    <div
      v-if="!$store.state.PrimeryRabot.entry._image?.id"
      class="dialog_dropzone_wrapper"
    >
      <vue-dropzone
        id="primeryRabotDropzone"
        ref="myVueDropzone"
        :class="{ loading_dropzone: $store.state.loadingRequestGeneral }"
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
        <div class="subtitle" style="color: firebrick; font-size: 16px">
          {{
            $store.state.loadingRequestGeneral
              ? "Загрузка..."
              : "Загрузите схему для спецификации (1 изображение)"
          }}
        </div>
      </vue-dropzone>
      <!-- Превью загруженного изображения -->
      <div
        v-if="$store.state.PrimeryRabot.entry._image?.id"
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

    <template v-if="$store.state.PrimeryRabot.entry._image?.id">
      <div class="dialog_dropzone_inputs">
        <span class="dialog_dropzone_inputs__label">
          [{{ $store.state.PrimeryRabot.entry._image.filename }}]
        </span>
      </div>
    </template>

    <!-- Редактор хотспотов (только после загрузки) -->
    <div
      v-if="$store.state.PrimeryRabot.entry._image?.id"
      class="editor-section"
    >
      <!-- Превью с хотспотами -->
      <div ref="imageWrapper" class="diagram-wrapper" @click="onImageClick">
        <img
          :src="$store.state.PrimeryRabot.entry._image.orig_path"
          class="diagram-image"
          :style="isAddingHotspot ? 'cursor: crosshair;' : ''"
          alt="Схема спецификации"
          @load="onImageLoad"
          :width="802"
          :height="601"
        />
        <!-- Метки -->
        <div
          v-for="(spot, index) in $store.state.PrimeryRabot.entry._hotspots"
          :key="spot.id"
          class="hotspot-dot"
          :class="{ saved: spot.id }"
          :style="{ left: spot.hotspot_x + 'px', top: spot.hotspot_y + 'px' }"
          @click.stop="editHotspot(index)"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- Кнопка добавления метки -->
    <div
      class="controls mt-4 d-flex"
      v-if="$store.state.PrimeryRabot.entry._image?.id"
    >
      <v-btn
        color="primary"
        small
        :disabled="isAddingHotspot || !imageLoaded"
        @click="startAddHotspot"
      >
        {{ isAddingHotspot ? "Кликните по изображению..." : "Добавить метку" }}
      </v-btn>
      <v-btn
        class="ml-2"
        small
        color="error"
        :disabled="editedIndex === null"
        @click="removeHotspot(editedIndex)"
      >
        Удалить метку
      </v-btn>
      <v-btn
        v-if="$store.state.PrimeryRabot.entry._hotspots.length"
        color="warning"
        class="ml-auto"
        small
        :loading="isDeletingAll"
        :disabled="isDeletingAll"
        @click="clearAllHotspots"
      >
        {{
          isDeletingAll
            ? "Удаление..."
            : `Очистить все метки (${$store.state.PrimeryRabot.entry._hotspots.length})`
        }}
      </v-btn>
    </div>
    <!-- Форма активной метки -->
    <div
      v-if="
        $store.state.PrimeryRabot.entry._hotspots.length &&
        $store.state.PrimeryRabot.entry._hotspots[editedIndex]
      "
      class="edit-form mt-4 pa-4 border"
    >
      <h4>
        Метка {{ editedIndex + 1 }} ({{
          $store.state.PrimeryRabot.entry._hotspots[editedIndex].hotspot_x
        }}%,
        {{ $store.state.PrimeryRabot.entry._hotspots[editedIndex].hotspot_y }}%)
      </h4>

      <!--      <v-autocomplete-->
      <!--        v-model="-->
      <!--          $store.state.PrimeryRabot.entry._hotspots[editedIndex].ids_families-->
      <!--        "-->
      <!--        :items="$store.state.PrimeryRabot.listFamilies"-->
      <!--        item-text="name"-->
      <!--        item-value="id"-->
      <!--        label="Семейства (можно выбрать несколько)"-->
      <!--        clearable-->
      <!--        multiple-->
      <!--        chips-->
      <!--        small-chips-->
      <!--        deletable-chips-->
      <!--        class="mb-2"-->
      <!--        :disabled="-->
      <!--          true || $store.state.loadingRequestGeneral || !hasChanges(editedIndex)-->
      <!--        "-->
      <!--      />-->

      <v-autocomplete
        v-model="
          $store.state.PrimeryRabot.entry._hotspots[editedIndex]
            .ids_nomenclatures
        "
        :items="$store.state.PrimeryRabot.listNomenclatures"
        :item-text="getProductDisplayName"
        item-value="id"
        label="Номенклатура (можно выбрать несколько)"
        clearable
        multiple
        chips
        small-chips
        deletable-chips
        class="mb-2 mt-4"
        :disabled="
          $store.state.loadingRequestGeneral || !hasChanges(editedIndex)
        "
      />
      <v-text-field
        v-model="
          $store.state.PrimeryRabot.entry._hotspots[editedIndex].quantity
        "
        :disabled="
          $store.state.loadingRequestGeneral || !hasChanges(editedIndex)
        "
        clearable
        type="number"
        label="Количество"
      ></v-text-field>

      <div class="d-flex">
        <v-btn
          small
          color="success"
          :disabled="
            !hasChanges(editedIndex) || $store.state.loadingRequestGeneral
          "
          :loading="$store.state.loadingRequestGeneral"
          @click="saveCurrentHotspot"
        >
          Сохранить изменения
        </v-btn>

        <v-spacer />
      </div>
    </div>

    <!--  Уведомлялка об ошибке  -->
    <v-snackbar v-model="snackbar" :timeout="10000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbarText = ''">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import Request from "@/services/request";
import TextAreaStyled from "@/components/common/TextAreaStyled.vue";

export default {
  name: "PrimeryRabotEditor",
  components: { TextAreaStyled, vueDropzone: vue2Dropzone },
  data() {
    return {
      isAddingHotspot: false,
      editedIndex: null,
      imageLoaded: false,
      isDeletingAll: false,
      snackbarText: "",
      snackbar: false,
      debounceTimeout: null,
    };
  },
  watch: {
    snackbarText: {
      handler(v) {
        this.snackbar = !!v.length;
      },
    },
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
  },
  mounted() {
    // Загружаем семейства и номенклатуру, чтобы выбирать при поставновке меток
    this.$store.dispatch("PrimeryRabot/getListFamilies");
    this.$store.dispatch("PrimeryRabot/getListNomenclature");
  },
  methods: {
    // Дропзона
    sendingData(file, xhr, formData) {
      // if (this.$refs.ref_name_specification.validate(true) === false) {
      //   this.snackbarText = "Name обязательно поле для заполнения";
      //   return false;
      // }
      this.$store.state.loadingRequestGeneral = true;
      formData.append("uuid", file.upload.uuid);
    },
    async successData(file, response) {
      // Создаем спецификацию
      const spec = await Request.post(
        `${this.$store.state.BASE_URL}/entity/specifications`,
        {
          id_image: response.data.id,
          name: this.$store.state.PrimeryRabot.entry.name,
          description: this.$store.state.PrimeryRabot.entry.description,
        }
      );
      if (spec.isError) {
        this.snackbarText = "Не создалась спецификация. " + spec.message;
        throw new Error("Не создалась спецификация. " + spec.message);
      }

      this.$store.state.PrimeryRabot.entry.id = spec.data.id;
      await this.$store.dispatch("PrimeryRabot/getSetOnceEntry");
      this.$store.state.loadingRequestGeneral = false;
    },
    triggerUpload() {
      document.getElementById("primeryRabotDropzone")?.click();
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

      this.$store.state.PrimeryRabot.entry._hotspots.push({
        id: null,
        hotspot_x: Math.round(xPixel), // или просто число Math.round(xPixel)
        hotspot_y: Math.round(yPixel), // или просто число Math.round(yPixel)
        ids_nomenclatures: [],
        ids_families: [],
        id_specification: this.$store.state.PrimeryRabot.entry.id,
      });

      this.editedIndex =
        this.$store.state.PrimeryRabot.entry._hotspots.length - 1;
      this.isAddingHotspot = false;
    },
    onImageLoad() {
      this.imageLoaded = true;
    },
    editHotspot(index) {
      this.editedIndex = index;
    },
    hasChanges(index) {
      const hotspot = this.$store.state.PrimeryRabot.entry._hotspots[index];
      return !hotspot.id;
    },

    updateEntryLocal(keyEntry, valueEntry) {
      this.$store.state.PrimeryRabot.entry[keyEntry] = valueEntry;

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.dispatch("PrimeryRabot/updateEntry");
      }, 1000);
    },

    async clearAllHotspots(isDeleteModal = false) {
      if (!isDeleteModal) {
        if (
          !confirm(
            `Удалить все метки (${this.$store.state.PrimeryRabot.entry._hotspots.length} шт.)?`
          )
        ) {
          return;
        }
      }

      const savedHotspots =
        this.$store.state.PrimeryRabot.entry._hotspots.filter((h) => h.id);
      this.editedIndex = null;

      const deletePromises = savedHotspots.map((hotspot) =>
        Request.delete(
          `${this.$store.state.BASE_URL}/m-to-o/specification-hotspots/${hotspot.id}`
        ).catch((e) => {
          console.error(`Ошибка удаления метки ${hotspot.id}:`, e);
          return { error: true, id: hotspot.id };
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

      this.editedIndex = null;
      await this.$store.dispatch("PrimeryRabot/getSetOnceEntry");
    },
    async saveHotspot(hotspot) {
      try {
        if (!hotspot.id_specification)
          throw new Error("Не заполнен id_specification");

        const response = await Request.post(
          `${this.$store.state.BASE_URL}/m-to-o/specification-hotspots`,
          {
            id_specification: hotspot.id_specification,
            ids_nomenclatures: hotspot.ids_nomenclatures || [],
            ids_families: hotspot.ids_families || [],
            hotspot_x: Math.round(hotspot.hotspot_x),
            hotspot_y: Math.round(hotspot.hotspot_y),
            quantity: hotspot.quantity || 1,
          }
        );
        if (response.isError)
          throw new Error(
            "Ошибка post запроса /m-to-o/specification-hotspots - " +
              response.message
          );

        await this.$store.dispatch("PrimeryRabot/getSetOnceEntry");
        return true;
      } catch (e) {
        console.error("Ошибка сохранения метки:", e);
        return false;
      }
    },
    async updateHotspot(hotspot) {
      try {
        if (!hotspot.id)
          throw new Error("Нет hotspot.id в текущей точке для Request.put");

        await Request.put(
          `${this.$store.state.BASE_URL}/m-to-o/specification-hotspots/${hotspot.id}`,
          {
            ids_nomenclatures: hotspot.ids_nomenclatures || [],
            ids_families: hotspot.ids_families || [],
            hotspot_x: Math.round(hotspot.hotspot_x),
            hotspot_y: Math.round(hotspot.hotspot_y),
            quantity: hotspot.quantity || 1,
          }
        );

        return true;
      } catch (e) {
        console.error("Ошибка обновления метки:", e);
        return false;
      }
    },
    async removeHotspot(index) {
      const hotspot = this.$store.state.PrimeryRabot.entry._hotspots[index];

      if (!hotspot.id) {
        this.$store.state.PrimeryRabot.entry._hotspots.splice(index, 1);
      } else {
        await Request.delete(
          `${this.$store.state.BASE_URL}/m-to-o/specification-hotspots/${hotspot.id}`
        );
        await this.$store.dispatch("PrimeryRabot/getSetOnceEntry");
      }

      this.snackbarText = "Метка удалена";
      this.editedIndex = null;
    },
    async saveCurrentHotspot() {
      if (this.editedIndex === null) return;

      const hotspot =
        this.$store.state.PrimeryRabot.entry._hotspots[this.editedIndex];

      if (!hotspot.ids_nomenclatures?.length && !hotspot.ids_families?.length) {
        this.snackbarText = "Выберите хотя бы одну номенклатуру или семейство";
        return;
      }
      this.$store.state.loadingRequestGeneral = true;

      if (hotspot.id) await this.updateHotspot(hotspot);
      else await this.saveHotspot(hotspot);

      this.$store.state.loadingRequestGeneral = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#primeryRabotDropzone {
  cursor: pointer;
  &.loading_dropzone {
    cursor: not-allowed;
    pointer-events: none;
  }
}
.editor-section {
  //max-width: 810px;
  //max-height: 455px;
  //max-width: 1000px;
  //max-height: 350px;
  //overflow-x: auto;
  //overflow-y: auto;
}
.diagram-wrapper {
  position: relative;
  display: inline-block;
}
.diagram-image {
  display: block;
  object-fit: cover;
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
