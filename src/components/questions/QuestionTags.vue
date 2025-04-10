<template>
  <div class="question_tags">
    <span class="question_tags__title"> Разместить в подборках </span>
    <div class="question_tags__wrapper" v-if="list_tags.length">
      <v-chip-group column>
        <v-chip
          class="question_tags__wrapper__chip"
          v-for="item in list_tags"
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
        @click="showTagComponent()"
      >
        <v-icon left color="white"> mdi-plus </v-icon>
        Новый тег
      </v-chip>
    </div>

    <v-dialog v-model="data_instance.showCreateTag" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6" style="text-align: center; width: 100%"
            >Добавить тэг к вопросу</span
          >
        </v-card-title>
        <v-card-text>
          <v-combobox
            v-model="data_instance.newTag"
            :items="data_instance.listGeneralTags"
            item-text="name"
            :loading="data_instance.tagsLoaded"
            :search-input.sync="data_instance.tagSearch"
            clearable
            label="Тэг"
            :error="data_instance.tagError.isError"
            :error-messages="
              data_instance.tagError.isError ? 'Такой тэг уже добавлен' : []
            "
            @change="checkForTagError()"
            @update:search-input="checkForTagError()"
            :disabled="!data_instance.listGeneralTags.length"
          >
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="hideTagComponent">
            Отмена
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="createNewTag()"
            :disabled="
              data_instance.tagError.isError || !data_instance.tagSearch
            "
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "QuestionTags",
  data: () => ({}),
  computed: {
    ...mapGetters(["getTagsQuestion"]),
    ...mapGetters(["getTagsArticle"]),
    data_instance() {
      if (this.$route.path.includes("/articles/")) {
        return this.$store.state.ArticleModule;
      } else if (this.$route.path.includes("/questions/")) {
        return this.$store.state.QuestionsModule;
      } else return {};
    },
    list_tags() {
      if (this.$route.path.includes("/articles/")) {
        return this.getTagsArticle;
      } else if (this.$route.path.includes("/questions/")) {
        return this.getTagsQuestion;
      } else return {};
    },
    _all_tags() {
      if (this.$route.path.includes("/articles/")) {
        return this.$store.state.ArticleModule.newArticle._all_tags;
      } else if (this.$route.path.includes("/questions/")) {
        return this.$store.state.QuestionsModule.newQuestion._all_tags;
      } else return {};
    },
    mtomtags() {
      if (this.$route.path.includes("/articles/")) {
        return this.$store.state.ArticleModule.newArticle.mtomtags;
      } else if (this.$route.path.includes("/questions/")) {
        return this.$store.state.QuestionsModule.newQuestion.mtomtags;
      } else return {};
    },
    setNewTagToList() {
      if (this.$route.path.includes("/articles/")) {
        return "setNewTagToListArticle";
      } else if (this.$route.path.includes("/questions/")) {
        return "setNewTagToListQuestion";
      } else return "";
    },
    getGeneralTags() {
      if (this.$route.path.includes("/articles/")) {
        return "getGeneralTagsArticle";
      } else if (this.$route.path.includes("/questions/")) {
        return "getGeneralTagsQuestion";
      } else return "";
    },
    deleteRelationTag() {
      if (this.$route.path.includes("/articles/")) {
        return "deleteRelationTagArticle";
      } else if (this.$route.path.includes("/questions/")) {
        return "deleteRelationTagQuestion";
      } else return "";
    },
  },
  methods: {
    showTagComponent() {
      this.data_instance.showCreateTag = true;
      this.$store.dispatch(this.getGeneralTags);
    },
    hideTagComponent() {
      this.data_instance.showCreateTag = false;
    },
    createNewTag() {
      if (
        !this.data_instance.listGeneralTags.some((elem) => {
          return (
            elem.name.replace(/\s/g, "").toLowerCase() ===
            this.data_instance.tagSearch.replace(/\s/g, "").toLowerCase()
          );
        })
      ) {
        this.$store
          .dispatch(this.setNewTagToList, this.data_instance.tagSearch)
          .then(() => {
            this._all_tags.push(
              Object.assign({}, this.data_instance.createdTag)
            );
            this.data_instance.createdTag = {};
            this.data_instance.showCreateTag = false;
            this.data_instance.newTag = "";
          });
      } else {
        let index = this.data_instance.listGeneralTags.findIndex((elem) => {
          return elem.name === this.data_instance.tagSearch;
        });
        if (index !== -1)
          this.data_instance.newTag = this.data_instance.listGeneralTags[index];
        if (
          this._all_tags.some((elem) => {
            return (
              elem.name.replace(/\s/g, "").toLowerCase() ===
              this.data_instance.newTag.name.replace(/\s/g, "").toLowerCase()
            );
          })
        ) {
          this.data_instance.tagError = Object.assign(
            {},
            { isError: true, errObj: this.data_instance.newTag }
          );
        } else {
          this._all_tags.push(this.data_instance.newTag);
          this.data_instance.tagError = Object.assign(
            {},
            { isError: false, errObj: {} }
          );
          this.data_instance.newTag = "";
          this.data_instance.showCreateTag = false;
        }
      }
    },
    removeTag(item) {
      let index = this._all_tags.findIndex((elem) => {
        return elem.id === item.id;
      });
      if (index !== -1) {
        this._all_tags.splice(index, 1);
        if (this.$route.params?.action === "edit") {
          if (this.mtomtags.length) {
            let mtmIndex = this.mtomtags.findIndex((elem) => {
              return elem.id_tag === item.id;
            });
            if (mtmIndex !== -1) {
              this.$store.dispatch(
                this.deleteRelationTag,
                this.mtomtags[mtmIndex].id
              );
            }
          }
        }
      }
    },
    checkForTagError() {
      setTimeout(() => {
        if (Object.keys(this.data_instance.tagError.errObj).length) {
          if (this.data_instance.tagSearch) {
            this.data_instance.tagError.isError =
              this.data_instance.tagSearch.replace(/\s/g, "").toLowerCase() ===
              this.data_instance.tagError.errObj.name
                .replace(/\s/g, "")
                .toLowerCase();
          } else this.data_instance.tagError.isError = false;
        }
      });
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
