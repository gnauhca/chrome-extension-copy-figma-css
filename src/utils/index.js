export function getVarsFromStr(str = '') {
  const vars = [];
  const regx = /([\w\-\@\$]+):([\s\S]+?);/gm;

  str.replace(regx, (s, key, value) => {
    let fixValue = value.replace(/!important/g, '');
    fixValue = fixValue.trim();
    vars.push([key, fixValue]);
  });
  return vars;
}
export function storageArrObjToArr(storageArrayObj) {
  const arr = [];
  for(let key in storageArrayObj) {
    arr[Number(key)] = storageArrayObj[key];
  }
  return arr;
}
