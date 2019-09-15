<template>
  <button
    :class="[$classes.button, $classes[_uid]]"
    type="button"
    @click="toggle"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    I'm a button № {{_uid}}
  </button>
</template>

<script>
const styles = {
  button: {
    padding: '0.75em 2em',
    borderRadius: '2em',
    display: 'inline-block',
    color: '#fff',
    backgroundColor: ({color}) => color,
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
    border: ({color}) => `1px solid ${color}`,
    
    margin: '1em 0.1em',
    fontSize: '1.05em',
    fontWeight: '600',
    letterSpacing: '0.1em',
    minWidth: '8em',
    textAlign: 'center',

    cursor: 'pointer',

    opacity: ({isHover}) => isHover ? 0.7 : 1,
    transition: 'opacity 0.25s ease-in-out',
  },
};

export default {
  name: 'Button',
  styles,
  data() {
    return {
      isSelected: false,
      isHover: false,
    };
  },
  methods: {
    toggle(event) {
      this.isSelected = !this.isSelected;
    },
  },
  computed: {
    color() {
      return this.isSelected ? '#2c3e50' : '#4fc08d';
    },
  },
};
</script>

<style scoped />
