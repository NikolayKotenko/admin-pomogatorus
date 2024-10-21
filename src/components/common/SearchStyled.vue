<template>
  <div>
    <v-autocomplete
      :class="isClass"
      :outlined="isOutlined"
      :dense="isDense"
      :hide-details="isHideDetails"
      :placeholder="isPlaceholder"
      :label="isPlaceholder"
      :loading="isLoading"
      :disabled="isDisabled"
      :hide-no-data="isHideNoData"
      :items="isItems"
      :item-text="isItemText"
      :item-value="isItemValue"
      :return-object="isReturnObject"
      :clearable="isClearable"
      :search-input.sync="localSearchInputSync"
      v-model="localSelected"
      @update:search-input="$emit('update-search-input', localSearchInputSync)"
      @change="$emit('change-search', localSelected)"
      :menu-props="{ maxHeight: '80vh' }"
    >
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  name: "SearchStyled",
  data: () => ({
    localSearchInputSync: "",
    localSelected: null,
  }),
  props: {
    isClass: {
      type: String,
      default: "",
    },
    isOutlined: {
      type: Boolean,
      default: true,
    },
    isDense: {
      type: Boolean,
      default: true,
    },
    isHideDetails: {
      type: Boolean,
      default: true,
    },
    isPlaceholder: {
      type: String,
      default: "",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isHideNoData: {
      type: Boolean,
      default: false,
    },
    isItems: {
      type: Array,
      default: () => [],
    },
    isItemText: {
      type: String,
      default: "",
    },
    isItemValue: {
      type: String,
      default: "",
    },
    isReturnObject: {
      type: Boolean,
      default: true,
    },
    isClearable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped></style>
