import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
  DestroyRef,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';

import { UserContext } from 'src/app/shared/services/user-context-service/user-context';
import { LanguageService } from 'src/app/shared/services/language-service/language-service';
import { ToastService } from 'src/app/shared/services/toast-service/toast-service';
import { SupplyChainTraceabilityService } from 'src/app/shared/services/production-services/supply-chain-tracebility-service/supply-chain-traceability-service';

declare var google: any;

@Component({
  selector: 'app-supplier-map-screen',
  templateUrl: './supplier-map-screen.page.html',
  styleUrls: ['./supplier-map-screen.page.scss'],
  standalone: false,
})
export class SupplierMapScreenPage implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  // Header Configuration
  appTitle: string = 'Supplier Supply Chain & Traceability';
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  language: string = '';

  // Map Variables
  map: any;
  geolocationPoints: any[] = [];
  millLatLng: any;
  pleaseWaitFlag: boolean = true;

  // Route Parameters
  supplierId: string = '';
  latitude: string = '4.2105';
  longitude: string = '101.9758';

  // Marker Icon
  iconTruck: any = {
    url: 'assets/img/location.png',
    scaledSize: new google.maps.Size(25, 32),
  };

  constructor(
    private translate: TranslateService,
    private userContext: UserContext,
    private languageService: LanguageService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private supplyChainTraceabilityService: SupplyChainTraceabilityService,
  ) {
    // Initialize user data from UserContext
    this.userId = this.userContext.userId || 0;
    this.millCode = this.userContext.millCode || '';
    this.language = this.languageService.getLanguage || 'English';

    // Get route parameters
    this.activatedRoute.paramMap.subscribe((params) => {
      this.supplierId = params.get('supplierid') || '';
      this.latitude = params.get('latitude') || '4.2105';
      this.longitude = params.get('longitude') || '101.9758';
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.millLatLng = new google.maps.LatLng(
      parseFloat(this.latitude),
      parseFloat(this.longitude),
    );
    this.getGpsData();
  }

  /**
   * Get GPS Polygon Data for Supplier
   */
  getGpsData(): void {
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      language: this.language,
      supplierid: this.supplierId,
    };

    console.log('GPS Polygon Request:', req);

    this.supplyChainTraceabilityService
      .getSupplierSupplyChainPolygonData(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;

            if (result.httpcode == 200) {
              this.geolocationPoints = result.data || [];
            } else {
              this.geolocationPoints = [];
              // this.toastService.error(
              //   this.translate.instant('ERROR_MESSAGES.failedToLoadData'),
              // );
            }

            // Load map and draw polygons regardless of data
            this.loadMap();
            this.drawPolyLine();
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;
            this.geolocationPoints = [];
            console.error('Failed to get GPS polygon data:', err);
            this.toastService.error(
              this.translate.instant('ERROR_MESSAGES.failedToLoadData'),
            );
            this.loadMap();
            this.drawPolyLine();
          });
        },
      });
  }

  /**
   * Load Google Maps
   */
  loadMap(): void {
    try {
      const mapOptions = {
        center: this.millLatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        scaleControl: false,
        rotateControl: false,
        attributionControl: false,
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Add marker at the center location
      const markerMill = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: this.iconTruck,
        position: this.millLatLng,
      });

      // Hide attribution after map loads
      this.hideMapAttribution();
    } catch (error) {
      console.error('Failed to load map:', error);
    }
  }

  /**
   * Hide Google Maps attribution and close button
   */
  private hideMapAttribution(): void {
    setTimeout(() => {
      const attributionElements = document.querySelectorAll(
        '.gm-style-cc, .gm-style-ccc, .gm-fullscreen-control, .gm-ui-hover-effect, button[title*="Close"]',
      );
      attributionElements.forEach((el: any) => {
        if (el) {
          el.style.display = 'none';
        }
      });
    }, 1000);
  }

  /**
   * Draw Polygon Lines on the Map
   */
  drawPolyLine(): void {
    if (!this.geolocationPoints || this.geolocationPoints.length === 0) {
      console.log('No polygon data available');
      return;
    }

    for (let i = 0; i < this.geolocationPoints.length; i++) {
      const eachItem = this.geolocationPoints[i];
      const path: any[] = [];

      if (eachItem.polygon && eachItem.polygon.length > 0) {
        for (let j = 0; j < eachItem.polygon.length; j++) {
          const eachData = eachItem.polygon[j];
          const eachReq = {
            lat: Number(eachData.lat),
            lng: Number(eachData.lng),
          };
          path.push(eachReq);
        }

        console.log('Polygon Path:', path);
        this.updateMapPolyLine(path);
      }
    }
  }

  /**
   * Update Map with Polygon
   */
  updateMapPolyLine(newPath: any[]): void {
    if (!this.map) {
      console.warn('Map not initialized');
      return;
    }

    try {
      const polygon = new google.maps.Polygon({
        path: newPath,
        strokeColor: '#08FF08',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: '#E0FFE0',
        fillOpacity: 0.3,
      });
      polygon.setMap(this.map);
    } catch (error) {
      console.error('Failed to draw polygon:', error);
    }
  }

  /**
   * Reload Data
   */
  reloadData(): void {
    this.getGpsData();
  }
}
