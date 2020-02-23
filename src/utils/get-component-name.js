let ROOT_COMPONENTS_COUNTER = 0;

/**
 * Get component name with fallback if the name is not specified.
 * @this {Vue}
 * @return {String} Component name.
 */
export function getComponentName() {
  if (this.$options.name) return this.$options.name;
  if (this.$root === this) return 'Root' + (ROOT_COMPONENTS_COUNTER++ || '');
  return 'Anonymous' + this._uid;
};
