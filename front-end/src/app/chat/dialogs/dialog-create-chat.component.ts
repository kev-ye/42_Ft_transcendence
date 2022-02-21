import { HttpClient } from "@angular/common/http";
import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-create-chat",
  templateUrl: "./html/dialog-create-chat.html"
})
export class DialogCreateChat {
  constructor(private http: HttpClient, private dialogRef: MatDialogRef<DialogCreateChat>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.user_id = data.user_id;
  }
  
  @ViewChild('printError') error: ElementRef<HTMLDivElement>;
  
  passwordInput: boolean = false;
  access: number = 0;
  user_id: string = "";
  
  hidePassword() {
    this.passwordInput = false;
  }
  
  showPassword() {
    this.passwordInput = true;
  }
  
  setAccess(value: number) {
    this.access = value;
  }
  
  createChat(name: string, passwordOne?: string, passwordTwo?: string) {
    if (!name)  
    {
      this.error.nativeElement.textContent = "Please enter a channel name"
      return ;
    }
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
      this.http.post('http://localhost:3000/channels', {name: name, access: this.access, password: passwordOne, creator_id: this.user_id}, {withCredentials: true}).subscribe({next:
      data => {
        this.dialogRef.close(true);
      },
      error: data => {
        this.error.nativeElement.textContent = "Could not create channel"
        
      }});
      return ;
    }
    console.log("Dadas");
    
    this.http.post('http://localhost:3000/channels', {name: name, access: this.access, creator_id: this.user_id}, {withCredentials: true}).subscribe({next: 
    data => {
      console.log("teest");
      
      this.dialogRef.close(true);
      
    },
    error: data => {
      this.error.nativeElement.textContent = "Could not create channel"
    },
  complete: () => {
    console.log("completed");
    
  }});
  }
  
}