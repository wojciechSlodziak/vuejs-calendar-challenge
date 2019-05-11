<template>
  <div>
    <header>
      <p>Example header content to push main part of the page.</p>
      <p>Example header content to push main part of the page.</p>
      <p>Example header content to push main part of the page.</p>
      <p>Example header content to push main part of the page.</p>
      <p>Example header content to push main part of the page.</p>
      <p>Example header content to push main part of the page.</p>
      <p>Example header content to push main part of the page.</p>
    </header>
    <div class="site-content">
      <main style="height: 500px;">
        <h1>Main Content</h1>
      </main>
      <aside>
        <AccommodationWidget 
          :price-per-night="298"
          ppn-currency-representation="zł"
          :rating="4.5"
          :number-of-votes="123"
          :earliest-accommodation-date="earliestAccommodationDate"
          :latest-accommodation-date="latestAccommodationDate"
        />
      </aside>
    </div>
    <footer>
      <p>Example footer content to expand the page</p>
      <p>Example footer content to expand the page</p>
      <p>Example footer content to expand the page</p>
      <p>Example footer content to expand the page</p>
      <p>Example footer content to expand the page</p>
      <p>Example footer content to expand the page</p>
      <p>Example footer content to expand the page</p>
    </footer>
  </div>
</template>

<script>
import AccommodationWidget from './components/AccommodationWidget.vue'

export default {
  components: {
    AccommodationWidget
  },
  data: function() {
    return {
      earliestAccommodationDate: new Date(2019, 4, 2),
      latestAccommodationDate: new Date(2019, 5, 15)
    }
  }
}
</script>

<style lang="less">
@import 'styles/shared.less';

body {
  font-family: Helvetica, Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  .site-content {
    @media @desktop {
      display: flex;
      margin: 0 auto;
      max-width: 1200px;
    }
    main {
      flex: 1 0 auto;
    }
    main, aside {
      padding: 0 5px;
    }
  }
}
</style>
