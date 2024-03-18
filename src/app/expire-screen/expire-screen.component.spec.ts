import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpireScreenComponent } from './expire-screen.component';

describe('ExpireScreenComponent', () => {
  let component: ExpireScreenComponent;
  let fixture: ComponentFixture<ExpireScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExpireScreenComponent]
    });
    fixture = TestBed.createComponent(ExpireScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
