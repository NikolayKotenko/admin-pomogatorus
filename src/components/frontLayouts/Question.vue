<template>
  <div class="question_wrapper" contenteditable="false" :id="`question_wrapper-${count_of_question}`">
    <div class="question_wrapper__admin_controls" :style="`width: ${controls_width}px; height: ${controls_height}px`">
      <div class="question_wrapper__admin_controls__wrapper" contenteditable="false">
        <img class="question_wrapper__admin_controls__wrapper__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">
      </div>
    </div>
    <div class="question_wrapper__title">
      <h3>{{ count_of_question }}. {{ question_data.name }}</h3>
      <v-menu
          v-if="question_data.title"
          open-on-hover
          bottom
          offset-y
          transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <img
              class="help_img"
              :src="require(`/src/assets/svg/help-circle.svg`)"
              alt="help"
              v-bind="attrs"
              v-on="on"
          >
        </template>
        <span class="question_wrapper__help">
          {{ question_data.title }}
        </span>
      </v-menu>
    </div>

    <div class="question_wrapper__content">
      <template v-if="question_data.id_type_answer == '1'">
        <v-text-field
            dense
            hide-details
            solo
            placeholder="Введите ответ"
        >
        </v-text-field>
      </template>
    </div>

<!--    <div class="question_wrapper__divider"></div>-->

<!--    <template slot="append">
      <v-menu
          open-on-hover
          bottom
          offset-y
          transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon
              v-bind="attrs"
              v-on="on"
              size="20"
          >
            mdi-help-circle
          </v-icon>
        </template>
        <span class="question_wrapper__help">
                {{ question_data.title }}
              </span>
      </v-menu>
    </template>-->
  </div>
</template>

<script>
export default {
  name: "Question",
  data: () => ({
/*    question_data: {
      "id": 12,
      "name_param_env": null,
      "name": "tested",
      "purpose_of_question": "teast",
      "title": 'ЭТО ПОДСКАЗКА',
      "article": null,
      "id_type_answer": 1,
      "value_type_answer": "\"[]\"",
      "state_detailed_response": true,
      "state_attachment_response": true,
      "created_at": "20.02.2022",
      "updated_at": "25.02.2022",
      "_all_tags": [
        {
          "id": 63,
          "code": "test",
          "name": "test",
          "description": null,
          "created_at": "2022-02-20T17:25:46.000000Z",
          "updated_at": "2022-02-20T17:25:46.000000Z"
        }
      ],
      "typeanswer": {
        "id": 1,
        "code": "stroka",
        "name": "Строка ",
        "created_at": null,
        "updated_at": null
      },
      "mtomtags": [
        {
          "id": 73,
          "id_tag": 63,
          "id_question": 12,
          "id_answer": null,
          "created_at": "2022-02-26T10:06:01.000000Z",
          "updated_at": "2022-02-26T10:06:01.000000Z",
          "dtags": {
            "id": 63,
            "code": "test",
            "name": "test",
            "description": null,
            "created_at": "2022-02-20T17:25:46.000000Z",
            "updated_at": "2022-02-20T17:25:46.000000Z"
          }
        }
      ]
    },*/
    question_data: {},
    count_of_question: null,
    controls_height: 0,
    controls_width: 0,
  }),
  mounted() {
    this.getData()
  },
  computed: {
    widthOfControls() {
      const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
      console.log(elem)
      if (elem) {
        return elem.getBoundingClientRect().width + 4;
      } else {
        return 0
      }
    },
    heightOfControls() {
      const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
      if (elem) {
        return elem.getBoundingClientRect().height + 4;
      } else {
        return 0
      }
    },
  },
  methods: {
    deleteQuestion() {
      const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.count_of_question)
    },
    getData() {
      if (Object.keys(this.$store.state.TitlesModule.selectedComponent).length) {
        this.count_of_question = this.$store.state.TitlesModule.countQuestion
        this.question_data = Object.assign({}, this.$store.state.TitlesModule.selectedComponent)
        this.getHeightOfControls()
        this.getWidthOfControls()
      }
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
        console.log(elem)
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0
        }
      })
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0
        }
      })
    },
    showHelp() {

    },
  }
}
</script>

<style scoped lang="scss">
.question_wrapper {
  max-width: 600px;
  position: relative;
  padding: 4px;

  &:hover {
    .question_wrapper__admin_controls {
      opacity: 1;
    }
  }

  &__admin_controls {
    border-bottom: 1px solid rgba(83, 158, 224, 0.7);
    border-right: 1px solid rgba(83, 158, 224, 0.7);
    border-left: 1px solid rgba(83, 158, 224, 0.7);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    position: absolute;
    left: -4px;
    top: -16px;
    opacity: 0;
    transition: all .4s ease-in-out;

    &__wrapper {
      background: rgba(83, 158, 224, 0.7);
      position: absolute;
      width: 100%;
      height: 16px;
      border-radius: 2px;
      top: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 4px;

      &__img {
        width: 14px;
        height: 14px;
      }
    }
  }

  &__title {
    display: flex;
    column-gap: 15px;
    padding-bottom: 5px;
    align-items: center;
  }
  &__divider {
    margin-top: 10px;
    height: 1px;
    width: 100%;
    background: darkgrey;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }
}

.v-menu__content {
  background: #FFFFFF;
  padding: 15px;
}

.help_img {
  width: 20px;
  height: 20px;
  margin-bottom: 3px;
}
</style>
