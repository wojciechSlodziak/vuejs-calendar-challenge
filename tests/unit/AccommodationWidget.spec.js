import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import AccommodationWidget from '@/components/AccommodationWidget.vue'


describe('AccommodationWidget.vue', () => {

  it('correctly sets earliest accommodation date', ()  => {
    let earliestAccommodationDate = new Date()
    earliestAccommodationDate.setDate(earliestAccommodationDate.getDate() - 5)

    let cmp = shallowMount(AccommodationWidget, {
      propsData: {
        pricePerNight: 20,
        ppnCurrencyRepresentation: 'USD',
        rating: 4.5,
        numberOfVotes: 123,
        daysFromLastUpdate: 12,
        earliestAccommodationDate
      }
    })
    
    expect(cmp.vm.earliestAccommodationDatePastToday > earliestAccommodationDate).to.be.true
  })

})
