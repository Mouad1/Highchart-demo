import { Component,OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HighchartService } from '../highchart.service';
let Highcharts = require('highcharts');  
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

export enum DatePickerType{
  Debut = '000000',
  Fin='235959'
}
export enum YearPickerType{
  Debut = '0101000000',
  Fin='1231235959'
}

@Component({
  selector: 'chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.scss'],
})
export class Chart1Component implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  chart2: any;
  options2: any;
  dataConso$: any;
  consoChartInput: any;

  constructor(private chartService: HighchartService) {}

  ngOnInit(): void {
    this.initChart2();
    this.getConsoData().subscribe((consoData) => {
      this.consoChartInput = this.merge2ArraysInto_2DArray(
        consoData[0],
        consoData[1]
      );
      this.updateChart2(this.consoChartInput, 'updated chart');
    });
  }

  getConsoData() {
    let apiDateArray: Array<any> = [];
    let apiValueArray: Array<number> = [];
    return this.chartService.getConsoData().pipe(
      map((res) => {
        apiValueArray = res['valeur'];
        res['mois'].forEach((_date: Date) => {
          apiDateArray.push(this.convertDateToApiFormat(new Date(_date)));
        });
        return [apiDateArray, apiValueArray];
      })
    );
  }

  initChart2() {
    this.options2 = {
      chart: {
        renderTo: 'chart2',
        type: 'spline',
        zoomType: 'xy',
      },
      xAxis: [
        {
          categories: [
            'Jan',
            'Fev',
            'Mar',
            'Avr',
            'Mai',
            'Juin',
            'Juil',
            'Août',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          crosshair: true,
          visible: true,
        },
      ],
      yAxis: [
        {
          // yAxis principal
          labels: {
            format: '{value} °C',
          },
          title: {
            text: 'Ecart Temperature',
          },
          min: -20,
          max: 20,
        },
        {
          // yAxis secondaire
          title: {
            text: ' CC Acheminement',
          },
          labels: {
            format: '{value} TWh',
          },
          opposite: true,
          min: -5,
          max: 5,
        },
      ],
      tooltip: {
        shared: true,
      },
      legend: {
        layout: 'horizontal',
        floating: false,
        align: 'center',
      },
      series: [
        {
          name: 'init name',
          data: [],
        },
      ],
    };
    this.chart2 = new Highcharts.Chart(this.options2);
  }

  addSerie(
    chart2bUpdated: any,
    chartId: string,
    chartOptions: any,
    data: any[],
    _seriename?: string
  ) {
    chartOptions.series.push({
      name: _seriename,
      data: data,
    });

    chart2bUpdated = this.Highcharts.chart(chartId, chartOptions);
  }

  updateChart2(_data: any, courbeName: string) {
    this.options2.series = [
      {
        name: courbeName,
        data: _data,
      },
    ];
    this.chart2 = this.Highcharts.chart('chart2', this.options2);
  }

  merge2ArraysInto_2DArray(array1: Array<any>, array2: Array<any>) {
    let multidimensional = [];
    if (array1.length == array2.length) {
      console.log('array1.length =', array1.length);
      for (let index = 0; index < array1.length; index++) {
        multidimensional[index] = [array1[index], array2[index]];
      }
      return multidimensional;
    } else {
      alert('Taille differente des tableaux !');
      return [];
    }
  }

  convertDateToApiFormat(date: Date, type_date?: string) {
    let y = date.getFullYear();
    let m = (date.getMonth() + 1).toString().padStart(2, '0');
    let d = date.getDate().toString().padStart(2, '0');

    if (type_date == DatePickerType.Fin) {
      return y + '' + m + '' + d + '' + DatePickerType.Fin;
    } else {
      return y + '' + m + '' + d + '' + DatePickerType.Debut;
    }
  }
}
