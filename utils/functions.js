const AxiosTransformer = (data, headers) => data
const consume = value => {
    if (value instanceof Function) {
        return value();
    }
    else return value
}
const propOrOther = (vm, value) => {
    const otherName = `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    return vm[otherName] !== undefined ? vm[otherName] : vm[value];
}
const consumePropOrOther = (vm, value) => {
    return consume(propOrOther(vm, value));
}
const generateMagicProperties = propertyArray => {
    const retVal = {};
    propertyArray.forEach(propertyName => {
        retVal[`_${propertyName}`] = function () { return consumePropOrOther(this, propertyName) };
    })
    return retVal;
}
const generateNonEvaluatedMagicProperties = propertyArray => {
    const retVal = {};
    propertyArray.forEach(propertyName => {
        retVal[`_${propertyName}`] = function () { return propOrOther(this, propertyName) };
    })
    return retVal;
}
export { AxiosTransformer };
export { consume };
export { propOrOther };
export { consumePropOrOther };
export { generateMagicProperties };
export { generateNonEvaluatedMagicProperties };
export default { AxiosTransformer, consume, consumePropOrOther, propOrOther, generateMagicProperties, generateNonEvaluatedMagicProperties }