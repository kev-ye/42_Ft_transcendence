import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserLogin2Component } from './user-login2/user-login2.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
// import { UserComponent } from './user/user.component';
// import { ChatComponent } from './chat/chat.component';
// import { GameRoomComponent } from './game-room/game-room.component';
// import { GameComponent } from './game/game.component';
// import { LoginCallbackComponent } from './login-callback/login-callback.component';
// import { NotFoundComponent } from './not-found/not-found.component';
import { UserPreferenceComponent } from './user-preference/user-preference.component';

import { SharedMaterialModule } from './common/shared-material.module';
import { EditableItemComponent } from './editable-item/editable-item.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserLoginComponent,
    UserLogin2Component,
    UserSubscriptionComponent,
    // UserComponent,
    // ChatComponent,
    // GameRoomComponent,
    // GameComponent,
    // LoginCallbackComponent,
    // NotFoundComponent,
    UserPreferenceComponent,
    EditableItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
