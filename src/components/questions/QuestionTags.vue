<template>
  <div class="question_tags">
          <span class="question_tags__title">
            Разделы
          </span>
    <div class="question_tags__wrapper" v-if="getTags.length">
      <v-chip-group
          column
      >
        <v-chip
            class="question_tags__wrapper__chip"
            v-for="item in getTags"
            :key="item.id"
        >
          <v-icon left @click="removeTag(item)">
            mdi-close
          </v-icon>
          {{ item.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <div class="question_tags__bottom">
      <v-chip color="green lighten-1" text-color="white" @click="showTagComponent()">
        <v-icon left color="white">
          mdi-plus
        </v-icon>
        Новый тег
      </v-chip>
    </div>

    <v-dialog
        v-model="$store.state.QuestionsModule.showCreateTag"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="text-align: center; width: 100%">Добавить тэг к вопросу</span>
        </v-card-title>
        <v-card-text>
          <v-combobox
              v-model="$store.state.QuestionsModule.newTag"
              :items="$store.state.QuestionsModule.listGeneralTags"
              item-text="name"
              :loading="$store.state.QuestionsModule.tagsLoaded"
              :search-input.sync="$store.state.QuestionsModule.tagSearch"
              clearable
              label="Введите тэг"
              :error="$store.state.QuestionsModule.tagError.isError"
              :error-messages="$store.state.QuestionsModule.tagError.isError ? 'Такой тэг уже добавлен' : []"
              @change="checkForTagError()"
              @update:search-input="checkForTagError()"
              :disabled="!$store.state.QuestionsModule.listGeneralTags.length"
          >
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="hideTagComponent"
          >
            Отмена
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="createNewTag()"
              :disabled="$store.state.QuestionsModule.tagError.isError || !$store.state.QuestionsModule.tagSearch"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "QuestionTags",
  data: () => ({

  }),
  computed: {
    ...mapGetters(['getTags']),
  },
  methods: {
    showTagComponent() {
      this.$store.state.QuestionsModule.showCreateTag = true
      this.$store.dispatch('getGeneralTags')
    },
    hideTagComponent() {
      this.$store.state.QuestionsModule.showCreateTag = false
    },
    createNewTag() {
      if (!this.$store.state.QuestionsModule.listGeneralTags.some(elem => {
        return elem.name.replace(/\s/g, '').toLowerCase() === this.$store.state.QuestionsModule.tagSearch.replace(/\s/g, '').toLowerCase()
      })) {
        this.$store.dispatch('setNewTagToList', this.$store.state.QuestionsModule.tagSearch).then(() => {
          this.$store.state.QuestionsModule.newQuestion._all_tags.push(Object.assign({}, this.$store.state.QuestionsModule.createdTag))
          console.log(this.$store.state.QuestionsModule.createdTag)
          this.$store.state.QuestionsModule.createdTag = {}
          this.$store.state.QuestionsModule.showCreateTag = false
          this.$store.state.QuestionsModule.newTag = ''
        })
      } else {
        let index = this.$store.state.QuestionsModule.listGeneralTags.findIndex(elem => {
          return elem.name === this.$store.state.QuestionsModule.tagSearch
        })
        if (index !== -1) this.$store.state.QuestionsModule.newTag = this.$store.state.QuestionsModule.listGeneralTags[index]
        if (this.$store.state.QuestionsModule.newQuestion._all_tags.some (elem => {
          return elem.name.replace(/\s/g, '').toLowerCase() === this.$store.state.QuestionsModule.newTag.name.replace(/\s/g, '').toLowerCase()
        })) {
          this.$store.state.QuestionsModule.tagError = Object.assign({}, {'isError': true, 'errObj': this.$store.state.QuestionsModule.newTag})
        } else {
          this.$store.state.QuestionsModule.newQuestion._all_tags.push(this.$store.state.QuestionsModule.newTag)
          this.$store.state.QuestionsModule.tagError = Object.assign({}, {'isError': false, 'errObj': {}})
          this.$store.state.QuestionsModule.newTag = ''
          this.$store.state.QuestionsModule.showCreateTag = false
        }
      }
    },
    removeTag(item) {
      let index = this.$store.state.QuestionsModule.newQuestion._all_tags.findIndex(elem => {
        return elem.id === item.id
      })
      if (index !== -1) this.$store.state.QuestionsModule.newQuestion._all_tags.splice(index, 1)
    },
    checkForTagError() {
      setTimeout(() => {
        console.log('changed')
        if (Object.keys(this.$store.state.QuestionsModule.tagError.errObj).length) {
          if (this.$store.state.QuestionsModule.tagSearch) {
            this.$store.state.QuestionsModule.tagError.isError = (
                this.$store.state.QuestionsModule.tagSearch.replace(/\s/g, '').toLowerCase() ===
                this.$store.state.QuestionsModule.tagError.errObj.name.replace(/\s/g, '').toLowerCase()
            );
          } else this.$store.state.QuestionsModule.tagError.isError = false
        }
      })
    },
  }
}
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
