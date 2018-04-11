const TRANSFORM_TRANSLATE_REGEX = /translate\(([-+]?[\d]*\.?[\d]+)(px)?,[\s]+([-+]?[\d]*\.?[\d]+)(px)?\)/;
const TRANSFORM_TRANSLATE_X_REGEX = /translateX\(([-+]?[\d]*\.?[\d]+)(px)?\)/;
const TRANSFORM_TRANSLATE_Y_REGEX = /translateY\(([-+]?[\d]*\.?[\d]+)(px)?\)/;
const TRANSFORM_ROTATE_REGEX = /rotate\(([-+]?[\d]*\.?[\d]+)deg\)/;
const TRANSFORM_ROTATE_X_REGEX = /rotateX\(([-+]?[\d]*\.?[\d]+)deg\)/;
const TRANSFORM_ROTATE_Y_REGEX = /rotateY\(([-+]?[\d]*\.?[\d]+)deg\)/;
const TRANSFORM_ROTATE_Z_REGEX = /rotateZ\(([-+]?[\d]*\.?[\d]+)deg\)/;
const TRANSFORM_SCALE_REGEX = /scale\(([-+]?[\d]*\.?[\d]+)\)/;
const TRANSFORM_SCALE_X_REGEX = /scaleX\(([-+]?[\d]*\.?[\d]+)\)/;
const TRANSFORM_SCALE_Y_REGEX = /scaleY\(([-+]?[\d]*\.?[\d]+)\)/;
const TRANSFORM_SKEW_X_REGEX = /skewX\(([-+]?[\d]*\.?[\d]+)deg\)/;
const TRANSFORM_SKEW_Y_REGEX = /skewY\(([-+]?[\d]*\.?[\d]+)deg\)/;

module.exports = function (value) {
  const arr = [];
  if (TRANSFORM_ROTATE_REGEX.test(value)) {
    arr.push({
      rotate: `${value.match(TRANSFORM_ROTATE_REGEX)[1]}deg`
    });
  }
  if (TRANSFORM_ROTATE_X_REGEX.test(value)) {
    arr.push({
      rotateX: `${value.match(TRANSFORM_ROTATE_X_REGEX)[1]}deg`
    });
  }
  if (TRANSFORM_ROTATE_Y_REGEX.test(value)) {
    arr.push({
      rotateY: `${value.match(TRANSFORM_ROTATE_Y_REGEX)[1]}deg`
    });
  }
  if (TRANSFORM_ROTATE_Z_REGEX.test(value)) {
    arr.push({
      rotateZ: `${value.match(TRANSFORM_ROTATE_Z_REGEX)[1]}deg`
    });
  }
  if (TRANSFORM_SKEW_X_REGEX.test(value)) {
    arr.push({
      skewX: `${value.match(TRANSFORM_SKEW_X_REGEX)[1]}deg`
    });
  }
  if (TRANSFORM_SKEW_Y_REGEX.test(value)) {
    arr.push({
      skewY: `${value.match(TRANSFORM_SKEW_Y_REGEX)[1]}deg`
    });
  }
  if (TRANSFORM_SCALE_REGEX.test(value)) {
    let r = value.match(TRANSFORM_SCALE_REGEX)[1];
    if (isNaN(r) === false) {
      r = parseFloat(r);
    }
    arr.push({
      scale: r
    });
  }
  if (TRANSFORM_SCALE_X_REGEX.test(value)) {
    let r = value.match(TRANSFORM_SCALE_X_REGEX)[1];
    if (isNaN(r) === false) {
      r = parseFloat(r);
    }
    arr.push({
      scaleX: r
    });
  }
  if (TRANSFORM_SCALE_Y_REGEX.test(value)) {
    let r = value.match(TRANSFORM_SCALE_Y_REGEX)[1];
    if (isNaN(r) === false) {
      r = parseFloat(r);
    }
    arr.push({
      scaleY: r
    });
  }
  if (TRANSFORM_TRANSLATE_REGEX.test(value)) {
    const rs = value.match(TRANSFORM_TRANSLATE_REGEX);
    let rx = rs[1];
    let ry = rs[2];
    if (isNaN(rx) === false) {
      rx = parseFloat(rx);
    }
    if (isNaN(ry) === false) {
      ry = parseFloat(ry);
    }
    arr.push({
      translateX: rx
    });
    arr.push({
      translateY: ry
    });
  }
  if (TRANSFORM_TRANSLATE_X_REGEX.test(value)) {
    let r = value.match(TRANSFORM_TRANSLATE_X_REGEX)[1];
    if (isNaN(r) === false) {
      r = parseFloat(r);
    }
    arr.push({
      translateX: r
    });
  }
  if (TRANSFORM_TRANSLATE_Y_REGEX.test(value)) {
    let r = value.match(TRANSFORM_TRANSLATE_Y_REGEX)[1];
    if (isNaN(r) === false) {
      r = parseFloat(r);
    }
    arr.push({
      translateY: r
    });
  }
  return arr;
};
