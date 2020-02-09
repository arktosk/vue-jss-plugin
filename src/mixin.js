/* eslint-disable no-invalid-this */
import {getDynamicStyles, SheetsRegistry, SheetsManager} from 'jss';
import {createVueModelProjection} from './utils/create-vue-model-projection';
import {getComponentName} from './utils/get-component-name';
import {mergeStyleSheetClasses} from './utils/merge-style-sheet-classes';

export const sheetsRegistry = new SheetsRegistry();
export const sheetsManager = new SheetsManager();

export const createJssPluginMixin = (__plugin__) => {
  /** */
  function beforeCreate() {
    if (typeof this.$options.styles !== 'object') return;

    if (!this.$options.name) this.$options.name = getComponentName(this);
    const componentName = this.$options.name;


    let __classes = {};

    this.$options.computed = this.$options.computed || {};
    this.$options.computed.$classes = function() {
      return __classes;
    };

    if (!this.$sheetsManager.get(componentName)) {
      const styleSheet = this.$jss.createStyleSheet(this.$options.styles, {
        name: componentName,
        link: true,
        meta: process.env.NODE_ENV !== 'production' ? componentName : null,
      });
      // TODO: Do not attach style sheet when is empty (all styles are dynamic)
      this.$sheetsManager.add(componentName, styleSheet);
      this.$sheetsRegistry.add(styleSheet);
    }

    this.$styleSheet = this.$sheetsManager.get(componentName);

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

    this.$dynamicStyleSheet = this.$jss.createStyleSheet(dynamicStyles, {
      name: componentName,
      generateClassName: (rule) => process.env.NODE_ENV !== 'production' ? `${this.$styleSheet.classes[rule.key]}-${this._uid}` : `${this.$styleSheet.classes[rule.key]}${this._uid}`,
      link: true,
      meta: process.env.NODE_ENV !== 'production' ? `${componentName}-${this._uid}` : null,
    });

    __classes = mergeStyleSheetClasses(this.$styleSheet.classes, this.$dynamicStyleSheet.classes);

    sheetsRegistry.add(this.$dynamicStyleSheet);
  }

  /** */
  function beforeMount() {
    if (typeof this.$options.styles !== 'object') return;

    if (__plugin__.WYSIWYG && this.$dynamicStyleSheet) {
      // TODO: Find a way how to keep reactivity between component and style sheet without all these unnecessary watchers...
      // IDEA: Use one Vue instance as style sheet config store with clean API
      [...Object.keys(this.$props || {}), ...Object.keys(this.$data || {})].forEach((reactiveProperty) => {
        this.$watch(`${reactiveProperty}`, (newValue) => {
          // if (process.env.NODE_ENV === 'development') console.log(`${this.$options.name} [${this._uid}] :: @watch :: ${reactiveProperty} -> ${newValue}`, newValue);
          this.$dynamicStyleSheet.update(createVueModelProjection(this));
        });
      });
    }

    if (!this.$styleSheet) return;
    this.$sheetsManager.manage(this.$options.name);
    if (!this.$dynamicStyleSheet) return;
    this.$dynamicStyleSheet.update(createVueModelProjection(this)).attach();
  }
  /** */
  function beforeDestroy() {
    if (typeof this.$options.styles !== 'object') return;

    this.$sheetsManager.unmanage(this.$options.name);
    if (!this.$sheetsManager.get(this.$options.name)) this.$sheetsRegistry.remove(this.$styleSheet);
    this.$sheetsRegistry.remove(this.$styleSheet);
    if (this.$dynamicStyleSheet) {
      this.$sheetsRegistry.remove(this.$dynamicStyleSheet);
      this.$dynamicStyleSheet.detach();
    }
  }

  return {
    beforeCreate,
    beforeMount,
    beforeDestroy,
  };
};
