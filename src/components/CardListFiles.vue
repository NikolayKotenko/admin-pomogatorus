<template>
  <div class="main_wrapper_card_list_files">
    <v-list class="wrapper_list_type" outlined subheader>
      <v-subheader>Файлы / документы.</v-subheader>
      <div class="wrapper_type_files">
        <div v-for="(file, i) in files" :key="i">
          <a v-if="file.type === 'application/pdf'"
             :href="$store.state.BASE_URL + file.full_path"
             :title="file.filename"
             class="doc_file"
             target="_blank"
          >
            {{ file.filename }}
          </a>
        </div>
      </div>
    </v-list>

    <v-list class="wrapper_list_type" outlined subheader>
      <v-subheader>Изображения</v-subheader>
      <div class="wrapper_type_files">

        <div v-for="(file, i) in files" :key="i" class="viewer_wrapper">
          <v-img
              v-if="file.type === 'image/jpeg'"
              :alt="file.filename"
              :src="`${$store.state.BASE_URL}${file.full_path}`"
              :title="file.filename"
              class="main_img"
              height="240px"
              width="240px"
              @click="toggleFullscreen(file)"
          />
          <div v-if="selectedImage" class="overlay_selected_image">
            <v-img
                :src="selectedImage"
                alt=""
                class="main_img mt-12"
                contain
                dark
                height="95vh"
                @click.stop="selectedImage = null"
                @keydown.esc="selectedImage = null"
            >
              <v-icon class="close_image_btn">mdi-close-thick</v-icon>
            </v-img>
          </div>
        </div>
      </div>
    </v-list>
  </div>
</template>

<script>
export default {
  props: ['files'],
  name: "CardListFiles",
  data() {
    return {
      selectedImage: null,
    }
  },
  methods: {
    toggleFullscreen(elem) {
      this.selectedImage = elem.url;
    },
  }
}
</script>

<style lang="scss" scoped>
.wrapper_list_type {
  .wrapper_type_files {
    display: inline-flex;
    flex-wrap: wrap;
    //grid-gap: 1em;
    //padding: 10px;

    .doc_file {
      word-break: break-word;
      padding: 0 10px;

      &::before {
        content: "-"; /* Добавляем после текста абзаца */
        color: black; /* Красный цвет текста */
        text-decoration: unset;
      }
    }

    .viewer_wrapper {
      padding: 10px;

      img {
      }
    }
  }
}
</style>

<style lang="scss">
.main_wrapper_card_list_files {
  width: 100%;
}

.overlay_selected_image {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6) !important;
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

.close_image_btn {
  right: 10px;
  top: 10px;
  position: absolute !important;
  z-index: 9999999 !important;
  font-size: 2em !important;
}
</style>
