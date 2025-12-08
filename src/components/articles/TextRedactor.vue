<template>
  <div :class="{ disabled: !check_created_article }" class="textRedactor">
    <HeaderBlock @callCheckout="callCheckout" @add-link="addLink"/>

    <div
        ref="content"
        :contenteditable="
        check_created_article && !$store.state.ArticleModule.startRender
      "
        class="textRedactor__content"
        spellcheck="false"
        @input="
        onContentChange;
        preventStyles;
      "
        @mouseup="onSelectionContent()"
        @keyup.enter="preventStyles"
    ></div>

    <!-- OVERLAYS -->
    <div
        v-if="!check_created_article || $store.state.ArticleModule.startRender"
        class="overlay"
    ></div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store/index.js";
import vuetify from "@/plugins/vuetify";

import HeaderBlock from "./HeaderBlock";
import Question from "../frontLayouts/Question";
import ImageLayout from "../frontLayouts/ImageLayout";
import NomenclatureArticle from "../frontLayouts/NomenclatureArticle";
import LoginAuth from "../auth/LoginAuth";

import titlesStore from "@/store/modules/article/index.js";
import DataComponent from "../../services/article/dataComponent";
import {Constructor_instance, Imported_component,} from "../../helpers/constructors";

import iconsModels from "../../models/iconsModels";

const _store = titlesStore.state;

const factory = new DataComponent();

