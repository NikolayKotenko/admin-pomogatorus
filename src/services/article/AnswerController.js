export default class AnswerController {
  create_status(type, auth_block) {
    let status;
    if (type === "sending") {
      status = new Status_sending(type);
    } else if (type === "warning") {
      status = new Status_warning(type, auth_block);
    } else if (type === "error") {
      status = new Status_error(type);
    } else if (type === "success") {
      status = new Status_success(type);
    }
    return status;
  }
}

class Status_sending {
  constructor(type) {
    this.color = "primary";
    this.type = type;
    this.icon = "v-progress-circular";
    this.text = `Отправляем ответ`;
  }
}

class Status_warning {
  constructor(type, auth_block) {
    this.color = "yellow darken-1";
    this.type = type;
    this.icon = "mdi-alert-circle-outline";
    this.anchor = `component_wrapper-${auth_block}`;
    this.text = `Отправка ответов в редакторе не работает`;
  }
}

class Status_error {
  constructor(type) {
    this.color = "red darken-1";
    this.type = type;
    this.icon = "mdi-close-octagon-outline";
    this.text = `Произошла ошибка`;
  }
}

class Status_success {
  constructor(type) {
    this.color = "green darken-1";
    this.type = type;
    this.icon = "mdi-check-circle-outline";
    this.text = `Ответ записан, спасибо!`;
  }
}
