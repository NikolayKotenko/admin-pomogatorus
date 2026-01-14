export default class DataComponent {
  create(type, data) {
    let data_component;
    if (type === "question" || type === "questions") {
      data_component = new Element_question(data);
    } else if (type === "image") {
      data_component = new Element_image(data);
    } else if (type === "auth") {
      data_component = new Element_auth(data);
    } else if (type === "nomenclature") {
      data_component = new Element_nomenclature(data);
    } else if (type === "citation") {
      data_component = new Element_citation(data);
    } else if (type === "specification") {
      data_component = new Element_specification(data);
    }
    return data_component;
  }
}

class Element_nomenclature {
  constructor(data) {
    const { name, id, index_nomenclature, nomenclatures_id } = data;

    this.name = name;
    this.id = id;
    this.nomenclatures_id = nomenclatures_id;
    this.index_nomenclature = index_nomenclature;
  }
}

class Element_question {
  constructor(data) {
    const { name, id, index_questions } = data;

    this.name = name;
    this.id = id;
    this.index_questions = index_questions;
  }
}

class Element_image {
  constructor(data) {
    const { name, src, index_image, id, alt, title } = data;

    this.id = id;
    this.name = name;
    this.src = src;
    this.index_image = index_image;
    this.alt = alt;
    this.title = title;
  }
}

class Element_auth {
  constructor(data) {
    const { name, index_auth } = data;

    this.name = name;
    this.index_auth = index_auth;
  }
}

class Element_citation {
  constructor(data) {
    const { name, id, index_citation, citation_title, citation_text, citation_id_user, citation__uuid_user } = data;

    this.name = name;
    this.id = id;
    this.index_citation = index_citation;
    this.title = citation_title;
    this.text = citation_text;
    this.id_user = citation_id_user;
    this.uuid_user = citation__uuid_user;
  }
}

class Element_specification {
  constructor(data) {
    const { name, imageId, imageUrl, imageUuid, index_specification } = data;

    this.name = name;
    this.imageId = imageId;
    this.imageUrl = imageUrl;
    this.imageUuid = imageUuid;
    this.index_specification = index_specification;
  }
}
