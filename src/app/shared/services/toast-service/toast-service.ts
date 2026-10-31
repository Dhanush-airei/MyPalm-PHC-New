import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export type ToastType =
  | 'success'
  | 'danger'
  | 'warning'
  | 'primary'
  | 'secondary'
  | 'medium';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async show(
    message: string,
    color: ToastType = 'primary',
    duration = 2500,
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color,
      duration,
      position: 'bottom',
      swipeGesture: 'vertical',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  async success(message: string): Promise<void> {
    // example: await this.toastService.success('Login successful.');
    await this.show(message, 'success');
  }

  async error(message: string): Promise<void> {
    // example: await this.toastService.error('Invalid username or password.');
    await this.show(message, 'danger');
  }

  async warning(message: string): Promise<void> {
    // example: await this.toastService.warning('Please enter username.');
    await this.show(message, 'warning');
  }

  async info(message: string): Promise<void> {
    // example: await this.toastService.info('Loading...');
    await this.show(message, 'primary');
  }
}
