<template>
  <div class="image_wrapper" contenteditable="false" :id="`component_wrapper-${index_component}`">
    <div class="image_wrapper__admin_controls-header" contenteditable="false">
      <img class="image_wrapper__admin_controls-header__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">
    </div>
    <vue-draggable-resizable :w="100" :h="100" :draggable="false" @resizing="onResize" :parent="true">
      <img class="inserted_image" :src="data_image.dataURL" :alt="data_image.name">
    </vue-draggable-resizable>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

export default {
  name: "ImageLayout",
  components: {
    VueDraggableResizable,
  },
  data: () => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    index_component: null,
    count_of_images: null,
    data_image: null,
  }),
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.data_image = this.$store.state.TitlesModule.selectedComponent
      this.count_of_images = this.$store.state.TitlesModule.count_of_images
      this.index_component = this.$store.state.TitlesModule.countLayout
      this.getHeightOfControls()
      this.getWidthOfControls()
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.index_component)
    },
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0
        }
      })
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.image_wrapper {
  //height: 200px;
  min-height: 150px;
  min-width: 50px;
  max-width: 600px;
  max-height: 600px;
  position: relative;
  padding: 16px 10px 8px 10px;
  //border: 1px solid rgba(83, 158, 224, 0);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom: 1px solid rgba(83, 158, 224, 0);
  border-right: 1px solid rgba(83, 158, 224, 0);
  border-left: 1px solid rgba(83, 158, 224, 0);
  transition: all .4s ease-in-out;


  &:hover {
    //border: 1px solid rgba(83, 158, 224, 0.7);
    border-bottom: 1px solid rgba(83, 158, 224, 0.7);
    border-right: 1px solid rgba(83, 158, 224, 0.7);
    border-left: 1px solid rgba(83, 158, 224, 0.7);

    .image_wrapper__admin_controls-header {
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
    transition: all .4s ease-in-out;
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
}

::v-deep .vdr {
  position: relative !important;
  border: 1px dashed rgba(0, 0, 0, 0);
  transition: border .5s ease-in-out;
}

::v-deep .handle {
  position: absolute !important;
  opacity: 0;
  transition: opacity .5s ease-in-out;
}
</style>
