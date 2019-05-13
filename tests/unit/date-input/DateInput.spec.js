import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import DateInput from '@/components/date-input/DateInput.vue'
import DateInputCalendarPopup from '@/components/date-input/DateInputCalendarPopup.vue'

describe('DateInput.vue', () => {
  let cmp

  beforeEach(() => {
    cmp = shallowMount(DateInput, {
      propsData: {
        value: new Date(2019, 0, 15)
      }
    })
  })

  it('opens calendar popup on input focus', () => {
    expect(cmp.vm.isPopupOpen).to.be.false
    cmp.find('input').trigger('click')
    expect(cmp.vm.isPopupOpen).to.be.true
  })

  it('opens calendar popup on input click', () => {
    expect(cmp.vm.isPopupOpen).to.be.false
    cmp.find('input').trigger('focus')
    expect(cmp.vm.isPopupOpen).to.be.true
  })

  it('updates internalValue and doesn\'t call input event on outer props change', ()  => {
    let testDate = new Date(2019, 3, 24)
    cmp.setProps({
      value: testDate
    })
    expect(cmp.vm.internalValue.getTime()).to.be.equal(testDate.getTime())
    expect(cmp.emitted().input).to.be.undefined
  })

  it('clears value when minValue is past current value', ()  => {
    cmp.setProps({
      minDate: new Date(2019, 1, 15)
    })
    expect(cmp.vm.internalValue).to.be.null
    expect(cmp.emitted().input).to.not.be.undefined
  })

  it('clears value when maxValue is before current value', ()  => {
    cmp.setProps({
      maxDate: new Date(2019, 0, 14)
    })
    expect(cmp.vm.internalValue).to.be.null
    expect(cmp.emitted().input).to.not.be.undefined
  })

  it('sets input element value to the date in textual format', ()  => {
    expect(cmp.find('input').element.value).to.equal('2019-01-15')
  })

  it('emits input on calendar input event and focuses input element', ()  => {
    let testDate = new Date(2019, 4, 18)
    cmp.find(DateInputCalendarPopup).vm.$emit('input', testDate)
    expect(cmp.emitted().input).to.not.be.undefined
    expect(cmp.vm.internalValue.getTime()).to.equal(testDate.getTime())
    expect(cmp.find('input').element).to.equal(document.activeElement)
  })
})
