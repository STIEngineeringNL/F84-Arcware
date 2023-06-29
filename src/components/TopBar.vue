<template>
  <div class="top-bar">
    <div class="quality-toggle" @click="qualityToggle">
      <Button class="action-button">{{ activeQuality }}</Button>
      <Transition>
        <div v-if="qualityMenuStatus" class="sub-menu styles-menu">
          <Button
            v-for="q in quality"
            :key="q"
            class="action-button"
            @click="setQuality(q)"
            >{{ q }}</Button
          >
        </div>
      </Transition>
    </div>
    <Button
      class="fullscreen-toggle"
      :icon="fullscreen ? 'fullscreen-on' : 'fullscreen-off'"
      @click="fullscreenToggle"
    ></Button>
    <Button
      class="audio-toggle"
      :icon="audio ? 'audio-on' : 'audio-off'"
      @click="audioToggle"
    ></Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    initQuality?: string
    quality: string[]
  }>(),
  {
    initQuality: 'auto'
  }
)

const fullscreen = ref(false)
const audio = ref(true)
const activeQuality = ref(props.initQuality)
const qualityMenuStatus = ref(false)

const emit = defineEmits<{
  (e: 'fullscreenChange', value: boolean): void
  (e: 'audioChange', value: boolean): void
  (e: 'qualityChange', value: string): void
}>()

function fullscreenToggle() {
  fullscreen.value = !fullscreen.value
  emit('fullscreenChange', fullscreen.value)
}

function audioToggle() {
  audio.value = !audio.value
  emit('audioChange', audio.value)
}

function qualityToggle() {
  qualityMenuStatus.value = !qualityMenuStatus.value
}

function setQuality(id: string) {
  activeQuality.value = id
  emit('qualityChange', id)
}
</script>

<style lang="scss" scoped>
.quality-toggle {
  display: inline-block;
}

.sub-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 40px;
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
</style>
