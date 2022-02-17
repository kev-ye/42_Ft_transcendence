import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { DialogUser } from "./dialog-user.component";

@Component({
    selector: "dialog-spec",
    templateUrl: "./html/dialog-spectator.html"
  })
  export class DialogSpectator implements OnInit{
    constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogSpectator>, public dialog: MatDialog) {
      console.log("data spectator", data.chat);
      
    }
  
    public users: any[] = [];
  
    fetchUsers() {
      this.http.get("http://localhost:3000/active-users/" + this.data.chat.id).subscribe(val => {
          console.log("fetched active users ", val);
          
          this.users = val as any[];
          let result: any[] = [];
          for (let tmp of this.users)
          {
            if (result.find(val => {
              return val.user_id == tmp.user_id;
            }))
              continue;
            result.push(tmp);
          }
          this.users = result;
      })
    }
  
    ngOnInit(): void {
      this.fetchUsers();
    }
  
    banUser(usr: any) {
      console.log("banning ", {user_id: usr.id, chat_id: this.data.chat.id});
      
      this.http.post(`http://localhost:3000/ban/`,
      {
        user_id: usr.id, 
        chat_id: this.data.chat.id 
      })
      .subscribe({next: () => {
        this.fetchUsers();
      }}) //todo
    }
  
    openUserProfile(user: any) {
      //this.dialogRef.close();
      
      const ref = this.dialog.open(DialogUser, {
        data: {
          username: user.name,
          id: user.id,
          my_id: this.data.my_id,
          friends: this.data.friends,
          blocked: this.data.blocked
        }
      });
      
  
    }
  }