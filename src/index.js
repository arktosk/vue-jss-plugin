import {create, getDynamicStyles, SheetsRegistry} from 'jss';
import jssPresetDefault from 'jss-preset-default';

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
    // TODO: Pass here vue instance to store theme reactive data, in future add vuex support
  } = {}) {
    this.jss = jss;
    this.jss.setup({...preset()});

    Vue.styles = [];

    Vue.prototype.$styleSheet = null;
    Vue.prototype.$classes = [];
    Vue.prototype.$sheetsRegistry = sheetsRegistry;

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
        if (typeof this.$options.styles !== 'object') return;

        if (!styleSheetRegistry.has(this.$options.name)) {
          const styleSheet = _plugin.jss.createStyleSheet(this.$options.styles, {
            name: this.$options.name,
            link: true,
            meta: this.$options.name,
          }).attach();
          // TODO: Do not attach style sheet when is empty (all styles are dynamic)
          styleSheetRegistry.set(this.$options.name, styleSheet);
        }

        this.$styleSheet = styleSheetRegistry.get(this.$options.name);
        this.$classes = Object.assign({}, this.$styleSheet.classes);

        sheetsRegistry.add(this.$styleSheet);

        const dynamicStyles = getDynamicStyles(this.$options.styles);
        if (!dynamicStyles) return;

        this.$dynamicStyleSheet = _plugin.jss.createStyleSheet(dynamicStyles, {
          name: this.$options.name,
          generateClassName: (rule) => `${this.$classes[rule.key]}-${this._uid}`,
          link: true,
          meta: `${this.$options.name}-${this._uid}`,
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
      },
      async mounted() {
        await this.$nextTick();
        if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update(_plugin.createDataProjection(this)).attach();
      },
      async updated() {
        await this.$nextTick();
        if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update(_plugin.createDataProjection(this));
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

  /**
   * Create read only data projection from Vue instance.
   * @param {Vue} VueInstance - Vue instance.
   * @return {*} - Data projection of props, data and computed properties from Vue instance.
   * @private
   */
  createDataProjection(VueInstance) {
    const $props = VueInstance.$props;
    const $data = VueInstance.$data;
    const $computed = {};

    if (typeof VueInstance.$options.computed === 'object') {
      Object.keys(VueInstance.$options.computed).forEach((key) => {
        // TODO: Traverse object tree to get plain values.
        computed[key] = VueInstance[key];
      });
    }

    return {
      ...$props,
      ...$data,
      ...$computed,
    };
  }
}

export default new VueJssPlugin();
