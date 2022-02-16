import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "dialog-user",
    templateUrl: "./html/dialog-user.html"
  })
  export class DialogUser implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
      this.username = data.username;
      this.id = data.id;
      this.my_id = data.my_id;
      console.log("data for userDialog ", this.id, this.my_id);
      http.get('http://localhost:3000/friend/' + this.my_id).subscribe(data => {
        if ((data as any[]).find(val => {
          return val.id == this.id && val.status == 2;
        }))
          this.friend = true;
      })
      
    }
  
    friend: boolean = false;
    user: any = {};
    error: boolean = false;
  
    ngOnInit(): void {
      this.http.get('http://localhost:3000/user/id/' + this.id).subscribe({
        next: data => {
          console.log("fetched user id = " + this.id, data);
          if (data)
            this.user = data;
          else
            this.error = true;
        },
        error: data => {
          console.log("could not fetch user " + this.id);
          this.error = true;
        }
      });
      console.log('error : ', this.error);
      
    }

    deleteFriend() {
      this.http.patch('http://localhost:3000/friend', {
        first: this.my_id,
        second: this.id
      }).subscribe({next: data => {
        console.log("deleted friend");
        this.friend = false;
      },
    error: data => {
      console.log("could not delete friend");
      
    }});
    }
  
    addFriend() {
        this.http.post('http://localhost:3000/friend', {first: this.my_id, second: this.id}).subscribe({
            next: data => {
                console.log("sent friend request", data);
                this.friend = true;
            }
        })
    }

  
    my_id: string = "";
    id: string = "";
    username: string = "";
  }