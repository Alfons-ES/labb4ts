import { Component } from '@angular/core';
import { CourseTable } from './components/course-table/course-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CourseTable],
  template: `<app-course-table />`
})
export class App { }