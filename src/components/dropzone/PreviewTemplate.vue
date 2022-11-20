<template>
  <v-card class="wrapper">
    <div data-dz-image>
      <img alt="" class="main_img image" data-dz-thumbnail/>
    </div>
    <div class="menu">
      <img
          :src="require('/src/assets/svg/close.svg')"
          alt="close"
          class="dz_close"
          data-dz-remove
      />
      <span id="name" class="dz_name" data-dz-name></span>
      <span class="dz_size" data-dz-size></span>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "PreviewTemplate",
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: unset !important;

  ::v-deep .dz-image-preview {
    width: 100%;
    height: 100%;
  }

  &:hover {
    .menu {
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
    }
  }

  .menu {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.4s ease-in-out;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .dz_close {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      width: 28px;
      height: 28px;
    }

    .dz_name, .dz_size {
      color: white;
    }
  }

  .image {
    width: 100%;
    display: grid;
    height: 100%;
    max-height: 300px;
    max-width: 300px;
    object-fit: contain;
    margin: auto;
  }
}
</style>
