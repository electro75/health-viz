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
  public dayCollection: any = {}
  public months: string[] = [
    "Jan", 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  public chartLoaded: boolean = false;

  constructor(private http: HttpClient) {
    
  }

  public dataObj: any = {}
  ngOnInit() {
    this.http.get('assets/daily-step.csv', {responseType: 'text'}).subscribe(
      data => {
        let csvToRowArray = data.split("\n");
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(",");
          this.dataObj[row[4]] = {
            // god i'm so good at coding
            step: row[0],
            speed: row[1],
            distance: row[2],
            calorie: row[3]
          }
          let day = new Date(+row[4]).getDay()

          if(this.dayCollection[day]) {
            this.dayCollection[day].push({steps: row[0], month: this.months[new Date(+row[4]).getMonth()]})
          } else {
            this.dayCollection[day] = [];
            this.dayCollection[day].push({steps: row[0], month: this.months[new Date(+row[4]).getMonth()]})
          }
        }

        Object.keys(this.dayCollection).forEach(k => {
          if(this.dayCollection[k].length < 78) {
            let diff = 78 - this.dayCollection[k].length
            console.log(diff)

            for(let i = 0; i < diff; i++) {
              this.dayCollection[k].push({
                steps: 0,
                month: this.months[11]
              })
            }
          }
          
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
          },
          title: {
            text: "Step Count"
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
