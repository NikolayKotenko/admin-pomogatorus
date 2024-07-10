<template>
  <div>
    <v-combobox
        v-model="currentData"
        :rules="$store.state.requiredFieldRules"
        :class="isClass"
        :outlined="isOutlined"
        :dense="isDense"
        :hide-details="isHideDetails"
        :error="isError"
        :error-messages="isErrorMessages"
        :placeholder="isPlaceholder"
        :label="isPlaceholder"
        :loading="isLoading"
        :disabled="isDisabled"
        :items="isItems"
        :item-text="isItemText"
        :item-value="isItemValue"
        :return-object="isReturnObject"
        :hide-no-data="false"
        chips
        small-chips
        :clearable="isClearable"
        :search-input.sync="localSearchInputSync"
        @update:search-input="$emit('update-search-input', localSearchInputSync)"
        @keyup.enter="$emit('change-search', localSelected)"
        @change="setChangeSelected(localSelected)"
        @click:clear="$emit('click-clear'); clearSelected()"
        ref="comboboxStyled"
    >
      <template v-slot:no-data>
        <v-list-item v-if="localSearchInputSync && !isItems.length && !isLoading"
          @click="$refs.comboboxStyled.focus()"
        >
          <span class="subheading">Не найдено совпадений, нажмите "Enter" для создания &nbsp;</span>
          <v-chip label small>
            {{ localSearchInputSync }}
          </v-chip>
        </v-list-item>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content class="template_item">
          <section>{{ item.name }}</section>
          <section>Выбрать</section>
        </v-list-item-content>
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
    isError: {
      type: Boolean,
      default: false
    },
    isErrorMessages: {
      type: String,
      default: ''
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
    isReturnObject: {
      type: Boolean,
      default: false
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
  },
  methods:{
    clearSelected(){
      console.log('check')
      this.localSearchInputSync = '';
      this.localSelected = null;
    },
    setChangeSelected(){
      if (typeof this.localSelected !== 'object')  return false;

      this.$emit('change-search', this.localSelected)
    }
  }
}
</script>

<style lang='scss'>
.template_item{
  display: grid;
  grid-template-columns: auto 1fr;
  :first-child{
    font-weight: bold;
  }
  :last-child{
    margin-left: auto;
  }
}


</style>
