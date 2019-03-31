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
      <AppIcon icon="/winvista/icons/3.ico" title="New Folder (8)" @click="openApp"/>
      <AppIcon icon="/winvista/icons/ie.png" title="Github Repo" @click="openRepo"/>
    </AppDesktop>
    <AppWindow>
      <textarea class="notepad"> asdasdasdasd </textarea>
    </AppWindow>
    <AppPanel  @click="openApp"/>
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
      AppWindow
    },
    data() {
      return {
        opaningTimeout: null,
        bluePage: false,
        repo: 'https://github.com/nainemom/winvista',
        loading: true
      }
    },
    methods: {
      openApp() {
        document.body.classList.add('waiting')
        clearTimeout(this.opaningTimeout)
        this.opaningTimeout = setTimeout(() => {
          document.body.classList.remove('waiting')
          this.bluePage = true
        }, 3000)
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

<style>
  .notepad {
    width: 100%;
    height: 100%;
    border: none;
    padding: 8px;
    resize: none;
  }
</style>