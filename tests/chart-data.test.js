import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Chart from '../src/components/chartContainer/Chart.vue'

test('Should instantiate chart', () => {
    const wrapper = mount(Chart, {
        propsData: {
            labels: ['jan', 'fev', 'mar', 'abril'],
            newChartData: [1, 2, 3, 4]
        }
    })

    expect(wrapper.vm).toBeDefined()
})
