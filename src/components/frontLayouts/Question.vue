<template>
  <div class="question_wrapper" contenteditable="false" :id="`component_wrapper-${index_component}`">
    <div class="question_wrapper__admin_controls-header" contenteditable="false">
      <img class="question_wrapper__admin_controls-header__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">
    </div>
    <div class="question_wrapper__title">
      <h3>
        <template v-if="index_questions">
          {{ index_questions }}.
        </template>
         {{ question_data.name }}
      </h3>
      <div class="helper_wrapper" v-if="question_data.title">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <img
                class="help_img"
                :src="require(`/src/assets/svg/help-circle.svg`)"
                alt="help"
                v-bind="attrs"
                v-on="on"
            >
          </template>
          <span>{{ question_data.title }}</span>
        </v-tooltip>
      </div>
    </div>

    <div class="question_wrapper__content">
      <template v-if="question_data.id_type_answer == '1'">
        <v-text-field
            dense
            hide-details
            solo
            placeholder="Введите ответ"
            v-model="answer"
            @change="changeAnswer"
        >
        </v-text-field>
      </template>
      <template v-else-if="question_data.id_type_answer == '2'">
        <v-textarea
            solo
            dense
            hide-details
            clearable
            auto-grow
            rows="3"
            row-height="25"
            placeholder="Введите ответ"
            v-model="answer"
            @change="changeAnswer"
        >
        </v-textarea>
      </template>
      <template v-else-if="question_data.id_type_answer == '3'">
        <v-radio-group
            dense
            hide-details
            v-model="answer"
        >
          <v-radio
              v-for="(item, index) in value_type_answer"
              :key="index"
              :value="item.answer"
              :disabled="!!detailed_response"
              @change="changeAnswer"
          >
            <template slot="label">
              <div style="display: flex; column-gap: 20px; align-items: center">
                <span v-html="item.answer" @click.stop></span>
                <div v-if="item.commentary">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <img
                          class="help_img"
                          :src="require(`/src/assets/svg/help-circle.svg`)"
                          alt="help"
                          v-bind="attrs"
                          v-on="on"
                      >
                    </template>
                    <span>{{ item.commentary }}</span>
                  </v-tooltip>
                </div>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template>
      <template v-else-if="question_data.id_type_answer == '4'">
        <v-checkbox
            hide-details
            dense
            multiple
            v-model="answer"
            v-for="(item, index) in value_type_answer"
            :key="index"
            :value="item.answer"
            :disabled="!!detailed_response"
            @change="changeAnswer"
        >
          <template slot="label">
            <div style="display: flex; column-gap: 20px">
              <span v-html="item.answer" @click.stop></span>
              <div v-if="item.commentary">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                        class="help_img"
                        :src="require(`/src/assets/svg/help-circle.svg`)"
                        alt="help"
                        v-bind="attrs"
                        v-on="on"
                    >
                  </template>
                  <span>{{ item.commentary }}</span>
                </v-tooltip>
              </div>
            </div>
          </template>
        </v-checkbox>
      </template>
      <template v-else-if="question_data.id_type_answer == '5'">
        <v-select
            solo
            dense
            hide-details
            clearable
            placeholder="Введите ответ"
            :items="value_type_answer"
            return-object
            item-text="answer"
            :menu-props="{closeOnContentClick: true, bottom: true, offsetY: true }"
            v-model="answer"
            :disabled="!!detailed_response"
            @change="changeAnswer"
        >
          <template v-slot:selection="data">
            <span
                v-bind="data.attrs"
                v-html="data.item.answer"
            ></span>
          </template>
          <template v-slot:item="{ active, item, attrs, on }">
            <v-list-item v-on="on" v-bind="attrs">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters align="center">
                    <span v-html="item.answer" @click.stop></span>
                    <v-spacer></v-spacer>
                    <div v-if="item.commentary">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <img
                              class="help_img"
                              :src="require(`/src/assets/svg/help-circle.svg`)"
                              alt="help"
                              v-bind="attrs"
                              v-on="on"
                          >
                        </template>
                        <span>{{ item.commentary }}</span>
                      </v-tooltip>
                    </div>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </template>
      <template v-else-if="question_data.id_type_answer == '6'">
        <span>Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до {{ value_type_answer[1].answer }}</span>
        <v-text-field
            solo
            dense
            hide-details
            placeholder="Введите ответ"
            v-model="range_one"
            type="number"
            :class="{rangeError: rangeError}"
            @change="changeAnswer"
        >
          <template slot="prepend-inner">
            <v-icon color="primary" @click="rangeEdit('minus')">
              mdi-minus
            </v-icon>
          </template>
          <template slot="append">
            <v-icon color="primary" @click="rangeEdit('plus')">
              mdi-plus
            </v-icon>
          </template>
        </v-text-field>
        <small v-if="rangeError" style="color: lightcoral">
          Неккоректные значения
        </small>
      </template>
      <template v-else-if="question_data.id_type_answer == '7'">
        <span>Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до {{ value_type_answer[1].answer }}</span>
        <v-range-slider
            v-model="range_two"
            :max="max"
            :min="min"
            hide-details
            type="number"
            class="align-center"
        >
          <template v-slot:prepend>
            <v-text-field
                :value="range_two[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(range_two, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
                :value="range_two[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(range_two, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
        <small v-if="rangeError" style="color: lightcoral">
          Неккоректные значения
        </small>
      </template>
      <v-text-field
        v-if="question_data.state_detailed_response"
        solo
        dense
        hide-details
        placeholder="Место для развернутого ответа"
        class="py-2"
        v-model="detailed_response"
      ></v-text-field>
    </div>

    <div class="py-3 file_input" v-if="question_data.state_attachment_response">
      <template>
        <v-btn
            color="primary"
            rounded
            dark
        >
          <v-icon>mdi-upload</v-icon>
          Загрузить файл
        </v-btn>
      </template>
    </div>

    <transition name="list">
      <div class="question_wrapper__content__alert pt-3" v-if="status_question.type !== 'sending' && check_status">
        <v-alert
            :type="status_question.type"
            :icon="status_question.icon"
        >
          <span v-html="status_question.text"></span>
        </v-alert>
      </div>
    </transition>
  </div>
