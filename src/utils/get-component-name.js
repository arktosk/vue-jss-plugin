let ROOT_COMPONENTS_COUNTER = 0;
let ANONYMOUS_COMPONENTS_COUNTER = 0;

/**
 * Get component name with fallback if the name is not specified.
 * @param {VueComponent} Component - Vue component.
 * @return {String} Component name.
 */
export const getComponentName = (Component) => {
  if (Component.$options.name) return Component.$options.name;
  if (Component.$root === Component) return 'Root' + (ROOT_COMPONENTS_COUNTER++ || '');
  if (Component._componentTag) return Component._componentTag;
  return 'Anonymous' + (ANONYMOUS_COMPONENTS_COUNTER++ || '');
};
