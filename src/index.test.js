import {mount, createLocalVue} from '@vue/test-utils';
import jssPlugin from './';

const localVue = createLocalVue();
localVue.use(jssPlugin);

const styles = {
  label: {
    display: 'block',
    color: '#42b983',
    textAlign: 'center',
  },
};

const testComponent = localVue.component('test-component', {
  styles,
  template: `<span :class="$classes.label">Let's test the World!</span>`,
});

describe('Mounted component', () => {
  const wrapper = mount(testComponent);

  test('received class after JSS injection', () => {
    expect(wrapper.vm.$classes).toHaveProperty('label');
  });

  test('has proper class name for JSS rule', () => {
    expect(wrapper.classes()).toContain('label-0-1-1');
  });

  // TODO: Find a way for proper style tests.
  test.skip('has applied proper styles', () => {
    const wrapperStyles = wrapper.element.style;
    expect(wrapperStyles.display).toBe('block');
    expect(wrapperStyles.color).toBe('#42b983');
    expect(wrapperStyles.textAlign).toBe('center');
  });
});
