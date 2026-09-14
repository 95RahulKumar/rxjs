import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderSvg } from './render-svg';

describe('RenderSvg', () => {
  let component: RenderSvg;
  let fixture: ComponentFixture<RenderSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderSvg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderSvg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
