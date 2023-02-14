export function Constructor_instance(params) {
  const { data, instance } = params;

  this.data = data;
  this.instance = instance;
}

export function Imported_component(data) {
  const { index, component } = data;

  this.index = index;
  this.component = component;
}

export function AnswerVariable(id) {
  this.id = id;
  this.answer = "";
  this.commentary = "";
  this.showComentary = true;
  this.focused = false;
  this.dataEnv = null;
}

export function AnswerRangeMin(id) {
  this.id = id;
  this.answer = "";
  this.commentary = "";
  this.showComentary = true;
  this.focused = false;
  this.placeholder = "Минимальное значение";
  this.dataEnv = null;
}

export function AnswerRangeMax(id) {
  this.id = id;
  this.answer = "";
  this.commentary = "";
  this.showComentary = true;
  this.focused = false;
  this.placeholder = "Максимальное значение";
  this.dataEnv = null;
}

export function MToMTags(
  id_tag = null,
  id_answer = null,
  id_question = null,
  id_article = null,
  id_object_property = null
) {
  this.id_tag = id_tag;
  this.id_answer = id_answer;
  this.id_question = id_question;
  this.id_article = id_article;
  this.id_object_property = id_object_property;
}

export function Dictionary(id = null, name = "", code = "") {
  this.id = id;
  this.name = name;
  this.code = code;
}

export function DictionaryAttribute(
  id = null,
  code = "",
  name = "",
  value = "",
  id_dictionary = null
) {
  this.id = id;
  this.code = code;
  this.name = name;
  this.value = value;
  this.id_dictionary = id_dictionary;
}