</template>

<script>
import AnswerController from "../../services/article/AnswerController";

export default {
  name: "Question",
  components: {
  },
  data: () => ({
    question_data: {},
    index_component: null,
    index_questions: null,
    controls_height: 0,
    controls_width: 0,
    value_type_answer: [],
    debounceTimeout: null,
    status_name: 'sending',
    check_status: false,

    /* DATA_BY_TYPES */
    rangeError: false,
    range_one: null,
    min: 0,
    max: 0,
    range_two: [],
    answer: null,
    detailed_response: "",
  }),
  created() {
  },
  mounted() {
    this.getData()
  },
  watch: {
    'range_one': {
      handler() {
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.rangeError = ((parseInt(this.range_one) < parseInt(this.value_type_answer[0].answer)) || (parseInt(this.range_one) > parseInt(this.value_type_answer[1].answer)));
        })
      },
    },
    'detailed_response': {
      handler(v) {
        if (v) {
          this.answer = null
        }
      },
    }
  },
  computed: {
    status_question() {
      let auth_block
      let index = this.$store.state.ArticleModule.components_after_request.findIndex(i => {
        return i.component.name === 'auth'
      })
      if (index !== -1) auth_block = this.$store.state.ArticleModule.components_after_request[index].index

      return new AnswerController().create_status(this.status_name, auth_block)
    },
  },
  methods: {
    changeAnswer() {
      this.check_status = true
      setTimeout(() => {
        this.status_name = 'warning'
      }, 1000)
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.index_component)
    },
    rangeEdit(action) {
      if (action === 'plus') {
        if (!this.range_one) {
          this.$nextTick(() => {
            this.range_one = 1
          })
        } else {
          this.$nextTick(() => {
            this.range_one = parseInt(this.range_one)+1
          })
        }
      } else {
        if (!this.range_one) {
          this.$nextTick(() => {
            this.range_one = 0
          })
        } else if (parseInt(this.range_one) > 0) {
          this.$nextTick(() => {
            this.range_one = parseInt(this.range_one)-1
          })
        } else this.$nextTick(() => {
          this.range_one = 0
        })
      }
      this.changeAnswer()
    },
    getData() {
      if (Object.keys(this.$store.state.ArticleModule.selectedComponent).length) {
        this.index_questions = this.$store.state.ArticleModule.counters.questions
        this.index_component = this.$store.state.ArticleModule.counters.layout
        this.question_data = Object.assign({}, this.$store.state.ArticleModule.selectedComponent)
        this.getValue_type_answer()
        this.getHeightOfControls()
        this.getWidthOfControls()
      }
    },
    getValue_type_answer() {
      if (this.question_data['id_type_answer'] == '7') {
        let parsed = null
        parsed = JSON.parse(JSON.parse(this.question_data['value_type_answer']))
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed
        } else {
          this.value_type_answer = []
        }
        if (this.value_type_answer.length) {
          this.min = this.value_type_answer[0].answer
          this.max = this.value_type_answer[1].answer
          this.range_two = []
          this.range_two.push(this.min)
          this.range_two.push(this.max)
        }
      } else if (this.question_data['id_type_answer'] !== 1 && this.question_data['id_type_answer'] !== 2) {
        let parsed = null
        parsed = JSON.parse(JSON.parse(this.question_data['value_type_answer']))
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed
        } else {
          this.value_type_answer = []
        }
      } else {
        this.value_type_answer = JSON.parse(this.question_data['value_type_answer'])
      }
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0
        }
      })
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.list-enter-active, .list-leave-active {
  transition: all .8s;
}

