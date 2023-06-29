<template>
  <div v-if="isLoading" class="loading-screen">
    <div class="loading-screen-messages-wrapper">
      <div class="loader-wrapper">
        <div class="loader">Loading...</div>
      </div>
      <div class="loading-screen-messages-shadow"></div>

      <transition-group name="list" mode="out-in" tag="div" class="loading-screen-messages">
        <div v-for="message in loadingMessages" :key="message" class="loading-screen-message">
          {{ message }}
        </div>
      </transition-group>
    </div>
  </div>
  <div ref="sizeContainerRef" id="sizeContainer">
    <div ref="videoContainerRef" id="videoContainer">
      <TopBar
        class="top-bar"
        :class="{ fullscreen: isFullscreen }"
        :initQuality="quality"
        :quality="availableQuality"
        @fullscreenChange="fullscreenToggle"
        @audioChange="audioToggle"
        @qualityChange="qualityToggle"
      />
      <ControlBar
        class="control-bar"
        :class="{ fullscreen: isFullscreen }"
        @changeStyle="setStyle"
        @changeView="setView"
        @changeHullColor="setHullColor"
        @changeDrone="setDrone"
        @changeNight="setNight"
      />
      <!-- <img class="bg" src="./assets/bg.png" /> -->
      <video ref="videoRef"></video>
      <audio id="audioRef"></audio>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { WebRTCClient } from '@arcware/webrtc-plugin'
import ControlBar from '@/components/ControlBar.vue'
import TopBar from '@/components/TopBar.vue'
import { debounce } from 'lodash'
import isMobile from 'ismobilejs'

const sizeContainerRef = ref<HTMLDivElement>()
const videoContainerRef = ref<HTMLDivElement>()
const videoRef = ref<HTMLVideoElement>()
const audioRef = ref<HTMLAudioElement>()
const loadingRef = ref(null)
const isLoading = ref(true)
const isFullscreen = ref(false)
const loadingMessages = ref<string[]>([])
const RTCClient = ref<WebRTCClient>(null)

const shareId = computed(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  if (id) {
    return id
  }

  if (window.innerWidth * window.devicePixelRatio <= 1920) {
    return 'share-cecb82b6-05a5-4b9d-8bc1-a2f6f0dd62d9'
  } else {
    return 'share-6394a78c-e743-43a0-a358-e04b8c9ef53d'
  }
})

const availableQuality = computed(() => {
  if (window.innerWidth * window.devicePixelRatio <= 1920) {
    return ['auto', '720p', '1080p']
  } else {
    return ['auto', '720p', '1080p', '1440p', '2160p']
  }
})

const quality = computed(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const q = urlParams.get('q')

  if (q === 'auto' || q == '720p' || q === '1080p' || q === '1440p' || q === '2160p') {
    return q
  }

  return 'auto'
})

const sendResolutionOnResize = ref(true)
function fullscreenToggle(e: boolean) {
  // e ? videoContainerRef.value?.requestFullscreen() : document.exitFullscreen()
  isFullscreen.value = !isFullscreen.value

  if (e) {
    if (videoContainerRef.value?.requestFullscreen) {
      videoContainerRef.value?.requestFullscreen()
    } else if (videoContainerRef.value.webkitRequestFullscreen) {
      /* Safari */
      videoContainerRef.value?.webkitRequestFullscreen()
    } else if (videoContainerRef.value?.msRequestFullscreen) {
      /* IE11 */
      videoContainerRef.value?.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen()
    }
  }
}

function audioToggle(e: boolean) {
  audioRef.value!.muted = e
  
}

