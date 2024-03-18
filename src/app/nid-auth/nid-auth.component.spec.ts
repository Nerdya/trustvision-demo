import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NidAuthComponent } from './nid-auth.component';

describe('NidAuthComponent', () => {
  let component: NidAuthComponent;
  let fixture: ComponentFixture<NidAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NidAuthComponent]
    });
    fixture = TestBed.createComponent(NidAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
