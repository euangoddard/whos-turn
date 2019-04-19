import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { mergeMap, pluck } from 'rxjs/operators';
import { saveTurn } from 'src/app/actions';
import { Icons } from 'src/app/icons';
import { State } from 'src/app/reducers';
import { selectTurnById } from 'src/app/selectors';
import { Turn } from 'src/app/turn.model';

@Component({
  selector: 'wt-turn-edit',
  templateUrl: './turn-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TurnEditComponent implements OnInit, OnDestroy {
  readonly separatorKeysCodes: ReadonlyArray<number> = [ENTER, COMMA];

  readonly form: FormGroup;

  turn!: Turn;

  constructor(
    formBuilder: FormBuilder,
    @Inject(Icons) readonly icons: ReadonlyArray<string>,
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.form = formBuilder.group({
      label: ['', Validators.required],
      icon: ['', Validators.required],
      candidates: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        pluck('id'),
        mergeMap(turnId => {
          return this.store.pipe(select(selectTurnById, { id: turnId }));
        }),
        untilDestroyed(this),
      )
      .subscribe(turn => {
        this.turn = turn;
        this.form.setValue({
          label: turn.label,
          icon: turn.icon,
          candidates: turn.candidates,
        });
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const control = this.form.get('candidates') as AbstractControl;
      control.setValue([...control.value, value.trim()]);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(candidate: string): void {
    const control = this.form.get('candidates') as AbstractControl;
    control.setValue(control.value.filter((c: string) => c !== candidate));
  }

  saveTurn() {
    if (this.form.valid) {
      const turn = { ...this.turn, ...this.form.value };
      this.store.dispatch(saveTurn({ turn }));
      this.router.navigate(['/turns', turn.id]);
    } else {
      console.warn('not valid', this.form.errors);
    }
  }
}
