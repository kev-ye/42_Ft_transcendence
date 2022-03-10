import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    templateUrl: './spectate-room.component.html',
    styleUrls: ['./spectate-room.component.css'],
    selector: 'spectate-room'
}) export class SpectateRoom {
    constructor(private router: Router) {
        console.log("too");
        
    }

    spectateGame(id: string) {
        if (id == "")
            return ;
        this.router.navigate(['play'], {queryParams: {spec: id}});
    }
}