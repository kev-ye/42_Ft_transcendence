import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserLogin2Component } from './user-login2/user-login2.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LadderComponent } from './ladder/ladder.component';

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch:'full' },
  { path: 'user_login', component: UserLoginComponent},
  { path: 'user_login2', component: UserLogin2Component },
  { path: 'user_subscription', component: UserSubscriptionComponent },
  { path: "ladder", component: LadderComponent}
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
