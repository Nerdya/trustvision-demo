import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingProcessComponent } from './waiting-process.component';

describe('WaitingProcessComponent', () => {
  let component: WaitingProcessComponent;
  let fixture: ComponentFixture<WaitingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
