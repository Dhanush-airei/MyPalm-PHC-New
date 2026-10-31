import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, ToastController } from '@ionic/angular';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { NotificationListModalPage } from '../notification-list-modal/notification-list-modal.page';

@Component({
  selector: 'app-qrcodescanner',
  templateUrl: './qrcodescanner.page.html',
  styleUrls: ['./qrcodescanner.page.scss'],
  standalone: false,
})
export class QrcodescannerPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Header Configuration
  appTitle: string = this.translate.instant('QRCODESCANNER.qrcodescanner');
  headerActions: string = '0';
  showLogo: number = 0;
  showBackButton: number = 1;

  // Scanner state
  uiEnable: boolean = false;

  // Parsed QR data
  qrcode: string = '';
  departmentId: string = '';
  stationId: string = '';
  equipmentId: string = '';
  partId: string = '';
  barcodeLength: number = 0;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private modalController: ModalController,
    private toastController: ToastController,
    private userContext: UserContext,
  ) {}

  ngOnInit(): void {}

  async scanqrcode(): Promise<void> {
    this.uiEnable = true;

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
        scanInstructions: this.translate.instant('QRCODESCANNER.scan'),
        scanButton: false,
        scanText: this.translate.instant('QRCODESCANNER.scan'),
        cameraDirection: 1,
        scanOrientation: 1,
      });

      const rawValue = result?.ScanResult || '';

      if (!rawValue) {
        this.uiEnable = false;
        return;
      }

      this.qrcode = rawValue;
      this.processScannedCode(rawValue);
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes('cancelled')) {
        this.uiEnable = false;
        return;
      }
      console.error('Scan error:', error);
      this.uiEnable = false;
      this.showToast(this.translate.instant('QRCODESCANNER.notvalidbarcode'));
    }
  }

  private processScannedCode(qrcode: string): void {
    const tildeSplit = qrcode.split('~');
    this.barcodeLength = tildeSplit.length;

    if (tildeSplit.length === 2) {
      const station = tildeSplit[0];
      const equipment = tildeSplit[1];

      this.stationId = station.split('-')[0];
      this.equipmentId = equipment.split('-')[0];
      this.partId = '0';

      this.openNotificationModal(this.stationId, this.equipmentId, this.partId);
    } else if (tildeSplit.length === 3) {
      const station = tildeSplit[0];
      const equipment = tildeSplit[1];
      const part = tildeSplit[2];

      this.stationId = station.split('-')[0];
      this.equipmentId = equipment.split('-')[0];
      this.partId = part.split('-')[0];

      this.openNotificationModal(this.stationId, this.equipmentId, this.partId);
    } else {
      this.uiEnable = false;
      this.showToast(this.translate.instant('QRCODESCANNER.notvalidbarcode'));
    }
  }

  /**
   * ✅ FIX: Pass dynamic values reliably via componentProps.
   * Also pass a fresh `createDate` so if the same modal is recreated
   * we always get a new instance (Ionic caches components).
   */
  private async openNotificationModal(
    stationId: string,
    equipmentId: string,
    partId: string,
  ): Promise<void> {
    console.log('🚀 Opening modal with:', { stationId, equipmentId, partId });

    const modal = await this.modalController.create({
      component: NotificationListModalPage,
      componentProps: {
        stationId: stationId,
        machineId: equipmentId,
        partId: partId,
      },
      showBackdrop: true,
      // ✅ Forces new instance — prevents stale data from previous scan
      id: `notif-modal-${Date.now()}`,
    });

    modal.onDidDismiss().then(() => {
      this.uiEnable = false;
    });

    await modal.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }

  nl2br(text: string): string {
    if (!text) return '';
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }
}
