import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import StarRating from '@/components/StarRating.vue'


describe('StarRating.vue', () => {

  it('sets percentage width style based on rating', ()  => {
    let cmp = shallowMount(StarRating, {
      propsData: {
        rating: 3.5
      }
    })
    expect(cmp.find('.star-rating__positive').element.getAttribute('style')).to.contain('width: 70%')
  })

})
