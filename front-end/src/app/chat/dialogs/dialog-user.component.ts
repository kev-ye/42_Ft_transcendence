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
      console.log("data for userDialog ", data.blocked);
      
      (data.friends as any[]).forEach(val => {
        if (val.id == this.id)
          this.friend = true;
      });

      (data.blocked as any[]).forEach(element => {
        if (element == this.id)
        {
          console.log("element is blocked");
          this.blocked = true;
          
        }
      });
      
    }
  
    friend: boolean = false;
    blocked: boolean = false;
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

    blockUser() {
      this.http.post('http://localhost:3000/block', {
        first: this.my_id,
        second: this.id
      }).subscribe(() => {
        (this.data.blocked as any[]).push(this.id);
        this.blocked = true;
      });
    }

    unblockUser() {
      this.http.post('http://localhost:3000/unblock', {
        first: this.my_id,
        second: this.id
      }).subscribe(() => {
        const index = (this.data.blocked as any[]).findIndex(val => val == this.id);
        if (index >= 0)
        {
          (this.data.blocked as any[]).splice(index);
          this.blocked = false;
        }
      });
    }

    deleteFriend() {
      this.http.patch('http://localhost:3000/friend', {
        first: this.my_id,
        second: this.id
      }).subscribe({
        next: data => {
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