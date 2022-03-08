import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { CombinedGuard } from "./service/guard/combined.guard";
import { AuthGuard } from './service/guard/auth.guard';
import { LoginGuard } from "./service/guard/login.guard";
import { IsLoginGuard } from "./service/guard/is-login.guard";
import { TwoFactorGuard } from "./service/guard/two-factor.guard";
import { SubscriptionGuard } from "./service/guard/subscription.guard";
import { MainComponent } from './main/main.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { GameRoomTestComponent } from "./game-room-test/game-room-test.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  { path: '', redirectTo: 'user_login', pathMatch: 'full' },
  { path: 'user_login', component: UserLoginComponent, canActivate: [LoginGuard] },
	{ path: 'two_factor', component: TwoFactorComponent, canActivate: [CombinedGuard], data: {
		guards: [IsLoginGuard, TwoFactorGuard]
	}},
  { path: 'user_subscription', component: UserSubscriptionComponent, canActivate: [CombinedGuard], data: {
		guards: [IsLoginGuard, SubscriptionGuard]
	}},
	{ path: 'main', component: MainComponent, canActivate: [CombinedGuard], data: {
		guards: [IsLoginGuard, AuthGuard]
	}},
	{ path: 'gameRoom', component: GameRoomTestComponent, canActivate: [IsLoginGuard] }, // need game guard
	{ path: 'api', component: NotFoundComponent },
  { path: '**', redirectTo: 'user_login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
