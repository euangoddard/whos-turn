import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as shortid from 'shortid';
import { Turn } from 'src/app/turn.model';
import { Icons } from 'src/app/icons';

@Component({
  selector: 'wt-turn-edit',
  templateUrl: './turn-edit.component.html',
})
export class TurnEditComponent implements OnInit, OnDestroy {
  readonly separatorKeysCodes: ReadonlyArray<number> = [ENTER, COMMA];

  readonly form: FormGroup;

  turn: Turn = {
    id: shortid.generate(),
    label: '',
    candidates: ['Eric'],
    icon: '',
    currentIndex: 0,
  };

  constructor(formBuilder: FormBuilder, @Inject(Icons) readonly icons: ReadonlyArray<string>) {
    this.form = formBuilder.group({
      label: [this.turn.label, Validators.required],
      icon: [this.turn.icon, Validators.required],
      candidates: [this.turn.candidates, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      console.log(value);
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
      console.log('saving', this.form.value);
    } else {
      console.warn('not valid', this.form.errors);
    }
  }
}
