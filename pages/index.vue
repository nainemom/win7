<template>
  <AppView>
    <AppBackground />
    <AppDesktop>
      <AppIcon icon="/icons/109.ico" title="My Computer" shortcut/>
      <AppIcon icon="/icons/123.ico" title="My Documents" shortcut/>
      <AppIcon icon="/icons/54.ico" title="Recycle Bin"/>
      <AppIcon icon="/icons/174.ico" title="asdasd.zip"/>
    </AppDesktop>
    <AppWidgets>
      <AppClockWidget />
    </AppWidgets>
    <AppPanel />
    <AppBluePage />
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

  export default {
    components: {
      AppView,
      AppBackground,
      AppDesktop,
      AppPanel,
      AppIcon,
      AppWidgets,
      AppClockWidget,
      AppBluePage
    }
  }
</script>

<style>
  html, body, #app {
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0;
    background-size: cover;
    background-position: bottom;
  }
  * {
    box-sizing: border-box;
  }
  #app {
    position: relative;
  }
</style>