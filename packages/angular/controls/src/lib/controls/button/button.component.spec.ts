import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaSchButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: MaSchButtonComponent;
  let fixture: ComponentFixture<MaSchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaSchButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaSchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
