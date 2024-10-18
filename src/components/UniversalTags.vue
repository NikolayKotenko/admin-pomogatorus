<template>
  <div class="question_tags">
    <span class="question_tags__title"> Разделы </span>
    <div class="question_tags__wrapper" v-if="attachedTags.length">
      <v-chip-group column>
        <v-chip
          class="question_tags__wrapper__chip"
          v-for="(item, key) in attachedTags"
          :key="key"
          :disabled="disabledNewTag"
        >
          <v-icon left @click="remove(item)"> mdi-close </v-icon>
          {{ item.dtags.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <div class="question_tags__bottom">
      <v-chip
        color="green lighten-1"
        text-color="white"
        @click="modal.state = true"
        :disabled="disabledNewTag"
      >
        <v-icon left color="white"> mdi-plus </v-icon>
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
            :items="listTags"
            item-text="name"
            :loading="loading"
            clearable
            @click:clear="localClearData"
            label="Выберите один из вариантов или создайте новый в разделе 'Тэги'"
            :error="errorState"
            :error-messages="errorMessages"
            :disabled="disabledState"
            @change="localSetChangeData"
          >
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="
              modal.state = false;
              localClearData();
            "
            :loading="loading"
          >
            Закрыть
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="create()"
            :disabled="!selectedItem.id"
            :loading="loading"
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
    errorState: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: String,
      default: "",
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
