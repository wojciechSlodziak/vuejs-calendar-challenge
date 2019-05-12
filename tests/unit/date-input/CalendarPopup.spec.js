import { expect } from 'chai'
import { shallowMount, createWrapper } from '@vue/test-utils'
import CalendarPopup from '@/components/date-input/CalendarPopup.vue'

describe('CalendarPopup.vue', () => {
  let cmp

  beforeEach(() => {
    cmp = shallowMount(CalendarPopup, {
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

  function testKeyboardInteraction(eventName, expectedDayNumber, done) {
    cmp.vm.focusDayButton(3, 3)
    setTimeout(function() {
      expect(document.activeElement.className).to.contain('calendar-popup__day')
      expect(document.activeElement.innerHTML).to.contain('23')
      createWrapper(document.activeElement).trigger(eventName)
      setTimeout(function() {
        expect(document.activeElement.className).to.contain('calendar-popup__day')
        expect(document.activeElement.innerHTML).to.contain(expectedDayNumber)
        done()
      }, 1)
    }, 1)
  }

  it('focuses correct day when up arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.up', '16', done)
  })

  it('focuses correct day when down arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.down', '30', done)
  })

  it('focuses correct day when left arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.left', '22', done)
  })

  it('focuses correct day when right arrow key is pressed', done  => {
    testKeyboardInteraction('keydown.right', '24', done)
  })

  it('selects date on enter', done  => {
    cmp.vm.focusDayButton(3, 3)
    setTimeout(function() {
      createWrapper(document.activeElement).trigger('keyup.enter')
      expect(cmp.vm.internalValue.getDate()).to.equal(23)
      expect(cmp.vm.internalValue.getMonth()).to.equal(0)
      expect(cmp.vm.internalValue.getFullYear()).to.equal(2019)
      done()
    }, 1)
  })

  it('selects date on click', ()  => {
    cmp.find('[data-row-index="3"][data-col-index="3"]').trigger('click')
    expect(cmp.vm.internalValue.getDate()).to.equal(23)
    expect(cmp.vm.internalValue.getMonth()).to.equal(0)
    expect(cmp.vm.internalValue.getFullYear()).to.equal(2019)
  })
})
