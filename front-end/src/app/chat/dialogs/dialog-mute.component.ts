import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: './html/dialog-mute.html'
})
export class DialogMute {
    constructor(@Inject(MAT_DIALOG_DATA) private data: any, private http: HttpClient) {        
    }

    muteUser(time : any) {
        if (time.value > 3600)
            time.value = 3600;
        else if (time.value < 1)
            time.value = 1;
        this.http.post('http://localhost:3000/channels/mute', { 
            seconds: time.value,
            user_id: this.data.user_id,
            chat_id: this.data.chat_id
        }, {withCredentials: true}).subscribe()
    }
}