import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PipesModule } from '../../pipes.module';
import { PlayAreaFilterPage } from './play-area-filter.page';

describe('PlayAreaFilterPage', () => {
  let component: PlayAreaFilterPage;
  let fixture: ComponentFixture<PlayAreaFilterPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayAreaFilterPage ],
      imports: [CommonTestModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayAreaFilterPage);
    component = fixture.componentInstance;
    // provide minimal outstanding input expected by ngOnInit
    component.outstanding = { emi: 1, amount: 1, interestRate: 1 } as any;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
