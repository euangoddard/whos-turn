import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AliasDirective } from 'src/app/directives/alias.directive';

describe('Alias directive', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [AliasDirective, DoubleComponent, TripleComponent],
    }),
  );

  it('should respond to changes in the host', () => {
    const fixture = TestBed.createComponent(DoubleComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toEqual('4');

    fixture.componentInstance.value = 10;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toEqual('20');
  });

  it('should support the "as" notation', () => {
    const fixture = TestBed.createComponent(TripleComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.textContent).toEqual('6');
  });
});

@Component({
  template: `
    <h1 *alias="double(value); let doubled">{{ doubled }}</h1>
  `,
})
class DoubleComponent {
  value = 2;

  double(value: number): number {
    return value * 2;
  }
}

@Component({
  template: `
    <h1 *alias="triple(value) as tripled">{{ tripled }}</h1>
  `,
})
class TripleComponent {
  value = 2;

  triple(value: number): number {
    return value * 3;
  }
}