export default {
  name: "TextRedactor",
  props: ["newArticle", "deletedContent"],
  components: {
    HeaderBlock,
  },
  data: () => ({
    /* MODALS */
    range: null,
    htmlSelected: null,
    selection: null,

    /* INSERT COMPONENTS */
    /**
     * @property {Boolean} - важный флаг при toggle которого происходит сохранение статьи (В будущем переписать на отдельный метод сохранения, хз почему он через вотчер работает)
     * **/
    saveDB: false,
    /**
     * @property {Boolean} - флаг, что сейчас идёт получения данных с бэкенда / рендеринг статьи
     * **/
    geting_from_server: false,
    debounceTimeout: null,
  }),
  mounted() {
    /**
     * GLOBAL NOTE INFO:
     * Весь принцип рендеринга компонентов в следующем:
     * 1. Получаем вёрстку с компонентами и текстом
     * 2. По массиву компонентов, которые сохранены в БД мы понимаем сколько в статье должно быть компонентов и куда их врендерить
     * 3. Если мы просто оставим "сырую" вёрстку из HTML с бэкенда - то мы не сможем работать с редактором! Будут отсутствовать функции удаления/добавления компонентов
     * 4. Вставляем "сырую" вёрстку с бэка в наш content
     * 5. Иттерируемся по компонентам и для каждого компонента удаляем HTML-элемент из DOM-дерева
     * 6. Заместо обычного HTML вставляем в это место наш Vue-component с данными по нашему компоненту. Вмонтировываем его в VDOM
     * 7. После этого, наш HTML синхронизирован с Vue-приложением и мы можем пользоваться редактором
     * **/

    /**
     * Общие настройки по сбросу стилей и поведения редактора при вводе текста
     * **/
    this.preventInsertingStyles();
    this.onkeydownInEditable();

    /**
     * ВАЖНО! Без таймаутов ничего не запустится. Нашему DOM-дерево надо дать время "прогреться" чтобы можно было работать с ним
     * **/
    setTimeout(() => {
      /** Вешаем на редактор событие по триггеру изменений **/
      this.$refs.content.addEventListener("input", this.onContentChange);

      /**
       * Самая важная часть при инициализации страницы
       * **/
      this.initializeContent().then(() => {
        this.checkOnDeletedComponents();
        this.$nextTick(() => {
          this.resetCounter(_store.list_components);
          this.changeIndexQuestion();
          this.getInsertedHtmlImageCounters()
          this.onContentChange(true);

          this.debugConsole(`Окончание рендеринга! Итоговый список компонентов list_components:`, _store.list_components)
          this.debugConsole(`Окончание рендеринга! Итоговый список counters:`, _store.counters)
        });
      });
    }, 500);
  },
  watch: {
    /** Через mapState не прокидывается и не реагирует **/
    "$store.state.ArticleModule.isSaveArticle": {
      handler() {
        this.$nextTick(() => {
          this.$store.commit("changeContent", this.content);
          this.$store.commit("change_by_action_editor");
        })
      },
      deep: true
    },
    /** Здесь триггерим сохранение статьи **/
    saveDB: {
      handler(v) {
        if (!this.geting_from_server && v) {
          this.$store.commit("changeContent", this.content);
          this.$store.commit("change_by_action_editor");
        }
      },
    },
    /** Очищаем все данные по редактору **/
    deletedContent: {
      handler(v) {
        if (v) {
          this.content = "";
          this.$store.commit("clean_store");
        }
      },
    },
    /** Если в стор попал компонент, подлежащий удалению - то удаляем из HTML и стора **/
    "$store.state.ArticleModule.deletedComponent": {
      handler(v) {
        if (v) this.deletingComponent();
      },
    },
    /** Если получили контент с бэкенда в сторе, то синхронизируем его со стором **/
    "$store.state.ArticleModule.content_from_server": {
      handler() {
        this.content = _store.content_from_server;
        this.$store.commit("changeContent", this.content);
      },
    },
    /** Если получили информацию, что надо перерендерить весь редактор - то перерендериваем **/
    "$store.state.ArticleModule.startRender": {
      handler(v) {
        if (v) {
          this.debugConsole("Начинаем ререндеринг статьи!")

          /**
           * ВАЖНО! Дожидаемся обновления HTML, чтобы синхронизировать все изменения со стором
           * **/
          this.$nextTick(() => {
            this.content = _store.content_from_server;
          });

          this.debugConsole(`Следующие компоненты подлежат перерендерингу.
          _store.components_after_request: `, _store.components_after_request)

          /* Start render */
          if (_store.components_after_request.length) {
            /* Initialise render func */
            this.initializeContent().then(() => {
              /* Check if some questions was deleted from DB */
              this.checkOnDeletedComponents();
              this.$nextTick(() => {
                /* Reset Counters & Question number */
                this.resetCounter(_store.list_components);
                this.changeIndexQuestion();
                /* Set start Render to default and prepare for next rerender */
                this.$store.commit("change_start_render", false);
              });
            });
          } else {
            this.debugWarning("Внимание! Компоненты для ререндеринга отсутствуют!")
            this.$store.commit("clear_list_components", []);
            this.$store.commit("change_start_render", false);
            /* Reset Counters & Question number */
            this.resetCounter(_store.list_components);
          }
        }
      },
    },
  },
  computed: {
    /**
     * Для включения дебаг режима - необходимо на странице с редактором добавить в URL &isDebug=true
     *
     * @function - проверка на наличие в роутере флага на дебаг режим
     * @return {Boolean} - флаг, который отвечает что редактор в дебаг режиме
     * @example
     * // Returns true
     * &isDebug=true
     * **/
    isDebugMode() {
      return !!this.$route?.query?.isDebug
    },

    /**
     * Проверяем заполнено ли название статьи. Если нет - то не даем изменять статью в редакторе
     * **/
    check_created_article() {
      return (
          this.newArticle.name.value !== ""
      );
    },
    /**
     * Главный геттер/сеттер для всего контента в нашем редакторе
     * **/
    content: {
      cache: false,
      get() {
        if (this.$refs.content) {
          return this.$refs.content.innerHTML;
        }
        return "";
      },
      set(val) {
        this.$refs.content.innerHTML = val;
      },
    },
    /**
     * Калькулируем на лету какой компонент подлежит рендерингу.
     * Возвращает сущность Vue-компонента, которая потом попадёт в VDOM и ппотом в DOM-дерево!
     * Поэтому ВАЖНО проставлять в store название компонента, который сейчас будет рендериться!
     * **/
    componentLayout() {
      if (_store.name_component === "questions") {
        return Vue.extend(Question);
      }

      if (_store.name_component === "image") {
        return Vue.extend(ImageLayout);
      }

      if (_store.name_component === "nomenclature") {
        return Vue.extend(NomenclatureArticle);
      }

      return Vue.extend(LoginAuth);
    },
  },
  methods: {
    /**
     * @function - метод для отладки значений в редакторе. Если включен режим дебага, то в консоль посыпятся логи
     * **/
    debugConsole(...args) {
      if (this.isDebugMode) {
        if (typeof args[0] === "string") {
          const [title, ...rest] = args
          console.log(`[DEBUG WARNING]: ${title}`, ...rest)
        } else {
          console.log(...args)
        }
      }
    },
    /**
     * @function - метод для отладки значений в редакторе. Если включен режим дебага, то в консоль посыпятся варнинги
     * **/
    debugWarning(...args) {
      if (this.isDebugMode) {
        if (typeof args[0] === "string") {
          const [title, ...rest] = args
          console.warn(`[DEBUG WARNING]: ${title}`, ...rest)
        } else {
          console.warn(...args)
        }
      }
    },

    /**
     * @function - метод для рендера компонентов картинок для скопированного HTML-текста
     * @param id {String | Number} - передаем event.target из копипаста
     * **/
    async onPasteImageComponent(id) {
      await this.$nextTick(() => {
        this.debugConsole("Начинаем рендерить изображения из скопированного текста с HTML")
        /**
         * Достаем все картинки из вставляемого HTML по тэгу <img
         * **/
        const rawImages = this.getImageFromOnPaste(id)

        if (!rawImages.length) {
          this.debugWarning("Нет ни одного <img> в скопированном тексте")
          return
        }

        this.debugConsole(`Полученные изображения из текста: `, rawImages)

        /**
         * UNDO/REDO
         * **/
        if (!_store.txtDisplay.length) {
          this.$store.commit("change_by_action_editor");
        }

        /**
         * Начинаем рендерить эти картинки в компоненты
         * **/
        for (const image of rawImages) {
          this.debugConsole(`Изображение подготовлено к рендерингу.
          image: `, image)

          /**
           * Достаем все данные, которые доступны из HTML и из стора
           * **/
          const url = image.src ?? ""
          const title = image.title ?? ""
          const alt = image.alt ?? ""
          const idImage = null // TODO: тут id из нашего хранилища фоток. Что делаем если вставляется HTML а там src с чужой фоткой? Догружаем на наш бэк?
          const indexComponent = _store.counters.layout
          const width = image.width ?? ""
          const height = image.height ?? ""
          const idArticle = _store.newArticle.id

          const data = Object.assign({}, {orig_path: url}, {id: idImage}, {title_image: title}, {alt_image: alt}, {height}, {width}, {idArticle});

          /**
           * Проставляем все counter, чтобы редактор статей считал наши новые компоненты компонентами
           * + делаем магию по проставлению данных в стор
           * **/
          this.$store.commit("change_counter", {
            name: "layout",
            count: indexComponent + 1,
          });
          this.$store.commit("change_counter", {
            name: "image",
            count: _store.counters.image + 1,
          });
          this.$store.commit("change_name_component", "image");
          this.$store.commit("changeSelectedObject", data);

          /**
           * Удаляем сырой HTML, который вставился из копипаста
           * **/
          let range = document.createRange();
          range.selectNode(image);
          range.deleteContents();
          range.collapse(false);

          /**
           * Нагенериваем сущности необходимые для работы с компонентами
           * **/
          let data_component = factory.create(_store.name_component, {
            name: _store.name_component,
            id: null,
            index_image: _store.counters.image,
            src: url,
            alt: alt,
            title: title,
            idArticle: idArticle
          });

          /**
           * Заполняем в стор наш новый компонент
           * **/
          _store.list_components[indexComponent] = this.getStructureForInstance(data_component);

          /**
           * Рендерим компонент
           * **/
          _store.list_components[indexComponent].instance.$mount();
          /**
           * Добавляем в DOM
           * **/
          range.insertNode(_store.list_components[indexComponent].instance.$el);

          /**
           * Очищаем стор
           * **/
          this.$store.commit("changeSelectedObject", {});
        }

        this.debugConsole("Окончание рендеринга изображения в статью")
      })

      this.$nextTick(() => {
        this.debugConsole("После рендеринга изображений подчищаем редактор для последующей работы")

        this.resetCounter(_store.list_components);
        this.changeIndexQuestion();

        this.$store.commit("change_counter", {
          name: "insertedHtml",
          count: _store.counters.insertedHtml + 1,
        });
        this.onContentChange();
      })
    },
    /**
     * @function - достаем из html все картинки
     * @param id {String | Number} - весь div из event.target
     * **/
    getImageFromOnPaste(id) {
      const div = document.getElementById(`inserted-html-${id}`);
      const childrenWithTag = div.getElementsByTagName("img");

      return [...childrenWithTag] || []
    },
    /**
     * @function - проверяем есть ли в тексте html тэги <img>
     * @param text {String} - html конвертированный в обычный текст
     * **/
    isImageContains(text) {
      return text.includes("<img")
    },

    /**
     * @function - функция для того, чтобы в заголовках при нажатии на enter и других нажатий на клавиши не возникали лишние элементы в HTML
     * **/
    preventStyles() {
      let range = null;
      if (window.getSelection) {
        let selection = null;
        selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
          range = null;
          range = selection.getRangeAt(0);
          range.collapse(false);
        }
      } else if (document.selection && document.selection.createRange) {
        range = null;
        range = document.selection.createRange();
        range.collapse(false);
      }

      if (range) {
        if (range.commonAncestorContainer.parentElement.nodeName === "H2") {
          let value = range.commonAncestorContainer.parentElement.innerText;
          let element = document.createElement("div");
          element.innerText = value;

          range.selectNode(range.commonAncestorContainer.parentElement);
          range.deleteContents();
          range.collapse(false);
          range.insertNode(element);
        }
      }
    },
    /** Меняем в скопированном тексте символы на значение из хэш-таблицы **/
    escapeText(text) {
      let map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return text.replace(/[&<>"']/g, function (m) {
        return map[m];
      });
    },
    /** Функция отключает дефолтное поведение при вставке текста в редактор **/
    preventInsertingStyles() {
      const _this = this;
      this.$refs.content.onpaste = (e) => {
        /**
         * Выключаем дефолтное поведение при копипасте
         * **/
        e.preventDefault();

        /**
         * Преобразовываем скопированное в text
         * **/
        let text = (e.originalEvent || e).clipboardData.getData("text/plain");

        /**
         * Если есть картинка в тексте(HTML), то рендерим как картинку
         * **/
        if (_this.isImageContains(text)) {
          /**
           * Оборачиваем скопированный HTML в контейнер с отступами и стилями, которые добавляются во все встраиваемые компоненты редактора
           * **/
          const result = `<div id="inserted-html-${_store.counters.insertedHtml}" class="inserted-html-image-container"><div style="min-height: 24px"></div>${text}<div style="min-height: 24px"></div></div>`
          /**
           * ВАЖНО! Этот шаг обязательно должен быть, иначе на моменте работы с HTML наше DOM-дерево будет пустым и мы не сможем достать НИ-ЧЕ-ГО
           * **/
          document.execCommand("insertHtml", false, result);

          /** Запускаем магию по встраиванию картинок из HTML-текста в редактор **/
          _this.onPasteImageComponent(_store.counters.insertedHtml)
        } else {
          /**
           * Дефолтное поведение - вставили в редактор и сохранили
           * **/
          document.execCommand("insertHtml", false, text);
          _this.onContentChange();
        }
      };
    },
    /**
     * Функция добавления логики на удаление выбранного текста
     * Если на пути у кнопки удаления есть НАШ отрендеренный компонент -
     * то удаляем выбранный компонент из наших сторов, чтобы он не рендерился и не создавал ошибок
     * **/
    onkeydownInEditable() {
      const _this = this;
      this.$refs.content.onkeydown = function (e) {
        if (e.key === "Backspace" || e.key === "Delete" || e.key === "Paste") {
          /**
           * Получаем выбранный рейндж, либо он будет [] если пользователь ничего не выбирал
           * **/
          const selection = window.getSelection();
          /**
           * Не даём удалять наш компонент если нет anchorNode
           * **/
          if (!selection.anchorNode) return;
          if (
              selection.anchorNode.textContent === "" &&
              selection.anchorNode.className !== "textRedactor__content" &&
              selection.anchorNode.isContentEditable
          ) {
            /**
             * Если это действие происходит внутри нашего редактора и мы "удаляем" наш компонент, то удаляем из вёрстки
             * **/
            e.preventDefault();
            selection.anchorNode.parentNode.removeChild(selection.anchorNode);
            _this.onContentChange();
          }
        }
      };
    },

    /**
     * Хитрая штука, которая может достать компоненты из content даже если в list_components пустой массив
     * Нужно для кейсов, когда может быть рассинхрон с компонентами и контентом
     *
     * @function - Функция, которая достает все элементы из верстки, которые могут быть отрендерены в нашем редакторе
     * **/
    checkOutOfSync() {
      let arrComponentsData = [];
      /**
       * Достаем все компоненты из DOM по нашему идентификатору
       * **/
      const componentsNodes = document.getElementsByClassName(
          "component_container"
      );

      /**
       * Запускаем эту функцию только в том случае, если длина компонентов в вёрстке(DOM) не совпадает с list_components, полученных от бэкенда
       * **/
      if (componentsNodes.length !== _store.list_components.length) {
        this.debugWarning("Произошло несоответствие между компонентами в БД и компонентами в контенте \n Начата процедура получения данных из вёрстки")
        let arrCollection = [...componentsNodes];

        let counters = {
          index_image: 1,
          index_questions: 1,
          index_auth: 1,
          index_nomenclature: 1,
        };

        let dataComponent = {};

        arrCollection.forEach((htmlCollection) => {
          if (htmlCollection.dataset.name) {
            /* Set index from id HTML element */
            let tmpStr = htmlCollection.id.match("-(.*)");
            let index = tmpStr[tmpStr.length - 1];
            /* Set name by data */
            dataComponent.name = htmlCollection.dataset.name;
            /* Set uniq index_%component% */
            dataComponent[`index_${htmlCollection.dataset.name}`] =
                counters[`index_${htmlCollection.dataset.name}`];
            /* Set uniq data for specific component */
            if (htmlCollection.dataset.name === "questions") {
              dataComponent.id = htmlCollection.dataset.id;
            } else if (htmlCollection.dataset.name === "image") {
              dataComponent.src = htmlCollection.dataset.src;
            } else if (htmlCollection.dataset.name === "nomenclature") {
              dataComponent.id = htmlCollection.dataset.id;

              if (htmlCollection.getElementsByClassName("c-slide").length) {
                const slideArr = [
                  ...htmlCollection.getElementsByClassName("c-slide"),
                ];

                dataComponent.nomenclatures_id = [];

                slideArr.forEach((slide) => {
                  dataComponent.nomenclatures_id.push(slide.dataset.id);
                });
              }
            }
            /* Push to arr result */
            arrComponentsData.push(
                new Imported_component({
                  index: parseInt(index),
                  component: dataComponent,
                })
            );
            /* Update global counters */
            counters[`index_${htmlCollection.dataset.name}`]++;
            /* Clear intermediate object */
            dataComponent = {};
          }
        });

        this.debugWarning(`Закончен процесс поиска компонентов в вёрстке.
        arrComponentsData: `, arrComponentsData)
      }

      return arrComponentsData;
    },

    /**
     * @function - основная функция по рендерингу компонентов внутри редактора
     * **/
    renderFunc() {
      this.debugConsole("Начинаем функцию рендеринга с подготовленными компонентами")

      let deletedIndexes = [];

      /** Иттерируемся по массиву готовых к рендеру компонентов **/
      _store.list_components.forEach((elem, index) => {
        this.debugConsole(`Подготовленный элемент к рендерингу. [index]: ${index}
        elem: `, elem)

        /** Метод по изменению counters и проставлению данных компонента в стор **/
        this.checkTypeComponent(elem);

        let data = elem.data;
        /** Если наш компонент - изображение, то небходимо достать по нему данные из вёрстки **/
        if (elem.component.name === "image") {
          const htmlParent = document.getElementById(
              `component_wrapper-${elem.index}`
          )

          if (!htmlParent) {
            this.debugWarning(`Внимание! У компонента изображения отсутствует <component_wrapper-> тэг! [index]: ${elem.index},
            elem: `, elem)
            deletedIndexes.push(index);
            return
          }

          const htmlImage = htmlParent.getElementsByClassName("inserted_image")[0]

          if (!htmlImage) {
            this.debugWarning(`Внимание! У компонента изображения отсутствует <img> тэг! [index]: ${elem.index},
            elem: `, elem)
            deletedIndexes.push(index);

            /**
             * Выбираем из вёрстки наш компонент
             * Удаляем его из DOM-дерева
             * Иначе будет ломаться логика рендера
             * **/
            let range = document.createRange();
            range.selectNode(
                document.getElementById(`component_wrapper-${elem.index}`)
            );
            range.deleteContents();
            range.collapse(false);
            return;
          }

          const url = htmlImage.src
          const IdImage = htmlParent.dataset.id
          const alt = htmlImage.alt;
          const title = htmlImage.title;
          const width = htmlImage.width;
          const height = htmlImage.height;
          const idArticle = _store.newArticle.id

          data = Object.assign({}, {orig_path: url}, {id: IdImage}, {title_image: title}, {alt_image: alt}, {width}, {height}, {idArticle});
        }
        /** Меняем глобальный counter **/
        this.$store.commit("change_counter", {
          name: "layout",
          count: elem.index,
        });
        /**
         * ВАЖНО! На этом этапе обязательно передаем дату компонента в стор,
         * т.к. в последующем когда компонент будет вмонтироваться, оттуда возьмется вся необходимая информация
         * **/
        this.$store.commit("changeSelectedObject", data);

        /** Начинаем ~МАГИЮ~ **/
        let range = document.createRange();

        /** Если в DOM-дереве отсутствует компонент, который мы должны отрендерить, то выходим **/
        if (!document.getElementById(`component_wrapper-${elem.index}`)) {
          this.debugWarning(`Останавливаем рендеринг. Компонент отсутствует в DOM-дереве! [index]: ${index},
          elem: `, elem)
          return;
        }

        /**
         * Выбираем из вёрстки наш компонент
         * Удаляем его из DOM-дерева
         * **/
        range.selectNode(
            document.getElementById(`component_wrapper-${elem.index}`)
        );
        range.deleteContents();
        range.collapse(false);

        /** Записываем в общий список компонентов - наш компонент подготовленный под единообразную структуру компонента **/
        _store.list_components[index] = this.getStructureForInstance(
            elem.component
        );

        /** Если рендерируемый компонент "не активен" (Убрана галка активности/видимости в админке) - удаляем его **/
        if (
            elem.component.name === "questions" ||
            elem.component.name === "question"
        ) {
          if (elem.data.activity !== 1) {
            this.debugWarning(`Внимание! У вопроса скрыта видимость! Он не будет отображен в статье! [index]: ${index}, [ID-question]: ${elem.data.id}
            elem: `, elem)
            deletedIndexes.push(index);
          }
        }

        /**
         * ВАЖНО! Обязательно заставляем наш компонент вмонтироваться в VDOM, иначе он будет недоступен для манипуляций
         * **/
        _store.list_components[index].instance.$mount();
        /**
         * Вставляем наш VDOM в DOM-дерево заместо ранее удаленного компонента!
         * Теперь это Vue-компонент, который реактивен и обладает всеми плюшками
         * **/
        range.insertNode(_store.list_components[index].instance.$el);

        /** Очищаем данные в сторе **/
        this.$store.commit("changeSelectedObject", {});
      });

      /** Если в процессе рендеринга были найдены компоненты - которые подлежат удалению из вёрстки, то убираем их из общего стора **/
      if (deletedIndexes.length) {
        this.debugWarning(`В процессе рендеринга были удалены индексы следующих компонентов: `, deletedIndexes)
        deletedIndexes.forEach((index) => {
          _store.list_components.splice(index, 1);
        });
      }

      this.debugConsole("Функция рендеринга с подготовленными компонентами успешно завершена")
    },
    /**
     * @function - Основной адаптер для рендера компонентов и контента в редакторе
     * **/
    initializeContent() {
      return new Promise((resolve) => {
        this.debugConsole("Начало инициализации данных в редактор")

        /** Очищаем в сторе данные по компонентам **/
        this.$store.commit("clear_list_components", []);

        /**
         *  Включаем оверлеи и заглушки на момент рендера
         *  ВАЖНО! Оверлеи рендерятся "поверх" редактора, т.к. нам нужен элемент редактора в DOM
         *  **/
        _store.loadingArticle = true;
        this.geting_from_server = true;

        /** Присваиваем контент со стора, который туда попал из бэка, либо через UNDO/REDO **/
        this.content = _store.content_from_server;

        /** Если контента нет, то нет смысла рендерить компоненты **/
        if (!this.content) {
          _store.loadingArticle = false;
          this.geting_from_server = false;

          this.debugWarning("Конец рендера, т.к. КОНТЕНТ - ОТСУТСТВУЕТ")
          return resolve();
        }

        /** Если есть несоответствие с компонентами в вёрстке и в БД, то получаем их из вёрстки **/
        let restoredArr = [];
        restoredArr = this.checkOutOfSync();
        this.debugConsole("Конец проверки на несоответствие компонентов вёрстки и в БД")

        let componentsForRequest;
        /**
         * Если мы восстановили компоненты через верстку, идем по ним, если их в верстке нет, пробуем через JSON с бэкенда
         * ВАЖНО! Для редактора вёрстка важнее, чем то, что лежит в list_components, т.к. иначе будет fatal error если редактор не схавает вёрстку
         * **/
        if (restoredArr.length) {
          componentsForRequest = restoredArr;
        } else {
          this.debugConsole(`Стартуем в обычном режиме - Берём компоненты с бэкенда.
          _store.components_after_request: `, _store.components_after_request)
          componentsForRequest = _store.components_after_request;
        }

        /**
         * По каждому компоненту необходимо достать данные с бэкенда
         * Запросы действуют для всех компонентов, кроме Изображений (по ним всё лежит в вёрстке)
         * **/
        const promises = [];
        const questions_data = _store.questions_data;
        this.debugConsole(`Компоненты вопросов, полученные от бэкенда.
        questions_data: `, questions_data)

        componentsForRequest.forEach((elem) => {
          /** Если структура не валидная, значит компонент поломан, исключаем **/
          if (!elem?.component?.name) {
            this.debugWarning(`Получен невалидный компонент по структуре: ${elem}`)
            return;
          }

          /** Флоу для компонента вопроса **/
          if (elem.component.name === "questions") {
            let question = questions_data.filter((question) => {
              return question.id == elem.component.id;
            })[0];
            /**
             * Если все данные по компоненту вопроса уже есть с бэкенда, то не имеет смысл делать повторный запрос на бэк
             * **/
            if (question) {
              this.$store.commit("changeSelectedComponent", {
                data: question,
                index: elem.index,
                component: elem.component,
              });
            } else {
              /**
               * Если ничего нет, то добавляем в массив промисов, чтобы получить их
               * **/
              promises.push(
                  this.$store.dispatch(`get_${elem.component.name}`, elem)
              );
            }
          } else {
            /** Для всех остальных компонентов делаем через методы в сторе **/
            promises.push(
                this.$store.dispatch(`get_${elem.component.name}`, elem)
            );
          }
        });

        /** Дожидаемся окончания ВСЕХ промисов на получение данных по компонентам **/
        Promise.allSettled(promises).finally(() => {
          this.debugConsole(`Все запросы на получение данных - выполнены.
           _store.list_components:`, _store.list_components)

          /**
           *  Отсортировываем компоненты по возрастанию по индексу
           *  ВАЖНО! Без этого процесса могут быть критические последствия для рендера.
           *  Идём сверху вниз, т.к. индекс - указывает на расположение компонента сверху вниз
           * **/
          _store.list_components.sort((a, b) => {
            return a.index - b.index;
          });

          /**
           * ВАЖНО! $nextTick - ОБЯЗАТЕЛЕН! Без него возможно отставание DOM дерева с VDOM
           * **/
          this.$nextTick(() => {
            this.renderFunc();

            _store.loadingArticle = false;
            this.geting_from_server = false;

            this.debugConsole("Все компоненты успешно отрендерены")
            resolve();
          });
        });
      });
    },
    /**
     * С течением времени, некоторые из вопросов могут быть удалены из БД.
     * Перестраховываемся и находим такие вопросы и удаляем из HTML
     *
     * @function - функция поиска удаленных вопросов из БД. Также вопросы которые не смогли отрендериться из-за отсутствия данных но которые остались в вёрстке
     * **/
    checkOnDeletedComponents() {
      this.$nextTick(() => {
        this.debugConsole("Начинаем проверять есть ли в статье удаленные вопросы, которые отсутствуют в БД")

        const componentsNodes = document.getElementsByClassName(
            "component_container"
        );

        /** Если в DOM-дереве компонентов не столько же сколько получили после рендера, то начинаем проверку **/
        if (componentsNodes.length !== _store.list_components.length) {
          this.debugWarning(`Обнаружено расхождение в компонентах в вёрстке и в сторе: [componentsNodes]: ${componentsNodes.length} | [_store.list_components]: ${_store.list_components.length}`)
          let arrCollection = [...componentsNodes];

          /** Фильтруем компоненты только по вопросам, и достаем только их ID **/
          const arrIDs = _store.list_components
              .filter((elem, index) => {
                const name = elem?.data?.component?.name;

                if (!name) {
                  this.debugWarning(`Получено невалидное наименование компонента при проверке удаленного вопроса! [index]: ${index}
                  elem: ${elem}`)

                  return false;
                }
                return name === "question" || name === "questions";
              })
              .map((i) => {
                return i?.data?.component?.id ?? i?.component?.id;
              });


          arrCollection.forEach((htmlCollection) => {
            if (
                htmlCollection.dataset.name &&
                htmlCollection.dataset.name === "questions"
            ) {
              /**
               * Если ID вопроса из вёрстки отсутствует в массиве ids, который лежит в сторе,
               * значит с бэка мы не получили инфы по этому вопросу, т.к. он удален из БД
               * **/
              if (!arrIDs.includes(htmlCollection.dataset.id)) {
                let tmpStr = htmlCollection.id.match("-(.*)");
                let index = tmpStr[tmpStr.length - 1];
                this.debugWarning(`ID вопроса, который был удален: ${htmlCollection.dataset.id}`)
                this.debugWarning(`Индекс удаленныго вопроса на странице [index]: ${index}`)

                /** Если index найден и он есть в вёрстке, значит мы можем удалить его из DOM-дерево и он перестанет отображаться в статье **/
                if (index) {
                  let range = document.createRange();
                  const elem = document.getElementById(`component_wrapper-${index}`);

                  this.debugWarning(`Удалённый HTML: ${elem}`)

                  range.selectNode(elem);
                  range.deleteContents();
                  range.collapse(false);
                }
              }
            }
          });
        }
        this.debugConsole("Окончание проверки на удаленные вопросы, которые отсутствуют в БД")
      });
    },
    /**
     * Наши компоненты работают со стором, поэтому для каждого из компонентов,
     * который проходит процесс рендеринга - проставляем необходимые параметры в стор.
     * Также изменяем counters для корректной работы с рендерингом
     * **/
    checkTypeComponent(elem) {
      this.$store.commit("change_name_component", elem.component.name);
      const name = Object.prototype.hasOwnProperty.call(
          elem.component,
          "index_question"
      )
          ? "question"
          : elem.component.name;

      /** ВАЖНО! Обязательно изменение коунтера **/
      this.$store.commit("change_counter", {
        name: elem.component.name,
        count: elem.component[`index_${name}`],
      });
    },

    /**
     * Важная функция для синхронизации стора и UNDO/REDO
     *
     * @function - функция синхронизации стора и локальных переменных, срабатывающая при каждом изменении контента
     * @param isMounted {Boolean} - необязательный флаг, используется только в mounted для корректной работы UNDO/REDO
     * **/
    onContentChange(isMounted = false) {
      this.debugConsole("Произошло изменение контента!")

      /** Если контент не меняется от действий UNDO/REDO **/
      if (!_store.isChangedByAction) {
        /**
         * Срабатывает только один раз, когда запускаем mounted редактора!
         * ВАЖНО! Это необходимо для корректной работы UNDO/REDO
         * **/
        if (!_store.txtDisplay.length && !isMounted) {
          this.$store.commit("change_by_action_editor");
        }

        /** Все изменения делаем через debounce, чтобы не было миллионых срабатываний **/
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          /** Изменяем контент в сторе, для сохранения. Также вызываем запись в UNDO/REDO **/
          _store.content = this.content;
          this.$store.commit("change_by_action_editor");
        }, 600);

        /** Чекаем если в процессе манипуляций с контентом был удалён наш Vue-компонент из вёрстки **/
        _store.list_components.forEach((elem, index) => {
          const elem_content = document.getElementById(
              `component_wrapper-${elem?.instance?.$data?.index_component}`
          );
          if (!elem_content && elem?.instance?.$data?.index_component) {
            this.debugWarning(`В процессе изменения контента был удален компонент! [index]: ${index}
            elem: `, elem)
            _store.deletedComponent = elem.instance.$data.index_component;
          }
        });
      }
    },

    /* MANIPULATING WITH INSERTING COMPONENTS */
    /**
     * Функция добавления ссылок в редактор
     * **/
    addLink() {
      this.debugConsole("Добавляем ссылку в редактор!")

      const link = document.createElement("a");
      link.href = _store.urlValue;
      link.innerText = `${_store.urlText}`;
      link.title = _store.urlText;
      link.target = "_blank";

      /**
       * Если мы хотим добавить ссылку на выделенный текст
       * **/
      if (_store.linkSelection) {
        _store.linkSelection.surroundContents(link);
      } else {
        /** Если мы создаем ссылку с нуля и планируем её вставить внутри редактора **/
        /** Делаем кучу проверок на доступность range и вставляем HTML нашей ссылки в выбранный range
         *  Если нет range или это делается не внутри текстового редактора - то вставляем ссылку в начало редактора
         * **/
        
        // ИСПОЛЬЗУЕМ СОХРАНЕННЫЙ RANGE ИЗ СТОРА
        if (
          _store.range &&
          this.checkIfTextEditor(_store.range.commonAncestorContainer)
        ) {
          // ПРОВЕРКА НА ВЛОЖЕННОСТЬ В ДРУГОЙ ТЕГ <a>
          let container = _store.range.commonAncestorContainer;
          const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
          const parentLink = element.closest('a');
          
          if (parentLink) {
            parentLink.parentNode.insertBefore(link, parentLink.nextSibling);
            parentLink.parentNode.insertBefore(document.createTextNode(' '), link);
          } else {
            // ВСТАВКА ПО RANGE
            _store.range.insertNode(link);
          }
        } else {
          // ВСТАВКА В НАЧАЛО РЕДАКТОРА
          let range = document.createRange();
          range.setStart(
            document.getElementsByClassName("textRedactor__content").item(0),
            0
          );
          range.collapse(false);
          range.insertNode(link);
        }
      }

      /** Очищаем данные в сторе и сохраняем текст статьи **/
      this.$store.commit("clear_url");
      this.saveDB = true;
      this.clearStateAfterSelect();
      setTimeout(() => {
        this.saveDB = false;
      });
    },


    /**
     * @function - функция которая запускает встраивание нового компонента в редактор
     * @param elem {Object} - объект с определенной структурой, полученный из @/components/articles/HeaderBlock
     * **/
    callCheckout(elem) {
      /** Через фабрику создаем экземпляр данных для нашего будущего компонента из переданных значений из Хедера **/
      let data_component = factory.create(_store.name_component, {
        name: _store.name_component,
        id: _store.selectedComponent?.id
            ? _store.selectedComponent.id
            : elem.id,
        index_questions: _store.counters.questions,
        index_image: _store.counters.image,
        index_auth: _store.counters.auth,
        index_nomenclature: _store.counters.nomenclature,
        src: elem?.orig_path ? elem?.orig_path : "",
        nomenclatures_id: elem?.nomenclatures_id ?? [],
        alt: elem?.alt_image ? elem?.alt_image : "",
        title: elem?.title_image ? elem?.title_image : ""
      });

      /** Если вставляем компонент-вопроса то записываем все данные вопроса, чтобы не вызывать запрос на бэк **/
      if (_store.name_component === "questions") {
        this.$store.commit("add_questions_data", _store.selectedComponent);
      }

      /** UNDO/REDO **/
      if (!_store.txtDisplay.length) {
        this.$store.commit("change_by_action_editor");
      }

      /** Основная ~Магия~ **/
      this.insertingComponent(data_component).then(() => {
        /** Делаем общие штуки после каждого рендера, очищаем стор и проставляем индексы с counters и сохраняем статью **/
        this.$nextTick(() => {
          this.resetCounter(_store.list_components);
          this.changeIndexQuestion();
        });
        this.saveDB = true;
        this.clearStateAfterSelect();
        setTimeout(() => {
          this.saveDB = false;
        });
      });
    },

    /**
     * @function - метод получения необходимой структуры для работы с рендерингом компонентов
     * **/
    getStructureForInstance(data_component) {
      /**
       * Внутрь instance, который будет лежать внутри переменной компонента обязательно кладём store и vuetify!
       * Это нужно сделать, т.к. у наших вручную врендеренных компонентов отсутствует доступ к внешнему окружению Vue
       * **/
      const instance = new this.componentLayout({
        store,
        vuetify,
      });
      /** Конструктор с нужной структурой **/
      const data = new Imported_component({
        index: _store.counters.layout,
        component: data_component,
      });
      const params = Object.assign({}, {instance: instance}, {data: data});
      return new Constructor_instance(params);
    },

    /**
     * Вставляем наш Vue-компонент внутрь редактора с сохранением реактивности и всех плюшек Vue
     * Также создаем оболочку над компонентом с отступами для отступов
     *
     * @function - функция по встраиванию в редактор Vue-компонента
     * **/
    insertingComponent(data_component) {
      return new Promise((resolve) => {
        this.debugConsole(`Начинаем встраивать компонент в HTML.
        data_component: `, data_component)

        const elem = this.getStructureForInstance(data_component);

        this.debugConsole(`Подготовленная структура из фабрик и конструкторов.
        elem: `, elem)

        this.$store.commit("add_to_list_components", elem);
        const calledElem = _store.list_components[_store.counters.layout - 1];

        this.debugConsole(`Компонент, полученный из стора перед mounted.
        calledElem: `, calledElem)

        calledElem.instance.$mount();

        /**
         * Создаем отступы от компонента сверху и снизу от него
         * **/
        const div = document.createElement("div");
        div.style.minHeight = "24px";
        const div2 = document.createElement("div");
        div2.style.minHeight = "24px";

        /**
         * Дефолтная работа с range по вставке HTML в область выбранную пользователем
         * Если пользователь вставляет компонент не в редактора (например, нажал на инпут названия статьи и потом на вставку компонента в статью)
         * То вставляем наш компонент в НАЧАЛО редактора
         *  **/
        if (
            _store.range &&
            this.checkIfTextEditor(_store.range.commonAncestorContainer)
        ) {
          if (window.getSelection) {
            _store.range.insertNode(div);
            _store.range.insertNode(calledElem.instance.$el);
            _store.range.insertNode(div2);
          } else if (document.selection && document.selection.createRange) {
            if (
                _store.range &&
                (_store.range.commonAncestorContainer.parentElement.className ===
                    "textRedactor__content" ||
                    _store.range.commonAncestorContainer.offsetParent._prevClass ===
                    "textRedactor")
            ) {
              this.htmlSelected =
                  calledElem.instance.$el.nodeType == 3
                      ? calledElem.instance.$el.innerHTML.data
                      : calledElem.instance.$el.outerHTML;
              _store.range.pasteHTML(div);
              _store.range.pasteHTML(this.htmlSelected);
              _store.range.pasteHTML(div2);
            }
          }
        } else {
          if (window.getSelection) {
            let range = document.createRange();
            range.setStart(
                document.getElementsByClassName("textRedactor__content").item(0),
                0
            );
            range.collapse(false);
            range.insertNode(div);
            range.insertNode(calledElem.instance.$el);
            range.insertNode(div2);
          } else if (document.selection && document.selection.createRange) {
            let range = document.createRange();
            range.setStart(
                document.getElementsByClassName("textRedactor__content").item(0),
                0
            );
            range.collapse(false);
            this.htmlSelected =
                calledElem.instance.$el.nodeType == 3
                    ? calledElem.instance.$el.innerHTML.data
                    : calledElem.instance.$el.outerHTML;
            range.pasteHTML(div);
            range.pasteHTML(this.htmlSelected);
            range.pasteHTML(div2);
          }
        }
        resolve();
      });
    },

    /**
     * Необходимо для правильного порядка номеров вопросов в статье. Если вставляем вопрос между 1-м и 3-м вопросом,
     * То все индексы проставятся в порядке по возрастанию сверху вниз
     *
     * @function - функция по переопределению номера вопроса внутри статьи
     * **/
    changeIndexQuestion() {
      this.debugConsole("Начинаем проставлять индексы вопросам внутри статьи")

      let questions = [...document.getElementsByClassName("question_wrapper")];
      let counter = 1;

      questions.forEach((block) => {
        let tmpStr = block.id.match("-(.*)");
        let id = tmpStr[tmpStr.length - 1];

        /** Фильтруемся только по вопросам в статье, и переписываем индексы на корректные в соответствии с их положением в DOM **/
        let component = _store.list_components
            .filter((elem) => {
              const name = elem?.data?.component?.name;

              /** Если в переданном компоненте нет нужной структуры, пропускаем его **/
              if (!name) {
                this.debugWarning(`Получен невалидный компонент по структуре: ${elem}`)

                return;
              }

              return name === "question" || name === "questions";
            })
            .filter((elem) => {
              return elem?.data?.index == id;
            });

        if (component.length) {
          let nameComponent = component[0]?.data?.component?.name;

          /** Если в переданном компоненте нет нужной структуры, пропускаем его **/
          if (!nameComponent) {
            this.debugWarning(`Получен невалидный компонент по структуре: ${component[0]}`)
            return;
          }

          /** Присваиваем index внутрь компонента, чтобы реактивность подхватила новое число **/
          const key_data = `index_${nameComponent}`;
          component[0].instance.$data[key_data] = counter;
          counter++;
        }
      });
      this.debugConsole("Проставление индексов вопросам окончено")
    },

    /**
     * @function - собираем последний каунтер всех ранее вставленных изображений через html
     * **/
    getInsertedHtmlImageCounters() {
      const elements = [...document.getElementsByClassName("inserted-html-image-container")]
      const arrIds = []

      elements.forEach((elem) => {
        let tmpStr = elem.id.split("-");
        let id = tmpStr[tmpStr.length - 1];
        arrIds.push(parseInt(id))
      })

      const lastCounter = arrIds.sort((a, b) => b - a)[0] ?? 0;

      this.$store.commit("change_counter", {
        name: "insertedHtml",
        count: lastCounter + 1,
      });
    },
    /**
     * В процессе рендеринга может быть ситация, когда компоненты начнут рендериться не по порядку.
     * В таком случае необходимо обнулить и пересчитать все counters, участвующие в рендеринге
     *
     * @function - функция сбрасывания counters для корректной работы редактора
     * **/
    resetCounter(array) {
      this.debugConsole("Начинаем сброс counters")

      /**
       * Общий стейт со всеми счётчиками
       * **/
      const global_counter = {
        index_questions: 1,
        index_image: 1,
        index_auth: 1,
        counter_index: 1,
        index_nomenclature: 1,
      };

      array.forEach((elem) => {
        this.debugConsole(`Сбрасываем компонент [index]: ${elem?.data?.index}, [index_component]: ${elem?.instance?.$data?.index_component}
        elem: `, elem)

        const currentDataComponent = elem?.data?.component?.name
            ? elem.data
            : elem;

        const name = currentDataComponent?.component?.name;

        /** Если в переданном компоненте нет нужной структуры, пропускаем его **/
        if (!name) {
          this.debugWarning(`Получен невалидный компонент по структуре: ${currentDataComponent}`)
          return;
        }

        /** Переприсваиваем индексы и счётчики в соответствии с нашим глобальным счётчиком **/
        currentDataComponent.index = global_counter.counter_index;
        const key_data = `index_${name}`;
        currentDataComponent.component[key_data] = global_counter[key_data];

        if (!elem?.instance?.$data) {
          this.debugWarning(`Отсутствует валидная структура компонента!: [elem.instance.$data] ${elem?.instance?.$data}`)
          return;
        }
        elem.instance.$data[key_data] = global_counter[key_data];
        const block = document.getElementById(
            `component_wrapper-${elem.instance.$data.index_component}`
        );

        this.debugConsole(`Полученный HTML-элемент для обнуления счётчика. [index]: ${elem.instance.$data.index_component}, [newIndex]: ${currentDataComponent.index}
        block: `, block)

        /** Если такой элемент есть в DOM-дереве, то переприсваиваем ему id в соответствии с его счётчиком и индексом **/
        if (block) {
          block.id = `component_wrapper-${global_counter.counter_index}`;
          elem.instance.$data.index_component = global_counter.counter_index;

          this.$store.commit("change_counter", {
            name: name,
            count: global_counter[key_data],
          });
          global_counter[key_data]++;
          global_counter.counter_index++;
        }
      });

      this.$store.commit("change_counter", {
        name: "layout",
        count: global_counter.counter_index - 1,
      });

      this.debugConsole(`Сброс counters окончен. Финальный результат счётчика: `, _store.counters)
    },

    /**
     * @function - функция удаления компонента из редактора
     * **/
    deletingComponent() {
      if (_store.deletedComponent !== 0) {
        this.debugConsole(`Начинаем удаление компонента. [index]: ${_store.deletedComponent}`)

        /** Undo/Redo **/
        if (!_store.txtDisplay.length) {
          this.$store.commit("change_by_action_editor");
        }

        /** Находим индекс внутри массива компонентов **/
        let index = _store.list_components.findIndex((elem) => {
          return (
              elem.instance.$data.index_component === _store.deletedComponent
          );
        });

        if (index !== -1) {
          const currentComponent = _store.list_components[index];

          /**
           * Если удаляемый компонент - вопрос, то удаляем и из массива с данными по вопросам
           * **/
          if (
              currentComponent?.data?.component?.name === "questions" ||
              currentComponent?.component?.name === "questions"
          ) {
            let question_index = _store.questions_data.findIndex((elem) => {
              return (
                  elem.id == currentComponent.instance.$data.question_data.id
              );
            });
            if (question_index !== -1) {
              _store.questions_data.splice(question_index, 1);
            }
          }

          /** Удаляем из компонентов внутри стора **/
          _store.list_components.splice(index, 1);

          /** Удаляем из вёрстки **/
          this.$nextTick(() => {
            try {
              const elem = document.getElementById(
                  `component_wrapper-${_store.deletedComponent}`
              );

              this.debugConsole(`Удаляемый HTML: `, elem)

              elem.remove();
            } catch (e) {
              this.debugWarning('Если это сообщение появилось, то значит компонент уже был удалён из HTML')
            } finally {
              /** Обнуляем счётчики, индексы и стор после удаления. Также сохраняем статью **/
              this.$store.commit("delete_component_by_id", 0);
              this.resetCounter(_store.list_components);
              this.changeIndexQuestion();

              this.saveDB = true;
              setTimeout(() => {
                this.saveDB = false;
              }, 200);
            }
          });
        }
      }
    },

    /**
     * Ниже методы для работы с иконками внутри @/components/articles/HeaderBlock
     * А именно проверки для подсвечивания тэгов: Жирный, Курсивный, Тонкий текст и т.д.
     * В общем, тут логика подсвечивания иконок в хедере.
     * Если сюда полезете - проще будет созвониться и вместе раскурить это.
     * НЕ советую тут что-то менять, хрен потом что-то починится
     * **/
    /* BLOCK FOR CHECK ICONS FORMAT TEXT */
    checkHTMLText(html, icon) {
      return html.includes(icon.tag);
    },
    checkByTag(html, icon) {
      return html.includes(icon.tag);
    },
    checkForStyles(html, icon) {
      if (icon.tag === "<u" || icon.tag === "<strike") {
        return (
            html.includes("text-decoration-line") && html.includes(icon.styleName)
        );
      } else return html.includes(icon.styleName);
    },
    onSelectionContent() {
      // if we select by one tap
      this.$store.commit("get_range");
      // if we ranged select
      let html = "";
      if (typeof window.getSelection != "undefined") {
        let sel = window.getSelection();
        if (sel.rangeCount) {
          let container = document.createElement("div");
          for (let i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML.replace(/<br>/g, "");
        }
        // SET SELECTED TEXT - TO CREATE URL
        this.$store.commit(
            "set_selected_text_url",
            window.getSelection().toString()
        );
      } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText.replace(/<br>/g, "");
        }
      }

      // html for range select return outerHtml
      // range for single selection return tag/outerHTML
      const icons_arr = iconsModels.icons_panel;
      Object.keys(icons_arr).forEach((icon) => {
        if (!_store.range?.commonAncestorContainer?.parentElement) return;

        let elem = _store.range.commonAncestorContainer.parentElement;

        // Явная проверка для заголовков H2 и H3
        if (icon === 'formatBlock') {
          icons_arr[icon].active = elem.tagName === 'H2';
          return;
        }
        if (icon === 'formatBlockH3') {
          icons_arr[icon].active = elem.tagName === 'H3';
          return;
        }

        // Global object
        let parentElem;
        // outerHTML
        let parentHTML = "";
        // outerHMTL for aligns
        let styleAlign = "";

        if (elem.localName !== "div") {
          parentElem = this.recursiveGetIconValue(elem);
          parentHTML = parentElem.outerHTML;
        }
        if (
            elem.className !== "textRedactor__content" &&
            elem.className !== "textRedactor"
        ) {
          let grandParent = parentHTML
              ? parentElem.parentElement.outerHTML
              : elem.outerHTML;
          styleAlign = this.getStyleAlign(grandParent, icons_arr[icon]);
        }
        icons_arr[icon].active =
            this.checkForStyles(parentHTML, icons_arr[icon]) ||
            this.checkByTag(parentHTML, icons_arr[icon]) ||
            this.checkForStyles(styleAlign, icons_arr[icon]) ||
            this.checkHTMLText(html, icons_arr[icon]) ||
            this.checkForStyles(html, icons_arr[icon]);
      });
    },
    /* Get style name for aligners values */
    getStyleAlign(outerHTML, icon) {
      if (
          icon.tag !== "<b" &&
          icon.tag !== "<i" &&
          icon.tag !== "<u" &&
          icon.tag !== "<strike"
      ) {
        return outerHTML.includes(icon.styleName) ? icon.styleName : "";
      } else return "";
    },
    /* Recursive Function for get parent elem, if we get nesting elems */
    recursiveGetIconValue(elem) {
      if (elem.parentElement.localName !== "div") {
        return this.recursiveGetIconValue(elem.parentElement);
      } else {
        return elem;
      }
    },

    /**
     * Проверяем вставляем ли мы что-то в пределах текстового редактора или нет
     *
     * @function - метод проверки является ли передаваемый элемент дочерним для текстового редактора
     * **/
    checkIfTextEditor(elem) {
      try {
        return elem.closest(".textRedactor__content") !== null;
      } catch (e) {
        return false;
      }
    },

    /* CLEANERS */
    clearStateAfterSelect() {
      this.$store.commit("change_select_component", {
        name: _store.name_component,
        value: false,
      });
      this.$store.commit("changeSelectedObject", {});
      this.$store.commit("changeInsertingComponents", false);
    },
  },
  beforeDestroy() {
    this.$store.commit("clean_store");
  },
};
</script>

<style lang="scss" scoped>
//@import "src/assets/styles/textEditor";
</style>

<style lang="scss">
.v-application p {
  margin: 0 !important;
}
</style>
