<template>
  <div>
    <DateInput 
      v-model="internalFromDate"
      :min-date="minDate"
      :max-date="fromInputMaxDate"
      @input="handleInput"
    />
    <DateInput
      v-model="internalToDate"
      :min-date="toInputMinDate"
      :max-date="maxDate"
      @input="handleInput"
    />
  </div>
</template>

<script>
import DateInput from './date-input/DateInput.vue'

export default {
  props: {
    value: {
      type: Object,
      default: {
        fromDate: null,
        toDate: null
      }
    },
    minDate: Date,
    maxDate: Date,
  },
  data() {
    return {
      internalFromDate: this.value? this.value.fromDate : null,
      internalToDate: this.value? this.value.toDate : null,
    }
  },
  computed: {
    fromInputMaxDate() {
      let maxDate = this.internalToDate < this.maxDate? this.internalToDate : this.maxDate
      if (maxDate) {
        let dayBeforeMaxDate = (new Date(maxDate)).setDate(maxDate.getDate() - 1)
        return new Date(dayBeforeMaxDate)
      }
      return null
    },
    toInputMinDate() {
      let minDate = this.internalFromDate > this.minDate? this.internalFromDate : this.minDate
      if (minDate) {
        let dayAfterMinDate = (new Date(minDate)).setDate(minDate.getDate() + 1)
        return new Date(dayAfterMinDate)
      }
      return null
    }
  },
  watch: {
    value(newVal) {
      this.internalFromDate = newVal.fromDate
      this.internalToDate = newVal.toDate
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', {
        fromDate: this.internalFromDate,
        toDate: this.internalToDate
      })
    }
  },
  components: {
    DateInput
  }
}
</script>

<style scoped lang="less">

</style>
