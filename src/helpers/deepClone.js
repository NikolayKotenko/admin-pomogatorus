export default function _clone(obj) {
  let clone = {};
  for (let i in obj) {
    if (typeof obj[i] == "object" && obj[i] != null) clone[i] = _clone(obj[i]);
    else clone[i] = obj[i];
  }
  return clone;
}
