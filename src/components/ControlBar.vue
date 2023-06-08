<template>
  <div class="control-bar">
    <Button class="menu-toggle" icon="menu" @click="collapse"></Button>
    <div class="action-buttons-wrapper" :class="{ collapsed: isCollapsed }">
      <div class="action-buttons-inner">
        <div class="views-btn action-btn-group" @click="menuToggle('views')">
          <Button class="action-button" icon="camera">Views</Button>
          <Transition>
            <div v-if="subMenuStatus.views" class="sub-menu views-menu">
              <Button v-for="view in views" :key="view.id" @click="setView(view)">{{
                view.title
              }}</Button>
            </div>
          </Transition>
        </div>

        <div class="views-btn action-btn-group" @click="menuToggle('styles')">
          <Button class="action-button" icon="styles">Styles</Button>
          <Transition>
            <div v-if="subMenuStatus.styles" class="sub-menu styles-menu">
              <Button
                v-for="style in styles"
                :key="style.id"
                :class="{ active: style.id == activeStyle }"
                @click="setStyle(style)"
                >{{ style.title }}</Button
              >
            </div>
          </Transition>
        </div>

        <div class="views-btn action-btn-group" @click="menuToggle('hull')">
          <Button class="action-button" icon="hull">Hull</Button>
          <Transition>
            <div v-if="subMenuStatus.hull" class="sub-menu hull-menu">
              <Button
                v-for="color in colors"
                :key="color.id"
                class="hull-color-swatch"
                :class="{ active: color.id == activeColor }"
                @click="setHullColor(color)"
                icon="boat"
                :icon-size="130"
                :icon-color="color.value"
              >
                <!-- <span :style="{ background: color.value }" class="color-swatch"></span> -->
              </Button>
            </div>
          </Transition>
        </div>

        <Button class="action-button" :class="{ active: droneMode }" icon="drone" @click="setDrone"
          >Drone</Button
        >

        <Button
          class="action-button"
          :class="{ active: nightMode }"
          icon="day-night"
          @click="setNight"
          >Night</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from './Button.vue'

const isCollapsed = ref(false)

const subMenuStatus = reactive<Record<string, boolean>>({
  // environment: false,
  views: false,
  styles: false,
  hull: false
})

interface Style {
  id: string
  title: string
}

interface View {
  id: number
  title: string
}

interface Color {
  id: string
  title: string
  value: string
}

const droneMode = ref(false)
const nightMode = ref(false)
const activeStyle = ref('')
const activeColor = ref('')

const views = ref<View[]>([
  { id: 0, title: 'Saloon' },
  { id: 1, title: 'Galley' },
  { id: 2, title: 'Master' },
  { id: 3, title: 'Fore' },
  { id: 4, title: 'Guest' },
  { id: 5, title: 'VIP' }
])

const styles = ref<Style[]>([
  { id: 'amsterdam', title: 'Amsterdam' },
  { id: 'athens', title: 'Athens' },
  { id: 'casablanca', title: 'Casablanca' },
  { id: 'milan', title: 'Milan' },
  { id: 'new_york', title: 'New York' },
  { id: 'paris', title: 'Paris' }
])

const colors = ref<Color[]>([
  { id: 'dark_blue', title: 'Dark Blue', value: '#1a1f33' },
  { id: 'ferrari', title: 'Ferrari Grigio', value: '#a29a95' },
  { id: 'gray', title: 'Dark Gray', value: '#7f8187' },
  { id: 'light_blue', title: 'Light Blue', value: '#adbcd2' },
  { id: 'white', title: 'White', value: '#cbc9bf' },
  { id: 'orange', title: 'Orange', value: '#bc5c26' }
])

const emit = defineEmits<{
  (e: 'changeView', value: number): void
  (e: 'changeStyle', value: string): void
  (e: 'changeHullColor', value: string): void
  (e: 'changeDrone', value: boolean): void
  (e: 'changeNight', value: boolean): void
}>()

function closeMenus() {
  Object.keys(subMenuStatus).map((key) => {
    subMenuStatus[key] = false
  })
}

function setStyle(style: Style) {
  styles.value.map((style) => style.id != activeStyle.value)
  activeStyle.value = style.id
  emit('changeStyle', style.id)
}

function setView(view: View) {
  console.log(view.id)
  emit('changeView', view.id)
}

function setHullColor(color: Color) {
  emit('changeHullColor', color.id)
}

function setDrone() {
  droneMode.value = !droneMode.value
  emit('changeDrone', droneMode.value)
}

function setNight() {
  closeMenus()
  nightMode.value = !nightMode.value
  emit('changeNight', nightMode.value)
}

function collapse() {
  isCollapsed.value = !isCollapsed.value
  closeMenus()
}

function menuToggle(e: string) {
  if (!subMenuStatus[e]) {
    closeMenus()
  }
  subMenuStatus[e] = !subMenuStatus[e]
}
</script>

<style lang="scss" scoped>
.control-bar {
  width: 100%;
  display: flex;
}

.menu-toggle :deep(.icon) {
  height: unset !important;
}

.action-btn-group {
  display: inline-flex;
}

.action-button {
  width: 150px;
  justify-content: center;
}

.action-button :deep(.icon) {
  margin-right: 10px;
}

.color-swatch {
  height: 30px !important;
  width: 130px;
}

.hull-color-swatch :deep(.icon) {
  height: 30px !important;
}

.action-buttons-wrapper {
  display: flex;
  width: 100%;
}
.action-buttons-inner {
  display: flex;
  top: 0;
  opacity: 1;
  transition: all 0.5s;
}
.action-buttons-wrapper.collapsed {
  overflow: hidden;
}

.action-buttons-wrapper.collapsed .action-buttons-inner {
  top: 36px;
  opacity: 0;
}

.sub-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  bottom: 50px;
  transition: opacity 0.5s;

  .btn {
    margin-top: 5px;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.views-menu {
  min-width: 130px;
}

@media screen and (max-width: 600px) {
  .control-bar {
    width: calc(100% - 10px);
    display: flex;
    align-items: center;
    margin: 0 5px 5px;
    position: absolute;
    z-index: 999;
    transition: all 0.5s;
  }

  .action-buttons-inner {
    display: flex;
    padding: 5px;
    justify-content: space-around;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    width: 100%;
  }
  .action-button {
    width: unset;
    font-size: 10px;
    flex-direction: column;
    background-color: transparent;
  }

  .action-button :deep(.icon) {
    margin-bottom: 5px;
  }

  .action-button :deep(.icon) {
    margin-bottom: 3px;
    margin-right: 0;
  }

  .sub-menu {
    bottom: 70px;
  }

  .sub-menu .btn {
    font-size: 14px;
  }
}
</style>
