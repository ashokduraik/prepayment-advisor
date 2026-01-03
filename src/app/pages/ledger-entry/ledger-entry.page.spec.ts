import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PipesModule } from '../../pipes.module';
import { LedgerEntryPage } from './ledger-entry.page';

describe('LoanTopupPage', () => {
  let component: LedgerEntryPage;
  let fixture: ComponentFixture<LedgerEntryPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LedgerEntryPage],
      imports: [CommonTestModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(LedgerEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
