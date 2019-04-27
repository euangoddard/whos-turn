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
    for (const turn of this.turns) {
      if (turn.timestamp) {
        turn.timestamp = new Date(turn.timestamp);
      }
    }
    return of(this.turns);
  }

  upsertTurn(turn: Turn): Observable<Turn> {
    const turnTimestamped = { ...turn, timestamp: new Date() };
    const hasTurn = this.turns.find(t => t.id === turn.id);
    if (hasTurn) {
      this.turns = this.turns.map(t => (t.id === turn.id ? turnTimestamped : t));
    } else {
      this.turns = [...this.turns, turnTimestamped];
    }
    this.commitToStorage();
    return of(turnTimestamped);
  }

  deleteTurn(turn: Turn): Observable<null> {
    this.turns = this.turns.filter(t => t.id !== turn.id);
    this.commitToStorage();
    return of(null);
  }

  private commitToStorage(): void {
    const turnsRaw = JSON.stringify(this.turns);
    localStorage.setItem(StorageService.Key, turnsRaw);
  }
}
