import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserConnexionService } from '../service/user_connexion/user-connexion.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('chat', [
      state('*', style({left: "0%"})),
      state('void', style({left: "-100%"})),
      transition('void <=> *', [
        animate('500ms ease-in-out')
      ])
    ]),
    trigger('user', [
      state('*', style({right: "0%"})),
      state('void', style({right: "-100%"})),
      transition("void <=> *", [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class MainComponent implements OnInit {

  title: string = 'ft_transcendence - Pong';
  chatVisibility: boolean = true;
  userVisibility: boolean = true;

  constructor(private userConnexionService: UserConnexionService, private router: Router) { }

  ngOnInit(): void {}

  checkConnexion() {
    return this.userConnexionService.getConnexion();
  }

  openChat() {
    if (this.chatVisibility)
      this.chatVisibility = false;
    else
      this.chatVisibility = true;

  }

  openUser() {
    if (this.userVisibility)
      this.userVisibility = false;
    else
      this.userVisibility = true;
  }

  openLadder() {
    this.router.navigate(["ladder"])
  }

}
