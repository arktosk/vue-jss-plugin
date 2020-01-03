import {mount, createLocalVue} from '@vue/test-utils';
import jssPlugin from './';

const localVue = createLocalVue();
localVue.use(jssPlugin);

const styles = {
  label: {
    display: 'block',
    color: 'rgb(66, 185, 131)', // #42b983
    textAlign: 'center',
  },
};

const testComponent = localVue.component('test-component', {
  styles,
  template: `<div :class="[$classes && $classes.label]">Let's test the World!</div>`,
});

describe('Mounted component', () => {
  const wrapper = mount(testComponent, {localVue});
  test('received class after JSS injection', () => {
    expect(wrapper.vm.$classes).toHaveProperty('label');
  });

  test('has proper class name for JSS rule', () => {
    expect(wrapper.classes()).toContain('label-0-1-1');
  });

  test('has applied proper styles', () => {
    const wrapperStyles = window.getComputedStyle(wrapper.element);

    expect(wrapperStyles.display).toBe('block');
    expect(wrapperStyles.color).toBe('rgb(66, 185, 131)');
    expect(wrapperStyles.textAlign).toBe('center');
  });
});
