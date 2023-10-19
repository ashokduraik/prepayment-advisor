import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Directive({
  selector: "[doughnutChart]",
})
export class DoughnutChart implements OnInit {
  @Input() title: string;
  constructor(
    private ele: ElementRef,
  ) { }

  ngOnInit() {
    // new Chart(this.ele.nativeElement, {
    //   type: 'doughnut',
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: 'top',
    //       },
    //       title: {
    //         display: true,
    //         text: this.title,
    //         font: {
    //           weight: 'bold',
    //           size: 17,
    //         }
    //       }
    //     },
    //   },
    //   data: {
    //     labels: [
    //       `Interest - ${this.currencyPipe.transform(interest, '')} (${interestPercentage}%)`,
    //       `Principal - ${this.currencyPipe.transform(amount - interest, '')} (${principalPercentage}%)`],
    //     datasets: [{
    //       backgroundColor: [
    //         "#e74c3c",
    //         "#2ecc71",
    //       ],
    //       data: [interestPercentage, principalPercentage]
    //     }]
    //   }
    // });
  }
}