import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-course-table',
  standalone: true,
  styleUrl: './course-table.scss',
  template: `
    <div class="container">
      <h1>Webbutveckling Ramschema</h1>

      <div class="search-wrapper">
        <label for="search">Sök:</label>
        <input
          id="search"
          type="search"
          (input)="onSearch($event)"
          placeholder="Sök efter kurskod eller kursnamn"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th (click)="sort('code')">Kurskod {{ getSortIcon('code') }}</th>
            <th (click)="sort('coursename')">Kursnamn {{ getSortIcon('coursename') }}</th>
            <th (click)="sort('progression')">Progression {{ getSortIcon('progression') }}</th>
            <th>Kursplan</th>
          </tr>
        </thead>
        <tbody>
          @for (course of filteredCourses(); track course.code) {
            <tr>
              <td>{{ course.code }}</td>
              <td>{{ course.coursename }}</td>
              <td>{{ course.progression }}</td>
              <td><a [href]="course.syllabus" target="_blank">Öppna</a></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class CourseTable implements OnInit {
  courses: any[] = [];
  filteredCourses = signal<any[]>([]);
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  async ngOnInit() {
    const res = await fetch('https://webbutveckling.miun.se/files/ramschema.json');
    const data = await res.json();
    this.courses = data;
    this.filteredCourses.set([...data]);
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase().trim();
    this.filteredCourses.set(query
      ? this.courses.filter(c =>
        c.coursename.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
      )
      : [...this.courses]);
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredCourses.set([...this.filteredCourses()].sort((a, b) => {
      if (a[column] < b[column]) return this.sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    }));
  }

  getSortIcon(column: string) {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}