import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoanDetailsPopoverComponent } from './loan-details-popover.component';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoanDetailsPopoverComponent', () => {
  let component: LoanDetailsPopoverComponent;
  let fixture: ComponentFixture<LoanDetailsPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDetailsPopoverComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), FormsModule, ReactiveFormsModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDetailsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
