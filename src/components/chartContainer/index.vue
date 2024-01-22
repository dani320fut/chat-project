<script setup lang="ts">
import Menu from './menu/index.vue'
import Chart from './Chart.vue'
import data from '../../services/data.json'
import { parseISO, isEqual } from 'date-fns'
import { LabelType } from '../../constants'
</script>

<script lang="ts">
type DataChartArray = {
    userId: string
    dateAccessed: string
    timeAccessed: string
    url: string
    timeSpent: number
}

type Data = {
    labels: number[] | string[]
    chartData: number[]
    newActiveButton: string
    newSelected: string
    labelType: string
}

export default {
    data() {
        return {
            labels: [],
            chartData: [],
            newActiveButton: LabelType.YEAR,
            newSelected: 'Todos',
            labelType: 'Mês'
        } as Data
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            let filteredData: DataChartArray[] = data

            if (this.newSelected !== 'Todos')
                filteredData = data.filter((item) =>
                    item.url.includes(this.newSelected.toLowerCase())
                )

            const lastDate = this.getLastDate(filteredData)

            if (this.newActiveButton === LabelType.TODAY) {
                this.mountDayArray(filteredData, lastDate)
            } else if (this.newActiveButton === LabelType.WEEK) {
                this.getLastWeekendData(filteredData, lastDate)
            } else if (this.newActiveButton === LabelType.MONTH) {
                this.getLastMonthData(filteredData, lastDate)
            } else if (this.newActiveButton === LabelType.YEAR) {
                this.mountYearArray(filteredData, lastDate)
            }
        },
        getLastDate(filteredData: DataChartArray[]) {
            return filteredData?.reduce((maxDateItem, currentItem) => {
                const maxDate = parseISO(maxDateItem.dateAccessed)
                const currentDate = parseISO(currentItem.dateAccessed)

                return currentDate > maxDate ? currentItem : maxDateItem
            }, filteredData[0])
        },
        mountYearArray(data: DataChartArray[], lastDate: DataChartArray) {
            const labels: string[] = []
            const dataValues: number[] = []

            for (let i = 11; i >= 0; i--) {
                const date = new Date(lastDate.dateAccessed)
                date.setMonth(date.getMonth() - i)

                labels.push(
                    new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
                        date
                    )
                )

                const filteredData = data.filter((entry) => {
                    const entryDate = new Date(entry.dateAccessed)
                    return (
                        entryDate.getMonth() === date.getMonth() &&
                        entryDate.getFullYear() === date.getFullYear()
                    )
                })

                const minutesAvarage = this.calculateAvarage(filteredData)

                dataValues.push(minutesAvarage)
            }

            this.labels = labels
            this.chartData = dataValues
            this.labelType = 'Mês'
        },
        getLastMonthData(data: DataChartArray[], lastDate: DataChartArray) {
            const labels: number[] = []
            const dataValues: number[] = []

            for (let i = 30; i >= 0; i--) {
                const date = new Date(lastDate.dateAccessed)
                date.setDate(date.getDate() - i)

                labels.push(date.getDate())

                const filteredData = data.filter((entry) => {
                    const entryDate = new Date(entry.dateAccessed)
                    return (
                        entryDate.getDate() === date.getDate() &&
                        entryDate.getMonth() === date.getMonth() &&
                        entryDate.getFullYear() === date.getFullYear()
                    )
                })

                const minutesAvarage = this.calculateAvarage(filteredData)

                dataValues.push(minutesAvarage)
            }

            this.labels = labels
            this.chartData = dataValues
            this.labelType = 'Dias'
        },
        getLastWeekendData(data: DataChartArray[], lastDate: DataChartArray) {
            const labels: number[] = []
            const dataValues: number[] = []

            for (let i = 7; i >= 0; i--) {
                const date = new Date(lastDate.dateAccessed)
                date.setDate(date.getDate() - i)

                labels.push(date.getDate())

                const filteredData = data.filter((entry) => {
                    const entryDate = new Date(entry.dateAccessed)
                    return (
                        entryDate.getDate() === date.getDate() &&
                        entryDate.getMonth() === date.getMonth() &&
                        entryDate.getFullYear() === date.getFullYear()
                    )
                })

                const minutesAvarage = this.calculateAvarage(filteredData)

                dataValues.push(minutesAvarage)
            }

            this.labels = labels
            this.chartData = dataValues
            this.labelType = 'Dias'
        },
        mountDayArray(
            filteredData: DataChartArray[],
            lastDate: DataChartArray
        ) {
            const filteByDay = filteredData?.filter((data) => {
                const date = parseISO(data.dateAccessed)
                return isEqual(date, parseISO(lastDate.dateAccessed))
            })
            const labels: number[] = []
            const dataValues: number[] = []

            for (let i = 0; i < 24; i++) {
                labels.push(i + 1)

                const filteredData = filteByDay.filter((entry) => {
                    return (
                        new Date(
                            entry.dateAccessed + ':' + entry.timeAccessed
                        ).getHours() === i
                    )
                })

                const minutesAvarage = this.calculateAvarage(filteredData)

                dataValues.push(minutesAvarage)
            }

            this.labels = labels
            this.chartData = dataValues
            this.labelType = 'Horas'
        },
        calculateAvarage(filteredData: DataChartArray[]) {
            let media = 0

            filteredData?.forEach((entry) => {
                media += entry.timeSpent
            })
            const secondsAvarage = media / filteredData.length
            const minutesAvarage = secondsAvarage / 60

            return !isNaN(minutesAvarage)
                ? Number(minutesAvarage?.toFixed(2))
                : 0
        },
        changeSelect(value: string) {
            this.newSelected = value
            this.fetchData()
        },
        changeButton(value: string) {
            this.newActiveButton = value
            this.fetchData()
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="header">
            <a class="title">Tempo médio de acesso</a>
            <Menu
                @change-select="changeSelect"
                @change-button="changeButton"
                :newActiveButton="newActiveButton"
                :newSelected="newSelected"
            />
        </div>
        <Chart :labels="labels" :newChartData="chartData" />
        <a class="labelType">{{ labelType }}</a>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid rgb(216, 216, 216);
    padding: 30px;
    border-radius: 10px;
}
.header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.title {
    font-size: 20px;
    color: rgb(112, 111, 111);
}
.labelType {
    font-size: 14px;
    color: rgb(112, 111, 111);
}
@media (min-width: 850px) {
    .container {
        min-width: 750px;
    }
}
@media (min-width: 400px) AND (max-width: 850px) {
    .container {
        padding: 14px;
    }
    .title {
        font-size: 14px;
        margin-bottom: 5px;
    }
}

@media (max-width: 400px) {
    .container {
        border: none;
        gap: 30px;
    }
    .header {
        gap: 5px;
        justify-content: center;
    }
    .title {
        font-size: 22px;
        margin-bottom: 5px;
    }
}
</style>
