import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaSchIconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: MaSchIconComponent;
  let fixture: ComponentFixture<MaSchIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaSchIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaSchIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
