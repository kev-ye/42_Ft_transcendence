import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserConnexionService {
  conn: boolean = true;

  constructor() { }

  getConnexion(): boolean {
    return this.conn;
  }
}
