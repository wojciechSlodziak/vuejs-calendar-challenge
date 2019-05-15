<template>
  <section 
    aria-label="Calendar"
    ref="container"
    class="calendar-popup"
    :class="{ 'calendar-popup--right-aligned': rightAligned }"
    v-if="isCalendarOpen"
  >
    <header class="calendar-popup__header">
      <button
        aria-label="Display previous month."
        type="button"
        @click="showPrevMonth"
        @blur="handleFocusableElementBlur"
        class="calendar-popup__month-button calendar-popup__month-button-prev"
      >
        <span>&#8592;</span>
      </button>
      <strong>{{ displayedMonthName }} {{ displayedYear }}</strong>
      <button 
        aria-label="Display next month."
        type="button"
        @click="showNextMonth" 
        class="calendar-popup__month-button calendar-popup__month-button-next"
      >
        <span>&#8594;</span>
      </button>
    </header>

    <section>
      <ul class="calendar-popup__column-headers">
        <li 
          v-for="(weekDay, weekDayIndex) in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" 
          :key="weekDayIndex"
          class="calendar-popup__column-header"
        >
          <strong>{{ weekDay }}</strong>
        </li>
      </ul>
      <table class="calendar-popup__days-table" role="presentation">
        <tr v-for="(row, rowIndex) in calendarData" :key="rowIndex">
          <td
            ref="dayButton"
            v-for="(day, dayIndex) in row" 
            :key="dayIndex"
            :data-row-index="rowIndex"
            :data-col-index="dayIndex"
            :aria-disabled="!day.isSelectable"
            :aria-label="day.ariaLabel"
            class="calendar-popup__day"
            :class="{ 'calendar-popup__day--selected': internalValue && day.date && day.date.getTime() === internalValue.getTime(),
                      'calendar-popup__day--selectable': day.isSelectable && day.dayNumber,
                      'calendar-popup__day--disabled': !day.isSelectable,
                      'calendar-popup__day--dummy': !day.dayNumber }"
            @click="selectDate(day)"
            @keyup.enter="selectDate(day)"
            @keydown.up.down.left.right.prevent="handleKeyNavigation($event)"
            @blur="handleFocusableElementBlur"
            :tabindex="day.dayNumber === focusableDayButton? 0 : -1"
            role="button"
          >
            {{ day.dayNumber }}
          </td>
        </tr>
      </table>
    </section>

    <slot name="footer"></slot>
  </section>
</template>

<script>
import { getMonthName } from '../../utils/date-utils.js'

