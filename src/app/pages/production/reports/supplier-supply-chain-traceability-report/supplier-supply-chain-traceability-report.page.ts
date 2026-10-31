import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
  DestroyRef,
  NgZone,
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
  selector: 'app-supplier-supply-chain-traceability-report',
  templateUrl: './supplier-supply-chain-traceability-report.page.html',
  styleUrls: ['./supplier-supply-chain-traceability-report.page.scss'],
  standalone: false,
})
export class SupplierSupplyChainTraceabilityReportPage implements OnInit {
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
  millLat: string = '4.2105';
  millLong: string = '101.9758';

  // Map Variables
  map: any;
  markersArray: any[] = [];
  markerIcon: any;
  activeWindow: any = null;
  gpsArray: any[] = [];

  // Data Variables
  locationArray: any[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  currentPage: number = 0;
  hasMoreData: boolean = true; // Flag to track if more data is available

  // UI Flags
  pleaseWaitFlag: boolean = false;
  noRecordFlag: boolean = false;
  isLoadingMore: boolean = false;

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
    this.millLat = this.userContext.millLat || '4.2105';
    this.millLong = this.userContext.millLang || '101.9758';
  }

  ngOnInit(): void {}

  ionViewDidEnter(): void {
    this.getGpsData();
    this.getSupplyChainData(true, 0);
  }

  /**
   * Get GPS Data for Map
   */
  getGpsData(): void {
    this.pleaseWaitFlag = true;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      language: this.language,
    };

    console.log('GPS Data Request:', req);

