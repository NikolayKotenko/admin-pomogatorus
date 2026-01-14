<template>
  <div
    :id="`component_wrapper-${index_component}`"
    :data-id="specification_data.imageId"
    contenteditable="false"
    data-name="specification"
    class="componentArticle_wrapper component_container specification-container"
    @dblclick="editSpecification"
  >
    <!-- Кнопка удаления -->
    <div class="componentArticle_wrapper__admin_controls-header">
      <CloseSVG
        alt="close"
        class="componentArticle_wrapper__admin_controls-header__img"
        @click="deleteSpecification()"
      />
    </div>

    <!-- Превью спецификации -->
    <div class="specification-preview">
      <template v-if="isLoading">
        <div class="specification-preview__loader">
          <v-progress-circular
            :size="24"
            color="#539ee0"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>

      <template v-else-if="!specification_data.imageUrl">
        <span class="specification-error">Ошибка: изображение отсутствует</span>
        <v-icon color="orange" class="mt-1">mdi-alert</v-icon>
      </template>

      <template v-else>
        <div class="specification-content">
          <img 
            :src="specification_data.imageUrl" 
            alt="Интерактивная спецификация"
            class="specification-image"
          />
          <div class="specification-overlay">
            <v-icon color="white" size="20">mdi-image-filter-center-focus</v-icon>
            <span>Меток - {{ hotspotsCount }}</span>
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
  name: "SpecificationArticle",
  components: {
    CloseSVG,
  },
  data: () => ({
    index_component: null,
    index_specification: null,
    specification_data: {},
    hotspotsCount: 0,
    isLoading: false,
  }),
  watch: {
    '$store.state.ArticleModule.selectedComponent': {
      handler(newVal) {
        if (newVal && Object.keys(newVal).length && !this.specification_data.imageId) {
          this.getData();
        }
      },
      deep: true
    }
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (Object.keys(this.$store.state.ArticleModule.selectedComponent).length) {
        this.index_specification = this.$store.state.ArticleModule.counters.specification;
        this.index_component = this.$store.state.ArticleModule.counters.layout;
        
        this.specification_data = Object.assign(
          {},
          this.$store.state.ArticleModule.selectedComponent
        );

        if (this.specification_data.imageId) {
          this.getHotspotsCount();
        } else {
          console.error('❌ imageId отсутствует в specification_data!');
        }
      }
    },


    async getHotspotsCount() {
      this.isLoading = true;
      
      try {
        const selectQuery = Request.ConstructSelectQuery(['*']);
        
        const result = await Request.get(
          `${this.$store.state.BASE_URL}/entity/specifications?${selectQuery}&filter[id_image]=${this.specification_data.imageId}`
        );
        
        this.hotspotsCount = result.data?.length || 0;
        
      } catch (error) {
        console.error('Ошибка получения меток:', error);
        this.hotspotsCount = 0;
      } finally {
        this.isLoading = false;
      }
    },


    editSpecification() {
      this.$store.commit("change_name_component", "specification");
      this.$store.commit("change_select_component", {
        name: "specification",
        value: true,
      });
      
      // Передаём данные для редактирования в HeaderBlock
      this.$store.commit("setEditingSpecification", {
        imageId: this.specification_data.imageId,
        imageUrl: this.specification_data.imageUrl,
        index_component: this.index_component,
      });
    },

    deleteSpecification() {
      this.$store.dispatch("deleteComponent", this.index_component);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Важно: не трогаем общий css, только поведение слоёв в спецификации */
.specification-container .specification-content,
.specification-container .specification-image,
.specification-container .specification-overlay {
  pointer-events: none;
}

.specification-container {
  position: relative;
  padding: 0;
  margin: 20px 0;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  overflow: hidden;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .specification-overlay {
      margin: 20px;
      opacity: 1;
    }
  }
}

.specification-preview {
  &__loader {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
}

.specification-error {
  color: #ff5252;
  font-size: 14px;
}

.specification-content {
  position: relative;
  
  .specification-image {
    width: 100%;
    display: block;
  }
  
  .specification-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s;
  }
}
</style>
