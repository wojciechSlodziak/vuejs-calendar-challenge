<template>
  <div class="star-rating">
    <div class="star-rating__negative">
      <span v-for="r in maxRating" :key="r">&#9733;</span>
    </div>
    <div class="star-rating__positive" :style="{ width: percentageRating + '%' }">
      <span v-for="r in maxRating" :key="r">&#9733;</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true
    },
    maxRating: {
      type: Number,
      default: 5
    }
  },
  computed: {
    percentageRating() {
      const percentageRating = this.rating / this.maxRating * 100
      return percentageRating >= 0? percentageRating : 0
    }
  }
}
</script>

<style scoped lang="less">
.star-rating {
  display: inline-block;
  position: relative;
  font-size: 0.8rem;
}
.star-rating__negative {
  color: #dadada;
}
.star-rating__positive {
  color: #378087;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
