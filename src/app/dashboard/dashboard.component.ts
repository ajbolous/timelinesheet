import { ViewChild, Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { TimelineGraph } from '../services/timeline.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import * as svgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('graphviewer') graphContainer: ElementRef;

  private timeline: TimelineGraph;

  private panzoom;
  private selectedProject;
  private selectedTask;

  constructor() { }


  ngAfterViewInit() {

    this.timeline = new TimelineGraph(this.graphContainer.nativeElement);
    this.timeline.drawTimeline();

    this.timeline.setOnclickEvent((project, task) => {
      this.selectedProject = project;
      this.selectedTask = task;
    });

    this.panzoom = svgPanZoom('#graphviewersvg', {
      maxZoom: 1,
      minZoom: 1,
      zoomScaleSensitivity: 0.25,
      dblClickZoomEnabled: false,
      beforePan: (oldp, newp) => {
        return { x: true, y: false };
      }
    });

  }
}
