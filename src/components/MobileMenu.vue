<template>
  <div class="mobile-menu-wrapper">
    <Button class="mobile-menu-toggle menu-toggle" icon="menu" :iconSize="25" ></Button>
    <div class="mobile-menu-top-wrapper" :class="{'collapsed': isCollapsed}" @click="collapse">
      <Button class="mobile-action-button" icon="camera" :iconSize="25" mode="transparent">Views</Button>
      <Button class="mobile-action-button" icon="styles" :iconSize="25" mode="transparent">Styles</Button>
      <Button class="mobile-action-button" icon="drone" :iconSize="25" mode="transparent">Drone</Button>
      <Button class="mobile-action-button" icon="day-night" :iconSize="25" mode="transparent">Night</Button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from './Button.vue'

const isCollapsed = ref(false)

function collapse() {
  isCollapsed.value = !isCollapsed.value
}

</script>

<style lang="scss" scoped>

.mobile-action-button :deep(.action-button) {
  font-size: 10px;
  flex-direction: column;
  
}
.mobile-action-button :deep(.action-button .icon) {
margin-bottom: 3px;
}

.menu-toggle .icon {
fill: #fff;
}

.mobile-menu-wrapper {
  width: calc(100% - 10px);
  display: flex;
  align-items: center;
  margin: 0 5px 5px;
  backdrop-filter: blur(5px);
  position: absolute;
  bottom: 0;
  z-index: 999;
  transition: all 0.5s;
}

.mobile-menu-top-wrapper {
  display: flex;
  padding: 5px;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  width: 100%;
  position: absolute;
}

.mobile-menu-top-wrapper.collapsed {
  top: 36px;
  opacity: 0;
}

</style>