export default {
  props: {
    value: {
      type: Date,
      default: null
    },
    minDate: Date,
    maxDate: Date,
    isOpen: {
      type: Boolean,
      default: false
    },
    rightAligned: Boolean
  },
  data() {
    return {
      internalValue: this.value,
      isCalendarOpen: false,
      displayedYear: null,
      displayedMonth: null,
      keyboardFocusedDayButton: null
    }
  },
  computed: {
    displayedMonthName() {
      return getMonthName(this.displayedMonth)
    },
    calendarData() {
      let data = []
      let firstDay = new Date(this.displayedYear, this.displayedMonth, 1)
      let lastDay = new Date(this.displayedYear, this.displayedMonth + 1, 0)
      let numberOfDays = lastDay.getDate()
      
      let row = []
      let rowIndex = 0;
      let colIndex = 0;
      for (let dayNumber = -firstDay.getDay() + 1; dayNumber <= (numberOfDays + 6 - lastDay.getDay()); dayNumber++) {
        if (dayNumber < 1 || dayNumber > numberOfDays) {
          row.push({});
        } else {
          let date = new Date(this.displayedYear, this.displayedMonth, dayNumber)
          if (row.length !== 0 && date.getDay() === 0) {
            data.push(row)
            row = []
            rowIndex++
            colIndex = 0
          }

          let isSelectable = (!this.maxDate || date <= this.maxDate) 
                              && (!this.minDate || date >= this.minDate)
          row.push({
            dayNumber,
            date,
            lastInRow: date.getDay() === 6 || dayNumber === numberOfDays,
            firstInRow: date.getDay() === 0 || dayNumber === 1,
            rowIndex,
            colIndex,
            isSelectable,
            ariaLabel: (isSelectable? 'Date available, ' : 'Date not available, ') + date.toDateString()
          })
        }
        colIndex++
      }
      data.push(row)

      return data
    },  
    focusableDayButton() {
      if (this.keyboardFocusedDayButton) {
        return this.keyboardFocusedDayButton
      } else if (this.internalValue 
          && this.internalValue.getFullYear() === this.displayedYear
          && this.internalValue.getMonth() === this.displayedMonth)
      {
        return this.internalValue.getDate()
      } else {
        for (let row of this.calendarData) {
          for (let day of row) {
            if (day.isSelectable) {
              return day.dayNumber
            }
          }
        }
      }
      return 1
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.handleCalendarOpen()
      } else {
        this.handleCalendarClose()
      }
    },
    value(newVal) {
      this.internalValue = newVal
    }
  },
  methods: {
    handleCalendarOpen() {
      this.setupInitialCalendarDisplay()
      this.isCalendarOpen = true
    },
    handleCalendarClose() {
      this.isCalendarOpen = false
      this.keyboardFocusedDayButton = null
    },
    setupInitialCalendarDisplay() {
      const date = (this.value? this.value : new Date())
      this.displayedYear = date.getFullYear()
      this.displayedMonth = date.getMonth()
    },
    showPrevMonth() {
      this.displayedMonth--
      if (this.displayedMonth === -1) {
        this.displayedMonth = 11
        this.displayedYear--
      }
    },
    showNextMonth() {
      this.displayedMonth++
      if (this.displayedMonth === 12) {
        this.displayedMonth = 0
        this.displayedYear++
      }
    },
    handleFocusableElementBlur() {
      setTimeout(() => {
        if (this.$refs.container && !this.$refs.container.contains(document.activeElement)) {
          this.$emit('blur')
        }
      })
    },
    handleKeyNavigation(event) {
      let rowIndex = parseInt(event.currentTarget.dataset.rowIndex)
      let colIndex = parseInt(event.currentTarget.dataset.colIndex)
      let nextRowIndex = rowIndex
      let nextColIndex = colIndex
      let currentDay = this.calendarData[rowIndex][colIndex]

      let correctIndexesForNewMonth = function() {
        if (this.calendarData[nextRowIndex] === undefined || this.calendarData[nextRowIndex][nextColIndex].dayNumber === undefined) {
          let nextButton = this.calendarData[nextRowIndex === 0? 0 : this.calendarData.length -1].find(
            element => nextRowIndex === 0? element.firstInRow : element.lastInRow
          )
          nextRowIndex = nextButton.rowIndex
          nextColIndex = nextButton.colIndex
        }
      }.bind(this)

      const key = event.key || event.keyCode
      switch (key) {
        case 'ArrowLeft':
        case 37: //left
          if (currentDay.firstInRow) {
            this.showPrevMonth()
            correctIndexesForNewMonth()
          } else {
            nextColIndex--
          }
          break;
        case 'ArrowRight':
        case 39: //right
          if (currentDay.lastInRow) {
            this.showNextMonth()
            correctIndexesForNewMonth()
          } else {
            nextColIndex++
          }
          break;
        case 'ArrowUp':
        case 38: //up
          if (nextRowIndex > 0
              && this.calendarData[nextRowIndex - 1][colIndex].dayNumber) {
            nextRowIndex--
          }
          break;
        case 'ArrowDown':
        case 40: //down
          if ((nextRowIndex + 1) < this.calendarData.length
              && this.calendarData[nextRowIndex + 1][colIndex].dayNumber) {
            nextRowIndex++
          }
          break;
      }

      this.focusDayButton(nextRowIndex, nextColIndex)
    },
    focusDayButton(rowIndex, colIndex) {
      this.keyboardFocusedDayButton = this.calendarData[rowIndex][colIndex].dayNumber
      setTimeout(() => {
        let btnToFocus = this.$refs.dayButton.find(
          element => parseInt(element.dataset.rowIndex) === rowIndex
                     && parseInt(element.dataset.colIndex) === colIndex
        )
        btnToFocus.focus()
      })
    },
    selectDate(day) {
      if (day.isSelectable) {
        this.internalValue = day.date
        this.$emit('input', day.date)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../../styles/shared.less';

.calendar-popup {
  border-radius: 5px;
  width: 236px;
  box-shadow: 0px 0px 2px 0px @border-color;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: white;
  z-index: 1;
  border: 1px solid @border-color;
  padding: 20px;
  &.calendar-popup--right-aligned {
    left: auto;
    right: 0;
    &:before, &:after {
      left: auto;
      right: 1.5rem;
      top: -.5rem;
      margin-right: -.5rem;
    }
  }
  &:before, &:after {
    width: 1rem;
    height: 1rem;
    position: absolute;
    transform: rotate(45deg);
    content: "";
    background-color: inherit;
    left: 1.5rem;
    top: -.5rem;
    margin-left: -.5rem;
  }
  &:after {
    box-shadow: -1px -1px 0 0 rgba(0,0,0,.16);
    z-index: -1;
  }
}
.calendar-popup__header {
  color: @black;
  position: relative;
  text-align: center;
  font-size: 1.1rem;
  padding-top: 5px;
}
.calendar-popup__month-button {
  position: absolute;
  font-size: 22px;
  line-height: 20px;
  padding: 2px 8px;
  top: 0;
  border: 1px solid @border-color;
  border-radius: 3px;
  background-color: white;
  color: @gray;
  span {
    position: relative;
    display: inline-block;
    top: -2px;
  }
  &:hover {
    background-color: @active-color;
    border-color: @active-color;
    cursor: pointer;
  }
}
.calendar-popup__month-button-prev {
  left: 0;
}
.calendar-popup__month-button-next {
  right: 0;
}
.calendar-popup__column-headers {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 20px;
}
.calendar-popup__column-header {
  color: @gray;
  font-size: 0.65rem;
  display: inline-block;
  width: 33px;
  text-align: center;
}
.calendar-popup__days-table {
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 3px;
}
.calendar-popup__day {
  font-size: 0.75rem;
  color: @black;
  width: 33px;
  height: 33px;
  box-sizing: border-box;
  width: 33px;
  margin: 0;
  height: 33px;
  padding: 0;
  text-align: center;
  &.calendar-popup__day--selectable {
    cursor: pointer;
    &:not(.calendar-popup__day--selected):hover {
      background-color: rgb(lighten(@active-color, 10%));
    }
  }
  &:not(.calendar-popup__day--dummy) {
    border: 1px solid @border-color;
  }
  &.calendar-popup__day--disabled {
    color: #dedede;
    text-decoration: line-through;
  }
  &.calendar-popup__day--selected {
    background-color: @active-color;
    border-color: @active-color;
  }
}
</style>
