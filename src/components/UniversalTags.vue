<template>
  <div class="question_tags">
    <span class="question_tags__title"> Разделы </span>
    <div class="question_tags__wrapper" v-if="attachedTags.length">
      <v-chip-group column>
        <v-chip
            class="question_tags__wrapper__chip"
            v-for="item in attachedTags"
            :key="item.id"
        >
          <v-icon left @click="removeTag(item)"> mdi-close </v-icon>
          {{ item.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <div class="question_tags__bottom">
      <v-chip
          color="green lighten-1"
          text-color="white"
          @click="modal.state = true"
      >
        <v-icon left color="white"> mdi-plus </v-icon>
        Новый тег
      </v-chip>
    </div>

    <v-dialog v-model="modal.state" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6" style="text-align: center; width: 100%"
          >Добавить тэг к вопросу</span
          >
        </v-card-title>
        <v-card-text>
          <v-combobox
              v-model="selectedItems"
              :items="listTags"
              item-text="name"
              :loading="loading"
              clearable
              label="Введите тэг"
              :error="errorState"
              :error-messages="errorMessages"
              :disabled="disabledState"
          >
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="modal.state = false">
            Отмена
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="create()"
              :disabled="!selectedItems"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "UniversalTags",
  props: {
    attachedTags: {
      type: Array,
      default: () => ([]),
    },
    listTags: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabledState: {
      type: Boolean,
      default: false,
    },
    errorState: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: String,
      default: ''
    },
  },
  data: () => ({
    modal:{
      state: false,
    },
    selectedItems: null,
  }),
  computed: {
  },
  methods: {
    //TODO тут должен быть emit об удалении уже прикрепленного тэга который пришел из родителя
    removeTag(){

    },
    //TODO тут должен быть emit в родительский компонент с данными о новом тэге
    create(){
      this.$emit('createNewTag', this.selectedItems)
    }
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
