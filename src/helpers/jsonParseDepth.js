import isJson from "@/helpers/checkJSON";

export function jsonParseDepth(string) {
  // console.group("jsonParseDepth ловим");
  // console.log(string);
  // console.groupEnd();
  // Ловим отсюда не строку (json), а объект и возвращаем её
  if (isJson(string) === false) {
    return string;
  } else {
    string = JSON.parse(string);
    return jsonParseDepth(string);
  }
}