.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(-30px);
  opacity: 0;
}

.question_wrapper {
  max-width: 600px;
  position: relative;
  padding: 16px 10px 8px 10px;
  //border: 1px solid rgba(83, 158, 224, 0);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom: 1px solid rgba(83, 158, 224, 0);
  border-right: 1px solid rgba(83, 158, 224, 0);
  border-left: 1px solid rgba(83, 158, 224, 0);
  transition: all .4s ease-in-out;


  &:hover {
    //border: 1px solid rgba(83, 158, 224, 0.7);
    border-bottom: 1px solid rgba(83, 158, 224, 0.7);
    border-right: 1px solid rgba(83, 158, 224, 0.7);
    border-left: 1px solid rgba(83, 158, 224, 0.7);

    .question_wrapper__admin_controls-header {
      opacity: 1;
      pointer-events: unset;
      visibility: visible;
      &__img {
        pointer-events: unset;
      }
    }
  }

  &__admin_controls-header {
    background: rgba(83, 158, 224, 0.7);
    position: absolute;
    top: 0;
    opacity: 0;
    transition: all .4s ease-in-out;
    border-radius: 2px;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 4px;
    height: 16px;
    width: 100%;
    pointer-events: none;
    visibility: hidden;
    &__img {
      width: 14px;
      height: 14px;
      pointer-events: none;
    }
  }

  &__title {
    display: flex;
    column-gap: 15px;
    padding-bottom: 5px;
    align-items: flex-start;
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

.helper_wrapper {
  padding-top: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.helper_wrapper__help {
  opacity: 0;
  transition: .2s ease-in-out;
}
.help_img {
  width: 20px;
  height: 20px;
  margin-bottom: 3px;
  padding-top: 2px;
}

.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.rangeError {
  border: 1px solid lightcoral !important;
  .question_main_wrapper__item {
    border-bottom: unset;
  }
  ::v-deep input {
    color: lightcoral;
  }
}
</style>
