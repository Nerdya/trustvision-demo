import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPasoComponent } from './header-paso.component';

describe('HeaderPasoComponent', () => {
  let component: HeaderPasoComponent;
  let fixture: ComponentFixture<HeaderPasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderPasoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