    this.supplyChainTraceabilityService
      .getSupplierSupplyChainGpsData(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;

            if (result.httpcode == 200) {
              this.gpsArray = result.data || [];
              this.loadMaps();
            } else {
              this.gpsArray = [];
              this.loadMaps();
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;
            this.gpsArray = [];
            console.error('Failed to get GPS data:', err);
            this.loadMaps();
          });
        },
      });
  }

  /**
   * Get Supply Chain Data with Pagination
   */
  getSupplyChainData(pagerefresh: boolean, pagenum: number): void {
    this.pleaseWaitFlag = true;
    this.noRecordFlag = false;

    if (pagerefresh) {
      this.locationArray = [];
      this.currentPage = 0;
      this.hasMoreData = true; // Reset hasMoreData flag on refresh
      this.totalItems = 0;
      this.totalPages = 0;
    }

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      language: this.language,
      pagenum: pagenum + 1,
    };

    console.log('Supply Chain Data Request:', req);

    this.supplyChainTraceabilityService
      .getSupplierSupplyChainReport(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;
            this.isLoadingMore = false;

            // Check if API call was successful
            if (result.httpcode == 200) {
              // Get pagination info from response
              this.pageSize = parseInt(result.listsize) || 10;
              this.totalPages = result.total_page || 0;
              this.totalItems = this.totalPages * this.pageSize;

              // Check if there is data in the response
              if (result.data && result.data.length > 0) {
                // Add new items to the array
                for (let i = 0; i < result.data.length; i++) {
                  this.locationArray.push(result.data[i]);
                }
                this.noRecordFlag = false;

                // Check if we've loaded all items
                if (this.locationArray.length >= this.totalItems) {
                  this.hasMoreData = false;
                } else {
                  this.hasMoreData = true;
                }
              } else {
                // No data in response - no more data available
                this.hasMoreData = false;
                if (this.locationArray.length === 0) {
                  this.noRecordFlag = true;
                }
              }
            } else {
              // API returned error (e.g., httpcode 202 - No Data Found)
              this.hasMoreData = false; // Stop pagination
              if (this.locationArray.length === 0) {
                this.noRecordFlag = true;
              }
              console.log(
                'API returned:',
                result.message || 'No data available',
              );
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;
            this.isLoadingMore = false;
            this.hasMoreData = false; // Stop pagination on error
            if (this.locationArray.length === 0) {
              this.noRecordFlag = true;
            }
            console.error('Failed to get supply chain data:', err);
          });
        },
      });
  }

  /**
   * Load Google Maps
   */
  loadMaps(): void {
    let latLng;

    if (this.gpsArray && this.gpsArray.length > 0) {
      latLng = new google.maps.LatLng(
        parseFloat(this.gpsArray[0].latitude),
        parseFloat(this.gpsArray[0].longitude),
      );
    } else {
      latLng = new google.maps.LatLng(
        parseFloat(this.millLat),
        parseFloat(this.millLong),
      );
    }

    const mapOptions = {
      center: latLng,
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

    // Hide attribution after map loads
    this.hideMapAttribution();

    this.getMarkers();
  }

  /**
   * Hide Google Maps attribution
   */
  private hideMapAttribution(): void {
    setTimeout(() => {
      const attributionElements = document.querySelectorAll(
        '.gm-style-cc, .gm-style-ccc, .gm-fullscreen-control',
      );
      attributionElements.forEach((el: any) => {
        if (el) {
          el.style.display = 'none';
        }
      });
    }, 1000);
  }

  /**
   * Get Markers from GPS data
   */
  getMarkers(): void {
    for (let i = 0; i < this.gpsArray.length; i++) {
      const gps = this.gpsArray[i];
      if (
        gps.latitude &&
        gps.longitude &&
        gps.latitude !== '-' &&
        gps.longitude !== '-'
      ) {
        this.addMarker(gps);
      }
    }
  }

  /**
   * Add Marker to Map
   */
  addMarker(getmarker: any): void {
    try {
      this.markerIcon = {
        url: 'assets/img/supplier.png',
        scaledSize: new google.maps.Size(25, 32),
      };

      const position = new google.maps.LatLng(
        parseFloat(getmarker.latitude),
        parseFloat(getmarker.longitude),
      );

      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: this.markerIcon,
        position: position,
      });

      this.markersArray.push(marker);
      this.addInfoWindow(marker, getmarker);
    } catch (error) {
      console.error('Failed to add marker:', error);
    }
  }

  /**
   * Add Info Window to Marker
   */
  addInfoWindow(marker: any, markerInfo: any): void {
    let infoWindowContent: string;

    const isCertified =
      markerInfo.certified ===
      this.translate.instant('SUPPLIERSUPPLYCHAIN.mspocertified');

    const color = isCertified ? 'green' : 'red';

    infoWindowContent = `
      <div style="margin:5px">
        <h7 style="text-align:center"><b>${markerInfo.suppliername}</b></h7><br/>
        <h7 style="text-align:center;color:${color}"><b>${markerInfo.certified}</b></h7><br/>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    google.maps.event.addListener(marker, 'click', () => {
      if (this.activeWindow) {
        this.activeWindow.close();
      }
      this.activeWindow = infoWindow;
      infoWindow.open(this.map, marker);
    });

    // Hide close button after info window renders
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      this.hideInfoWindowCloseButton();
    });
  }

  /**
   * Hide close button in InfoWindow
   */
  private hideInfoWindowCloseButton(): void {
    setTimeout(() => {
      const closeButtons = document.querySelectorAll(
        '.gm-ui-hover-effect, button[title*="Close"]',
      );
      closeButtons.forEach((btn: any) => {
        if (btn) {
          btn.style.display = 'none !important';
          btn.style.visibility = 'hidden';
          btn.style.opacity = '0';
          btn.style.width = '0';
          btn.style.height = '0';
          btn.style.padding = '0';
          btn.style.margin = '0';
          btn.style.border = 'none';
          btn.style.overflow = 'hidden';
        }
      });
    }, 200);
  }

  /**
   * Clear all markers from map
   */
  clearOverlays(): void {
    if (this.markersArray) {
      for (let i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray = [];
    }
  }

  /**
   * Handle pagination (infinite scroll)
   * FIX: Check hasMoreData flag before making API call
   */
  newPagination(event: any): void {
    // Check if we have more data to load
    if (!this.hasMoreData) {
      event.target.complete();
      return;
    }

    // Check if we've loaded all items based on total items
    if (this.totalItems > 0 && this.locationArray.length >= this.totalItems) {
      this.hasMoreData = false;
      event.target.complete();
      return;
    }

    // Check if there's no data or no more data to load
    if (this.locationArray.length === 0 || this.noRecordFlag) {
      this.hasMoreData = false;
      event.target.complete();
      return;
    }

    setTimeout(() => {
      // Re-check conditions after timeout
      if (!this.hasMoreData) {
        event.target.complete();
        return;
      }

      // Calculate next page
      const nextPage = Math.ceil(this.locationArray.length / this.pageSize);

      // Check if we've reached the end
      if (this.totalPages > 0 && nextPage >= this.totalPages) {
        this.hasMoreData = false;
        event.target.complete();
        return;
      }

      // Only make API call if we have more data
      if (this.hasMoreData && this.locationArray.length < this.totalItems) {
        this.isLoadingMore = true;
        this.getSupplyChainData(false, nextPage);
      } else {
        this.hasMoreData = false;
      }

      // Complete the infinite scroll event
      event.target.complete();
    }, 500);
  }

  /**
   * Get text color based on certification status
   */
  getTextColor(certificate: string): string {
    let color: string;

    if (
      certificate ===
      this.translate.instant('SUPPLIERSUPPLYCHAIN.mspocertified')
    ) {
      color = '#008000'; // Green for certified
    } else {
      color = '#ff0000'; // Red for not certified
    }

    return color;
  }

  /**
   * Navigate to map screen for specific supplier
   */
  getPolygon(value: any): void {
    this.router.navigate([
      '/supplier-map-screen',
      {
        supplierid: value.supplierid,
        latitude: value.latitude,
        longitude: value.longitude,
      },
    ]);
  }

  /**
   * Validate Latitude and Longitude
   */
  checkIfValidLatitudeAndLongitude(str: string): boolean {
    const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;
    return regexExp.test(str);
  }

  /**
   * Reload Data
   */
  reloadData(): void {
    this.getGpsData();
    this.getSupplyChainData(true, 0);
  }
}
