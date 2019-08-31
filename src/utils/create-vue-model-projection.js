/**
 * Create projection of V-Model, contains data, props, computed properties.
 * @param {Vue} VueInstance - Vue instance.
 * @return {*} - Data projection of props, data and computed properties from Vue instance.
 * @private
 */
export const createVueModelProjection = (VueInstance) => {
  const $props = VueInstance.$props;
  const $data = VueInstance.$data;
  const $computed = {};

  if (typeof VueInstance.$options.computed === 'object') {
    Object.keys(VueInstance.$options.computed).forEach((key) => {
      // TODO: Traverse object tree to get plain values.
      $computed[key] = VueInstance[key];
    });
  }

  return {
    ...$props,
    ...$data,
    ...$computed,
  };
};
