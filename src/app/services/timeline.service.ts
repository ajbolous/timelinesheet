import { DrawingService } from './drawing.service';
import { Injector } from '@angular/core';
import * as d3 from 'd3';


// graph service. this draws an entire graph on a container div.
export class TimelineGraph {
    private _size: number;
    private _weekTick: number;
    private _goffset = 120;
    private _svg;
    private _graph;
    private _container;
    private drawing: DrawingService;
    private _tooltip;
    private _onClickEvent = null;

    private projects = [
        {
            name: 'Requirements',
            tasks: [
                {
                    name: 'task1',
                    length: 4,
                    start: 0,
                    color: 'green'
                },
                {
                    name: 'task2',
                    length: 5,
                    start: 4,
                    color: 'red'
                },
            ]
        },
        {
            name: 'Start developing',
            tasks: [
                {
                    name: 'Build POC',
                    length: 2,
                    start: 1,
                    color: 'orange'
                },
                {
                    name: 'Testing',
                    length: 2,
                    start: 6,
                    color: 'blue'
                },
            ]
        },
        {
            name: 'Java Project',
            tasks: [
                {
                    name: 'Build POC',
                    length: 25,
                    start: 1,
                    color: 'orange'
                },
                {
                    name: 'Testing',
                    length: 5,
                    start: 28,
                    color: 'blue'
                },
            ]
        },
        {
            name: 'OnClick',
            tasks: [
                {
                    name: 'Build POC',
                    length: 6,
                    start: 1,
                    color: 'red'
                },
                {
                    name: 'Testing',
                    length: 18,
                    start: 8,
                    color: 'green'
                },
            ]
        },
    ]

    constructor(container) {
        this._container = container;
    }

    drawTimeline() {
        const self = this;

        this._size = Math.max(this._container.offsetWidth, this._container.offsetHeight);
        this._weekTick = this._size / (12 * 4);

        d3.select(this._container)
            .select('svg')
            .remove();

        this._svg = d3.select(this._container)
            .append('svg')
            .attr('id', 'graphviewersvg')
            .attr('width', this._container.offsetWidth)
            .attr('height', this._container.offsetHeight);

        this._tooltip = d3.select(this._container)
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .style('opacity', 0.5);

        this._graph = this._svg.append('g');

        this.drawing = new DrawingService(this._graph);

        this.drawAxis();
        this.drawProjects();
    }

    drawAxis() {
        for (let i = 0; i < 12 * 4; i++) {
            let weekRect = this.drawing.drawRectangle(40, 400, 'white', 1)
                .attr('x', i * this._weekTick + this._goffset)
                .attr('y', 0)
                .style('opacity', 0.25)

            weekRect.on('mouseover', (event) => {
                weekRect.style('fill', i == 2 ? 'red' : 'skyblue');
            });

            weekRect.on('mouseout', (event) => {
                weekRect.style('fill', 'white')
            });

            let text = this.drawing.drawText('W' + i, i * this._weekTick + this._goffset, 410, 10)
                .style('stroke', 'darkgrey')
                .style('text-anchor', 'middle')

            if (i == 2) {
                text.style('stroke', 'red');
            }
        }

        this.drawing.drawLine(this._goffset, 0, this._goffset, 400).style('opacity', 0.2);
    }

    drawProjects() {
        let i = 0;
        this.projects.forEach(project => {
            this.drawProject(i++, project);
        });
    }

    drawProject(row, project) {

        this.drawing.drawText(project.name, 0, row * 50 + 25, 10);

        this.drawing.drawLine(0, row * 50, this._size + this._goffset, row * 50, 1)
            .style('opacity', 0.25);

        project.tasks.forEach(task => {
            let taskRect = this.drawing.drawRectangle(task.length * this._weekTick, 45, task.color, 'white', 1);

            taskRect.attr('rx', 10)
                .attr('ry', 10)
                .attr('x', task.start * this._weekTick + this._goffset)
                .attr('y', row * 50 + 2)
                .style('opacity', 0.6)
                .classed('project-task');

            taskRect.on('mouseover', (event) => {
                this.showTooltip(row, project, task);
                taskRect.style('opacity', 1);
            });

            taskRect.on('mouseout', (event) => {
                this.hideTooltip();
                taskRect.style('opacity', 0.5)
            });

            taskRect.on('click', (event) => {
                if (this._onClickEvent)
                    this._onClickEvent(project, task);
            });

            let cx: number = (task.length / 2 + task.start) * this._weekTick + this._goffset;

            this.drawing.drawText(task.name, cx, row * 50 + 25, 10)
                .style('text-anchor', 'middle').style('stroke', 'white').style('fill', 'white');
        });
    }

    setOnclickEvent(callback) {
        this._onClickEvent = callback;
    }

    hideTooltip() {
        this._tooltip.style('display', 'none');
    }

    showTooltip(row, project, task) {
        this._tooltip.style('display', 'block').transition().style('opacity', 0.95);
        this._tooltip.html('');
        let list = this._tooltip.append('pre')
            .style('background-color', 'white')
            .style('padding', '0px')
            .style('margin', '0px')
            .append('ul')
            .attr('class', 'list-group')
            .style('margin', '0px');

        list.append('li').html('Name&#9;&#9 <a href="#">' + task.name + '</a>')
            .attr('class', 'list-group-item')
            .style('padding', '4px')

        let cx: number = (task.length / 2 + task.start) * this._weekTick + this._goffset;

        this._tooltip.style('left', + cx + 'px').style('top', (row * 50 - 20) + 'px');
    }

}
