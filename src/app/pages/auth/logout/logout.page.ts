import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
  standalone: false,
})
export class LogoutPage implements OnInit {
  isLoading = false;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  cancel(): void {
    this.modalController.dismiss();
  }

  confirmLogout(): void {
    this.isLoading = true;

    this.modalController.dismiss({
      logout: true,
    });
  }
}
