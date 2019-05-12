<template>
  <div class="date-range-input">
    <DateInput 
      :id="fromInputId"
      class="date-range-input__input"
      placeholder="Check In"
      v-model="internalFromDate"
      :min-date="minDate"
      :max-date="fromInputMaxDate"
      @input="handleFromDateInput"
    >
      <template v-slot:calendar-footer>
        <slot name="calendar-footer"></slot>
      </template>
    </DateInput>
    <div class="date-range-input__separator">
      <span>&#8594;</span>
    </div>
    <DateInput
      ref="toInput"
      :id="toInputId"
      class="date-range-input__input"
      placeholder="Check Out"
      v-model="internalToDate"
      :min-date="toInputMinDate"
      :max-date="maxDate"
      @input="handleToDateInput"
      :right-aligned="true"
    >
      <template v-slot:calendar-footer>
        <slot name="calendar-footer"></slot>
      </template>
    </DateInput>
  </div>
</template>

<script>
import DateInput from './date-input/DateInput.vue'

export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          fromDate: null,
          toDate: null
        }
      }
    },
    minDate: Date,
    maxDate: Date,
    fromInputId: String,
    toInputId: String
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
    handleFromDateInput() {
      this.handleInput()
      setTimeout(function() {
        this.$refs.toInput.$refs.input.focus()
      }.bind(this))
    },
    handleToDateInput() {
      this.handleInput()
    },
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
@import '../styles/shared.less';

.date-range-input {
  display: flex;
  padding: 7px;
  border: 1px solid @border-color;
  border-radius: 3px;
}
.date-range-input__separator {
  padding: 0 8px;
  max-height: 20px;
  line-height: 20px;
  span {
    color: @medium-gray;
    font-size: 1.8rem;
  }
}
</style>
<style lang="less">
@import '../styles/shared.less';
.date-range-input__input  {
  .date-input__input {
    border: none;
    padding: 3px 5px;
  }
  .calendar-popup {
    margin-top: 18px;
    left: -7px;
    &.calendar-popup--right-aligned {
      right: -7px;
    }
  }
}
</style>
