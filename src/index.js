import jss, {getDynamicStyles, SheetsRegistry, createGenerateClassName} from 'jss'
import jssPresetDefault from 'jss-preset-default'

export const sheetsRegistry = new SheetsRegistry();

const styleSheetRegistry = new Map();

export class VueJssPlugin {
  install(Vue, {
    preset = jssPresetDefault,
    // TODO: Pass here vue instance to store theme reactive data, in future add vuex support
  } = {}) {
    jss.setup({...preset()})

    Vue.styles = [];

    Vue.mixin({
      beforeCreate() {
        if (typeof this.$options.styles !== 'object') return;

        if (!styleSheetRegistry.has(this.$options.name)) {
          const styleSheet = jss.createStyleSheet(this.$options.styles, {
            name: this.$options.name,
            link: true,
            meta: this.$options.name
          }).attach();
          // TODO: Do not attach style sheet when is empty (all styles are dynamic)
          styleSheetRegistry.set(this.$options.name, styleSheet);
        }
        
        this.$styleSheet = styleSheetRegistry.get(this.$options.name);
        this.$classes = Object.assign({}, this.$styleSheet.classes);

        sheetsRegistry.add(this.$styleSheet);

        const dynamicStyles = getDynamicStyles(this.$options.styles);
        if (!dynamicStyles) return;

        this.$dynamicStyleSheet = jss.createStyleSheet(dynamicStyles, {
          name: this.$options.name,
          generateClassName: (rule) => `${this.$classes[rule.key]}-${this._uid}`,
          link: true,
          meta: `${this.$options.name}-${this._uid}`
        });

        Object.keys(this.$dynamicStyleSheet.classes).forEach((rule) => {
          if (this.$styleSheet.classes[rule]) {
            this.$classes[rule] = [
              ...(Array.isArray(this.$styleSheet.classes[rule]) ? this.$styleSheet.classes[rule] : [this.$styleSheet.classes[rule]]),
              this.$dynamicStyleSheet.classes[rule],
            ]
          } else {
            this.$classes[rule] = this.$dynamicStyleSheet.classes[rule]
          }
        })

        sheetsRegistry.add(this.$dynamicStyleSheet);
      },
      async mounted() {
        await this.$nextTick();
        if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update(this).attach();
      },
      async updated() {
        await this.$nextTick();
        if (this.$dynamicStyleSheet) this.$dynamicStyleSheet.update(this);
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
    Vue.prototype.$styleSheet = null;
    Vue.prototype.$classes = [];
    Vue.prototype.$sheetsRegistry = sheetsRegistry;
  }
}

export default new VueJssPlugin();