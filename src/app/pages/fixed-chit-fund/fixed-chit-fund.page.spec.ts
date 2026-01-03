import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FixedChitFundPage } from './fixed-chit-fund.page';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PipesModule } from '../../pipes.module';

describe('FixedChitFundPage', () => {
  let component: FixedChitFundPage;
  let fixture: ComponentFixture<FixedChitFundPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedChitFundPage ],
      imports: [CommonTestModule],
      providers: [{ provide: Router, useValue: { navigate: () => Promise.resolve(true), navigateByUrl: () => Promise.resolve(true) } }]
    }).compileComponents();

    fixture = TestBed.createComponent(FixedChitFundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
