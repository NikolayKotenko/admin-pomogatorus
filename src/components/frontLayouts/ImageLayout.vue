<template>
  <div
      :id="`component_wrapper-${index_component}`"
      :data-id="getIdImage"
      :data-src="shortPath"
      class="componentArticle_wrapper image_wrapper component_container"
      contenteditable="false"
      data-name="image"
  >
    <div
        class="componentArticle_wrapper__admin_controls-header"
        contenteditable="false"
    >
      <img
          :src="require(`/src/assets/svg/closeIcon.svg`)"
          alt="close"
          class="componentArticle_wrapper__admin_controls-header__img"
          @click="deleteImage()"
      />
    </div>
    <img :alt="altName" :src="srcPath" :title="title" class="main_img inserted_image"/>
  </div>
</template>

<script>
// import VueDraggableResizable from 'vue-draggable-resizable'
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

export default {
  name: "ImageLayout",
  components: {
    // VueDraggableResizable,
  },
  data: () => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    index_component: null,
    index_image: null,
    data_image: null,
    dataForRerender: {},
  }),
  mounted() {
    this.getData();
  },
  computed: {
    shortPath() {
      if (!this.data_image || !this.data_image?.full_path) return null;
      return this.data_image.full_path;
    },
    srcPath() {
      return this.$store.state.BASE_URL + this.data_image?.full_path;
    },
    altName() {
      return this.data_image?.alt;
    },
    title() {
      return this.data_image?.title;
    },
    getIdImage() {
      return this.data_image?.id
    }
  },
  methods: {
    getData() {
      this.data_image = this.$store.state.ArticleModule.selectedComponent;
      this.dataForRerender = this.$store.state.ArticleModule.selectedComponent;
      this.index_image = this.$store.state.ArticleModule.counters.image;
      this.index_component = this.$store.state.ArticleModule.counters.layout;
      this.getHeightOfControls();
      this.getWidthOfControls();
    },
    async deleteImage() {
      await this.$store.dispatch('deleteFileGeneral', this.data_image.id);
      // if (response.codeResponse !== 202)
      //   return false;


      const elem = document.getElementById(
          `component_wrapper-${this.index_component}`
      );
      elem.remove();
      await this.$store.dispatch("deleteComponent", this.index_component);
    },
    onResize: function (x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
            `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0;
        }
      });
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
            `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/componentArticle";

.image_wrapper {
  min-height: 150px;
  min-width: 50px;
  max-width: 600px;
  max-height: 600px;
  position: relative;
  padding: 16px 10px 8px 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom: 1px solid rgba(83, 158, 224, 0);
  border-right: 1px solid rgba(83, 158, 224, 0);
  border-left: 1px solid rgba(83, 158, 224, 0);
  transition: all 0.4s ease-in-out;

  &:hover {
    //border: 1px solid rgba(83, 158, 224, 0.7);
    border-bottom: 1px solid rgba(83, 158, 224, 0.7);
    border-right: 1px solid rgba(83, 158, 224, 0.7);
    border-left: 1px solid rgba(83, 158, 224, 0.7);

    .componentArticle_wrapper__admin_controls-header {
      opacity: 1;
    }

    ::v-deep .vdr {
      border: 1px dashed rgba(0, 0, 0, 1);
    }

    ::v-deep .handle {
      opacity: 1;
    }
  }

  &__admin_controls-header {
    background: rgba(83, 158, 224, 0.7);
    position: absolute;
    top: 0;
    opacity: 0;
    transition: all 0.4s ease-in-out;
    border-radius: 2px;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 4px;
    height: 16px;
    width: 100%;

    &__img {
      width: 14px;
      height: 14px;
    }
  }
}

.inserted_image {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  object-fit: cover;
  -o-object-fit: cover;
}

::v-deep .vdr {
  position: relative !important;
  border: 1px dashed rgba(0, 0, 0, 0);
  transition: border 0.5s ease-in-out;
}

::v-deep .handle {
  position: absolute !important;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
</style>
