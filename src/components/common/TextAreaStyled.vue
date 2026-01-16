<template>
  <v-textarea
    v-model="currentData"
    :append-icon="appendIcon"
    :autofocus="isAutofocus"
    :clearable="isClearable"
    :disabled="isDisabled"
    :flat="isFlat"
    :hide-details="hideDetailsState"
    :item-text="itemText"
    :item-value="itemValue"
    :loading="isLoading"
    :multi-line="multiLine"
    :outlined="isOutlined"
    :label="computedPlaceholder"
    :placeholder="computedPlaceholder"
    :prepend-icon="prependIcon"
    :required="isRequired"
    :rows="rowsCount"
    :rules="currentRules"
    :solo="isSolo"
    :type="typeData"
    :hint="counterChar"
    auto-grow
    dense
    row-height="25"
    @focus="onFocus"
    @focusout="outFocus"
    @click:clear="currentData = ''"
    @change="$emit('change-input', $event)"
  >
    <template slot="prepend-inner">
      <slot name="prepend-inner"></slot>
    </template>

    <template slot="append">
      <slot name="append"></slot>
    </template>
  </v-textarea>
</template>

<script>
export default {
  name: "TextAreaStyled",
  props: {
    rowsCount: {
      type: String,
      default: "1",
    },
    multiLine: {
      type: Boolean,
      default: false,
    },
    appendIcon: {
      type: String,
      default: "",
    },
    prependIcon: {
      type: String,
      default: "",
    },
    typeData: {
      type: String,
      default: "text",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isClearable: {
      type: Boolean,
      default: false,
    },
    itemText: {
      type: String,
      default: "",
    },
    itemValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    isCounterChar: {
      type: Boolean,
      default: false,
    },
    isSolo: {
      type: Boolean,
      default: false,
    },
    data: {
      type: [String, Number],
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isAutofocus: {
      type: Boolean,
      default: false,
    },
    currentRules: {
      type: Array,
      default: () => [],
    },
    isOutlined: {
      type: Boolean,
      default: false,
    },
    indexArray: {
      type: Number,
    },
    isFlat: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    internalData: "",
    isFocused: false,
  }),
  computed: {
    hideDetailsState() {
      if (this.isCounterChar) return false;
      if (this.currentRules.length) return false;
      return true;
    },
    counterChar() {
      return `${this.currentData.length} символов`;
    },
    computedPlaceholder() {
      if (this.isFocused) {
        return "";
      }
      return this.placeholder;
    },
    currentData: {
      get() {
        if (this.data) {
          return this.data;
        }
        return this.internalData;
      },
      set(value) {
        if (!this.data) {
          this.internalData = value;
        }
        if (this.indexArray !== undefined) {
          this.$emit("update-input", {
            index: this.indexArray,
            value: value,
          });
        } else {
          this.$emit("update-input", value);
        }
      },
    },
  },
  methods: {
    onFocus() {
      this.isFocused = true;
      this.$emit("on-focus", true);
    },
    outFocus() {
      this.isFocused = false;
      this.$emit("out-focus", false);
    },
  },
};
</script>

<style scoped></style>
