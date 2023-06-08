<template>
  <button v-ripple="50" class="btn ripple1" :class="{ transparent: mode }">
    <Icon
      v-if="icon"
      class="icon"
      :class="{ 'icon-only': !$slots.default }"
      :name="icon"
      :size="iconSize"
      :color="iconColor"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon.vue'

withDefaults(
  defineProps<{
    title?: string
    icon?: string
    iconSize?: number
    iconColor?: string
    mode?: string
  }>(),
  {
    iconSize: 20,
    iconColor: '#fff'
  }
)
</script>

<style lang="scss" scoped>
.ripple {
  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #243446 radial-gradient(circle, transparent 1%, #243446 1%) center/15000%;
}

.ripple:focus {
  background: #243446 radial-gradient(circle, transparent 1%, #243446 1%) center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}

.btn {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  color: rgb(224, 224, 224);
  background: rgba(0, 0, 0, 0.6);
  outline: none;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 0 5px;
  align-items: center;

  .icon {
    // max-width: 20px;
  }

  .icon-only {
    margin-right: 0;
  }

  &.active {
    background-color: #3e699b;
  }

  &.active {
    // background-color: red;
  }

  &.inactive {
    background-color: red;
  }
}

.action-button.menu-toggle {
  width: unset;

  .icon {
    margin-right: 0;
  }
}

.transparent {
  background: transparent;
}
</style>
