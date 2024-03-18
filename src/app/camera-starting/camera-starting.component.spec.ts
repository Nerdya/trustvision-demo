import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraStartingComponent } from './camera-starting.component';

describe('CameraStartingComponent', () => {
  let component: CameraStartingComponent;
  let fixture: ComponentFixture<CameraStartingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraStartingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraStartingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
