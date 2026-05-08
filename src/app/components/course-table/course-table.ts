import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Webbutveckling – Ramschema</h1>

      <div class="search-wrapper">
        <label for="search">Sök:</label>
        <input
          id="search"
          type="search"
          [(ngModel)]="searchText"
          (input)="onSearch()"
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
          <tr *ngFor="let course of filteredCourses">
            <td>{{ course.code }}</td>
            <td>{{ course.coursename }}</td>
            <td class="center">{{ course.progression }}</td>
            <td class="center">
              <a [href]="course.syllabus" target="_blank">Öppna</a>
            </td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="filteredCourses.length === 0">Inga kurser matchade sökningen.</p>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif; }
    h1 { margin-bottom: 1.5rem; }
    .search-wrapper { margin-bottom: 1.5rem; }
    .search-wrapper label { display: block; font-weight: bold; margin-bottom: 0.4rem; }
    .search-wrapper input { width: 100%; padding: 0.6rem 1rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
    th { cursor: pointer; user-select: none; font-weight: 600; }
    th:hover { text-decoration: underline; }
    tr:hover td { background: #f5f5f5; }
    .center { text-align: center; }
    a { color: #1a73e8; text-decoration: none; }
    a:hover { text-decoration: underline; }
  `]
})
export class CourseTable implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchText: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
      this.filteredCourses = [...data];
    });
  }

  onSearch(): void {
    const query = this.searchText.toLowerCase().trim();
    this.filteredCourses = query
      ? this.courses.filter(c =>
        c.coursename.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
      )
      : [...this.courses];
    if (this.sortColumn) this.applySortTo(this.filteredCourses);
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySortTo(this.filteredCourses);
  }

  private applySortTo(list: Course[]): void {
    list.sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
}