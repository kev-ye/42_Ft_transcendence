import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalConsts } from '../common/global';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(public dialog: MatDialog, private http: HttpClient) {
  }

  user: any;

  changeUsername: boolean = false;
  connected: boolean = false;

  refreshUserDetails() {
    //load data from backend server

    this.http.get(`${GlobalConsts.userApi}/user/id/`, {withCredentials: true}).subscribe({
      next: data => {
        if (!data) {
          console.log("Could not fetch user details");
          return ;
        }
        console.log("fetched user details", data);
        const tmp = data as any;
        this.user = tmp;
        this.user.username = tmp.name;
        this.user.avatar = `${GlobalConsts.userApi}/image/user/` + this.user.id;

        this.connected = true;

        this.http.get(`${GlobalConsts.userApi}/ladder/` + this.user.id, {withCredentials: true}).subscribe({
          next: (data: any) => {
            this.user.ladder = data.points;
          },
          error: data => {
            console.log("Could not fetch user ladder points");

        }});
    }, error: data => {
      console.log("Could not fetch user details");

    }});
  }

  ngOnInit(): void {
    this.refreshUserDetails();
  }

  openImageDialog() {
    const tmp = this.dialog.open(DialogChangeImage, {
      data: {
        user_id: this.user.id
        //data
      }
    });
    tmp.afterClosed().subscribe(data => {
      if (data)
        this.user.avatar = data;
    });
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
    this.http.put(`${GlobalConsts.userApi}/user/update`, {id: this.userID, name: newUsername}, {withCredentials: true}).subscribe({
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
      this.http.get(`${GlobalConsts.userApi}/user/name/` + username, {withCredentials: true}).subscribe({
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

@Component({
  templateUrl: "./dialog-change-image.html"
})
export class DialogChangeImage {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private http: HttpClient,
  private dialogRef: MatDialogRef<DialogChangeImage>) {
    this.link = `${GlobalConsts.userApi}/image/user/` + data.user_id;
  }

  link: string = "";
  newImage: any;

  @ViewChild('file') file: ElementRef<HTMLInputElement>;

  changeImage(e: any) {
    if (!e.target.files || !e.target.files.item(0))
      return ;
    console.log("change ", e);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files.item(0));
    if (reader)
    {
      reader.onload = (data: any) => {
        if (reader.result)
          this.link = reader.result.toString();
      };
    }

  }


  submitImage() {

    if (!this.file.nativeElement.files)
      return ;

    if (!this.file.nativeElement.files?.length)
    {
      console.log("No file was loaded");
      return ;
    }

    const image = this.file.nativeElement.files.item(0);
    if (!image)
      return ;

      let ext: string = "";
      let index: number = 0;

      if ((index = ((image.name as string).lastIndexOf('.'))) > 0)
      {
        ext = (image.name as string).substring(index).toUpperCase();
        console.log("extension " + ext);

        if (ext != ".PNG" && ext != ".JPG")
        {
          console.log("Bad extension 1: " + ext);
          return;
        }
        let fd = new FormData();
        fd.append('image', image);
        this.http.post<FormData>(`${GlobalConsts.userApi}/image/upload/` + this.data.user_id, fd, {headers: {extension: ext}, withCredentials: true}).subscribe((res) => {

        });
      }
      else
        console.log("Bad extension 2: " + index);
      this.dialogRef.close(this.link);
  }

  async deleteImage() {
    this.http.delete(`${GlobalConsts.userApi}/image/${this.data.user_id}`).subscribe( () => {
      this.dialogRef.close(`${GlobalConsts.userApi}/image/`);
    })

  }
}
