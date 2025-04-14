<template>
  <div class="question_tags">
    <span class="question_tags__title"> {{ nameHeading }} </span>
    <div v-if="attachedTags.length" class="question_tags__wrapper">
      <v-chip-group column>
        <v-chip
          v-for="(item, key) in attachedTags"
          :key="key"
          :disabled="disabledExistTag"
          class="question_tags__wrapper__chip"
        >
          <v-icon :disabled="disableDeleting" left @click="remove(item)">
            mdi-close</v-icon
          >
          {{ item.dtags.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <div class="question_tags__bottom">
      <v-chip
        :disabled="disabledNewTag"
        color="green lighten-1"
        text-color="white"
        @click="modal.state = true"
      >
        <v-icon color="white" left> mdi-plus</v-icon>
        Новый тег
      </v-chip>
    </div>

    <v-dialog v-model="modal.state" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6" style="text-align: center; width: 100%"
            >Добавление тэга</span
          >
        </v-card-title>
        <v-card-text>
          <v-combobox
            :disabled="disabledState"
            :error="errorState"
            :error-messages="errorMessages"
            :items="listTags"
            :loading="loading"
            clearable
            item-text="name"
            label="Выберите один из вариантов или создайте новый в разделе 'Тэги'"
            @change="localSetChangeData"
            @click:clear="localClearData"
          >
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :loading="loading"
            color="blue darken-1"
            text
            @click="
              modal.state = false;
              localClearData();
            "
          >
            Закрыть
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!selectedItem.id"
            :loading="loading"
            color="blue darken-1"
            text
            @click="create()"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ComboboxStyled from "@/components/common/ComboboxStyled.vue";
import { DTag } from "@/helpers/constructors";

export default {
  name: "UniversalTags",
  components: { ComboboxStyled },
  props: {
    attachedTags: {
      type: Array,
      default: () => [],
    },
    listTags: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabledState: {
      type: Boolean,
      default: false,
    },
    disabledNewTag: {
      type: Boolean,
      default: false,
    },
    disabledExistTag: {
      type: Boolean,
      default: false,
    },
    errorState: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: String,
      default: "",
    },
    nameHeading: {
      type: String,
      default: "Разместить в подборках",
    },
    /** @param {Boolean} - параметр, который отвечает за то, чтобы дизейблить удаление тэгов из сущности (к примеру, если у нас нет id сущности) **/
    disableDeleting: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    modal: {
      state: false,
    },
    selectedItem: new DTag(),
  }),
  computed: {},
  methods: {
    remove(item) {
      this.$emit("removeAttachedTag", item);
    },
    create() {
      this.$emit("createNewTag", this.selectedItem);
    },
    localClearData() {
      this.selectedItem = new DTag();
      this.$store.commit("clearErrorResponseTag");
    },
    localSetChangeData(data) {
      this.localClearData();

      if (!data) return;

      if (typeof data !== "object") return;

      this.selectedItem = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.question_tags {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  &__title {
    color: #7e8d9a;
    font-weight: 600;
  }

  &__wrapper {
    ::v-deep .v-slide-group__content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    &__chip {
      margin-bottom: 10px;
    }

    &__chip:last-child {
      margin-bottom: 0 !important;
    }
  }
}
</style>
