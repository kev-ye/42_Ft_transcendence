import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  user: any = {username: "ppoinsinet", ladder: 42, login: "ppoinsin", avatar: "https://cdn.intra.42.fr/users/medium_ppoinsin.jpg"};

  changeUsername: boolean = false;
  connected: boolean = false;

  ngOnInit(): void {
    //load picture + data from backend server

    //if connection successfull -> connected = true;
    this.connected = true;
  }

  openUsername() {
    if (this.changeUsername)
      this.changeUsername = false;
    else
      this.changeUsername = true;
    this.dialog.open(DialogChangeUsername, {
      data: {} //change data to send to dialog
    })
  }
  
  


}

@Component({
  templateUrl: './dialog-change-username.html'
})
export class DialogChangeUsername {

  changeUsername(newUsername: string) {
    //ask to back-end if newUsername is already taken
  }
}
