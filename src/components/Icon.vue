<template>
  <span class="e-icon" :style="style" v-html="icon"></span>
</template>

<script lang="ts" setup>
import { onBeforeMount, onUpdated, ref, type Ref } from 'vue'

const props = defineProps<{
  name: string
  size: number
  color: string
}>()

const icon: Ref<string> = ref('')

const style = ref({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fill: `${props.color}`,

})

async function loadIcon() {
  const img = await import(`@/assets/icons/${props.name}.svg?raw`)
  icon.value = img.default
}
onBeforeMount(() => {
  loadIcon()
})

onUpdated(() => {
  loadIcon()
})
</script>

<style lang="scss">
.e-icon {
  display: inline-flex;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
