import { HttpClient } from "@angular/common/http";
import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: './html/dialog-channel-settings.html'
  })
  export class DialogChannelSettings {
    constructor(private http: HttpClient, private dialogRef: MatDialogRef<DialogChannelSettings>, @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("data channel settings", data);
      this.chatName = data.name;
    }
  
    @ViewChild('printError') error: ElementRef<HTMLDivElement>;
  
    public chatName: string = "";
    private access: number = 0;
  
    passwordInput: boolean = false;
    
    hidePassword() {
      this.passwordInput = false;
    }
  
    showPassword() {
      this.passwordInput = true;
    }
  
    setAccess(val: any) {
      this.access = val;
      
    }
  
    changeChat(passwordOne: string, passwordTwo: string) {
      if (this.access == 1)
      {
        if (!passwordOne)
        {
          this.error.nativeElement.textContent = "Please enter password for protected channel";
          return ;
        }
        
        if (passwordOne != passwordTwo)
        {
          this.error.nativeElement.textContent = "Please enter same password"
          return ;
        }
        this.http.put('http://localhost:3000/channels', {id: this.data.id, access: this.access, password: passwordOne}, {withCredentials: true}).subscribe({next:
                  data => {
                      this.dialogRef.close(true);
              },
            error: data => {
              this.error.nativeElement.textContent = "Could not create channel";
            }});
        return ;
      }
      this.http.put('http://localhost:3000/channels', {id: this.data.id, access: this.access}, {withCredentials: true}).subscribe({next: 
              data => {
                  this.dialogRef.close(true);
                  
              },
              error: data => {
                this.error.nativeElement.textContent = "Could not update channel"
              }});
    }
  }