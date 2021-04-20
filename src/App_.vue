<template>
  <AppView>
    <AppBackground />
    <AppWidgets>
      <AppClockWidget />
    </AppWidgets>
    <AppDesktop>
      <AppIcon icon="/winvista/icons/109.ico" title="My Computer" shortcut @click="openApp"/>
      <AppIcon icon="/winvista/icons/123.ico" title="My Documents" shortcut @click="openApp"/>
      <AppIcon icon="/winvista/icons/54.ico" title="Recycle Bin" @click="openApp"/>
      <AppIcon icon="/winvista/icons/102.ico" title="Notepad" @click="openApp('notepad')"/>
      <AppIcon icon="/winvista/icons/46.ico" title="Camera" @click="openApp('camera')"/>
      <AppIcon icon="/winvista/icons/ie.png" title="Github Repo" @click="openRepo"/>
      <AppWindow v-for="window in windowsList" :key="window.id" :ref="'window-'+window.id" :width="window.width" :height="window.height" :left="window.left" :top="window.top" :title="window.title" @go-to-top="goToTop(window)" @close="close(window)">
        <component :is="window.type" :content="window.content" />
      </AppWindow>
      <AppWindow v-if="error" title="Error!" width="450px" height="auto" @close="error=false">
        <AppError @click="error=false"/>
      </AppWindow>
    </AppDesktop>
    <AppPanel @click="openApp" :windows-list="windowsList" @focus="$refs['window-'+$event.id][0].toggleMinimize()"/>
    <AppBluePage v-model="bluePage" :repo="repo"/>
    <AppDownloading v-if="loading"/>
  </AppView>
</template>

<script>
  import AppView from '../components/AppView.vue'
  import AppBackground from '../components/AppBackground.vue'
  import AppDesktop from '../components/AppDesktop.vue'
  import AppPanel from '../components/AppPanel.vue'
  import AppIcon from '../components/AppIcon.vue'
  import AppWidgets from '../components/AppWidgets.vue'
  import AppClockWidget from '../components/AppClockWidget.vue'
  import AppBluePage from '../components/AppBluePage.vue'
  import AppDownloading from '../components/AppDownloading.vue'
  import AppWindow from '../components/AppWindow.vue'
  import AppNotepad from '../components/AppNotepad.vue'
  import AppCamera from '../components/AppCamera.vue'
  import AppError from '../components/AppError.vue'

  export default {
    components: {
      AppView,
      AppBackground,
      AppDesktop,
      AppPanel,
      AppIcon,
      AppWidgets,
      AppClockWidget,
      AppBluePage,
      AppDownloading,
      AppWindow,
      AppNotepad,
      AppCamera,
      AppError
    },
    data() {
      return {
        opaningTimeout: null,
        bluePage: false,
        repo: 'https://github.com/nainemom/winvista',
        loading: true,
        error: false,
        userActions: 0,
        windowsList: [
          {
            id: 1,
            type: 'AppNotepad',
            title: 'Notepad - untitled.txt*',
            content: 'asdasdasdasd'
          },
          {
            id: 2,
            type: 'AppNotepad',
            title: 'Notepad - Readme.md',
            content: `By Nainemom\nRepo: https://github.com/nainemom/winvista`,
            top: '40px',
            left: '50px'
          }
        ]
      }
    },
    methods: {
      log(x) {
        console.log(x)
        console.log(this.$refs)
      },
      goToTop(window) {
        this.windowsList.sort((x => x.id == window.id ? 1 : -1 ))
      },
      close(window) {
        this.windowsList.splice(this.windowsList.findIndex(x => x.id === window.id), 1)
      },
      openApp(app = null) {
        this.userActions++
        if (app === 'notepad') {
          this.windowsList.push({
            id: Math.random().toString(36).substr(2),
            type: 'AppNotepad',
            title: 'Notepad - untitled.txt*',
            content: ''
          })
        } else if (app === 'camera') {
          this.windowsList.push({
            id: Math.random().toString(36).substr(2),
            type: 'AppCamera',
            title: 'Camera',
            content: '',
            width: '640px',
            height: '480px'
          })
        } else {
          if (this.userActions > 4) {
            this.bluePage = true
            this.userActions = 0
          } else {
            this.error = true
          }
        }
      },
      openRepo() {
        window.open(this.repo)
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      })
    }
  }
</script>