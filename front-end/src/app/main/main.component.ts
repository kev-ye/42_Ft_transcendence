import { Component, OnInit } from '@angular/core';

import { UserConnexionService } from '../service/user_connexion/user-connexion.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title: string = 'ft_transcendence - Pong';

  constructor(private userConnexionService: UserConnexionService) { }

  ngOnInit(): void {}

  checkConnexion() {
    return this.userConnexionService.getConnexion();
  }

}
