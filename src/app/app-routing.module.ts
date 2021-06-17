import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {LoanBasicComponent} from './modules/loan-basic/loan-basic.component'; 

const routes: Routes = [{
  path: 'home',
  loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
}, {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'loan-basic',
  component: LoanBasicComponent,
  //loadChildren: () => import('./modules/loan-basic/loan-basic.module').then(m => m.LoanBasicModule)
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
