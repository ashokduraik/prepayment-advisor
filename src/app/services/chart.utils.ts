import * as Highcharts from 'highcharts';

export class ChartUtils {
  static getPieChartOptions(currencyPipe, title, data): Highcharts.Options {
    data.forEach(e => {
      e.amount = currencyPipe.transform(e.amount, 'noDecimal');
    })
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
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
        type: undefined,
        data
      }]
    }
  }

  static getPaymentHistoryChart(currencyPipe, instalments): Highcharts.Options {
    let ymax = 0;
    let categories = null;
    const interestPaid = [];
    const principalPaid = [];
    const interestRate = [];
    const lessCate = instalments.length < 5;
    if (lessCate) categories = [];

    instalments.forEach(emi => {
      const date = new Date(emi.emiDate).getTime();
      ymax = Math.max(ymax, emi.interestPaid + emi.principalPaid);

      if (lessCate) {
        categories.push(date);
        interestPaid.push(emi.interestPaid);
        principalPaid.push(emi.principalPaid);
        emi.interestRate && interestRate.push(emi.interestRate);
        return;
      }
      interestPaid.push({
        x: date,
        y: emi.interestPaid,
      });
      principalPaid.push({
        x: date,
        y: emi.principalPaid,
      });
      emi.interestRate && interestRate.push({ x: date, y: emi.interestRate });
    });

    const series: Highcharts.Options["series"] = [{
      name: 'Interest Paid',
      type: undefined,
      data: interestPaid,
      color: '#eb445a',
      yAxis: 0,
    }, {
      name: 'Principal Paid',
      type: undefined,
      data: principalPaid,
      color: '#2dd36f',
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
        zooming: {
          type: 'x',
          singleTouch: true,
        },
      },
      title: { text: '' },
      xAxis: {
        categories,
        type: 'datetime',
        labels: { format: '{value:%b %Y}' },
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
      backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
      // layout: 'vertical',
      // alignColumns: true,
    }
  }

  static getTooltip(_this: Highcharts.TooltipFormatterContextObject, currencyPipe) {
    const rows = _this.points.map(p => {
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