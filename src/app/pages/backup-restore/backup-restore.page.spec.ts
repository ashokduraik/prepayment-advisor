import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { PipesModule } from '../../pipes.module';

import { BackupRestorePage } from './backup-restore.page';

describe('BackupRestorePage', () => {
  let component: BackupRestorePage;
  let fixture: ComponentFixture<BackupRestorePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BackupRestorePage],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([]), FormsModule, ReactiveFormsModule, PipesModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(BackupRestorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
