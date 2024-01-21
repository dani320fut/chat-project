<script lang="ts">
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartItem
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

type ChartDataType = {
    chart?: any
    chartData: number[]
    chartLabels: number[] | string[]
    errorLoad: boolean
}

export default {
    name: 'Chart',
    components: { Line },
    props: ['labels', 'newChartData'],
    data() {
        return {
            chart: null,
            chartData: [],
            chartLabels: [],
            errorLoad: false
        } as ChartDataType
    },

    watch: {
        $props: {
            async handler(props) {
                const { labels, newChartData } = props

                this.chartLabels = labels
                this.chartData = newChartData

                this.initLineChart()
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        ChartJS.register(Filler)
        this.resizeChart()
    },
    methods: {
        resizeChart() {
            let timeout: number | undefined

            window.addEventListener('resize', () => {
                clearTimeout(timeout)

                timeout = setTimeout(() => {
                    this.initLineChart()
                }, 400)
            })
        },
        async initLineChart() {
            if (this.chart) {
                await this.chart.destroy()
            }
            const ctx = document.getElementById('line-chart')

            if (!ctx) return null

            const data = {
                labels: this.labels,
                datasets: [
                    {
                        data: this.chartData,
                        fill: true,
                        segment: {
                            borderColor: 'rgb(0, 172, 234)',

                            backgroundColor: function (context: any) {
                                const chart = context.chart
                                const { ctx, chartArea } = chart

                                if (!chartArea) {
                                    return
                                }
                                function getGradientNew(
                                    ctx: CanvasRenderingContext2D
                                ) {
                                    const gradientFill =
                                        ctx.createLinearGradient(0, 250, 0, 0)
                                    gradientFill.addColorStop(
                                        0,
                                        'rgba(97,97,125,0)'
                                    )
                                    gradientFill.addColorStop(
                                        1,
                                        'rgba(0,212,255,0.5970763305322129)'
                                    )

                                    return gradientFill
                                }

                                return getGradientNew(ctx)
                            }
                        },
                        pointStyle: false,
                        animations: false,
                        tension: 0.2
                    }
                ]
            }

            const options = {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 3
                        }
                    }
                }
            }

            try {
                this.chart = new ChartJS(ctx as ChartItem, {
                    type: 'line',
                    data: data as any,
                    options: options
                })
            } catch (err) {
                this.errorLoad = true
            }
        }
    }
}
</script>

<template>
    <div class="root">
        <canvas v-if="!errorLoad" id="line-chart" />
        <div class="error" v-else>Não foi possivel carregar o gráfico</div>
    </div>
</template>

<style scoped>
.root {
    width: 100%;
    height: 100%;
}
.error {
    color: brown;
    font-weight: 550;
    font-weight: 20px;
    margin: 30px 0 30px 0;
}
</style>
