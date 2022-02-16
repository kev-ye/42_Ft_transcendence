import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedMaterialModule } from './common/shared-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserLogin2Component } from './user-login2/user-login2.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { UserComponent } from './user/user.component';
import { ChatComponent } from './chat/chat.component';
import { LadderComponent } from './ladder/ladder.component';
import { CookieModule } from 'ngx-cookie'
import { DialogChannelSettings } from './chat/dialogs/dialog-channel-settings.component';
import { DialogCreateChat } from './chat/dialogs/dialog-create-chat.component';
import { DialogInvite } from './chat/dialogs/dialog-invite-channel.component';
import { DialogProtectedChat } from './chat/dialogs/dialog-protected-chat.component';
import { DialogSpectator } from './chat/dialogs/dialog-spectator.component';
import { DialogUser } from './chat/dialogs/dialog-user.component';
import { DialogBanned } from './chat/dialogs/dialog-banned.component';
import { DialogAddFriend } from './chat/dialogs/dialog-add-friend.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserLoginComponent,
    UserLogin2Component,
    UserSubscriptionComponent,
    UserComponent,
    ChatComponent,
    DialogCreateChat,
    DialogInvite,
    DialogProtectedChat,
    DialogSpectator,
    DialogUser,
    DialogChannelSettings,
    DialogBanned,
    DialogAddFriend
    
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
  bootstrap: [AppComponent]
})
export class AppModule {}
