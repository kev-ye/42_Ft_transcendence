import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { AuthGuard } from './service/guard/auth.guard';
import { MainComponent } from './main/main.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';

const routes: Routes = [
  { path: '', redirectTo: 'user_login', pathMatch: 'full' },
  { path: 'user_login', component: UserLoginComponent },
	{ path: 'two_factor', component: TwoFactorComponent },
  { path: 'user_subscription', component: UserSubscriptionComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'user_login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
