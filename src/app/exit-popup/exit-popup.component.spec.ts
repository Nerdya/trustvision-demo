import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitPopupComponent } from './exit-popup.component';

describe('OtpComponent', () => {
  let component: ExitPopupComponent;
  let fixture: ComponentFixture<ExitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ExitPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
