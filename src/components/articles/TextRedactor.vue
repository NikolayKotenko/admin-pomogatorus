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
        @input="onContentChange; preventStyles"
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
import LoginAuth from "../auth/LoginAuth";

import titlesStore from "@/store/modules/article/index.js";
import DataComponent from "../../services/article/dataComponent";
import {Constructor_instance, Imported_component} from "../../helpers/constructors";

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
    saveDB: false,
    debounceTimeout: null,
    geting_from_server: false,
  }),
  mounted() {
    this.preventInsertingStyles();
    this.onkeydownInEditable();
    setTimeout(() => {
      this.$refs.content.addEventListener("input", this.onContentChange)

      this.initializeContent().then(() => {
        this.checkOnDeletedComponents();
        this.$nextTick(() => {
          this.resetCounter(_store.list_components);
          this.changeIndexQuestion();
        });
      });
    }, 500);
  },
  watch: {
    saveDB: {
      handler(v) {
        if (!this.geting_from_server && v) {
          console.log('save article')
          this.$store.commit("changeContent", this.content);
          this.$store.commit("change_by_action_editor");
        }
      },
    },
    deletedContent: {
      handler(v) {
        if (v) {
          this.content = "";
          this.$store.commit("clean_store");
        }
      },
    },
    "$store.state.ArticleModule.deletedComponent": {
      handler(v) {
        if (v) this.deletingComponent();
      },
    },
    "$store.state.ArticleModule.content_from_server": {
      handler() {
        this.content = _store.content_from_server;
        this.$store.commit("changeContent", this.content);
      },
    },
    "$store.state.ArticleModule.startRender": {
      handler(v) {
        if (v) {
          console.log("start rerender");
          /* Only way to get time for procedure render DOM */
          setTimeout(() => {
            /* Change content on article by static HTML */
            this.$nextTick(() => {
              this.content = _store.content_from_server;
            });
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
              this.$store.commit("clear_list_components", []);
              this.$store.commit("change_start_render", false);
            }
          }, 600);
        }
      },
    },
  },
  computed: {
    check_created_article() {
      return (
          this.newArticle.name.value !== "" &&
          this.newArticle.short_header.value !== ""
      );
    },
    content: {
      cache: false,
      get: function () {
        if (this.$refs.content) {
          return this.$refs.content.innerHTML;
        }
        return ''
      },
      set: function (val) {
        this.$refs.content.innerHTML = val;
      },
    },
    componentLayout() {
      return _store.name_component === "questions"
          ? Vue.extend(Question)
          : _store.name_component === "image"
              ? Vue.extend(ImageLayout)
              : Vue.extend(LoginAuth);
    },
  },
  methods: {
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
        if (range.commonAncestorContainer.parentElement.nodeName === 'H2') {
          let value = range.commonAncestorContainer.parentElement.innerText
          let element = document.createElement('div')
          element.innerText = value

          range.selectNode(
              range.commonAncestorContainer.parentElement
          );
          range.deleteContents();
          range.collapse(false);
          range.insertNode(element);
        }
      }
    },
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
    preventInsertingStyles() {
      const _this = this;
      this.$refs.content.onpaste = function (e) {
        e.preventDefault();
        let text = (e.originalEvent || e).clipboardData.getData("text/plain");
        document.execCommand("insertHtml", false, _this.escapeText(text));
        _this.onContentChange();
      };
    },
    onkeydownInEditable() {
      const _this = this;
      this.$refs.content.onkeydown = function (e) {
        if (e.key === "Backspace" || e.key === "Delete" || e.key === "Paste") {
          const selection = window.getSelection();
          // Don't allow deleting nodes
          if (!selection.anchorNode) return;
          if (
              selection.anchorNode.textContent === "" &&
              selection.anchorNode.className !== "textRedactor__content" &&
              selection.anchorNode.isContentEditable
          ) {
            e.preventDefault();
            selection.anchorNode.parentNode.removeChild(selection.anchorNode);
            _this.onContentChange();
          }
        }
      };
    },

    /* CHECK OUT OF SYNC */
    checkOutOfSync() {
      let arrComponentsData = [];
      /* Get all components from DOM by class identifier */
      const componentsNodes = document.getElementsByClassName(
          "component_container"
      );

      console.log(componentsNodes)

      /* Check if components length from DB isn't equal components count by DOM */
      if (componentsNodes.length !== _store.list_components.length) {
        let arrCollection = [...componentsNodes];

        let counters = {
          index_image: 1,
          index_questions: 1,
          index_auth: 1,
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
            }
            /* Push to arr result */
            arrComponentsData.push(
                new Imported_component({
                  index: index,
                  component: dataComponent,
                })
            );
            /* Update global counters */
            counters[`index_${htmlCollection.dataset.name}`]++;
            /* Clear intermediate object */
            dataComponent = {};
          }
        });
        console.log('end restore components by html')
      }
      /* Rewrite components data for next render function */
      return arrComponentsData;
    },

    /* RENDER FUNCTIONALITY */
    renderFunc() {
      console.log("nextTIck inserting");

      let deletedIndexes = []

      _store.list_components.forEach((elem, index) => {
        console.log('countInserted', index)
        /** Function that change counter by @elem, and call prepare layout that we need **/
        this.checkTypeComponent(elem);

        /* Here we set data of component and manipulate by type component */
        let data = elem.data;
        /* If component is image we get URL of img and title/alt */
        if (elem.component.name === "image") {
          const full_url = document
              .getElementById(`component_wrapper-${elem.index}`)
              .getElementsByClassName("inserted_image")[0].src;
          let sub_url = full_url.split(".com");
          const IdImage = document.getElementById(`component_wrapper-${elem.index}`).dataset.id;
          data = Object.assign({},
              {full_path: sub_url[1]},
              {id: IdImage},
          );
        }
        /* Here change global counter of component in article */
        this.$store.commit("change_counter", {
          name: "layout",
          count: elem.index,
        });
        /* Here we pass data to store, that can be getted from layout component */
        this.$store.commit("changeSelectedObject", data);
        /* Now we get place on DOM in our contentEditable div to place HTML on article */
        let range = document.createRange();
        range.selectNode(
            document.getElementById(`component_wrapper-${elem.index}`)
        );
        range.deleteContents();
        range.collapse(false);
        /* Constructor return our FullReady component to get mounted on DOM */
        _store.list_components[index] = this.getStructureForInstance(
            elem.component
        );

        /* Check if question is not active */
        if (elem.component.name === "questions" || elem.component.name === "question") {
          if (elem.data.activity !== 1) {
            console.log(elem.data.id, 'Is not active => remove')
            deletedIndexes.push(index)
          }
        }

        /* Start Vue Component lifecycle hook that provides us reactive $data and methods */
        _store.list_components[index].instance.$mount();
        /* Place mounted component on DOM */
        range.insertNode(_store.list_components[index].instance.$el);

        /* Clear global store data for next circle */
        this.$store.commit("changeSelectedObject", {});
      });

      if (deletedIndexes.length) {
        console.log('Not active indexes', deletedIndexes)
        deletedIndexes.forEach(index => {
          _store.list_components.splice(index, 1)
        })
      }
      console.log("insertingDone");
    },
    /* INITIALIZE DATA FROM BACK OR INDEXEDDB */
    initializeContent() {
      return new Promise((resolve) => {
        console.log("initialize");

        /* First we clean list_components on store */
        this.$store.commit("clear_list_components", []);

        /* If we have backendView component from API or UNDO/REDO start get data */
        // if (_store.components_after_request.length) {
        /* LOADERS & OVERLAY */
        _store.loadingArticle = true;
        this.geting_from_server = true;

        /* Set content from API or UNDO/REDO */
        this.content = _store.content_from_server;

        console.log("start check out of sync");

        let restoredArr = [];
        restoredArr = this.checkOutOfSync();

        console.log("end check out of sync");

        console.log('restoredArr', restoredArr)

        let componentsForRequest;

        if (restoredArr.length) {
          componentsForRequest = restoredArr
        } else {
          componentsForRequest = _store.components_after_request
        }

        /* Requests for get data of list_components, that lay on Array<Promises> */
        const promises = [];
        const questions_data = _store.questions_data
        console.log('Questions from BACKEND', questions_data)

        componentsForRequest.forEach((elem) => {
          if (elem.component.name === 'questions') {
            let question = questions_data.filter(question => {
              return question.id == elem.component.id
            })[0]
            if (question) {
              this.$store.commit("changeSelectedComponent", {
                data: question,
                index: elem.index,
                component: elem.component
              });
            } else {
              promises.push(this.$store.dispatch(`get_${elem.component.name}`, elem))
            }
          } else {
            promises.push(
                this.$store.dispatch(`get_${elem.component.name}`, elem)
            );
          }
        });

        /* As soon as Promises done, we start render */
        Promise.allSettled(promises).finally(() => {
          console.log("all promises done");

          /* Sorting list_components for index, to get right structure on article */
          _store.list_components.sort((a, b) => {
            return a.index - b.index;
          });

          /* $nextTick to be sure that content rendered on DOM */
          this.$nextTick(() => {
            /* MAIN RENDER FUCNTION */
            this.renderFunc();

            /* LOADERS & OVERLAY */
            _store.loadingArticle = false;
            this.geting_from_server = false;

            resolve();
          });
        });
        // }
      });
    },
    checkOnDeletedComponents() {
      this.$nextTick(() => {
        console.log("start check deleted question");

        /* Get all components from DOM by class identifier */
        const componentsNodes = document.getElementsByClassName(
            "component_container"
        );

        /* Check if components length from DB isn't equal components count by DOM */
        if (componentsNodes.length !== _store.list_components.length) {
          let arrCollection = [...componentsNodes];

          const arrIDs = _store.list_components
              .filter((elem) => {
                return (
                    elem.data.component.name === "question" ||
                    elem.data.component.name === "questions"
                );
              })
              .map((i) => {
                return i.data.component.id;
              });

          console.log(arrIDs)

          arrCollection.forEach((htmlCollection) => {
            if (htmlCollection.dataset.name && htmlCollection.dataset.name === "questions") {
              if (!arrIDs.includes(htmlCollection.dataset.id)) {
                console.log('Question which is deleted', htmlCollection.dataset.id)
                let tmpStr = htmlCollection.id.match("-(.*)");
                let index = tmpStr[tmpStr.length - 1];
                console.log(`index question on the page`, index)

                if (index) {
                  let range = document.createRange();
                  console.log('deleted html', document.getElementById(`component_wrapper-${index}`))
                  range.selectNode(
                      document.getElementById(`component_wrapper-${index}`)
                  );
                  range.deleteContents();
                  range.collapse(false);
                }
              }
            }
          })
        }
        console.log("ended check deleted question");
      });
    },
    checkTypeComponent(elem) {
      this.$store.commit("change_name_component", elem.component.name);
      const name = Object.prototype.hasOwnProperty.call(
          elem.component,
          "index_question"
      )
          ? "question"
          : elem.component.name;
      this.$store.commit("change_counter", {
        name: elem.component.name,
        count: elem.component[`index_${name}`],
      });
    },

    onContentChange() {
      if (!_store.isChangedByAction) {
        if (!_store.txtDisplay.length)
          this.$store.commit("change_by_action_editor");
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          _store.content = this.content;
          /* Undo/Redo memento manipulation */
          this.$store.commit("change_by_action_editor");
        }, 600);

        /* IF WE DELETED COMPONENT BY KEYBOARD */
        _store.list_components.forEach((elem) => {
          const elem_content = document.getElementById(
              `component_wrapper-${elem.instance.$data.index_component}`
          );
          if (!elem_content) {
            _store.deletedComponent = elem.instance.$data.index_component;
          }
        });
      }
    },

    /* MANIPULATING WITH INSERTING COMPONENTS */
    addLink() {
      console.log(_store.linkSelection)

      const link = document.createElement("a")
      link.href = _store.urlValue
      link.innerText = `${_store.urlText}`
      link.title = _store.urlText
      link.target = '_blank'

      if (_store.linkSelection) {
        // If we selected already exist text on editor
        _store.linkSelection.surroundContents(link);
      } else {
        // IF we create link with new text
        if (
            _store.range &&
            (this.checkIfTextEditor(_store.range.commonAncestorContainer))
        ) {
          if (window.getSelection) {
            _store.range.insertNode(link);
          } else if (document.selection && document.selection.createRange) {
            if (
                _store.range &&
                (_store.range.commonAncestorContainer.parentElement.className ===
                    "textRedactor__content" ||
                    _store.range.commonAncestorContainer.offsetParent._prevClass ===
                    "textRedactor")
            ) {
              _store.range.pasteHTML(link.outerHTML);
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
            range.insertNode(link);
          } else if (document.selection && document.selection.createRange) {
            let range = document.createRange();
            range.setStart(
                document.getElementsByClassName("textRedactor__content").item(0),
                0
            );
            range.collapse(false);
            range.pasteHTML(link.outerHTML);
          }
        }
      }

      this.$store.commit('clear_url')
      this.saveDB = true;
      this.clearStateAfterSelect();
      setTimeout(() => {
        this.saveDB = false;
      });
    },
    callCheckout(elem) {
      let data_component = factory.create(_store.name_component, {
        name: _store.name_component,
        id: (_store.selectedComponent?.id) ? _store.selectedComponent.id : elem.id,
        index_questions: _store.counters.questions,
        index_image: _store.counters.image,
        index_auth: _store.counters.auth,
        src: elem?.full_path ? elem?.full_path : "",
      });

      // QUESTIONS DATA ADD TO ARRAY BECAUSE NEED UNDO/REDO
      if (_store.name_component === 'questions') {
        this.$store.commit('add_questions_data', _store.selectedComponent)
      }

      /* Undo/Redo memento manipulation */
      if (!_store.txtDisplay.length)
        this.$store.commit("change_by_action_editor");

      this.insertingComponent(data_component).then(() => {
        this.$nextTick(() => {
          this.resetCounter(_store.list_components);
          this.changeIndexQuestion();
        });
        this.saveDB = true;
        // this.$store.commit("changeContent", this.content);
        // this.$store.commit("change_by_action_editor");
        this.clearStateAfterSelect();
        setTimeout(() => {
          this.saveDB = false;
        });
      });
    },
    getStructureForInstance(data_component) {
      const instance = new this.componentLayout({
        store,
        vuetify,
      });
      const data = new Imported_component({
        index: _store.counters.layout,
        component: data_component,
      });
      const params = Object.assign({}, {instance: instance}, {data: data});
      return new Constructor_instance(params);
    },
    insertingComponent(data_component) {
      return new Promise((resolve) => {
        const elem = this.getStructureForInstance(data_component);
        this.$store.commit("add_to_list_components", elem);
        const calledElem = _store.list_components[_store.counters.layout - 1];
        calledElem.instance.$mount();

        const div = document.createElement("div");
        div.style.minHeight = "24px";
        const div2 = document.createElement("div");
        div2.style.minHeight = "24px";

        if (
            _store.range &&
            (this.checkIfTextEditor(_store.range.commonAncestorContainer))
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

    changeIndexQuestion() {
      console.log("start changing index Question");

      let questions = [...document.getElementsByClassName("question_wrapper")];
      let counter = 1;

      questions.forEach((block) => {
        let tmpStr = block.id.match("-(.*)");
        let id = tmpStr[tmpStr.length - 1];

        let component = _store.list_components
            .filter((elem) => {
              return (
                  elem.data.component.name === "question" ||
                  elem.data.component.name === "questions"
              );
            })
            .filter((elem) => {
              return elem.data.index == id;
            });

        // console.log(block)

        if (component.length) {
          const key_data = `index_${component[0].data.component.name}`;
          component[0].instance.$data[key_data] = counter;
          counter++;
        }
      });
      console.log("ended index Question");
    },

    resetCounter(array) {
      console.log("start reset counters");

      const global_counter = {
        index_questions: 1,
        index_image: 1,
        index_auth: 1,
        counter_index: 1,
      };

      array.forEach((elem) => {
        console.log("resets id");
        // console.log(elem.data.index)
        // console.log(elem.instance.$data.index_component)
        elem.data.index = global_counter.counter_index;
        const key_data = `index_${elem.data.component.name}`;
        elem.data.component[key_data] = global_counter[key_data];
        elem.instance.$data[key_data] = global_counter[key_data];
        console.log("block");
        const block = document.getElementById(
            `component_wrapper-${elem.instance.$data.index_component}`
        );
        // console.log(block)
        block.id = `component_wrapper-${global_counter.counter_index}`;
        elem.instance.$data.index_component = global_counter.counter_index;

        this.$store.commit("change_counter", {
          name: elem.data.component.name,
          count: global_counter[key_data],
        });
        global_counter[key_data]++;
        global_counter.counter_index++;
      });

      this.$store.commit("change_counter", {
        name: "layout",
        count: global_counter.counter_index - 1,
      });
      console.log("end reset counters");
    },

    deletingComponent() {
      if (_store.deletedComponent !== 0) {
        /* Undo/Redo memento manipulation */
        if (!_store.txtDisplay.length)
          this.$store.commit("change_by_action_editor");

        let index = _store.list_components.findIndex((elem) => {
          return (
              elem.instance.$data.index_component === _store.deletedComponent
          );
        });
        if (index !== -1) {
          if (_store.list_components[index].data.component.name === 'questions') {
            let question_index = _store.questions_data.findIndex(elem => {
              return elem.id == _store.list_components[index].instance.$data.question_data.id
            })
            if (question_index !== -1) {
              _store.questions_data.splice(question_index, 1);
            }
          }

          _store.list_components.splice(index, 1);

          this.$nextTick(() => {
            const elem = document.getElementById(
                `component_wrapper-${_store.deletedComponent}`
            );
            console.log(elem)
            elem.remove();
            this.$store.commit("delete_component_by_id", 0);
            this.resetCounter(_store.list_components);
            this.changeIndexQuestion();

            this.saveDB = true;
            setTimeout(() => {
              this.saveDB = false;
            }, 200);
          });
        }
      }
    },

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
        this.$store.commit('set_selected_text_url', window.getSelection().toString())
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
    /* Function for get if we insert component into text-editor area */
    checkIfTextEditor(elem) {
      try {
        return elem.closest('.textRedactor__content') !== null;
      } catch (e) {
        return false
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
