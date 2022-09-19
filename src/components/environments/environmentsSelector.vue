<template>
  <div class="environments_wrapper" :class="{removeSpace: flat}">
    <v-autocomplete
        :class="{innerSelector: flat, focused: flatFocused}"
        :outlined="!flat"
        :solo="flat"
        :flat="flat"
        dense
        hide-details
        :placeholder="flat ? 'Введите переменную окружения' : 'Начните ввод'"
        :loading="loadingList"
        :disabled="loadingList"
        hide-no-data
        :label="flat ? '' : 'Поиск...'"
        :search-input.sync="search"
        @update:search-input="getValues()"
        :items="firstEnvItemsArray"
        item-text="text"
        item-value="query"
        return-object
        clearable
        @change="selectFirstEnv()"
        v-model="firstEnv"
        no-filter
        @focus="$emit('onFocus', 'envFocused')"
        @focusout="$emit('outFocus', 'envFocused')"
    >
      <template v-slot:selection="data" v-if="!flat">
        <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            small
        >
          {{ data.item.text }} - {{ data.item.category }}
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.text"></v-list-item-title>
            <v-list-item-subtitle v-html="data.item.category"></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
    <template v-if="checkFirst">
      <div class="divider" v-if="flat"></div>
      <v-autocomplete
          :class="{innerSelector: flat, focused: flatFocused}"
          :outlined="!flat"
          :solo="flat"
          :flat="flat"
          dense
          hide-details
          placeholder="Выберите"
          :loading="loadingList"
          :disabled="loadingList"
          hide-no-data
          :label="flat ? '' : 'Выберите'"
          :items="secondEnvItemsArray"
          item-text="ru_text"
          return-object
          clearable
          @change="selectSecondEnv()"
          v-model="secondEnv"
          @focus="$emit('onFocus', 'envFocused')"
          @focusout="$emit('outFocus', 'envFocused')"
      >
      </v-autocomplete>
    </template>
  </div>
</template>

<script>
import Request from "../../services/request";

export default {
  name: "environmentsSelector",
  props: ['flat', 'dataEnv', 'flatFocused'],
  data: () => ({
    loadingList: false,
    debounceTimeout: null,
    stopTrigger: false,

    search: '',
    firstEnvItemsArray: [],
    firstEnv: null,

    secondEnvItemsArray: [],
    secondEnv: null,
  }),
  mounted() {
    if (this.dataEnv) {
      this.firstEnv = this.dataEnv
      this.secondEnv = this.firstEnv.data.data
      this.firstEnvItemsArray.push(this.firstEnv)
      this.secondEnvItemsArray.push(this.firstEnv.data.data)
    }
  },
  watch: {
  },
  computed: {
    checkFirst() {
      if (!this.firstEnv) return false
      if (!Object.keys(this.firstEnv).length) return false
      return this.firstEnv?.data?.model;
    }
  },
  methods: {
    async getValues() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {
        if (!this.search) return

        this.loadingList = true

        try {
          const { data } = await Request.get(`${this.$store.state.BASE_URL}/dictionary/environment/search/{q}?q=${this.search}`)
          this.firstEnvItemsArray = data
        } catch (e) {
          console.log(e)
          this.$store.commit('change_notification_modal', e)
        }

        this.loadingList = false
      }, 500)
    },
    async selectFirstEnv() {
      if (this.checkFirst) {
        this.loadingList = true
        // this.stopTrigger = true

        try {
          const { data } = await Request.get(`${this.$store.state.BASE_URL}/dictionary/environment-entity-property/${this.checkFirst}`)
          this.secondEnvItemsArray = data
        } catch (e) {
          console.log(e)
          this.$store.commit('change_notification_modal', e)
        }

        this.loadingList = false
        setTimeout(() => {
          // this.stopTrigger = false
        }, 500)
      } else {
        this.secondEnv = null
        this.secondEnvItemsArray = []
      }
    },
    selectSecondEnv() {
      this.firstEnv.data.data = this.secondEnv
      this.$emit('update:dataEnv', this.firstEnv);
      this.$emit('selectedEnvironment', this.secondEnv)
    },
  },
}
</script>

<style lang="scss" scoped>

.focused {
  ::v-deep textarea {
    color: black !important;
  }
  ::v-deep input {
    color: black !important;
  }
}

.divider {
  border-bottom: 1px dashed;
  width: 15%;
  margin-left: 6px;
}

.innerSelector {
  font-size: 14px;
  ::v-deep textarea {
    color: darkgray;
    transition: color .6s ease-in-out;
  }
  ::v-deep input {
    color: darkgray;
    transition: color .6s ease-in-out;
  }
}

.removeSpace {
  row-gap: 0 !important;
}

.environments_wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
}

::v-deep .v-select.v-input--dense .v-chip {
  margin: 0 4px 4px 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .v-autocomplete.v-select.v-input--is-focused input {
  min-width: 2px;
}
::v-deep .v-select__selections {
  flex-wrap: nowrap;
  margin: 4px 0;
}

::v-deep .v-text-field input {
  padding: 3px 0 3px;
}
</style>
