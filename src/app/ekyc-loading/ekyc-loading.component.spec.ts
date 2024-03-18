import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkycLoadingComponent } from './ekyc-loading.component';

describe('EkycLoadingComponent', () => {
  let component: EkycLoadingComponent;
  let fixture: ComponentFixture<EkycLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EkycLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EkycLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
