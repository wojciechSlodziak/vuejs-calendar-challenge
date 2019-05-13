<template>
  <section class="accommodation-widget">
    <header class="accommodation-widget__header">
      <div>
        <span class="accommodation-widget__price">{{ pricePerNight }} {{ ppnCurrencyRepresentation }}</span>
        <span class="accommodation-widget__price-detail"> per night</span>
      </div>
      <div>
        <StarRating :rating="rating"/>
        <span class="accommodation-widget__rating-count">{{ numberOfVotes }}</span>
      </div>
    </header>
    <hr/>
    <form 
      action="javascript:void(0);"
      class="accomomodation-widget__form"
    >
      <label 
        for="from-input"
        class="accomomodation-widget__date-range-label"
      >Dates</label>
      <DateRangeInput
        v-model="dateRangeValue"
        :min-date="earliestAccommodationDatePastToday"
        :max-date="latestAccommodationDate"
        from-input-id="from-input"
      >
      <template v-slot:calendar-footer>
        <section class="custom-calendar-footer">
          <ul>
            <li>Minimum stay varies</li>
            <li>Updated {{ daysFromLastUpdate }} days ago</li>
          </ul>
        </section>
      </template>
      </DateRangeInput>
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
    daysFromLastUpdate: {
      type: Number,
      required: true
    },
    earliestAccommodationDate: Date,
    latestAccommodationDate: Date
  },
  data: function() {
    return {
      dateRangeValue: {
        fromDate: null,
        toDate: null
      }
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
    dateRangeValue: {
      handler: function(newVal) {
        console.log('Date range changed!', newVal.fromDate, newVal.toDate)
      },
      deep: true
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

.accommodation-widget {
  border: 1px solid @border-color;
  box-sizing: border-box;
  padding: 10px;
  max-width: 100%;
  width: 100%;
  @media @desktop {
    width: 350px;
  }
  hr {
    background-color: @border-color;
    border: none;
    height: 1px;
    margin: 15px 0;
  }
  .custom-calendar-footer {
    color: @dark-gray;
    ul {
      list-style-type: none;
      margin: 20px 0 0 0;
      padding: 0;
      li {
        padding: 0.1rem;
        font-size: 0.65rem;
        font-weight: bold;
      }
    }
  }
}
.accommodation-widget__header {
  font-weight: bold;
}
.accommodation-widget__price {
  font-size: 1.2rem;
  color: @black;
}
.accommodation-widget__price-detail {
  font-size: 0.7rem;
  color: @dark-gray;
}
.accommodation-widget__rating-count {
  font-size: 0.7rem;
  color: @dark-gray;
  margin-left: 3px;
}
.accomomodation-widget__form {
  margin-top: 10px;
}
.accomomodation-widget__date-range-label {
  color: @dark-gray;
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1.2rem;
}
</style>