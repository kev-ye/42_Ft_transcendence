import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserLogin2Component } from './user-login2/user-login2.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { AuthGuard } from './service/guard/auth.guard';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: 'user_login', pathMatch: 'full' },
  { path: 'user_login', component: UserLoginComponent },
  // { path: 'user_login2', component: UserLogin2Component },
  { path: 'user_subscription', component: UserSubscriptionComponent, /* canActivate: [AuthGuard] */ },
  { path: 'main', component: MainComponent, /* canActivate: [AuthGuard] */ },
  { path: '**', redirectTo: 'user_login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
