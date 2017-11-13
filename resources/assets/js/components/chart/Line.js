
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default Line.extend({
  mixins: [reactiveProp],
  props: ['options', 'dataOriginal'],
  watch: {
    dataOriginal() {
      this.renderChart(this.chartData, this.options);
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
    //console.log('grafico:', this._chart);
    this._chart.update()

  },
  beforeDestroy() {
    if (this._chart) {
      this._chart.destroy()
    }
  }
})

