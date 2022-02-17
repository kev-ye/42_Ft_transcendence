import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { AuthGuard } from './service/guard/auth.guard';
import { LoginGuard } from "./service/guard/login.guard";
import { IsLoginGuard } from "./service/guard/is-login.guard";
import { TwoFactorGuard } from "./service/guard/two-factor.guard";
import { SubscriptionGuard } from "./service/guard/subscription.guard";
import { MainComponent } from './main/main.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';

const routes: Routes = [
  { path: '', redirectTo: 'user_login', pathMatch: 'full' },
  { path: 'user_login', component: UserLoginComponent, canActivate: [LoginGuard] },
	{ path: 'two_factor', component: TwoFactorComponent, canActivate: [IsLoginGuard, TwoFactorGuard] },
  { path: 'user_subscription', component: UserSubscriptionComponent, canActivate: [IsLoginGuard, SubscriptionGuard] },
  { path: 'main', component: MainComponent, canActivate: [IsLoginGuard, AuthGuard] },
  { path: '**', redirectTo: 'user_login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
