import { Component } from '@angular/core';
import { ContactsService } from '../services/contacts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  contacts: any[] = [];
  selections: any = [];
  constructor(private service: ContactsService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.service.getContacts().subscribe((response: any) => {
      this.contacts = response;
    }, (error: any) => {
      this.contacts = []
      this.toastr.error('An error occured while fetching the contacts.', 'Error: ' + error.status + ' ' + error.statusText)
    });
  }

  onSelect(contact: any) {
    if (this.selections.includes(contact)) {
      this.selections = this.selections.filter((c: any) => c.id !== contact.id)
      return;
    }
    this.selections.push(contact);
  }

  isSelected(contact: any) {
    return this.selections.includes(contact)
  }

  onReset() {
    this.selections = []
    this.contacts = []
    this.service.fillDummy().subscribe(
      (response: any) => {
        this.contacts = response
        this.toastr.info('Contacts list has been resetted to default values in DB!', 'Info')
      },
      (error: any) => {
        this.toastr.error('An error occured while resetting the contacts to default value', 'Error: ' + error.status + ' ' + error.statusText)
      })
  }

  onDelete(filter: string) {
    const toBeDeleted = this.contacts.filter((c: any) => filter === 'delete' ? this.selections.includes(c) : !this.selections.includes(c))
    const ids = toBeDeleted.map((c: any) => c.id)
    this.service.deleteContacts(ids).subscribe(
      (response: any) => {
        if (response.status === 200) {
          // Showing Toasts for each deleted contact
          response.body?.forEach((deletedResp: any) => {
            if (deletedResp.error) {
              this.toastr.error('Delete Request for ' + toBeDeleted.find((c: any) => c.id === deletedResp.id)?.firstName + ' failed.', 'Error: ' + deletedResp.error)
            }
          })
          // Updating the contacts list
          this.contacts = this.contacts.filter((c: any) => !ids.includes(c.id))
          this.selections = []
          this.toastr.success('Contacts deletion request has been completed!', 'Success')
        }
        // DISPLAY TOAST MESSAGE HERE
      },
      (error: any) => {
        console.log(error)
        this.toastr.error('An error occured while deleting the contacts.', 'Error: ' + error.status + ' ' + error.statusText)
      })
  }
}
