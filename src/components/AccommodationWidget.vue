<template>
  <section>
    <header>
      <div>
        <span>{{ pricePerNight }} {{ ppnCurrencyRepresentation }}</span>
        <span> per night</span>
      </div>
      <div>
        <StarRating :rating="4.5"/> {{ numberOfVotes }}
      </div>
    </header>
    <hr/>
    <form action="javascript:void(0);">
      <DateRangeInput
        v-model="dateRangeValue"
        :min-date="earliestAccommodationDatePastToday"
        :max-date="latestAccommodationDate"
      />
    </form>
  </section>
</template>

<script>
import StarRating from './StarRating.vue'
import DateRangeInput from './DateRangeInput.vue'

export default {
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
    },
    earliestAccommodationDate: Date,
    latestAccommodationDate: Date
  },
  data: function() {
    return {
      dateRangeValue: null
    }
  },
  computed: {
    earliestAccommodationDatePastToday() {
      let now = new Date()
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      if (this.earliestAccommodationDate && this.earliestAccommodationDate >= today) {
        return this.earliestAccommodationDate
      } else {
        return today
      }
    }
  },
  watch: {
    // TODO: remove - this is only for presenting the functionality
    dateRangeValue(newVal) {
      console.log('Date range changed!', newVal.fromDate, newVal.toDate);
    }
  },
  components: {
    StarRating,
    DateRangeInput
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
