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
          <v-icon color="grey lighten-1" size="120" style="transform: rotate(45deg)">
            mdi-image-filter-center-focus
          </v-icon>
        </h3>
        <div class="subtitle" style="color: darkgrey">
          Загрузите схему для спецификации (1 изображение)
        </div>
      </vue-dropzone>
      
      <!-- Превью загруженного изображения -->
      <div
        v-if="dropzone_uploaded.length"
        class="dialog_dropzone_wrapper__upload"
        @click="triggerUpload()"
      >
        <v-icon color="grey lighten-1" size="60" style="transform: rotate(45deg)">
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
          :src="getImageUrl()"
          class="diagram-image"
          :style="isAddingHotspot ? 'cursor: crosshair;' : ''"
          alt="Схема спецификации"
          @load="onImageLoad"
        />
        <!-- Метки -->
        <div
          v-for="(spot, index) in hotspots"
          :key="spot.id"
          class="hotspot-dot"
          :style="{ left: spot.x + '%', top: spot.y + '%' }"
          @click.stop="editHotspot(index)"
        >
          {{ index + 1 }}
        </div>
      </div>

      <!-- Кнопка добавления метки -->
      <div class="controls mt-4">
        <v-btn
          color="primary"
          :disabled="isAddingHotspot || !imageLoaded"
          @click="startAddHotspot"
        >
          {{ isAddingHotspot ? 'Кликните по изображению...' : 'Добавить метку' }}
        </v-btn>
        <v-btn
          v-if="hotspots.length"
          color="warning"
          class="ml-2"
          @click="clearAllHotspots"
        >
          Очистить ({{ hotspots.length }})
        </v-btn>
      </div>

      <!-- Форма активной метки -->
      <div v-if="editedIndex !== null" class="edit-form mt-4 pa-4 border">
        <h4>Метка {{ editedIndex + 1 }} ({{ hotspots[editedIndex].x }}%, {{ hotspots[editedIndex].y }}%)</h4>
        <v-autocomplete
          v-model="hotspots[editedIndex].productId"
          :items="products"
          item-text="name"
          item-value="id"
          label="Номенклатура"
          clearable
          class="mb-2"
        />
        <v-text-field
          v-model="hotspots[editedIndex].name"
          label="Название"
          class="mb-2"
        />
        <v-btn small color="error" @click="removeHotspot(editedIndex)">
          Удалить
        </v-btn>
      </div>

    </div>

    <div v-if="dropzone_uploaded.length" class="mt-6 pa-4 border-top">
      <v-divider class="mb-4"></v-divider>
      <div class="d-flex justify-space-between">
        <v-btn 
          color="success" 
          :disabled="!dropzone_uploaded.length || hotspots.length === 0"
          @click="saveSpecificationData"
        >
          Сохранить [{{ hotspots.length }}] меток
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  name: 'SpecificationEditor',
  components: { vueDropzone: vue2Dropzone },
  props: { initialData: { type: Object, default: () => ({}) } },
  data () {
    return {
      index_uploaded: 1,
      dropzone_uploaded: [],
      loading_dropzone: false,
      previewHtml: null,
      hotspots: [],
      isAddingHotspot: false,
      editedIndex: null,
      imageLoaded: false,
      products: []
    }
  },
  computed: {
    dropzoneOptions () {
      return {
        url: `${this.$store.state.BASE_URL}/entity/files`,
        destroyDropzone: false,
        headers: { Authorization: `666777` },
        duplicateCheck: true,
        maxFiles: 1,
        acceptedFiles: 'image/*',
        addRemoveLinks: true
      }
    }
  },
  mounted () {
    if (this.initialData.imageUrl) {
      this.dropzone_uploaded = [{
        id: this.initialData.id,
        url: this.initialData.imageUrl,
        filename: 'scheme.jpg',
        title_image: '',
        index: 1
      }]
      this.hotspots = this.initialData.hotspots || []
    }
    this.loadProducts()
  },
  methods: {
    
    // Дропзона
    sendingData (file, xhr, formData) {
      formData.append("uuid", file.upload.uuid)
      formData.append("id_article", this.$store.state.ArticleModule.newArticle?.id)
    },
    successData (file, response) {
      const formatObj = Object.assign({}, response.data)
      formatObj.index = this.index_uploaded
      this.index_uploaded++
      this.dropzone_uploaded = [formatObj]
      
      this.$nextTick(() => {
        const closeBtn = document.getElementById('close-1')
        if (closeBtn) {
          closeBtn.onclick = () => this.removedFile(1)
        }
      })
    },
    removedFile (id) {
      const index = this.dropzone_uploaded.findIndex(elem => elem.index === id)
      if (index !== -1) {
        this.$store.dispatch("deleteFile", this.dropzone_uploaded[index].id).then(() => {
          this.dropzone_uploaded = []
          this.hotspots = []
          this.imageLoaded = false
        })
      }
    },
    setTitle (value, index) {
      if (this.dropzone_uploaded[index]) {
        this.dropzone_uploaded[index].title_image = value
      }
    },
    triggerUpload () {
      document.getElementById("specDropzone")?.click()
    },

    // Хотспоты
    getImageUrl () {
      return this.dropzone_uploaded[0]?.url || ''
    },
    loadProducts () {
      this.products = [
        { id: 1, name: 'Газовый котел Eco Life 4S' },
        { id: 2, name: 'Водонагреватель Aqua Heat' },
        { id: 3, name: 'Радиатор SteelRad 500' }
      ]
    },
    startAddHotspot () {
      this.isAddingHotspot = true
      this.editedIndex = null
    },
    onImageClick (e) {
      if (!this.isAddingHotspot || !this.imageLoaded) return

      const rect = this.$refs.imageWrapper.getBoundingClientRect()
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100

      this.hotspots.push({
        id: Date.now(),
        x: +xPercent.toFixed(2),
        y: +yPercent.toFixed(2),
        productId: null,
        name: ''  
      })

      this.editedIndex = this.hotspots.length - 1
      this.isAddingHotspot = false
    },
    onImageLoad () {
      this.imageLoaded = true
    },
    editHotspot (index) {
      this.editedIndex = index
    },
    removeHotspot (index) {
      this.hotspots.splice(index, 1)
      if (this.editedIndex === index) this.editedIndex = null
    },
    clearAllHotspots () {
      this.hotspots = []
      this.editedIndex = null
    },

    // Сохранение
    saveSpecificationData () {
      const data = {
        id: this.dropzone_uploaded[0].id,
        imageUrl: this.getImageUrl(),
        title: this.dropzone_uploaded[0].title_image || 'Спецификация',
        hotspots: this.hotspots
      }
      this.$emit('specification-save', data) // ← ТОЛЬКО ЭТО
    },
    
    clearAllData () {
      this.dropzone_uploaded = []
      this.hotspots = []
      this.imageLoaded = false
      this.isAddingHotspot = false
      this.editedIndex = null
      this.index_uploaded = 1
      
      if (this.$refs.myVueDropzone && this.$refs.myVueDropzone.dropzone) {
        this.$refs.myVueDropzone.dropzone.removeAllFiles(true)
      }
    },
  }
}
</script>



<style scoped>
/* ваши стили + новые */
.diagram-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.hotspot-dot:hover {
  background: #ff5722;
  transform: translate(-50%, -50%) scale(1.1);
}
</style>
