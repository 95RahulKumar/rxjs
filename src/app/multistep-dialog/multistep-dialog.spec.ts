import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultistepDialog } from './multistep-dialog';

describe('MultistepDialog', () => {
  let component: MultistepDialog;
  let fixture: ComponentFixture<MultistepDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultistepDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultistepDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
