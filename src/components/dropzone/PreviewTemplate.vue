<template>
  <v-card class="wrapper">
    <div data-dz-image>
      <img data-dz-thumbnail alt="" class="image" />
    </div>
    <div class="menu">
      <img
        class="dz_close"
        data-dz-remove
        :src="require('/src/assets/svg/close.svg')"
        alt="close"
      />
      <span id="name" data-dz-name></span>
      <span data-dz-size></span>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "PreviewTemplate",
};
</script>

<style scoped lang="scss">
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
  }
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
