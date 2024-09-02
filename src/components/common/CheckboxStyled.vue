<template>
  <v-checkbox
      class="CheckboxStyled"
      :hide-details="isHideDetails"
      v-model.number="currentData"
      :false-value="0"
      :true-value="1"
      :disabled="isDisabled"
      @change="$emit('change-event',$event)"
  ></v-checkbox>
</template>

<script>
export default {
  name: "CheckboxStyled",
  props: {
    isHideDetails: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    state: {
      type: Number,
      default: 0
    },
  },
  data: () => ({
    localState: 0
  }),
  computed:{
    currentData: {
      get() {
        if (this.state) {
          return this.state
        }
        return this.localState
      },
      set(value) {
        this.localState = value
      }
    }
  }
}
</script>

<style lang="scss">
.CheckboxStyled {
  .v-input--selection-controls__input {
    width: 100%;
  }
}
</style>