<template>
  <View>
    <Desktop :wallpaper="wallpaper" />
    <Taskbar />
  </View>
</template>

<script>
  import View from '/src/components/View.vue'
  // import AppBackground from '../components/AppBackground.vue'
  import Desktop from '/src/components/Desktop.vue'
  import Taskbar from '/src/components/Taskbar.vue'

  // import AppPanel from '../components/AppPanel.vue'
  // import AppIcon from '../components/AppIcon.vue'
  // import AppWidgets from '../components/AppWidgets.vue'
  // import AppClockWidget from '../components/AppClockWidget.vue'
  // import AppBluePage from '../components/AppBluePage.vue'
  // import AppDownloading from '../components/AppDownloading.vue'
  // import AppWindow from '../components/AppWindow.vue'
  // import AppNotepad from '../components/AppNotepad.vue'
  // import AppCamera from '../components/AppCamera.vue'
  // import AppError from '../components/AppError.vue'
  import WallpaperImage from '/src/assets/wallpaper.jpg';

  export default {
    components: {
      View,
      Desktop,
      Taskbar,
      // Window,
    },
    data() {
      return {
      }
    },
    computed: {
      wallpaper() {
        return WallpaperImage;
      },
    },
    methods: {

    },
    mounted() {

    }
  }
</script>
