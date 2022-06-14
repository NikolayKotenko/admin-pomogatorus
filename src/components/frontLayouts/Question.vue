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
          >
            <template slot="label">
              <div style="display: flex; column-gap: 20px; align-items: center">
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
            multiple
            v-model="answer"
            v-for="(item, index) in value_type_answer"
            :key="index"
            :value="item.answer"
            :disabled="!!detailed_response"
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
            v-model="answer"
            :disabled="!!detailed_response"
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
      <v-text-field
        v-if="question_data.state_detailed_response"
        solo
        dense
        hide-details
        placeholder="Место для развернутого ответа"
        class="py-2"
        v-model="detailed_response"
      ></v-text-field>
<!--      <div class="dialog_dropzone_wrapper">-->
<!--        <vue-dropzone-->
<!--            ref="myVueDropzone" id="dropzone" :options="options" :useCustomSlot=true v-if="!loading_dropzone" @vdropzone-success="successData" @vdropzone-sending="sendingData"-->
<!--        >-->
<!--          <h3 class="dropzone-custom-title">-->
<!--            <v-icon size="120" color="grey lighten-1" style="transform: rotate(45deg)">-->
<!--              mdi-paperclip-->
<!--            </v-icon>-->
<!--          </h3>-->
<!--          <div class="subtitle" style="color: darkgrey">Для вставки изображения перетащите файл в зону или нажмите на скрепку</div>-->
<!--        </vue-dropzone>-->
<!--        <div v-if="dropzone_uploaded.length" @click="triggerUpload()" class="dialog_dropzone_wrapper__upload">-->
<!--          <v-icon color="grey lighten-1" size="60" style="transform: rotate(45deg)">mdi-paperclip</v-icon>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
// import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import PreviewTemplate from "../dropzone/PreviewTemplate";
import Vue from "vue";

export default {
  name: "Question",
  components: {
    // vueDropzone: vue2Dropzone,
  },
  data: () => ({
    question_data: {},
    index_component: null,
    index_questions: null,
    controls_height: 0,
    controls_width: 0,
    value_type_answer: [],
    debounceTimeout: null,

    /* DROPZONE */
    index_uploaded: 1,
    dropzone_uploaded: [],
    loading_dropzone: true,
    previewHtml: null,

    /* DATA_BY_TYPES */
    rangeError: false,
    range_one: null,
    min: 0,
    max: 0,
    range_two: [],
    answer: null,
    // data_radio: null,
    // data_checkbox: null,
    detailed_response: "",
  }),
  created() {
    const ComponentClass = Vue.extend(PreviewTemplate);
    const instance = new ComponentClass();
    instance.$mount();
    this.previewHtml = instance.$el.outerHTML;
    this.loading_dropzone = false;
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
    options() {
      return {
        // url: `${this.$store.state.BASE_URL}/entity/files`,
        url: 'https://httpbin.org/post',
        previewTemplate: this.previewHtml,
        destroyDropzone: false,
        headers: {
          "My-Awesome-Header": "header value",
          Authorization: '666777',
        },
        duplicateCheck: true,
      }
    },
  },
  methods: {
    /* DROPZONE */
    sendingData(file, xhr, formData) {
      console.log(file.upload.uuid)
      formData.append('uuid', file.upload.uuid)
      // formData.append('id_answer', _store.newArticle.id)
    },
    successData(file, response) {
      console.log(response)
      const formatObj = Object.assign({}, response.data)
      Object.assign(formatObj, {index: this.index_uploaded, alt: '', title: ''})
      this.index_uploaded++
      this.dropzone_uploaded.push(formatObj)

      this.$nextTick(() => {
        const deletedElems = document.getElementsByClassName('dz_close')
        let count = 1;
        for (let item of deletedElems) {
          item.setAttribute('id', `close-${count}`);
          let index = count
          item.onclick = () => {
            this.removedFile(index)
          }
          count++
        }
      })
    },
    removedFile(id) {
      console.log(id)
      const index = this.dropzone_uploaded.findIndex(elem => {
        return elem.index === id
      })
      if (index !== -1) {
        this.$store.dispatch('deleteFile', this.dropzone_uploaded[index].id).then(() => {
          this.dropzone_uploaded.splice(index, 1)
          for (let i = 0; i < this.dropzone_uploaded.length; i++) {
            console.log(this.dropzone_uploaded[i].index)
            console.log(document.getElementById(`close-${this.dropzone_uploaded[i].index}`))
            const block = document.getElementById(`close-${this.dropzone_uploaded[i].index}`)
            block.id = `close-${i+1}`
            block.onclick = () => {
              this.removedFile(i+1)
            }
            this.dropzone_uploaded[i].index = i+1
          }
          this.index_uploaded = this.dropzone_uploaded.length+1
        })
      }
    },
    clearDropZoneTemplate() {
      for (let i = 1; i < this.dropzone_uploaded.length+1; i++) {
        this.$nextTick(() => {
          let template = document.getElementById(`close-${i}`)
          console.log(template)
          template.click()
        })
      }
    },
    triggerUpload() {
      document.getElementById('dropzone').click()
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
