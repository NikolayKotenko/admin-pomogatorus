<template>
  <div class="question_wrapper" contenteditable="false" :id="`question_wrapper-${count_of_question}`">
<!--    <div class="question_wrapper__admin_controls" :style="`width: ${controls_width}px; height: ${controls_height}px`">-->
<!--      <div class="question_wrapper__admin_controls__wrapper" contenteditable="false">-->
<!--        <img class="question_wrapper__admin_controls__wrapper__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">-->
<!--      </div>-->
<!--    </div>-->
    <div class="question_wrapper__admin_controls-header" contenteditable="false">
      <img class="question_wrapper__admin_controls-header__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">
    </div>
    <div class="question_wrapper__title">
      <h3>{{ count_of_question }}. {{ question_data.name }}</h3>
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
        >
        </v-textarea>
      </template>
      <template v-else-if="question_data.id_type_answer == '3'">
        <v-radio-group
            dense
            hide-details
        >
          <v-radio
              v-for="(item, index) in value_type_answer"
              :key="index"
              :value="item.answer"
          >
            <template slot="label">
              <div style="display: flex; column-gap: 20px">
                <span>
                  {{item.answer}}
                </span>
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
            v-for="(item, index) in value_type_answer"
            :key="index"
            :value="item.answer"
        >
          <template slot="label">
            <div style="display: flex; column-gap: 20px">
                <span>
                  {{item.answer}}
                </span>
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
        >
          <template v-slot:item="{ active, item, attrs, on }">
            <v-list-item v-on="on" v-bind="attrs">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters align="center">
                    <span>{{ item.answer }}</span>
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
    </div>
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
    value_type_answer: [],
    debounceTimeout: null,

    /* DATA_BY_TYPES */
    rangeError: false,
    range_one: null,
    min: 0,
    max: 0,
    range_two: [],
  }),
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
    }
  },
  computed: {

  },
  methods: {
    deleteQuestion() {
      const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.count_of_question)
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
    },
    getData() {
      if (Object.keys(this.$store.state.TitlesModule.selectedComponent).length) {
        this.count_of_question = this.$store.state.TitlesModule.countQuestion
        this.question_data = Object.assign({}, this.$store.state.TitlesModule.selectedComponent)
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
        const elem = document.getElementById(`question_wrapper-${this.count_of_question}`)
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
  }
}
</script>

<style scoped lang="scss">
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

    .question_wrapper__admin_controls {
      opacity: 1;
    }
    .question_wrapper__admin_controls-header {
      opacity: 1;
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
    &__img {
      width: 14px;
      height: 14px;
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

.helper_wrapper {
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
