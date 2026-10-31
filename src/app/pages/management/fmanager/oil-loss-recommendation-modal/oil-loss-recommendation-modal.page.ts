import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-oil-loss-recommendation-modal',
  templateUrl: './oil-loss-recommendation-modal.page.html',
  styleUrls: ['./oil-loss-recommendation-modal.page.scss'],
  standalone: false,
})
export class OilLossRecommendationModalPage implements OnInit {
  // Data properties
  params: any = null;
  module: string = '';
  title: string = '';
  time: string = '';
  predicteddata: string = '';
  recommendationArr: any[] = [];
  reasonArr: any[] = [];
  generalArr: any[] = [];
  reasonflag: boolean = false;
  type: string = '';

  constructor(
    private translate: TranslateService,
    public modalController: ModalController,
    public navParams: NavParams,
  ) {
    // Get data from navParams
    const viewform = this.navParams.get('item');
    this.params = viewform ? JSON.parse(viewform) : null;
    this.type = this.navParams.get('type') || '';

    console.log('Received params:', this.params);
    console.log('Type:', this.type);

    // Set data based on type
    if (this.type === 'reason') {
      this.reasonflag = true;
      this.reasonArr = this.params?.reasons || [];
    } else {
      this.reasonflag = false;
      this.recommendationArr = this.params?.actions || [];
    }
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  /**
   * Close the modal
   */
  btn_close(): void {
    this.modalController.dismiss({
      dismissed: true,
      item: '',
    });
  }

  /**
   * Convert newlines to <br> tags
   */
  nl2br(text: string): string {
    return text.replace(new RegExp('\r?\n', 'g'), '<br />');
  }

  /**
   * Stringify an object for debugging
   */
  parseString(item: any): string {
    return JSON.stringify(item);
  }
}
