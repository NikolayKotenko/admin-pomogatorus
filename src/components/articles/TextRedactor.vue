<template>
  <div class="textRedactor">
    <div class="textRedactor__header">
      <div class="textRedactor__header__firstLine">
        <!-- Вставить элемент в текст -->
        <div class="header__elBlock right">
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
              >
                mdi-plus
              </v-icon>
            </template>
            <v-list>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                        @click="test()"
                    >
                      mdi-format-align-left
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по левой стороне </v-list-item-title>
                  </template>
                  <span>Выравнивание по левой стороне</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Undo/Redo -->
        <div class="header__elBlock right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-undo
              </v-icon>
            </template>
            <span>Отменить</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-redo
              </v-icon>
            </template>
            <span>Вернуть</span>
          </v-tooltip>
        </div>
        <!-- Жирный/курсив и т.д. -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-title
                </v-icon>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Настройка текста</span>
          </v-tooltip>
        </div>
        <!-- Заголовки -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-header-pound
                </v-icon>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Настройка заголовка</span>
          </v-tooltip>
        </div>
        <!-- Шрифты -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-font
                </v-icon>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Настройка шрифта</span>
          </v-tooltip>
        </div>
        <!-- Цвет текста -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <div style="display: flex; flex-direction: column; align-items: center; position: relative">
                  <v-icon>
                    mdi-format-color-text
                  </v-icon>
                  <div style="width: 60%; height: 2px; background: black; position: absolute; top: 20px"></div>
                </div>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Выбрать цвет текста</span>
          </v-tooltip>
        </div>
        <!-- Выделение текста -->
        <div class="header__elBlock">
          <v-menu
              bottom
              offset-y
              transition="scale-transition"
              :close-on-click="false"
              :close-on-content-click="false"
              v-model="text_underline"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <div style="display: flex; flex-direction: column; align-items: center; position: relative">
                  <v-icon>
                    mdi-format-color-highlight
                  </v-icon>
                  <div style="width: 60%; height: 2px; background: black; position: absolute; top: 20px"></div>
                </div>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <div style="display: grid">
                  <div style="justify-self: end">
                    <v-icon @click="text_underline = false">mdi-close</v-icon>
                  </div>
                  <v-color-picker
                      :swatches="swatches"
                      show-swatches
                  ></v-color-picker>
                  <v-btn
                      color="primary"
                      @click="text_underline = false"
                  >
                    Применить
                  </v-btn>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Очистка форматирования -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="test2()"
              >
                mdi-format-clear
              </v-icon>
            </template>
            <span>Очистить форматирование</span>
          </v-tooltip>
        </div>
      </div>
      <div class="textRedactor__header__secondLine">
        <!-- Форматирование -->
        <div class="header__elBlock">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-align-left
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-left
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по левой стороне </v-list-item-title>
                  </template>
                  <span>Выравнивание по левой стороне</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-right
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по правой стороне </v-list-item-title>
                  </template>
                  <span>Выравнивание по правой стороне</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-center
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по центру </v-list-item-title>
                  </template>
                  <span>Выравнивание по центру</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-justify
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по ширине </v-list-item-title>
                  </template>
                  <span>Выравнивание по ширине</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Отступы -->
        <div class="header__elBlock">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-indent-decrease
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-indent-increase
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Сделать отступ </v-list-item-title>
                  </template>
                  <span>Сделать отступ</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-indent-decrease
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Убрать отступ </v-list-item-title>
                  </template>
                  <span>Убрать отступ</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Высота строки -->
        <div class="header__elBlock right">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-line-spacing
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item
                  v-for="(value_spacing, index) in line_spacing"
                  :key="index"
              >
                <v-list-item-title> {{ value_spacing.value }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>

    <div
        class="textRedactor__content"
        contenteditable="true"
        spellcheck="false"
        ref="ce" @input="onCeChange"
    >
      lorem loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
      lorem
      loremloremlorem
      lorem
    </div>

    <v-btn @click="getELEM()">
      GET ELEM
    </v-btn>

<!--  EXPEREMENTAL  -->
<!--    <div
        class="textRedactor__content"
        contenteditable="true"
        spellcheck="false"
        ref="ce" @input="onCeChange"
    ></div>-->

<!--  РАБОЧИЙ ВАРИАНТ БЕЗ v-model!  -->
<!--    <div
        class="textRedactor__content"
        contenteditable="true"
        spellcheck="false"
    >
      lorem loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
      lorem
      loremloremlorem
      lorem
    </div>-->

<!--    <v-autocomplete-->
<!--      :items="$store.state.TitlesModule.fonts"-->
<!--      item-text="family"-->
<!--    />-->
  </div>
</template>

<script>
import Vue from "vue";
import WebFontLoader from 'webfontloader';
import Question from "../frontLayouts/Question";

export default {
  name: "TextRedactor",
  data: () => ({
    /* EDITOR */
    line_spacing: [
      {
        value: 1,
      },
      {
        value: 1.15,
      },
      {
        value: 1.5,
      },
      {
        value: 2,
      },
      {
        value: 2.5,
      },
      {
        value: 3,
      },
    ],
    text_underline: false,
    swatches: [
      ['#000000', '#2196F3', '#A9A9A9'],
      ['#FF0000', '#FFFFFF', '#AA0000'],
      ['#FFFF00', '#0000FF', '#8E24AA'],
      ['#00FF00', '#00AA00', '#005500'],
      ['#00FFFF', '#00AAAA', '#005555'],
    ],
    insert_items: [
      {
        componentName: '',
        component_ruName: '',
      }
    ],
    fakeContent: '',
    instances: [

    ],
  }),
  created() {
    WebFontLoader.load({
      google: { families: ["Roboto", 'Hurricane', 'Palette Mosaic']}
    })
  },
  mounted() {
    this.onCeChange()
    this.$store.dispatch('testFont')
  },
  watch: {
  },
  computed: {
    content: {
      cache: false,
      get: function () { return this.$refs.ce.innerHTML ; },
      set: function (val) {
        this.$refs.ce.innerHTML  = val;
      }
    }
  },
  methods: {
    getELEM() {
      console.log(this.content)
    },
    onCeChange() {
      // console.log(this.$refs.ce.innerHTML)
      // console.log('this.content: ' + this.content);
    },
    test2() {
      document.execCommand("bold", false, null)
    },
    test() {
      console.log('test')

      let ComponentClass = Vue.extend(Question)
      this.instances.push(new ComponentClass())
      this.instances[0].$mount() // pass nothing

      console.log('instance')
      console.log(this.instances[0])
      console.log('instance.$el')
      console.log(this.instances[0].$el.innerHTML)

      let sel, range, html;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.collapse(false);
          range.insertNode(this.instances[0].$el);
        }
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.collapse(false);
        html = (this.instances[0].$el.nodeType == 3) ? this.instances[0].$el.innerHTML.data : this.instances[0].$el.outerHTML;
        range.pasteHTML(html);
      }

      // this.$refs.container.appendChild(this.instances[0].$el)

      // this.content = instance.$el.outerHTML

      // document.execCommand("insertHTML", false, this.instances[0].$el.innerHTML);
    },
  },
}
</script>

<style scoped lang="scss">
.textRedactor {
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  border-radius: 5px;

  &__header {
    background: #e9ecf4;
    width: 100%;
    display: grid;
    grid-template-areas:
              'firstLine'
              'secondLine';
    box-shadow: 0px -3px 5px -5px rgba(0, 0, 0, 0.6) inset;

    &__firstLine {
      display: flex;
      justify-content: space-between;
      grid-area: firstLine;
    }

    &__secondLine {
      display: flex;
      grid-area: secondLine;
    }

    .header__elBlock {
      padding: 2px 4px;

      &:last-child {
        border-right: unset;
      }

      &__iconWrapper {
        position: relative;
        padding-right: 10px;

        &__arrow {
          position: absolute !important;
          right: -8px !important;
          top: 0;
        }
      }
    }
    .right {
      border-right: 1px solid #c3cfd9;
    }
  }

  &__content {
    padding: 20px;
    outline: none;
    min-height: 300px;
    margin: 10px 0;
  }
}

.v-menu__content {
  max-width: 90% !important;
}
.v-menu-item {
  font-size: 1em;
  padding-left: 10px
}
::v-deep .v-color-picker__color {
  border: 1px solid lightgrey !important;
}
</style>
