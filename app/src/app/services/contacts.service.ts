import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  host = '/api';
  getContacts() {
    return this.http.get(this.host + '/contacts');
  }

  deleteContacts(ids: string[]) {
    return this.http.delete(this.host + '/contacts', { body: [...ids], observe: 'response' });
  }

  fillDummy() {
    return this.http.post(this.host + '/contacts/filldummy', {});
  }

  constructor(private http: HttpClient) { }
}
