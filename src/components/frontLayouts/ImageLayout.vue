<template>
  <div class="image_wrapper" contenteditable="false" :id="`question_wrapper-${count_of_question}`">
    <div class="image_wrapper__admin_controls-header" contenteditable="false">
      <img class="image_wrapper__admin_controls-header__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">
    </div>
    <vue-draggable-resizable :w="100" :h="100" :draggable="false" @resizing="onResize" :parent="true">
      <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br>
        X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}</p>
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
    y: 0
  }),
  methods: {
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
  },
}
</script>

<style scoped lang="scss">

</style>
