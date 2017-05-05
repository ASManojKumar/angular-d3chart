import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import * as d3 from '@types/d3-selection';
import * as d3Scale from "@types/d3-scale";
import * as d3Shape from "@types/d3-shape";
import * as d3Array from "@types/d3-array";
import * as d3Axis from "@types/d3-axis";
import { dropDown } from './dropdown';

import { lineChartData } from './shared/data';

@Component({
    selector: 'my-app',
    template: `
    <h2>{{title}}</h2>
    <h4>Select chart</h4>
    <select [(ngModel)]="dropdownVal" (change)="callType(dropdownVal)">
      <option *ngFor="let dropDown of dropDownList">
        {{dropDown.name}}
      </option>
    </select>
    <h3>{{chartName}}</h3>
    <svg width="900" height="500"></svg>
  `
})

export class AppComponent implements OnInit {

    title: string = 'D3.js with Angular 2';

    OnInit() {
        this.dropdownVal = "Line";
    }

    dropDownList = [{
        id: 1,
        name: "Line"
    }, {
        id: 2,
        name: "Pie"
    }, {
        id: 3,
        name: "Donut"
    }];

    callType(dropdownVal) {
        if (dropdownVal && dropdownVal === 'Line') {
            this.chartName = "Line Chart"
            this.lineChart();
        } else if (dropdownVal && dropdownVal === 'Pie') {
            this.chartName = "Pie Chart"
            // this.pieChart();
        } else {
            this.chartName = "Donut Chart"
            // this.donutChart();
        }
    }

    // donutChart() {
      
    // }

    // pieChart() {
      
    // }

    lineChart() {

        private margin = { top: 20, right: 20, bottom: 30, left: 50 };
        private width: number;
        private height: number;
        private x: any;
        private y: any;
        private svg: any;
        private line: d3Shape.Line < [number, number] > ;

        constructor() {
            this.width = 900 - this.margin.left - this.margin.right;
            this.height = 500 - this.margin.top - this.margin.bottom;
        }

        ngOnInit() {
            this.initSvg()
            this.initAxis();
            this.drawAxis();
            this.drawLine();
        }

        private initSvg() {
            this.svg = d3.select("svg")
                .append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");;
        }

        private initAxis() {
            this.x = d3Scale.scaleTime().range([0, this.width]);
            this.y = d3Scale.scaleLinear().range([this.height, 0]);
            this.x.domain(d3Array.extent(lineChartData, (d) => d.date));
            this.y.domain(d3Array.extent(lineChartData, (d) => d.value));
        }

        private drawAxis() {

            this.svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + this.height + ")")
                .call(d3Axis.axisBottom(this.x));

            this.svg.append("g")
                .attr("class", "axis axis--y")
                .call(d3Axis.axisLeft(this.y))
                .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");
        }

        private drawLine() {
            this.line = d3Shape.line()
                .x((d: any) => this.x(d.date))
                .y((d: any) => this.y(d.value));

            this.svg.append("path")
                .datum(lineChartData)
                .attr("class", "line")
                .attr("d", this.line);
        }
    }
}
