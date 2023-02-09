import { Component } from '@angular/core';
import { VisibilityService } from 'src/app/services/visibilities.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  constructor(private visibleService: VisibilityService) {}

  close() {
    this.visibleService.closeContact();
  }
}
