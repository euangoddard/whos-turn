import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turn } from 'src/app/turn/turn.model';
import * as shortid from 'shortid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  turns: ReadonlyArray<Turn> = [
    {
      id: shortid.generate(),
      label: 'Pouring coffee',
      icon: 'local_drink',
      candidates: ['Eric', 'Alex'],
      currentIndex: 0,
    },
  ];

  readonly isLargeScreen$: Observable<boolean>;

  constructor(private router: Router, breakpointObserver: BreakpointObserver) {
    this.isLargeScreen$ = breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(map(r => !r.matches));
  }

  createNewTurn(): void {
    this.router.navigate(['/turns', shortid.generate(), 'edit']);
  }
}
