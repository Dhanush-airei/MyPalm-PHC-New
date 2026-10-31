import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation as CapacitorScreenOrientation } from '@capacitor/screen-orientation';

@Injectable({
  providedIn: 'root',
})
export class ScreenOrientation {
  private isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  async portrait(): Promise<void> {
    if (!this.isNative()) {
      return;
    }

    try {
      await CapacitorScreenOrientation.lock({
        orientation: 'portrait',
      });
    } catch (error) {
      console.error('Portrait orientation error:', error);
    }
  }

  async landscape(): Promise<void> {
    if (!this.isNative()) {
      return;
    }

    try {
      await CapacitorScreenOrientation.lock({
        orientation: 'landscape',
      });
    } catch (error) {
      console.error('Landscape orientation error:', error);
    }
  }

  async unlock(): Promise<void> {
    if (!this.isNative()) {
      return;
    }

    try {
      await CapacitorScreenOrientation.unlock();
    } catch (error) {
      console.error('Orientation unlock error:', error);
    }
  }
}
