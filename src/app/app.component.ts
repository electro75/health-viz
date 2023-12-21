import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ChartComponent
} from "ng-apexcharts";

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   title: ApexTitleSubtitle;
//   plotOptions: ApexPlotOptions;
// };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'health-viz';
  @ViewChild("chart") chart: any;
  public chartOptions: any;
  public barChartOptions: any;
  public dayCollection: any = {}
  public monthCollection: any = {}
  public monthAgg: any = {}
  public months: string[] = [
    "Jan", 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  public stepArr : number[] = []
  public distanceArr: number[] = []
  public calorieArr: number[] = []
  public monthAggArr: string[] = []
  public chartLoaded: boolean = false;

  constructor(private http: HttpClient) {
    
  }

  updateDisplay() {
    this.chart.updateOptions({
      series: [
        {
          name: "Sun",
          data: this.dayCollection[0].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        },
        {
          name: "Mon",
          data: this.dayCollection[1].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        },
        {
          name: "Tue",
          data: this.dayCollection[2].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        },
        {
          name: "Wed",
          data: this.dayCollection[3].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        },
        {
          name: "Thu",
          data: this.dayCollection[4].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        },
        {
          name: "Fri",
          data: this.dayCollection[5].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        },
        {
          name: "Sat",
          data: this.dayCollection[6].map((obj: any) => {
            return {
              x: obj.month,
              y: obj[this.displayType]
            }
          })
        }
      ]
    }, true)

    if(this.displayType === 'calorie') {
      this.chart.updateOptions({
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 50,
                  name: "low",
                  color: "#00A100"
                },
                {
                  from: 51,
                  to: 100,
                  name: "medium",
                  color: "#128FD9"
                },
                {
                  from:101,
                  to: 250,
                  name: "high",
                  color: "#FFB200"
                },
                {
                  from: 251,
                  to: 500,
                  name: "extreme",
                  color: "#FF0000"
                }
              ]
            }
          }
        }
      },true)
    } else {
      this.chart.updateOptions({
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 1500,
                  name: "low",
                  color: "#00A100"
                },
                {
                  from: 1501,
                  to: 3000,
                  name: "medium",
                  color: "#128FD9"
                },
                {
                  from:3001,
                  to: 8000,
                  name: "high",
                  color: "#FFB200"
                },
                {
                  from: 8001,
                  to: 20000,
                  name: "extreme",
                  color: "#FF0000"
                }
              ]
            }
          }
        }
      }, true)
    }
  }

  public displayType = 'step'

  public dataObj: any = {}
  ngOnInit() {
    this.http.get('assets/daily-step.csv', {responseType: 'text'}).subscribe(
      data => {
        let csvToRowArray = data.split("\n");
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(",");
          this.dataObj[row[4]] = {
            step: row[0],
            speed: row[1],
            distance: row[2],
            calorie: row[3]
          }
        }

        Object.keys(this.dataObj).forEach(k => {
          let day = new Date(+k).getDay()
          if(this.dayCollection[day]) {
            this.dayCollection[day].push({steps: this.dataObj[k].step, month: this.months[new Date(+k).getMonth()], distance: this.dataObj[k].distance, calorie: this.dataObj[k].calorie})
          } else {
            this.dayCollection[day] = [];
            this.dayCollection[day].push({steps: this.dataObj[k].step, month: this.months[new Date(+k).getMonth()], distance: this.dataObj[k].distance, calorie: this.dataObj[k].calorie})
          }

          let month = new Date(+k).getMonth()
          if(this.monthCollection[month]) {
            this.monthCollection[month].push({
              step: this.dataObj[k].step,
              speed: this.dataObj[k].speed,
              distance: this.dataObj[k].distance,
              calorie: this.dataObj[k].calorie
            })
          } else {
            this.monthCollection[month] = []
            this.monthCollection[month].push({
              step: this.dataObj[k].step,
              speed: this.dataObj[k].speed,
              distance: this.dataObj[k].distance,
              calorie: this.dataObj[k].calorie
            })
          }
        })

        Object.keys(this.monthCollection).forEach((m: any) => {
          let aggObj = {
            step: 0,
            distance: 0,
            calorie: 0
          }
          this.monthCollection[m].forEach((mObj: any) => {
            aggObj.step += +mObj.step
            aggObj.distance += +mObj.distance
            aggObj.calorie += +mObj.calorie
          })

          this.stepArr.push(aggObj.step)
          this.distanceArr.push(aggObj.distance)
          this.calorieArr.push(aggObj.calorie)
          this.monthAggArr.push(this.months[m])
          this.monthAgg[this.months[m]] = aggObj
        })

        this.chartOptions = {
          series: [
            {
              name: "Sun",
              data: this.dayCollection[0].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            },
            {
              name: "Mon",
              data: this.dayCollection[1].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            },
            {
              name: "Tue",
              data: this.dayCollection[2].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            },
            {
              name: "Wed",
              data: this.dayCollection[3].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            },
            {
              name: "Thu",
              data: this.dayCollection[4].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            },
            {
              name: "Fri",
              data: this.dayCollection[5].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            },
            {
              name: "Sat",
              data: this.dayCollection[6].map((obj: any) => {
                return {
                  x: obj.month,
                  y: obj.steps
                }
              })
            }
          ],
          chart: {
            height: 300,
            width: 1250,
            type: "heatmap"
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              colorScale: {
                ranges: [
                  {
                    from: 0,
                    to: 1500,
                    name: "low",
                    color: "#00A100"
                  },
                  {
                    from: 1501,
                    to: 3000,
                    name: "medium",
                    color: "#128FD9"
                  },
                  {
                    from:3001,
                    to: 8000,
                    name: "high",
                    color: "#FFB200"
                  },
                  {
                    from: 8001,
                    to: 20000,
                    name: "extreme",
                    color: "#FF0000"
                  }
                ]
              }
            }
          },
          dataLabels: {
            enabled: false
          }
        };

        this.barChartOptions = {
          series: [
            {
              name: "Steps",
              data: this.stepArr
            },
            {
              name: "Distance",
              data: this.distanceArr
            },
            // {
            //   name: "Calories",
            //   data: this.calorieArr
            // }
          ],
          chart: {
            type: "bar",
            height: 430,
            width: 1050
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: "top"
              }
            }
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: "12px",
              colors: ["#fff"]
            }
          },
          stroke: {
            show: true,
            width: 1,
            colors: ["#fff"]
          },
          xaxis: {
            categories: this.monthAggArr
          }
        };

        this.chartLoaded = true
    },
    error => {
        console.log(error);
    }
    )            
  }
}
