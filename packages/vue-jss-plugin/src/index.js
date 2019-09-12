import {create, getDynamicStyles, SheetsRegistry} from 'jss';
import jssPresetDefault from 'jss-preset-default';
import {createVueModelProjection} from './utils/create-vue-model-projection';

export const sheetsRegistry = new SheetsRegistry();

const styleSheetRegistry = new Map();

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
    this.jss = jss;
    this.jss.setup({...preset()});

    // Vue.styles = [];

    // Vue.prototype.$styleSheet = null;
    // Vue.prototype.$classes = [];
    Vue.prototype.$jss = this.jss;
    Vue.prototype.$sheetsRegistry = sheetsRegistry;

    this.createVueMixin(Vue);
  }
  /**
   * Create plugin mixin.
   * @param {Vue} Vue - Vue Instance.
   * @return {void}
   */
  createVueMixin(Vue) {
    const thisPlugin = this;

    Vue.mixin({
      beforeCreate() {
        if (typeof this.$options.styles !== 'object') return;

        let componentName = this.$options.name || this.$options._componentTag;
        if (!componentName && this.$root === this) componentName = 'Root';

        if (!styleSheetRegistry.has(componentName)) {
          const styleSheet = thisPlugin.jss.createStyleSheet(this.$options.styles, {
            name: componentName,
            link: true,
            meta: componentName,
          }).attach();
          // TODO: Do not attach style sheet when is empty (all styles are dynamic)
          styleSheetRegistry.set(componentName, styleSheet);
        }

        this.$styleSheet = styleSheetRegistry.get(componentName);
        this.$classes = Object.assign({}, this.$styleSheet.classes);

        sheetsRegistry.add(this.$styleSheet);

        const dynamicStyles = getDynamicStyles(this.$options.styles);
        if (!dynamicStyles) return;

        this.$dynamicStyleSheet = thisPlugin.jss.createStyleSheet(dynamicStyles, {
          name: componentName,
          generateClassName: (rule) => `${this.$classes[rule.key]}-${this._uid}`,
          link: true,
          meta: `${componentName}-${this._uid}`,
        });

        // Assign reactive classes into static ones
        Object.keys(this.$dynamicStyleSheet.classes).forEach((rule) => {
          if (this.$styleSheet.classes[rule]) {
            this.$classes[rule] = [
              ...(Array.isArray(this.$styleSheet.classes[rule]) ? this.$styleSheet.classes[rule] : [this.$styleSheet.classes[rule]]),
              this.$dynamicStyleSheet.classes[rule],
            ];
          } else {
            this.$classes[rule] = this.$dynamicStyleSheet.classes[rule];
          }
        });

        sheetsRegistry.add(this.$dynamicStyleSheet);

        if (!WYSIWYG) return;
        // TODO: Find a way how to keep reactivity between component and style sheet without all these unnecessary watchers...
        // IDEA: Use one Vue instance as style sheet config store with clean API
        [...Object.keys(this.$props), ...Object.keys(this.$data), ...Object.keys(this._computedWatchers)].forEach((reactiveProperty) => {
          this.$watch(`${reactiveProperty}`, () => {
            this.$dynamicStyleSheet.update(createVueModelProjection(this));
          });
        });
      },
      async mounted() {
        await this.$nextTick();
        if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update(createVueModelProjection(this)).attach();
      },
      async updated() {
        await this.$nextTick();
        if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update(createVueModelProjection(this));
      },
      beforeDestroy() {
        // TODO: Add counting of component instances and remove non-dynamic styles only when counter reach 0.
        // if (this.$styleSheet) this.$styleSheet.detach();
        sheetsRegistry.remove(this.$styleSheet);
        if (this.$dynamicStyleSheet) {
          sheetsRegistry.remove(this.$dynamicStyleSheet);
          this.$dynamicStyleSheet.detach();
        }
      },
    });
  }
}

export default new VueJssPlugin();
