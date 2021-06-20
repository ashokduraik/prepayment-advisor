import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoanBasicComponent } from './pages/loan-basic/loan-basic.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:id',
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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
