import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PipesModule } from '../../pipes.module';
import { LoanBasicComponent } from './loan-basic.component';

describe('LoanBasicComponent', () => {
  let component: LoanBasicComponent;
  let fixture: ComponentFixture<LoanBasicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanBasicComponent ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), FormsModule, ReactiveFormsModule, PipesModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
