import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { EmiEditPage } from './pages/emi-edit/emi-edit.page';
import { LoanBasicComponent } from './pages/loan-basic/loan-basic.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'loan-basic',
    component: LoanBasicComponent,
    //loadChildren: () => import('./pages/loan-basic/loan-basic.module').then(m => m.LoanBasicModule)
  },
  {
    path: 'loan-details/:id',
    loadChildren: () => import('./pages/loan-details/loan-details.module').then(m => m.LoanDetailsPageModule)
  },
  {
    path: 'loan-topup/:loanid/:emiid',
    loadChildren: () => import('./pages/loan-topup/loan-topup.module').then(m => m.LoanTopupPageModule)
  },
  {
    path: 'calculation-logic/:loanid/:emiid',
    loadChildren: () => import('./pages/calculation-logic/calculation-logic.module').then(m => m.CalculationLogicPageModule)
  },
  {
    path: 'emi-edit/:loanid/:emiid',
    component: EmiEditPage,
    //loadChildren: () => import('./pages/emi-edit/emi-edit.module').then( m => m.EmiEditPageModule)
  },
  {
    path: 'prepayment/:loanid/:emiid',
    loadChildren: () => import('./pages/prepayment/prepayment.module').then(m => m.PrepaymentPageModule)
  },
  {
    path: 'play-area',
    loadChildren: () => import('./pages/play-area/play-area.module').then(m => m.PlayAreaPageModule)
  },
  {
    path: 'play-area/:id',
    loadChildren: () => import('./pages/play-area/play-area.module').then(m => m.PlayAreaPageModule)
  },
  {
    path: 'statistics/:id',
    loadChildren: () => import('./pages/statistics/statistics.module').then(m => m.StatisticsPageModule)
  },
  {
    path: 'play-area-filter',
    loadChildren: () => import('./pages/play-area-filter/play-area-filter.module').then(m => m.PlayAreaFilterPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule)
  },
  {
    path: 'currency-select',
    loadChildren: () => import('./pages/currency-select/currency-select-routing.module').then(m => m.CurrencySelectRoutingModule)
  },
  {
    path: 'timeline/:id',
    loadChildren: () => import('./pages/timeline/timeline.module').then(m => m.TimelinePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
