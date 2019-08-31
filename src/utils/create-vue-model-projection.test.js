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
    testStringComputed() {
      return `computed ${this.testStringProp} and ${this.testStringData}`;
    },
  },
  template: `<div>Let's test the World!</div>`,
});

describe('Create Vue Model projection', () => {
  const wrapper = mount(testComponent, {
    propsData: {
      testStringProp: 'prop',
    },
  });
  const vModelProjection = createVueModelProjection(wrapper.vm);
  test('has created proper projection from props', () => {
    expect(vModelProjection.testStringProp).toBe('prop');
  });
  test('has created proper projection from data', () => {
    expect(vModelProjection.testStringData).toBe('data');
  });
  test('has created proper projection from computed properties', () => {
    expect(vModelProjection.testStringComputed).toBe('computed prop and data');
  });
});
