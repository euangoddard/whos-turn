import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as shortid from 'shortid';
import { Turn } from 'src/app/turn/turn.model';

@Component({
  selector: 'wt-turn-edit',
  templateUrl: './turn-edit.component.html',
  styleUrls: ['./turn-edit.component.scss'],
})
export class TurnEditComponent implements OnInit, OnDestroy {
  readonly separatorKeysCodes: ReadonlyArray<number> = [ENTER, COMMA];

  readonly icons = [
    'accessibility',
    'account_balance',
    'account_balance_wallet',
    'account_circle',
    'alarm',
    'all_inbox',
    'assessment',
    'assignment',
    'autorenew',
    'bookmark',
    'bug_report',
    'build',
    'card_giftcard',
    'commute',
    'date_range',
    'delete',
    'face',
    'favorite',
    'fingerprint',
    'flight_takeoff',
    'grade',
    'home',
    'motorcycle',
    'pets',
    'receipt',
    'room',
    'shopping_cart',
    'watch_later',
    'work',
    'mic',
    'radio',
    'call',
    'email',
    'gesture',
    'weekend',
    'waves',
    'format_paint',
    'attachment',
    'photo_camera',
    'style',
    'directions_car',
    'local_bar',
    'local_cafe',
    'local_dining',
    'local_drink',
    'terrain',
    'cake',
    'school',
  ];

  readonly form: FormGroup;

  turn: Turn = {
    id: shortid.generate(),
    label: '',
    candidates: ['Eric'],
    icon: '',
    currentIndex: 0,
  };

  constructor(formBuilder: FormBuilder) {
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
