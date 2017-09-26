<template>
    <div class="q-card bg-white">
        <div class="q-card-title bg-teal text-white">
            {{cardTitle}}
        </div>
        <div class="q-card-content">
            <canvas ref="chart"></canvas>


                                        
        </div>
    </div>
</template>
<script type="text/javascript">
/* eslint-disable */

import Chart from 'chart.js'
export default {
    data() {
        return {
            type: 'doughnut',
            chart: '',
        }
    },
    props: {
        data: {
        },
        cardTitle: {
            default() { return 'Graph' }
        }
    },
    watch: {
        data() {
            this.startChart()
        },
        type() {
            this.chart.destroy()
            this.startChart()
        }
    },
    computed: {
        dataForChart() {
            return {
                labels: ["Red", "Blue", "Yellow"],
                datasets: [{
                    data: this.data,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            }
        }
    },
    methods: {
        startChart() {
            let axesStartFromZero = [{
                ticks: {
                    beginAtZero: true
                }
            }]
            this.chart = new Chart(this.$refs.chart,
                {
                    type: this.type,
                    data: this.dataForChart,
                    options: {
                        legend: {
                            display: false
                        },
                        scales: {
                            yAxes: axesStartFromZero,
                            xAxes: axesStartFromZero
                        }
                    }
                })
        }
    }
}
</script>
