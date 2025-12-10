<template>
  <div
    :id="`component_wrapper-${index_component}`"
    :data-id="citation_data.id"
    contenteditable="false"
    data-name="citation"
    class="componentArticle_wrapper component_container citation-container"
    @dblclick="editCitation"
  >
    <!-- Кнопка удаления -->
    <div class="componentArticle_wrapper__admin_controls-header">
      <CloseSVG
        alt="close"
        class="componentArticle_wrapper__admin_controls-header__img"
        @click="deleteCitation()"
      />
    </div>

    <!-- Превью цитаты -->
    <div class="citation-preview">
      <template v-if="isLoading">
        <div class="citation-preview__loader">
          <v-progress-circular
            :size="24"
            color="#539ee0"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>

      <template v-else-if="!citation_data.title && !citation_data.text">
        <span class="citation-error">Ошибка: данные цитаты отсутствуют</span>
        <v-icon color="orange" class="mt-1">mdi-alert</v-icon>
      </template>

      <template v-else>
        <div class="citation-content">
          <h4 v-if="citation_data.title" class="citation-title">
            {{ citation_data.title }}
          </h4>
          <blockquote class="citation-text">
            {{ citation_data.text }}
          </blockquote>
          <div v-if="author_name" class="citation-author">
            — {{ author_name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Request from "@/services/request";
import CloseSVG from "@/assets/svg/closeIcon.svg";

export default {
  name: "CitationArticle",
  components: {
    CloseSVG,
  },
  data: () => ({
    index_component: null,
    index_citation: null,
    citation_data: {},
    author_name: "",
    isLoading: false,
  }),
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
  console.log('selectedComponent:', this.$store.state.ArticleModule.selectedComponent);
  
  if (Object.keys(this.$store.state.ArticleModule.selectedComponent).length) {
    this.index_citation = this.$store.state.ArticleModule.counters.citation;
    this.index_component = this.$store.state.ArticleModule.counters.layout;
    
    this.citation_data = Object.assign(
      {},
      this.$store.state.ArticleModule.selectedComponent
    );
    
    console.log('citation_data:', this.citation_data);

    if (this.citation_data.user_id) {
      this.getUserName();
    }
  }
},


    async getUserName() {
      // TODO: Когда будет готов эндпоинт с user_id - раскомментировать
      // this.isLoading = true;
      // try {
      //   const result = await Request.get(
      //     `${this.$store.state.BASE_URL}/users/get-user-data/${this.citation_data.user_id}`
      //   );
      //   this.author_name = `${result.data.first_name} ${result.data.last_name}`;
      // } catch (error) {
      //   console.error('Ошибка получения автора:', error);
      //   this.author_name = "Автор не найден";
      // } finally {
      //   this.isLoading = false;
      // }

      // Временная заглушка
      this.author_name = `Автор #${this.citation_data.user_id}`;
    },

    editCitation() {
      // Открываем модалку для редактирования
      this.$store.commit("change_name_component", "citation");
      this.$store.commit("change_select_component", {
        name: "citation",
        value: true,
      });
      
      // Передаём данные в стор для заполнения формы
      this.$store.commit("setEditingCitation", {
        id: this.citation_data.id,
        title: this.citation_data.title,
        text: this.citation_data.text,
        user_id: this.citation_data.user_id,
        index_component: this.index_component,
      });
    },

    deleteCitation() {
      this.$store.dispatch("deleteComponent", this.index_component);
    },
  },
};
</script>

<style lang="scss" scoped>
.citation-container {
  position: relative;
  padding: 20px;
  margin: 20px 0;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.citation-preview {
  &__loader {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
}

.citation-error {
  color: #ff5252;
  font-size: 14px;
}

.citation-content {
  .citation-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }

  .citation-text {
    font-size: 16px;
    font-style: italic;
    line-height: 1.6;
    color: #555;
    border-left: 4px solid #539ee0;
    padding-left: 16px;
    margin: 0 0 12px 0;
  }

  .citation-author {
    font-size: 14px;
    color: #777;
    text-align: right;
  }
}
</style>
