<template>
  <div class="star-rating">
    <div class="star-rating__negative">
      <span v-for="r in maxRating" :key="r">&#9734;</span>
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
  color: #378087;
  display: inline-block;
  position: relative;
  .star-rating__positive {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
}
</style>
