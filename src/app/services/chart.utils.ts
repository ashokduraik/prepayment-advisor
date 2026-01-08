import { DateUtils } from './date.utils';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';

export class ChartUtils {
  static getPieChartOptions(currencyPipe, title, data): Highcharts.Options {
    data.forEach(e => {
      e.amount = currencyPipe.transform(e.amount, 'noDecimal');
    })
    return {
      chart: {
        plotBackgroundColor: '',
        plotBorderWidth: 0,
        plotShadow: false,
        type: 'pie',
        width: 180,
        height: 180,
        marginTop: 28,
        marginLeft: -5,
      },
      title: {
        text: title,
        align: 'center',
        style: {
          fontSize: '12px',
        }
      },
      tooltip: {
        pointFormat: '<b>{point.amount}</b> ({point.percentage:.1f}%)'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          // colors,
          borderRadius: 7,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
            distance: -15,
          }
        }
      },
      series: [{
        name: 'Percentage',
        type: 'pie',
        data
      }]
    }
  }

  static getPaymentHistoryChart(currencyPipe, instalments): Highcharts.Options {
    let ymax = 0;
    let categories: any = null;
    const interestPaid: any = [];
    const principalPaid: any = [];
    const interestRate: any = [];
    const drilldown: any = {
      series: [],
      breadcrumbs: {
        formatter: function (level) {
          return `Back`;
        },
        buttonTheme: {
          padding: 8,
          stroke: '#cccccc',
          'stroke-width': 1
        },
        floating: true,
        position: {
          align: 'right'
        },
        showFullPath: false
      },
      activeDataLabelStyle: {
        textDecoration: 'none',
        // fontStyle: 'italic'
        color: '#000',
      },
      activeAxisLabelStyle: {
        fontSize: '10px',
      }
    };
    const lessCate = instalments.length <= 5;
    let zooming: any = { type: 'x', singleTouch: true };
    if (lessCate) zooming.type = false;


    instalments.forEach(emi => {
      const date = new Date(emi.emiDate).getTime();
      const pPaid = emi.principalPaid + (emi.prepaymentTotal || 0);
      ymax = Math.max(ymax, emi.interestPaid + pPaid);

      if (lessCate) {
        const name = DateUtils.formatMonthYear(date);
        let dd = emi.drilldowns && emi.drilldowns.length;

        interestPaid.push({
          name,
          y: emi.interestPaid,
          drilldown: dd ? 'i' + name : false,
        });
        principalPaid.push({
          name,
          y: pPaid,
          drilldown: dd ? 'p' + name : false,
        });
        emi.interestRate && interestRate.push({ name, y: emi.interestRate, drilldown: false });

        if (dd) {
          const interest: any = [];
          const principal: any = [];
          emi.drilldowns.forEach(d => {
            interest.push([d.name, d.interestPaid]);
            principal.push([d.name, d.principalPaid]);
          });

          drilldown.series.push({
            id: 'i' + name,
            data: interest,
            name: 'Interest',
            color: '#eb445a',
            yAxis: 0,
            pointPadding: 0.3,
            pointPlacement: -0.2,
          }, {
            id: 'p' + name,
            data: principal,
            name: 'Principal',
            color: '#1b6534',
            yAxis: 0,
            pointPadding: 0.3,
            pointPlacement: -0.2,
          });
        }
        return;
      }

      interestPaid.push({ x: date, y: emi.interestPaid });
      principalPaid.push({ x: date, y: pPaid });
      emi.interestRate && interestRate.push({ x: date, y: emi.interestRate });
    });

    ymax += ymax * 0.3;
    const series: Highcharts.Options['series'] = [{
      name: 'Interest',
      type: 'column',
      data: interestPaid,
      color: '#eb445a',
      yAxis: 0,
    }, {
      name: 'Principal',
      type: 'column',
      data: principalPaid,
      color: '#1b6534',
      yAxis: 0,
    }];

    if (interestRate.length) {
      series.push({
        name: 'Interest Rate',
        type: 'spline',
        data: interestRate,
        yAxis: 1,
      });
    };

    return {
      chart: {
        type: 'column',
        zooming,
      },
      title: { text: '' },
      xAxis: {
        categories,
        type: !lessCate ? 'datetime' : 'category',
        labels: {
          autoRotationLimit: 10,
          formatter: function () {
            if (isNaN(Number(this.value))) return this.value + '';
            return DateUtils.formatMonthYear(Number(this.value));
          }
        },
      },
      yAxis: [{
        title: { text: '' },
        labels: { enabled: false },
        max: ymax,
        stackLabels: {
          enabled: true,
          formatter: function () {
            return getCurrVal(this.total);
          }
        }
      }, {
        title: { text: '' },
        labels: { enabled: false },
        opposite: true,
      }],
      tooltip: {
        useHTML: true,
        formatter: function () {
          return ChartUtils.getTooltip(this, currencyPipe);
        },
        shared: true,
      },
      legend: ChartUtils.getLegendOption(),
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function () {
              return getCurrVal(this.y);
            }
          },
        },
        spline: {
          lineWidth: 2,
          states: {
            hover: { lineWidth: 4 }
          },
          marker: { enabled: false },
        }
      },
      series,
      drilldown,
    }

    function getCurrVal(val) {
      return currencyPipe.transform(val, 'noDecimal');
    }
  }

  static getLegendOption(): Highcharts.LegendOptions {
    return {
      align: 'left',
      x: 0,
      verticalAlign: 'top',
      y: 0,
      floating: true,
      backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
      // layout: 'vertical',
      // alignColumns: true,
    }
  }

  static getTooltip(_this: Highcharts.TooltipFormatterContextObject, currencyPipe) {
    const rows = (_this.points || []).map(p => {
      return `
      <tr>
        <td style="padding: 3px 5px">${p.series.name}</td>
        <td style="color:${p.series.color}">:
          <b>${p.series.name === 'Interest Rate' ? (p.y + '%') : (`${currencyPipe.transform(p.y, 'noDecimal')}</b>(${p.percentage.toFixed(2)}%)`)}
        </td>
      </tr>`
    }).join('');
    return `
    <table>
        <tr>
          <th colspan="2">${Highcharts.dateFormat('%b %Y', Number(_this.key))}</th>
        </tr>
        <tr>
          <td style="padding: 3px 5px">Total Paid</td>
          <td>: <b>${currencyPipe.transform(_this.total, 'noDecimal')}</b><td>
        </tr>
        ${rows}
      </table>`;

  }


}