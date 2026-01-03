import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PipesModule } from '../../pipes.module';
import { CalculationLogicPage } from './calculation-logic.page';

describe('CalculationLogicPage', () => {
  let component: CalculationLogicPage;
  let fixture: ComponentFixture<CalculationLogicPage>;

  beforeEach(waitForAsync(() => {
    @Component({ template: '' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [ CalculationLogicPage ],
      imports: [CommonTestModule],
      providers: [{ provide: Router, useValue: { navigate: () => Promise.resolve(true), navigateByUrl: () => Promise.resolve(true) } }]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculationLogicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
