import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turn, Turns } from 'src/app/turn.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private static Key = 'turns';

  private turns: Turns = [];

  constructor() {}

  loadTurns(): Observable<Turns> {
    const turnsRaw = localStorage.getItem(StorageService.Key) || '[]';
    try {
      this.turns = JSON.parse(turnsRaw) || [];
    } catch {
      this.turns = [];
    }
    return of(this.turns);
  }

  upsertTurn(turn: Turn): Observable<null> {
    const hasTurn = this.turns.find(t => t.id === turn.id);
    if (hasTurn) {
      this.turns = this.turns.map(t => (t.id === turn.id ? turn : t));
    } else {
      this.turns = [...this.turns, turn];
    }
    return this.commitToStorage();
  }

  deleteTurn(turn: Turn): Observable<null> {
    this.turns = this.turns.filter(t => t.id !== turn.id);
    return this.commitToStorage();
  }

  private commitToStorage(): Observable<null> {
    const turnsRaw = JSON.stringify(this.turns);
    localStorage.setItem(StorageService.Key, turnsRaw);
    return of(null);
  }
}
