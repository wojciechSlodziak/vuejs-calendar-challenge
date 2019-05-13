import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import DateRangeInput from '@/components/DateRangeInput.vue'
import DateInput from '@/components/date-input/DateInput.vue'

describe('DateRangeInput.vue', () => {
  let cmp

  beforeEach(() => {
    cmp = mount(DateRangeInput, {
      propsData: {
        value: {
          fromDate: new Date(2019, 0, 15),
          toDate: null
        }
      }
    })
  })

  it('updates internalValue and doesn\'t call input event on outer props change', ()  => {
    let testDate = new Date(2019, 3, 24)
    cmp.setProps({
      value: {
        ...cmp.props().value,
        toDate: testDate
      }
    })
    expect(cmp.vm.internalToDate.getTime()).to.be.equal(testDate.getTime())
    expect(cmp.emitted().input).to.be.undefined
  })

  it('updates internal value on from date change and focuses second input', done  => {
    let testDate = new Date(2020, 4, 13)
    cmp.findAll(DateInput).at(0).vm.$emit('input', testDate)
    expect(cmp.vm.internalFromDate.getTime()).to.be.equal(testDate.getTime())
    expect(cmp.emitted().input).to.not.be.undefined
    setTimeout(function() {
      expect(cmp.findAll('input').at(1).element).to.equal(document.activeElement)
      done()
    })
  })

  it('correctly calculates min and max dates', ()  => {
    cmp.setProps({
      minDate: new Date(2019, 10, 15),
      maxDate: new Date(2019, 10, 25)
    })
    expect(cmp.vm.fromInputMaxDate.getDate()).to.equal(24)
    expect(cmp.vm.toInputMinDate.getDate()).to.equal(16)
  })
})
