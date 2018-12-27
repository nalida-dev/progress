import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarProgressComponent } from './bar-progress/bar-progress.component';

const routes: Routes = [
  { path: 'bar-progress/:sheet_id/:sheet_name/:api_key', component: BarProgressComponent }
  // { path: '', redirectTo: '/bar-progress', pathMatch: 'full' },
  // { path: 'bar-progress', component: BarProgressComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
