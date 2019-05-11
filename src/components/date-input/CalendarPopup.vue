<template>
  <div 
    ref="container"
    class="calendar-popup"
    v-if="isCalendarOpen"
  >
    <header class="calendar-popup__header">
      <button 
        type="button"
        @click="showPrevMonth"
        @blur="handleFocusableElementBlur"
        class="calendar-popup__month-button calendar-popup__month-button-prev">&#8592;</button>
      {{ displayedMonthName }} {{ displayedYear }}
      <button 
        type="button"
        @click="showNextMonth" 
        class="calendar-popup__month-button calendar-popup__month-button-next">&#8594;</button>
    </header>

    <section>
      <ul>
        <li 
          v-for="(weekDay, weekDayIndex) in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" 
          :key="weekDayIndex"
        >
          {{ weekDay }}
        </li>
      </ul>
      <table>
        <tr v-for="(row, rowIndex) in calendarData" :key="rowIndex">
          <td
            ref="dayButton"
            v-for="(day, dayIndex) in row" 
            :key="dayIndex"
            :data-row-index="rowIndex"
            :data-col-index="dayIndex"
            class="calendar-popup__day"
            :class="{ 'calendar-popup__day--selected': internalValue && day.date && day.date.getTime() === internalValue.getTime(),
                      'calendar-popup__day--disabled': !day.isSelectable }"
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
  </div>
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
    }
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

          row.push({
            dayNumber,
            date,
            lastInRow: date.getDay() === 6 || dayNumber === numberOfDays,
            firstInRow: date.getDay() === 0 || dayNumber === 1,
            rowIndex,
            colIndex,
            isSelectable: (!this.maxDate || date <= this.maxDate) 
                          && (!this.minDate || date >= this.minDate)
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
      this.applyPopupPositioning()
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

      switch (event.keyCode) {
        case 37: //left
          if (currentDay.firstInRow) {
            this.showPrevMonth()
            correctIndexesForNewMonth()
          } else {
            nextColIndex--
          }
          break;
        case 39: //right
          if (currentDay.lastInRow) {
            this.showNextMonth()
            correctIndexesForNewMonth()
          } else {
            nextColIndex++
          }
          break;
        case 38: //up
          if (nextRowIndex > 0
              && this.calendarData[nextRowIndex - 1][colIndex].dayNumber) {
            nextRowIndex--
          }
          break;
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
    },
    applyPopupPositioning() {
      // TODO: handle directional opening & listen for scroll events & delete on destroy
    }
  }
}
</script>

<style scoped lang="less">
.calendar-popup {
  position: absolute;
  top: 100%;
  margin-top: 10px;
  .calendar-popup__header {
    position: relative;
    text-align: center;
    
    .calendar-popup__month-button {
      position: absolute;
      top: 0;
    }
    .calendar-popup__month-button-prev {
      left: 0;
    }
    .calendar-popup__month-button-next {
      right: 0;
    }
  }
  .calendar-popup__day--disabled {
    opacity: 0.5;
  }
}
</style>
