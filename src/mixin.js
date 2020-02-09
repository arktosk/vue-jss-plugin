/* eslint-disable no-invalid-this */
import {getDynamicStyles, SheetsRegistry} from 'jss';
import {createVueModelProjection} from './utils/create-vue-model-projection';
import {getComponentName} from './utils/get-component-name';
import {mergeStyleSheetClasses} from './utils/merge-style-sheet-classes';

export const createJssPluginMixin = (__plugin__) => {
  const sheetsRegistry = new SheetsRegistry();
  // const sheetsManager = new SheetsManager();

  const hasJssStylesDefined = (Component) => {
    return typeof Component.$options.styles === 'object';
  };

  /** */
  function beforeCreate() {
    if (!hasJssStylesDefined(this)) return;

    console.log(this);

    if (!this.$options.name) this.$options.name = getComponentName(this);

    let __classes = {};

    this.$options.computed = this.$options.computed || {};
    this.$options.computed.$classes = function() {
      // There should be invoked all function that uses reactive vue model.
      // After that jss stylesheet should be force updated.
      return __classes;
    };

    if (!this.$sheetsManager.get(this.$options.name)) {
      const styleSheet = this.$jss.createStyleSheet(this.$options.styles, {
        name: this.$options.name,
        link: true,
        meta: process.env.NODE_ENV !== 'production' ? this.$options.name : null,
      });
      // TODO: Do not attach style sheet when is empty (all styles are dynamic)
      this.$sheetsManager.add(this.$options.name, styleSheet);
      this.$sheetsRegistry.add(styleSheet);
    }

    this.$styleSheet = this.$sheetsManager.get(this.$options.name);

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
      name: this.$options.name,
      generateClassName: (rule) => process.env.NODE_ENV !== 'production' ? `${this.$styleSheet.classes[rule.key]}-${this._uid}` : `${this.$styleSheet.classes[rule.key]}${this._uid}`,
      link: true,
      meta: process.env.NODE_ENV !== 'production' ? `${this.$options.name}-${this._uid}` : null,
    });

    __classes = mergeStyleSheetClasses(this.$styleSheet.classes, this.$dynamicStyleSheet.classes);

    sheetsRegistry.add(this.$dynamicStyleSheet);
  }

  /** */
  function beforeMount() {
    if (!hasJssStylesDefined(this)) return;

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
    if (!hasJssStylesDefined(this)) return;

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
