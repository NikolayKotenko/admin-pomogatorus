<template>
  <v-text-field
      v-model='currentData'
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
      :required="isRequired"
      :rules="currentRules"
      :solo='isSolo'
      :type="typeData"
      dense
      hide-details
      @click:clear="(currentData = '')"
      @change="$emit('change-input')"
  >
    <template slot="prepend-inner">
      <slot name="prepend-inner"></slot>
    </template>

    <template slot="append">
      <slot name="append"></slot>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: "InputStyledSimple",
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
    isRequired: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: false
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
      type: [String, Number, Array],
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
    currentRules: {
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
    internalData: '',
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
        return this.data
      },
      set(value) {
        this.$emit('update-input', value)
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
