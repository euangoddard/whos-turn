import { TestBed } from '@angular/core/testing';
import { switchMap } from 'rxjs/operators';
import { STUB_TURN_A, STUB_TURN_B } from 'src/app/testing/fixtures';
import { Turn, Turns } from 'src/app/turn.model';

import { StorageService } from './storage.service';

const STUB_DATE_NOW = new Date(2019, 3, 1, 14, 45);

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });
    service = TestBed.get(StorageService);
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(STUB_DATE_NOW);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('Loading data', () => {
    it('should handle an empty storage medium', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      service.loadTurns().subscribe(turns => {
        expect(turns).toEqual([]);
        expect(localStorage.getItem).toHaveBeenCalledWith('turns');
      });
    });

    it('should handle corrupted storage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('[something');
      service.loadTurns().subscribe(turns => {
        expect(turns).toEqual([]);
        expect(localStorage.getItem).toHaveBeenCalledWith('turns');
      });
    });

    it('should handle stored turns', () => {
      const storedTurns: Turns = [STUB_TURN_A, STUB_TURN_B];
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedTurns));
      service.loadTurns().subscribe(turns => {
        expect(turns).toEqual(storedTurns);
        expect(localStorage.getItem).toHaveBeenCalledWith('turns');
      });
    });

    it('should deserialize dates', () => {
      const turnWithDate = { ...STUB_TURN_A, timestamp: new Date(2019, 3, 4, 3, 45, 56) };
      const storedTurns: Turns = [turnWithDate];
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedTurns));
      service.loadTurns().subscribe(turns => {
        expect(turns).toEqual(storedTurns);
        expect(localStorage.getItem).toHaveBeenCalledWith('turns');
      });
    });
  });

  describe('Upserting data', () => {
    it('should add a turn to an empty set', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(localStorage, 'setItem');
      const turnTimestamped: Turn = { ...STUB_TURN_A, timestamp: STUB_DATE_NOW };
      service
        .loadTurns()
        .pipe(switchMap(() => service.upsertTurn(STUB_TURN_A)))
        .subscribe(returnValue => {
          expect(returnValue).toEqual(turnTimestamped);
          expect(localStorage.setItem).toHaveBeenCalledWith(
            'turns',
            JSON.stringify([turnTimestamped]),
          );
        });
    });

    it('should add a turn to an existing set', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([STUB_TURN_B]));
      spyOn(localStorage, 'setItem');
      const turnTimestamped: Turn = { ...STUB_TURN_A, timestamp: STUB_DATE_NOW };
      service
        .loadTurns()
        .pipe(switchMap(() => service.upsertTurn(STUB_TURN_A)))
        .subscribe(returnValue => {
          expect(returnValue).toEqual(turnTimestamped);
          expect(localStorage.setItem).toHaveBeenCalledWith(
            'turns',
            JSON.stringify([STUB_TURN_B, turnTimestamped]),
          );
        });
    });

    it('should update an existing turn', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([STUB_TURN_A, STUB_TURN_B]));
      spyOn(localStorage, 'setItem');

      const turnUpdated: Turn = { ...STUB_TURN_A, currentIndex: 1 };
      const turnTimestamped: Turn = { ...turnUpdated, timestamp: STUB_DATE_NOW };
      service
        .loadTurns()
        .pipe(switchMap(() => service.upsertTurn(turnUpdated)))
        .subscribe(returnValue => {
          expect(returnValue).toEqual(turnTimestamped);
          expect(localStorage.setItem).toHaveBeenCalledWith(
            'turns',
            JSON.stringify([turnTimestamped, STUB_TURN_B]),
          );
        });
    });
  });

  describe('Removing turns', () => {
    it('should remove a turn by ID', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([STUB_TURN_A, STUB_TURN_B]));
      spyOn(localStorage, 'setItem');
      const turnToDelete = { ...STUB_TURN_A, currentIndex: 1 };
      service
        .loadTurns()
        .pipe(switchMap(() => service.deleteTurn(turnToDelete)))
        .subscribe(returnValue => {
          expect(returnValue).toBeNull();
          expect(localStorage.setItem).toHaveBeenCalledWith('turns', JSON.stringify([STUB_TURN_B]));
        });
    });

    it('should skip a turn not found by ID', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([STUB_TURN_B]));
      spyOn(localStorage, 'setItem');
      service
        .loadTurns()
        .pipe(switchMap(() => service.deleteTurn(STUB_TURN_A)))
        .subscribe(returnValue => {
          expect(returnValue).toBeNull();
          expect(localStorage.setItem).toHaveBeenCalledWith('turns', JSON.stringify([STUB_TURN_B]));
        });
    });
  });
});
