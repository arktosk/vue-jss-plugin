import {create, getDynamicStyles, SheetsRegistry, SheetsManager} from 'jss';
import jssPresetDefault from 'jss-preset-default';
import {createVueModelProjection} from './utils/create-vue-model-projection';
import {mergeStyleSheetClasses} from './utils/merge-style-sheet-classes';

export const sheetsRegistry = new SheetsRegistry();
export const sheetsManager = new SheetsManager();

process.env = process.env || {};
const NODE_ENV = process.env.NODE_ENV || 'production';

/**
 * Plugin class.
 * @class
 */
export class VueJssPlugin {
  /**
   * Plugin installation interface.
   * @param {Vue} Vue - Vue Instance.
   * @param {Object} options - Plugin settings.
   * @return {void}
   */
  install(Vue, {
    preset = jssPresetDefault,
    jss = create(),
    WYSIWYG = false,
    // TODO: Pass here vue instance to store theme reactive data, in future add vuex support
  } = {}) {
    this.WYSIWYG = WYSIWYG;
    this.jss = jss;
    this.jss.setup({...preset()});

    Vue.prototype.$jss = this.jss;
    Vue.prototype.$sheetsRegistry = sheetsRegistry;
    Vue.prototype.$sheetsManager = sheetsManager;

    this.createVueMixin(Vue);
  }
  /**
   * Create plugin mixin.
   * @param {Vue} Vue - Vue Instance.
   * @return {void}
   */
  createVueMixin(Vue) {
    const _plugin = this;

    Vue.mixin({
      beforeCreate() {
        if (!this.$options.name) this.$options.name = this.$root === this ? 'Root' : this.$options._componentTag || this._uid;
        const componentName = this.$options.name;

        if (typeof this.$options.styles !== 'object') return;

        let __classes = {};

        this.$options.computed = this.$options.computed || {};
        this.$options.computed.$classes = function() {
          return __classes;
        };

        if (!this.$sheetsManager.get(componentName)) {
          const styleSheet = _plugin.jss.createStyleSheet(this.$options.styles, {
            name: componentName,
            link: true,
            meta: NODE_ENV !== 'production' ? componentName : null,
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

        this.$dynamicStyleSheet = _plugin.jss.createStyleSheet(dynamicStyles, {
          name: componentName,
          generateClassName: (rule) => NODE_ENV !== 'production' ? `${this.$styleSheet.classes[rule.key]}-${this._uid}` : `${this.$styleSheet.classes[rule.key]}${this._uid}`,
          link: true,
          meta: NODE_ENV !== 'production' ? `${componentName}-${this._uid}` : null,
        });

        __classes = mergeStyleSheetClasses(this.$styleSheet.classes, this.$dynamicStyleSheet.classes);

        sheetsRegistry.add(this.$dynamicStyleSheet);
      },
      beforeMount() {
        if (_plugin.WYSIWYG && this.$dynamicStyleSheet) {
          // TODO: Find a way how to keep reactivity between component and style sheet without all these unnecessary watchers...
          // IDEA: Use one Vue instance as style sheet config store with clean API
          [...Object.keys(this.$props || {}), ...Object.keys(this.$data || {})].forEach((reactiveProperty) => {
            this.$watch(`${reactiveProperty}`, (newValue) => {
              // if (NODE_ENV === 'development') console.log(`${this.$options.name} [${this._uid}] :: @watch :: ${reactiveProperty} -> ${newValue}`, newValue);
              this.$dynamicStyleSheet.update(createVueModelProjection(this));
            });
          });
        }

        if (!this.$styleSheet) return;
        this.$sheetsManager.manage(this.$options.name);
        if (!this.$dynamicStyleSheet) return;
        this.$dynamicStyleSheet.update(createVueModelProjection(this)).attach();
      },
      beforeDestroy() {
        if (typeof this.$options.styles !== 'object') return;
        this.$sheetsManager.unmanage(this.$options.name);
        if (!this.$sheetsManager.get(this.$options.name)) this.$sheetsRegistry.remove(this.$styleSheet);
        this.$sheetsRegistry.remove(this.$styleSheet);
        if (this.$dynamicStyleSheet) {
          this.$sheetsRegistry.remove(this.$dynamicStyleSheet);
          this.$dynamicStyleSheet.detach();
        }
      },
    });
  }
}

export default new VueJssPlugin();
