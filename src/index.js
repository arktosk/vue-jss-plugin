import {create, SheetsRegistry, SheetsManager} from 'jss';
import jssPresetDefault from 'jss-preset-default';
import {createJssPluginMixin} from './mixin';

export const sheetsRegistry = new SheetsRegistry();
export const sheetsManager = new SheetsManager();

/**
 * Plugin class.
 */
export class VueJssPlugin {
  /** @property {String} version - Current version of plugin. */
  version = VERSION;

  /**
   * Plugin installation interface.
   * @param {Vue} Vue - Vue Instance.
   * @param {Object} options - Plugin settings.
   * @return {void}
   */
  install(Vue, {
    presets = jssPresetDefault(),
    jss = create(),
    WYSIWYG = false,
    // TODO: Pass here theme options and then store them in a vue instance to keep theme reactive data
  } = {}) {
    this.WYSIWYG = WYSIWYG;
    this.jss = jss;
    this.jss.setup(presets);

    Vue.prototype.$jss = this.jss;
    Vue.prototype.$sheetsRegistry = sheetsRegistry;
    Vue.prototype.$sheetsManager = sheetsManager;

    Vue.mixin(createJssPluginMixin(this));
  }
}

export default new VueJssPlugin();
