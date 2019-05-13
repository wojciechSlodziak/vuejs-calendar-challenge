import { expect } from 'chai'
import { shallowMount, createWrapper } from '@vue/test-utils'
import DateInputCalendarPopup from '@/components/date-input/DateInputCalendarPopup.vue'

describe('DateInputCalendarPopup.vue', () => {
  let cmp

  beforeEach(() => {
    cmp = shallowMount(DateInputCalendarPopup, {
      propsData: {
        value: new Date(2019, 0, 15)
      }
    })
    cmp.setProps({
      isOpen: true
    })
  })

  it('displays textual month name for given initial value', () => {
    expect(cmp.vm.displayedMonthName).to.equal('January')
  })

  it('creates calendarData for given initial value', () => {
    expect(cmp.vm.calendarData.length).to.equal(5)
    expect(cmp.vm.calendarData[0][0].dayNumber).to.equal(undefined)
    expect(cmp.vm.calendarData[0][1].dayNumber).to.equal(undefined)
    expect(cmp.vm.calendarData[0][2].dayNumber).to.equal(1)
    expect(cmp.vm.calendarData[4][6].dayNumber).to.equal(undefined)
    expect(cmp.vm.calendarData[4][5].dayNumber).to.equal(undefined)
    expect(cmp.vm.calendarData[4][4].dayNumber).to.equal(31)
  })

  it('sets focusable day button to be currently selected date', () => {
    expect(cmp.vm.focusableDayButton).to.equal(15)
  })
  
  it('displays previous month on <- button click', () => {
    cmp.find('.calendar-popup__header').find('button:first-of-type').trigger('click')
    expect(cmp.vm.displayedMonthName).to.equal('December')
  })

  it('displays next month on -> button click', () => {
    cmp.find('.calendar-popup__header').find('button:last-of-type').trigger('click')
    expect(cmp.vm.displayedMonthName).to.equal('February')
  })

  function testKeyboardInteraction(eventName, startRow, startCol, expectedDayNumber, done) {
    cmp.vm.focusDayButton(startRow, startCol)
    setTimeout(function() {
      expect(document.activeElement.className).to.contain('calendar-popup__day')
      createWrapper(document.activeElement).trigger(eventName)
      setTimeout(function() {
        expect(document.activeElement.className).to.contain('calendar-popup__day')
        if (expectedDayNumber) {
          expect(document.activeElement.innerHTML).to.contain(expectedDayNumber)
        }
        done()
      }, 1)
    }, 1)
  }

  it('focuses correct day when up arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.up', 3, 3, '16', done)
  })

  it('focuses correct day when down arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.down', 3, 3, '30', done)
  })

  it('focuses correct day when left arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.left', 3, 3, '22', done)
  })

  it('focuses correct day when right arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.right', 3, 3, '24', done)
  })

  it('changed month on left edge day keyboard interaction', done  => {
    testKeyboardInteraction('keydown.left', 3, 0, null, function() {
      expect(cmp.vm.displayedMonthName).to.equal('December')
      done()
    })
  })

  it('changed month on right edge day keyboard interaction', done  => {
    testKeyboardInteraction('keydown.right', 3, 6, null, function() {
      expect(cmp.vm.displayedMonthName).to.equal('February')
      done()
    })
  })

  it('updates internalValue and doesn\'t call input event on outer props change', ()  => {
    let testDate = new Date(2019, 5, 13)
    cmp.setProps({
      value: testDate
    })
    expect(cmp.vm.internalValue.getTime()).to.be.equal(testDate.getTime())
    expect(cmp.emitted().input).to.be.undefined
  })
  
  it('selects date on enter', done  => {
    cmp.vm.focusDayButton(3, 3)
    setTimeout(function() {
      expect(cmp.emitted().input).to.be.undefined
      createWrapper(document.activeElement).trigger('keyup.enter')
      expect(cmp.vm.internalValue.getDate()).to.equal(23)
      expect(cmp.vm.internalValue.getMonth()).to.equal(0)
      expect(cmp.vm.internalValue.getFullYear()).to.equal(2019)
      expect(cmp.emitted().input).to.not.be.undefined
      done()
    }, 1)
  })

  it('selects date on click', ()  => {
    expect(cmp.emitted().input).to.be.undefined
    cmp.find('[data-row-index="3"][data-col-index="3"]').trigger('click')
    expect(cmp.vm.internalValue.getDate()).to.equal(23)
    expect(cmp.vm.internalValue.getMonth()).to.equal(0)
    expect(cmp.vm.internalValue.getFullYear()).to.equal(2019)
    expect(cmp.emitted().input).to.not.be.undefined
  })

})
