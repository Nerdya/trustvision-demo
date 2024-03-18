import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkycErrorComponent } from './ekyc-error.component';

describe('EkycErrorComponent', () => {
  let component: EkycErrorComponent;
  let fixture: ComponentFixture<EkycErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EkycErrorComponent]
    });
    fixture = TestBed.createComponent(EkycErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
