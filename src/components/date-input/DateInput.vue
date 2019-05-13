<template>
  <div class="date-input" ref="container">
    <input 
      ref="input"
      type="text"
      class="date-input__input"
      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
      readonly
      v-bind="$attrs"
      v-model="valueTextRepresentation"
      @change="onChange($event)"
      @input="onInput($event)"
      @click="openCalendarPopup"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @keyup.enter="openCalendarPopup"
    />
    <DateInputCalendarPopup
      ref="calendar"
      @mousedown.native.prevent
      :is-open="isPopupOpen"
      v-model="calendarPopupValue"
      @input="handleCalendarPopupInput"
      @blur="handleCalendarBlur"
      :min-date="minDate"
      :max-date="maxDate"
      :right-aligned="rightAligned"
    >
      <template v-slot:footer>
        <slot name="calendar-footer"></slot>
      </template>
    </DateInputCalendarPopup>
  </div>
</template>

<script>
import DateInputCalendarPopup from './DateInputCalendarPopup.vue'
import { dateToString } from '../../utils/date-utils.js'

export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Date,
      default: null
    },
    minDate: Date,
    maxDate: Date,
    rightAligned: Boolean
  },
  data() {
    const initialValue = this.value
    return {
      isPopupOpen: false,
      internalValue: initialValue,
      valueTextRepresentation: dateToString(initialValue),
      calendarPopupValue: initialValue,
      ignoreNextFocus: false
    }
  },
  watch: {
    value: function(newVal) {
      this.internalValue = newVal
    },
    internalValue: function(newVal) {
      this.valueTextRepresentation = dateToString(newVal)
      this.calendarPopupValue = newVal
    },
    minDate: function(newVal) {
      if (newVal && this.internalValue && this.internalValue < newVal) {
        this.internalValue = null
        this.$emit('input', null)
      }
    },
    maxDate: function(newVal) {
      if (newVal && this.internalValue && this.internalValue > newVal) {
        this.internalValue = null
        this.$emit('input', null)
      }
    }
  },
  methods: {
    openCalendarPopup() {
      if (!this.isPopupOpen) {
        document.addEventListener('click', this.outsideClickEventHandler, true)
        this.isPopupOpen = true
      }
    },
    closeCalendarPopup() {
      if (this.isPopupOpen) {
        document.removeEventListener('click', this.outsideClickEventHandler, true)
        this.isPopupOpen = false
      }
    },
    outsideClickEventHandler(event) {
      if (!this.$refs.container.contains(event.target)) {
        this.closeCalendarPopup()
      }
    },
    handleCalendarBlur() {
      if (this.$refs.input !== document.activeElement) {
        this.closeCalendarPopup()
      }
    },
    handleInputFocus() {
      if (!this.ignoreNextFocus) {
        this.openCalendarPopup()
      }
    },
    handleInputBlur() {
      setTimeout(() => {
        if (this.$refs.calendar && !this.$refs.calendar.$el.contains(document.activeElement)) {
          this.closeCalendarPopup()
        }
      })
    },
    handleCalendarPopupInput(date) {
      this.closeCalendarPopup()
      this.internalValue = date
      this.$emit('input', date)

      this.ignoreNextFocus = true
      this.focusInput()
      setTimeout(function() {
        this.ignoreNextFocus = false
      }.bind(this));
    },
    focusInput() {
      this.$refs.input.focus()
    }
  },
  destroyed() {
    if (this.isPopupOpen) {
      document.removeEventListener('click', this.outsideClickEventHandler, true)
    }
  },
  components: {
    DateInputCalendarPopup
  }
}
</script>

<style scoped lang="less">
@import '../../styles/shared.less';

.date-input {
  position: relative;
  display: inline-block;
  width: 100%;
}
.date-input__input {
  color: rgb(darken(@active-color, 45%));
  padding: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid @border-color;
  border-radius: 3px;
  &:focus {
    outline: none;
    background-color: rgb(@active-color);
    &::placeholder {
      color: rgb(darken(@active-color, 45%));
    }
  }
}
</style>
