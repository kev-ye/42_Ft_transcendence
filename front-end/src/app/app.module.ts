import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SharedMaterialModule } from './shared/shared-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserLogin2Component } from './user-login2/user-login2.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { UserComponent } from './user/user.component';
import { ChatComponent, DialogCreateChat, DialogInvite, DialogProtectedChat, DialogSpectator, DialogUser } from './chat/chat.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { GameComponent } from './game/game.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LadderComponent } from './ladder/ladder.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserLoginComponent,
    UserLogin2Component,
    UserSubscriptionComponent,
    UserComponent,
    ChatComponent,
    GameRoomComponent,
    GameComponent,
    LoginCallbackComponent,
    NotFoundComponent,
    DialogInvite,
    DialogUser,
    DialogCreateChat,
    DialogProtectedChat,
    DialogSpectator,
    LadderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
