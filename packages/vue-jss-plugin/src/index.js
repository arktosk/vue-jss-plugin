import {create, getDynamicStyles, /* SheetsRegistry, */ SheetsManager} from 'jss';
import jssPresetDefault from 'jss-preset-default';
import {createVueModelProjection} from './utils/create-vue-model-projection';

// export const sheetsRegistry = new SheetsRegistry();
export const sheetsManager = new SheetsManager();

let mode = 'production';

try {
  if (typeof process.env.NODE_ENV !== 'undefined') {
    mode = process.env.NODE_ENV;
  }
} catch (error) {}

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
    _plugin.propsToWatch = [];

    Vue.mixin({
      beforeCreate() {
        if (!this.$options.name) this.$options.name = this.$root === this ? 'Root' : this.$options._componentTag || `Component${this._uid}`;
        const componentName = this.$options.name;

        if (typeof this.$options.styles !== 'object') return;

        let $styles = this.$options.styles;
        const propsToWatch = [];

        if (this.$options.styles instanceof VueJssStyles) {
          propsToWatch.push(...this.$options.styles.propsToWatch);
          $styles = this.$options.styles.resolve(this);
        }

        if (!this.$sheetsManager.get(componentName)) {
          const styleSheet = _plugin.jss.createStyleSheet($styles, {
            name: componentName,
            meta: mode !== 'production' ? componentName : null,
          });
          // TODO: Do not attach style sheet when is empty (all styles are dynamic)
          this.$sheetsManager.add(componentName, styleSheet);
        }

        this.$styleSheet = this.$sheetsManager.get(componentName);
        this.$classes = Object.assign({}, this.$styleSheet.classes);

        let dynamicStyles = getDynamicStyles($styles);
        if (!dynamicStyles) return;

        dynamicStyles = Object.keys(dynamicStyles).reduce((styles, rule) => {
          if (!this.$styleSheet.classes[rule]) return styles;
          if (typeof dynamicStyles[rule] === 'function') {
            styles[rule] = dynamicStyles[rule].bind(this);
            return styles;
          }
          styles[rule] = {
            [`.${this.$styleSheet.classes[rule]}&`]: dynamicStyles[rule],
          };
          return styles;
        }, {});

        this.$dynamicStyleSheet = _plugin.jss.createStyleSheet(dynamicStyles, {
          name: componentName,
          generateClassName: (rule) => this.$classes[rule.key] + (mode !== 'production' ? '-' : '') + this._uid,
          link: true,
          meta: mode !== 'production' ? `${componentName}-${this._uid}` : null,
        });

        // Assign reactive classes into static ones
        Object.keys(this.$dynamicStyleSheet.classes).forEach((rule) => {
          const currentClasses = this.$styleSheet.classes[rule];
          if (currentClasses) {
            this.$classes[rule] = [
              ...(Array.isArray(currentClasses) ? currentClasses : [currentClasses]),
              this.$dynamicStyleSheet.classes[rule],
            ];
          } else {
            this.$classes[rule] = this.$dynamicStyleSheet.classes[rule];
          }
        });
      },
      beforeMount() {
        // TODO: Find a way how to keep reactivity between component and style sheet without all these unnecessary watchers...
        // IDEA: Use one Vue instance as style sheet config store with clean API
        // [...Object.keys(this.$props || {}), ...Object.keys(this.$data || {})].forEach((reactiveProperty) => {
        if (_plugin.WYSIWYG && this.$dynamicStyleSheet) {
          if (this.$options.styles instanceof VueJssStyles) {
            const propsToWatch = [...new Set(this.$options.styles.propsToWatch)];
            propsToWatch.forEach((reactiveProperty) => {
              console.log(`@Watch in ${this.$options.name} - ${this._uid} -> ${reactiveProperty}`);
              this.$watch(`${reactiveProperty}`, (newValue) => {
                console.log(`@Update in ${this.$options.name} - ${this._uid} -> ${reactiveProperty} :: ${newValue}`);
                console.log(propsToWatch.reduce((updateObject, prop) => {
                  if (typeof this[prop] !== 'undefined') updateObject[prop] = this[prop];
                  return updateObject;
                }, {}));
                this.$dynamicStyleSheet.update(propsToWatch.reduce((updateObject, prop) => {
                  if (typeof this[prop] !== 'undefined') updateObject[prop] = this[prop];
                  return updateObject;
                }, {}));
              });
            });
          }
        }

        if (!this.$styleSheet) return;
        this.$sheetsManager.manage(this.$options.name);
        if (!this.$dynamicStyleSheet) return;
        this.$dynamicStyleSheet.update(createVueModelProjection(this)).attach();
      },
      beforeDestroy() {
        if (typeof this.$classes !== 'object') return;
        this.$sheetsManager.unmanage(this.$options.name);
        if (this.$dynamicStyleSheet) {
          this.$dynamicStyleSheet.detach();
        }
      },
    });
  }
}

export default new VueJssPlugin();

/**
 * @param {*} styles
 * @param {*} propsToWatch
 * @return {*}
 */
function VueJssStyles(styles, propsToWatch) {
  this.resolve = (context = null) => {
    const walkThrough = (object) => {
      Object.keys(object).forEach((key) => {
        const currentProperty = object[key];
        if (typeof currentProperty === 'function') {
          console.log(key);
          object[key] = object[key].bind(context);
        } else if (typeof currentProperty === 'object') {
          walkThrough(object[key]);
        }
      });
    };
    walkThrough(styles);
    return styles;
  };
  this.propsToWatch = propsToWatch;
  return this;
}

/**
 * @param {*} stylesFactory
 * @return {*}
 */
export function createStyles(stylesFactory) {
  const propsToWatch = [];
  // this._stylesProvider = true;
  const mapState = function(props, stylingFunction) {
    if (!Array.isArray(props)) props = [props];
    propsToWatch.push(...props);
    return function(configuration) {
      console.log(this, props.map((prop) => configuration[prop]), stylingFunction(...props.map((prop) => configuration[prop])));
      return stylingFunction.call(this, ...props.map((prop) => configuration[prop]));
    };
  };

  const styles = stylesFactory({mapState});

  console.log(propsToWatch);

  return new VueJssStyles(styles, propsToWatch);
};
