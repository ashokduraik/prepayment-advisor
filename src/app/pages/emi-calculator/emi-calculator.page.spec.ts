import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PipesModule } from '../../pipes.module';
import { EmiCalculatorPage } from './emi-calculator.page';

describe('EmiCalculatorPage', () => {
  let component: EmiCalculatorPage;
  let fixture: ComponentFixture<EmiCalculatorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmiCalculatorPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), FormsModule, ReactiveFormsModule, PipesModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(EmiCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
