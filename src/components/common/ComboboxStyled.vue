<template>
  <div>
    <v-combobox
        v-model="currentData"
        :rules="$store.state.nameRules"
        :class="isClass"
        :outlined="isOutlined"
        :dense="isDense"
        :hide-details="isHideDetails"
        :placeholder="isPlaceholder"
        :label="isPlaceholder"
        :loading="isLoading"
        :disabled="isDisabled"
        :items="isItems"
        :item-text="isItemText"
        :item-value="isItemValue"
        :return-object="false"
        :hide-no-data="false"
        chips
        small-chips
        :clearable="isClearable"
        :search-input.sync="localSearchInputSync"
        @update:search-input="$emit('update-search-input', localSearchInputSync)"
        @change="$emit('change-search', localSelected)"
    >
      <template v-slot:no-data>
        <v-list-item v-if="localSearchInputSync && !isItems.length && !isLoading">
          <span class="subheading">Enter чтобы создать новый элемент &nbsp;</span>
          <v-chip label small>
            {{ localSearchInputSync }}
          </v-chip>
        </v-list-item>
      </template>
<!--      <template v-slot:selection="{ attrs, item, parent, selected }">-->
<!--        <v-chip-->
<!--            v-if="item === Object(item)"-->
<!--            v-bind="attrs"-->
<!--            :color="`${item.color} lighten-3`"-->
<!--            :input-value="selected"-->
<!--            label-->
<!--            small-->
<!--        >-->
<!--          <span class="pr-2">-->
<!--            {{ item.value }}-->
<!--          </span>-->
<!--        </v-chip>-->
<!--      </template>-->
    </v-combobox>
  </div>
</template>

<script>

export default {
  name: 'ComboboxStyled',
  data: () => ({
    localSearchInputSync: '',
    localSelected: null
  }),
  props: {
    isClass: {
      type: String,
      default: ''
    },
    isOutlined: {
      type: Boolean,
      default: true
    },
    isDense: {
      type: Boolean,
      default: true
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isPlaceholder: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isHideNoData: {
      type: Boolean,
      default: false
    },
    isItems: {
      type: Array,
      default: () => []
    },
    isItemText: {
      type: String,
      default: ''
    },
    isItemValue: {
      type: String,
      default: ''
    },
    isClearable: {
      type: Boolean,
      default: true
    },
    data: {
      type: [String, Number],
      default: null
    },
  },
  computed:{
    currentData: {
      get() {
        if (this.data) {
          return this.data
        }
        return this.localSelected
      },
      set(value) {
        this.localSelected = value
      }
    }
  }
}
</script>

<style lang='scss' scoped>



</style>
