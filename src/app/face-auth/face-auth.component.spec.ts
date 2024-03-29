import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceAuthComponent } from './face-auth.component';

describe('FaceAuthComponent', () => {
  let component: FaceAuthComponent;
  let fixture: ComponentFixture<FaceAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
