<template>
  <v-select
      v-model='currentData'
      :items="items"
      :autofocus='isAutofocus'
      :clearable="isClearable"
      :disabled='isDisabled'
      :flat="isFlat"
      :item-text="itemText"
      :item-value="itemValue"
      :loading='isLoading'
      :outlined="isOutlined"
      :label="computedPlaceholder"
      :placeholder='computedPlaceholder'
      :prepend-icon="prependIcon"
      :prepend-inner-icon="prependInnerIcon"
      :readonly="isReadonly"
      :rules="currentRules"
      :solo='isSolo'
      :type="typeData"
      :return-object="isReturnObject"
      dense
      :hide-details="isHideDetails"
      @focus='onFocus'
      @focusout='outFocus'
      @change="$emit('change-input')"
      @click:clear="(internalData = null)"
      :menu-props="{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }"
  >
    <template slot="prepend-inner">
      <slot name="prepend-inner"></slot>
    </template>

    <template slot="append">
      <slot name="append"></slot>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "SelectStyled",
  props: {
    prependInnerIcon: {
      type: String,
      default: ''
    },
    prependIcon: {
      type: String,
      default: ''
    },
    typeData: {
      type: String,
      default: 'text'
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isClearable: {
      type: Boolean,
      default: true
    },
    itemText: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Object, String, Number, Array],
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isAutofocus: {
      type: Boolean,
      default: false
    },
    isReturnObject: {
      type: Boolean,
      default: true
    },
    currentRules: {
      type: Array,
      default: () => ([])
    },
    items: {
      type: Array,
      default: () => ([])
    },
    isOutlined: {
      type: Boolean,
      default: true,
    },
    indexArray: {
      type: Number,
    },
    isFlat: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    internalData: null,
    isFocused: false
  }),
  computed: {
    computedPlaceholder() {
      if (this.isFocused) {
        return ''
      }
      return this.placeholder
    },
    currentData: {
      get() {
        if (this.data) {
          return this.data
        }
        return this.internalData
      },
      set(value) {
        if (!this.data) {
          this.internalData = value
        }
        if (this.indexArray !== undefined) {
          this.$emit('update-input', {
            index: this.indexArray,
            value: value
          })
        } else {
          this.$emit('update-input', value)
        }
      }
    }
  },
  methods: {
    onFocus() {
      this.isFocused = true
      this.$emit('on-focus', true)
    },
    outFocus() {
      this.isFocused = false
      this.$emit('out-focus', false)
    }
  }
}
</script>

<style scoped>

</style>
