import { Component } from '@angular/core';
import * as shortid from 'shortid';
import { Turn } from 'src/app/turn.model';

@Component({
  selector: 'wt-turn',
  templateUrl: './turn.component.html',
})
export class TurnComponent {

  turn: Turn = {
    id: shortid.generate(),
    label: 'Pouring coffee',
    candidates: ['Eric', 'Alex'],
    icon: 'local_drink',
    currentIndex: 0
  };

  get currentCandidate(): string {
    return this.turn.candidates[this.turn.currentIndex];
  }

  moveToNext(): void {
    this.turn.currentIndex = (this.turn.currentIndex + 1) % this.turn.candidates.length;
  }
}
