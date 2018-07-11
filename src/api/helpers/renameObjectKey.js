export default (obj, keyMap) =>
  Object.keys(obj).reduce((newObj, oldKey) => {
    const newKey = keyMap[oldKey] || oldKey;
    newObj[newKey] = obj[oldKey];
    return newObj;
  }, {});
