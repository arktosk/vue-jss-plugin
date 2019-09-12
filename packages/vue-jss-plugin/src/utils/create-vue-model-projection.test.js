import {mount, createLocalVue} from '@vue/test-utils';
import {createVueModelProjection} from './create-vue-model-projection';

const localVue = createLocalVue();

const testComponent = localVue.component('test-component', {
  props: [
    'testStringProp',
  ],
  data() {
    return {
      testStringData: 'data',
    };
  },
  computed: {
    testComputedStringData() {
      return `computed ${this.testStringProp} and ${this.testStringData}`;
    },
  },
  template: `<div>Let's test the World!</div>`,
});

describe('Vue Model projection', () => {
  const wrapper = mount(testComponent, {
    propsData: {
      testStringProp: 'prop',
    },
  });
  const vueModelProjection = createVueModelProjection(wrapper.vm);
  test('has created proper projection from props', () => {
    expect(vueModelProjection.testStringProp).toBe('prop');
  });
  test('has created proper projection from data', () => {
    expect(vueModelProjection.testStringData).toBe('data');
  });
  test('has created proper projection from computed properties', () => {
    expect(vueModelProjection.testComputedStringData).toBe('computed prop and data');
  });
});
