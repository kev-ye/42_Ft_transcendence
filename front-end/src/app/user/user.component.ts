import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(public dialog: MatDialog, private http: HttpClient) { }

  user: any = {id: "123", username: "ppoinsinet", ladder: 42, login: "ppoinsin", avatar: "http://localhost:3000/image/"};

  changeUsername: boolean = false;
  connected: boolean = false;

  refreshUserDetails() {
    //load data from backend server
    this.http.get('http://localhost:3000/user/id/' + this.user.id).subscribe({
      next: data => {
        if (data)
          console.log("fetched user details", data);
        const tmp = data as any;
        this.user.username = tmp.name;
      },
      error: data => {
        console.log("Could not fetch data");
      }
    });
    this.http.get('http://localhost:3000/ladder/' + this.user.id).subscribe({
      next: (data: any) => {
        this.user.ladder = data.points;
      },
      error: data => {
        console.log("Could not fetch user ladder points");
        
      }
    });
  }

  ngOnInit(): void {
    this.user.avatar += this.user.id;

    this.refreshUserDetails();
    


    //if connection successfull -> connected = true;
    this.connected = true;
    this.user.avatar += this.user.id;
  }

  openUsername() {
    if (this.changeUsername)
      this.changeUsername = false;
    else
      this.changeUsername = true;
    const ref = this.dialog.open(DialogChangeUsername, {
      data: {
        id: this.user.id
      } //change data to send to dialog
    });
    ref.afterClosed().subscribe(data => {
      console.log("haha", data);
      
      if (data == true)
        this.refreshUserDetails();
    })
  }
  
  


}

@Component({
  templateUrl: './dialog-change-username.html'
})
export class DialogChangeUsername implements OnInit {

  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<DialogChangeUsername>) {}

  change: boolean = false;
  userID : string = "";

  ngOnInit(): void {
      this.userID = this.data.id;
  }

  @ViewChild('statusText') private statusText: ElementRef<HTMLDivElement>;

  changeUsername(newUsername: string) {
    this.http.put('http://localhost:3000/user/update', {id: this.userID, name: newUsername}).subscribe({
      next: data => {
        console.log("Changed successfully username");
        this.dialogRef.close(true);
      },
      error : data => {
        console.log("Could not change username");
      }
    })
  }

  inputEvent(username: string) {
    
    if (username)
    {
      //look for username in database and see if available
      this.http.get('http://localhost:3000/user/name/' + username).subscribe({
        next: data => {
          if (!data)
          {
            this.statusText.nativeElement.textContent = username + " is available";    
            this.change = true;
          }
          else
          {
            this.change = false;
            this.statusText.nativeElement.textContent = username + " is not available";
          }
        },
        error: data => {
          this.statusText.nativeElement.textContent = "Could not check for username";
          this.change = false;
        }
      });
    } else {
      this.change = false;
      this.statusText.nativeElement.textContent = "";
    }

  }
}
