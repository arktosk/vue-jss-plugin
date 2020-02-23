import {getDynamicStyles, SheetsManager} from 'jss';
import {createVueModelProjection} from './utils/create-vue-model-projection';
import {getComponentName} from './utils/get-component-name';
import {mergeStyleSheetClasses} from './utils/merge-style-sheet-classes';

/**
 * Check if component has defined JSS styles.
 * @param {Vue.Component} component - Vue component instance.
 * @return {Boolean} - Returns true if component has defined JSS styles inside.
 */
function hasJssStylesDefined(component) {
  return typeof component.$options.styles === 'object';
};

export const createJssPluginMixin = (__plugin__) => {
  const sheetsManager = new SheetsManager();

  /** @this {Vue} */
  function beforeCreate() {
    if (!hasJssStylesDefined(this)) return;

    if (!this.$options.name) this.$options.name = getComponentName();
    const componentName = this.$options.name || getComponentName()

    let __classes = {};

    this.$options.computed = this.$options.computed || {};
    this.$options.computed.$classes = function() {
      // Calling update invokes all functions, and as long as they refer to this
      // they will be added as dependency to computed watcher.
      if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update();

      return __classes;
    };

    if (!sheetsManager.get(componentName)) {
      const styleSheet = this.$jss.createStyleSheet(this.$options.styles, {
        name: componentName,
        link: true,
        meta: process.env.NODE_ENV !== 'production' ? componentName : null,
      });
      // TODO: Do not attach style sheet when is empty (all styles are dynamic)
      sheetsManager.add(componentName, styleSheet);
    }

    this.$styleSheet = sheetsManager.get(componentName);

    __classes = mergeStyleSheetClasses(this.$styleSheet.classes);

    let dynamicStyles = getDynamicStyles(this.$options.styles);
    if (!dynamicStyles) return;

    dynamicStyles = Object.keys(dynamicStyles).reduce((styles, rule) => {
      if (!this.$styleSheet.classes[rule]) return styles;
      styles[rule] = {
        [`.${this.$styleSheet.classes[rule]}&`]: dynamicStyles[rule],
      };
      return styles;
    }, {});

    const findAllDynamicRulesAndWrapThem = (dynamicStyles) => {
      Object.keys(dynamicStyles).forEach((key) => {
        if (!Array.isArray(dynamicStyles[key]) && typeof dynamicStyles[key] === 'object') {
          // Traverse object tree down.
          findAllDynamicRulesAndWrapThem(dynamicStyles[key]);
        } else if (typeof dynamicStyles[key] === 'function') {
          const dynamicRule = dynamicStyles[key];
          dynamicStyles[key] = () => {
            return dynamicRule.call(this, this);
          };
        }
      });
    };

    findAllDynamicRulesAndWrapThem(dynamicStyles);


    this.$dynamicStyleSheet = this.$jss.createStyleSheet(dynamicStyles, {
      name: componentName,
      generateClassName: (rule) => process.env.NODE_ENV !== 'production' ? `${this.$styleSheet.classes[rule.key]}-${this._uid}` : `${this.$styleSheet.classes[rule.key]}${this._uid}`,
      link: true,
      meta: process.env.NODE_ENV !== 'production' ? `${componentName}-${this._uid}` : null,
    });

    __classes = mergeStyleSheetClasses(this.$styleSheet.classes, this.$dynamicStyleSheet.classes);
  }

  /** @this {Vue} */
  function attachJssStyleSheets() {
    if (!hasJssStylesDefined(this)) return;

    if (!this.$styleSheet) return;
    sheetsManager.manage(this.$options.name);
    if (!this.$dynamicStyleSheet) return;
    this.$dynamicStyleSheet.update().attach();
  }

  /** @this {Vue} */
  function detachAndRemoveJssStyleSheets() {
    if (!hasJssStylesDefined(this)) return;

    sheetsManager.unmanage(this.$options.name);
    if (this.$dynamicStyleSheet) {
      this.$dynamicStyleSheet.detach();
    }
  }

  return {
    beforeCreate,
    beforeMount: attachJssStyleSheets,
    destroyed: detachAndRemoveJssStyleSheets,
  };
};
