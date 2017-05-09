import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import * as d3 from '@types/d3-selection';
import * as d3Scale from "@types/d3-scale";
import * as d3Shape from "@types/d3-shape";
import * as d3Array from "@types/d3-array";
import * as d3Axis from "@types/d3-axis";
import { dropDown } from './dropdown';

import { lineChartData } from './shared/data';
import { Stats } from './shared/pieData';

@Component({
    selector: 'my-app',
    template: `
    <h2>{{title}}</h2>
    <svg width="1500" height="1000"></svg>
  `
})

export class AppComponent implements OnInit {

    title: string = 'D3.js with Angular 2';

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

    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private line: d3Shape.Line < [number, number] > ;

    constructor() {

    }

    ngOnInit() {
        this.createLineChart();
        this.createPieChart();
        this.createDonutChart();
    }

    createDonutChart() {

        this.dataset = {
            apples: [53245, 28479, 19697, 24037, 40245],
        };

        this.width = 460;
        this.height = 300,
            this.radius = Math.min(this.width, this.height) / 2;

        let color = d3Scale.scaleOrdinal().range(["#f95f5f", "#015a01", "#fdfd57", "#ADD6FB", "#532455"]);

        this.pie = d3Shape.pie()
            .sort(null);

        this.arc = d3Shape.arc()
            .innerRadius(this.radius - 100)
            .outerRadius(this.radius - 50);

        this.svg = d3.select("svg").append("g")
            .attr("transform", "translate(" + this.width / 2 + "," + 650 + ")");

        let g = this.svg.selectAll("path")
            .data(this.pie(this.dataset.apples))
            .enter().append("path")
            .attr("fill", function(d, i) {
                return color(i); })
            .attr("d", this.arc);

    }

    createPieChart() {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2;
        this.initSvgForPie();
        this.drawForPie();

    }

    initSvgForPie() {
        this.color = d3Scale.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        this.arc = d3Shape.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(0);
        this.labelArc = d3Shape.arc()
            .outerRadius(this.radius - 40)
            .innerRadius(this.radius - 40);
        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.population);
        this.svg = d3.select("svg")
            .append("g")
            .attr("transform", "translate(" + 700 + "," + 650 + ")");;
    }

    createLineChart() {
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.initSvg()
        this.initAxis();
        this.drawAxis();
        this.drawLine();
    }

    drawForPie() {
        let g = this.svg.selectAll(".arc")
            .data(this.pie(Stats))
            .enter().append("g")
            .attr("class", "arc");
        g.append("path").attr("d", this.arc)
            .style("fill", (d: any) => this.color(d.data.age));
        g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.centroid(d) + ")")
            .attr("dy", ".35em")
            .text((d: any) => d.data.age);
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
