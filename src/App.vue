<template>
  <div>
    <header></header>
    <div>
      <main>
        <h1>Main Content</h1>
      </main>
      <aside>
        <accommodation-widget/>
      </aside>
    </div>
    <footer></footer>
  </div>
</template>

<script>
import AccommodationWidget from './components/AccommodationWidget.vue'

export default {
  name: 'App',
  components: {
    AccommodationWidget
  }
}
</script>

<style lang="less">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
