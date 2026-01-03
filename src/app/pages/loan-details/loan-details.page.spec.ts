import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PipesModule } from '../../pipes.module';
import { LoanDetailsPage } from './loan-details.page';

describe('LoanDetailsPage', () => {
  let component: LoanDetailsPage;
  let fixture: ComponentFixture<LoanDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDetailsPage ],
      imports: [CommonTestModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
