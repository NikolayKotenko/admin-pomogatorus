export default {
    icons_panel: {
        bold: {
            active: false,
            tag: "<b",
            parentElem: 'b',
            styleName: 'font-style: bold',
        },
        italic: {
            active: false,
            tag: "<i",
            parentElem: 'i',
            styleName: 'font-style: italic',
        },
        underline: {
            active: false,
            tag: "<u",
            parentElem: 'u',
            styleName: 'underline',
        },
        strikethrough: {
            active: false,
            tag: "<strike",
            parentElem: 'strike',
            styleName: 'line-through',
        },
        justifyLeft: {
            active: false,
            tag: "text-align: left",
            parentElem: '',
            styleName: 'text-align: left',
        },
        justifyRight: {
            active: false,
            tag: "text-align: right",
            parentElem: '',
            styleName: 'text-align: right',
        },
        justifyCenter: {
            active: false,
            tag: "text-align: center",
            parentElem: '',
            styleName: 'text-align: center',
        },
        justifyFull: {
            active: false,
            tag: "text-align: justify",
            parentElem: '',
            styleName: 'text-align: justify',
        },
        formatBlock: {
            active: false,
            tag: "<h2",
            parentElem: 'h2',
            styleName: 'krkozybtra',
        }
    },
    array_align_content: [
        {
            value: 'justifyLeft',
            text: 'Выравнивание по левой стороне',
            icon: 'mdi-format-align-left',
            open_list: false,
        },
        {
            value: 'justifyRight',
            text: 'Выравнивание по правой стороне',
            icon: 'mdi-format-align-right',
            open_list: false,
        },
        {
            value: 'justifyCenter',
            text: 'Выравнивание по центру',
            icon: 'mdi-format-align-center',
            open_list: false,
        },
        {
            value: 'justifyFull',
            text: 'Выравнивание по ширине',
            icon: 'mdi-format-align-justify',
            open_list: false,
        },
    ],
    array_edit_content: [
        {
            value: 'bold',
            text: 'Жирный',
            icon: 'mdi-format-bold',
        },
        {
            value: 'italic',
            text: 'Курсив',
            icon: 'mdi-format-italic',
        },
        {
            value: 'underline',
            text: 'Подчеркнутый',
            icon: 'mdi-format-underline',
        },
        {
            value: 'strikethrough',
            text: 'Перечеркнутый',
            icon: 'mdi-format-strikethrough',
        },
    ],
}

