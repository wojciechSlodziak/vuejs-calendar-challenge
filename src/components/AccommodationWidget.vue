<template>
  <section>
    <header>
      <div>
        <span>{{ pricePerNight }} {{ ppnCurrencyRepresentation }}</span>
        <span> per night</span>
      </div>
      <div>
        <StarRating :rating="rating"/> {{ numberOfVotes }}
      </div>
    </header>
    <hr/>
  </section>
</template>

<script>
import StarRating from './StarRating.vue'

export default {
  name: 'AccommodationWidget',
  props: {
    pricePerNight: {
      type: Number,
      required: true
    },
    ppnCurrencyRepresentation: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    numberOfVotes: {
      type: Number,
      required: true
    }
  },
  components: {
    StarRating
  }
}
</script>

<style scoped lang="less">
@import '../styles/shared.less';

section {
  border: 1px solid @border-color;
  box-sizing: border-box;
  padding: 10px;
  max-width: 100%;
  width: 350px;
  hr {
    background-color: @border-color;
    border: none;
    height: 1px;
  }
}
</style>
