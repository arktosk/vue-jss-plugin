import {mount, createLocalVue} from '@vue/test-utils';
import jssPlugin from './';

const TEST_RULE_NAME = 'label';

const localVue = createLocalVue();
localVue.use(jssPlugin);

const styles = {
  [TEST_RULE_NAME]: {
    display: 'block',
    color: '#42b983',
    textAlign: 'center',
  },
};

const testComponent = localVue.component('test-component', {
  styles,
  template: `<span :class="$classes.${TEST_RULE_NAME}">Let's test the World!</span>`,
});

describe('Mounted component', () => {
  const wrapper = mount(testComponent);

  test('received class after JSS injection', () => {
    expect(wrapper.vm.$classes).toHaveProperty(TEST_RULE_NAME);
  });

  test('has proper class name for JSS rule', () => {
    expect(wrapper.classes()).toContain(`${TEST_RULE_NAME}-0-1-1`);
  });
});