function qualityToggle(e = 'auto') {
  const pixelRatio = window.devicePixelRatio
  const width = window.innerWidth * pixelRatio
  const height = window.innerHeight * pixelRatio
  const aspectRatio = width / height

  if (e === '720p') {
    handleSendCommands({ Console: `r.setres 1280x${1280 / aspectRatio}w` })
  } else if (e === '1080p') {
    handleSendCommands({ Console: `r.setres 1920x${1920 / aspectRatio}w` })
  } else if (e === '1440p') {
    handleSendCommands({ Console: `r.setres 2560x${2560 / aspectRatio}w` })
  } else if (e === '2160p') {
    handleSendCommands({ Console: `r.setres 3840x${3840 / aspectRatio}w` })
  } else {
    handleSendCommands({ Console: `r.setres ${width}x${width / aspectRatio}w` })
  }
}

function handleSendCommands(command: any) {
  RTCClient.value.emitUIInteraction(command)
}

function setStyle(e: string) {
  handleSendCommands({ style: e })
}

function setView(e: number) {
  handleSendCommands({ view: e })
}

function setHullColor(e: string) {
  handleSendCommands({ hull_color: e })
}

function setDrone(e: boolean) {
  handleSendCommands({ drone_mode: e })
}

function setNight(e: boolean) {
  handleSendCommands({ night: e })
}

const isLandscape = computed(() => {
  return window.innerHeight < window.innerWidth
})

onMounted(() => {
  console.log('loading...')

  RTCClient.value = new WebRTCClient({
    address: 'wss://signalling-client.ragnarok.arcware.cloud/',
    // shareId: 'share-4f253d63-82af-44af-b69a-e89971254d36',
    // shareId: 'share-0158d412-d7a9-4643-b186-f14800a698c3',
    shareId: shareId.value,
    settings: {
      /* object with settings */
    },
    playOverlay: false,
    autoplay: { 
    video: true, 
    audio: true,
},
    sendResolutionOnResize: false,
    loader: (status: boolean) => {
      /* handle loader */
      console.log('loader', status)
      isLoading.value = status
    },
    applicationResponse: (response: any) => {
      /* handle application response */

      console.log('response', response)
    },
    videoInitializeCallback: (descriptor: any) => {
      handleSendCommands({ is_mobile: isMobile().any, is_landscape: isLandscape.value })

      window.addEventListener(
        'orientationchange',
        () => {
          handleSendCommands({ is_landscape: isLandscape.value })
        },
        false
      )

      qualityToggle(quality.value)
    },
    sendLetter: (letter: string) => {
      console.log('sendLetter', letter)
      loadingMessages.value.push(letter)

      loadingMessages.value = loadingMessages.value.slice(-4)
    },
    sizeContainer: sizeContainerRef.value,
    container: videoContainerRef.value,
    videoRef: videoRef.value,
    audioRef: audioRef.value,
    forceVideoToFitContainer: true
  })

  window.addEventListener('resize', debounce(qualityToggle, 500))
})
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
#sizeContainer,
#videoContainer,
#videoRef {
  width: 100vw;
  height: 100% !important;
}

#videoContainer {
  cursor: grab;
}

.bg {
  width: 100vw;
}
.top-bar {
  display: flex;
  position: absolute;
  top: 10px;
  right: 0;
  z-index: 999;
}

.control-bar {
  position: absolute;
  bottom: 10px;
  left: 0;
  z-index: 999;
}

.control-bar.fullscreen {
  bottom: 60px;
}

@media screen and (min-width: 567px) {
  .control-bar.fullscreen {
    bottom: 10px;
  }
}

.loading-screen {
  position: absolute;
  height: 100vh;
  width: 100vw;
  color: #d3d3d3;
  background: #0e0e0e;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-screen-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-screen-messages-shadow {
  width: 100%;
  height: 50px;
  /* background: red; */
  position: absolute;
  /* background-image: linear-gradient(transparent, white 75%), url(http://www.fillmurray.com/460/300); */
  background-image: linear-gradient(to bottom, #0e0e0e, transparent);
  z-index: 10;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}

.loader-wrapper {
  height: 85px;
}
.loader,
.loader:before,
.loader:after {
  background: #ffffff;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.loader {
  color: #ffffff;
  text-indent: -9999em;
  margin: 0 auto;
  position: relative;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: '';
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
