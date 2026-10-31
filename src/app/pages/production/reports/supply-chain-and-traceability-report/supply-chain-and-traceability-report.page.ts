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
  selector: 'app-supply-chain-and-traceability-report',
  templateUrl: './supply-chain-and-traceability-report.page.html',
  styleUrls: ['./supply-chain-and-traceability-report.page.scss'],
  standalone: false,
})
export class SupplyChainAndTraceabilityReportPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private zone = inject(NgZone);

  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  // Header Configuration
  appTitle: string = this.translate.instant('SUPPLYCHAIN.title');
  showLogo: number = 0;
  showBackButton: number = 1;
  headerActions: string = '';

  // User Data
  userId: number = 0;
  millCode: string = '';
  language: string = '';

  // Map Variables
  map: any;
  markers: any[] = [];
  markerIcon: any;
  latitude: string = '4.2105';
  longitude: string = '101.9758';
  currentInfoWindow: any = null;
  currentHighlightedButton: any = null; // Track currently highlighted button

  // Data Variables
  locationArray: any[] = [];
  supplierDetails: any[] = [];
  buyerDetails: any[] = [];
  totalSupplier: string = '';
  totalBuyer: string = '';

  // UI Flags
  pleaseWaitFlag: boolean = false;
  showNoRecords: boolean = false;

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

    // Subscribe to route params to refresh data
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.getSupplyChainData();
      });
  }

  ngOnInit(): void {
    // Initialize map when component loads
    setTimeout(() => {
      this.getSupplyChainData();
    }, 500);
  }

  /**
   * Get Supply Chain Data from API
   */
  getSupplyChainData(): void {
    this.pleaseWaitFlag = true;
    this.showNoRecords = false;

    const req = {
      userid: this.userId,
      millcode: this.millCode,
      language: this.language,
    };

    console.log('Supply Chain Request:', req);

    this.supplyChainTraceabilityService
      .getSupplyChainReport(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result: any) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;

            if (result.httpcode == 200) {
              this.locationArray = result.data.user_gps || [];
              this.supplierDetails = result.data.supplier_details || [];
              this.buyerDetails = result.data.buyer_details || [];
              this.totalSupplier = result.data.total_supplier || '0';
              this.totalBuyer = result.data.total_buyer || '0';

              this.showNoRecords = false;
              this.loadMaps();
            } else {
              this.locationArray = [];
              this.supplierDetails = [];
              this.buyerDetails = [];
              this.totalSupplier = '0';
              this.totalBuyer = '0';
              this.showNoRecords = true;
              // this.toastService.error(
              //   this.translate.instant('ERROR_MESSAGES.failedToLoadData'),
              // );
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.pleaseWaitFlag = false;
            this.locationArray = [];
            this.supplierDetails = [];
            this.buyerDetails = [];
            this.totalSupplier = '0';
            this.totalBuyer = '0';
            this.showNoRecords = true;
            console.error('Failed to get supply chain data:', err);
            // this.toastService.error(
            //   this.translate.instant('ERROR_MESSAGES.failedToLoadData'),
            // );
          });
        },
      });
  }

  /**
   * Load Google Maps
   */
  loadMaps(): void {
    if (!this.locationArray || this.locationArray.length === 0) {
      console.warn('No location data available');
      return;
    }

    try {
      const position = new google.maps.LatLng(
        parseFloat(this.locationArray[0]?.latitude || this.latitude),
        parseFloat(this.locationArray[0]?.longitude || this.longitude),
      );

      console.log('Map Center Position:', position);

      const mapOptions = {
        center: position,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true, // This removes most UI controls
        // Additional options to remove attribution
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        scaleControl: false,
        rotateControl: false,
        // Remove the "Terms" and "Map Data" links
        attributionControl: false,
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Hide attribution and terms after map loads
      this.hideMapAttribution();

      this.getMarkers();
    } catch (error) {
      console.error('Failed to load map:', error);
    }
  }

  /**
   * Hide Google Maps attribution and terms
   */
  private hideMapAttribution(): void {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Hide the attribution container
      const attributionElements = document.querySelectorAll(
        '.gm-style-cc, .gm-style-ccc, .gm-fullscreen-control',
      );
      attributionElements.forEach((el: any) => {
        if (el) {
          el.style.display = 'none';
        }
      });

      // Hide the "Terms" and "Map Data" links
      const termsElements = document.querySelectorAll(
        'a[href*="maps/terms"], a[href*="map/terms"]',
      );
      termsElements.forEach((el: any) => {
        if (el) {
          el.style.display = 'none';
        }
      });

      // Hide the attribution text
      const attributionText = document.querySelectorAll('.gm-style-cc');
      attributionText.forEach((el: any) => {
        if (el) {
          el.style.display = 'none';
        }
      });
    }, 1000);
  }

  /**
   * Get Markers from location data
   */
  getMarkers(): void {
    console.log('Location Array:', this.locationArray);

    for (let i = 0; i < this.locationArray.length; i++) {
      const location = this.locationArray[i];

      if (location.latitude && location.longitude) {
        this.addMarker(location);
      }
    }
  }

  /**
   * Add Marker to Map
   */
  addMarker(markerData: any): void {
    try {
      this.markerIcon = {
        url: 'assets/img/location.png',
        scaledSize: new google.maps.Size(25, 32),
      };

      const position = new google.maps.LatLng(
        parseFloat(markerData.latitude),
        parseFloat(markerData.longitude),
      );

      const marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: this.markerIcon,
        position: position,
      });

      this.addInfoWindow(marker, markerData);
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

    const trackButtonText = this.translate.instant(
      'SUPPLYCHAIN.tracksupplierlist',
    );
    const buttonStyle =
      this.language !== 'Portuguese'
        ? 'height:30px;width:120px;'
        : 'height:45px;width:130px;';

    if (this.totalSupplier === '0') {
      infoWindowContent = this.buildInfoWindowContent(
        markerInfo.DisplayText,
        isCertified,
        trackButtonText,
        buttonStyle,
        false,
      );
    } else {
      infoWindowContent = this.buildInfoWindowContent(
        markerInfo.DisplayText,
        isCertified,
        trackButtonText,
        buttonStyle,
        true,
      );
    }

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
    });

    // Close previous info window if open
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    // Store reference to current info window
    this.currentInfoWindow = infoWindow;

    // Open info window
    infoWindow.open(this.map, marker);

    // Marker click event - highlight the button
    google.maps.event.addListener(marker, 'click', () => {
      // Close previous info window
      if (this.currentInfoWindow && this.currentInfoWindow !== infoWindow) {
        this.currentInfoWindow.close();
      }

      infoWindow.open(this.map, marker);
      this.currentInfoWindow = infoWindow;

      // Remove highlight from previous button
      if (this.currentHighlightedButton) {
        this.currentHighlightedButton.classList.remove('highlight-btn');
        this.currentHighlightedButton = null;
      }

      // Highlight the button after info window opens
      setTimeout(() => {
        const trackButton = document.getElementById('tracksupplier');
        if (trackButton) {
          // Remove existing highlight class if any
          trackButton.classList.remove('highlight-btn');
          // Force reflow to restart animation
          void trackButton.offsetWidth;
          // Add highlight class (will stay until next marker is clicked)
          trackButton.classList.add('highlight-btn');
          // Store reference to currently highlighted button
          this.currentHighlightedButton = trackButton;
        }
      }, 150);
    });

    // Handle domready event for button click
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      // Hide close button after info window is rendered
      this.hideInfoWindowCloseButton();

      const trackButton = document.getElementById('tracksupplier');
      if (trackButton) {
        trackButton.addEventListener('click', () => {
          this.router.navigate(['/supplier-supply-chain-traceability-report'], {
            queryParams: {
              eachitem: markerInfo.institution_id,
              mspologonumber: markerInfo.certified_name || '',
            },
          });
        });
      }

      // Also hide attribution controls again
      this.hideMapAttribution();
    });
  }

  /**
   * Hide the close button in InfoWindow
   */
  private hideInfoWindowCloseButton(): void {
    setTimeout(() => {
      // Hide all close buttons in info windows
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

      // Also hide any SVG icons inside close buttons
      const closeIcons = document.querySelectorAll(
        '.gm-ui-hover-effect svg, .gm-ui-hover-effect img',
      );
      closeIcons.forEach((icon: any) => {
        if (icon) {
          icon.style.display = 'none';
        }
      });
    }, 200);
  }

  /**
   * Build Info Window Content
   */
  private buildInfoWindowContent(
    displayText: string,
    isCertified: boolean,
    buttonText: string,
    buttonStyle: string,
    showButton: boolean,
  ): string {
    let content = `<div style="margin:5px">`;
    content += `<h7 style="text-align:center"><b>${displayText}</b></h7>`;

    if (showButton) {
      content += `<br/>`;
      content += `<div style="text-align:center; margin-top: 5px;">`;
      content += `<button type="button" class="h7 btn btn-info btn-sm" style="margin-top:5px;${buttonStyle}" id="tracksupplier">`;
      content += buttonText;
      content += `</button>`;
      content += `<br></div>`;
    }

    content += `</div>`;
    return content;
  }

  /**
   * Navigate to Track Supplier Page
   */
  btnTrace(item: any): void {
    console.log('Track Supplier:', item);
    this.router.navigate(['/listdetails'], {
      queryParams: { eachitem: JSON.stringify(item) },
    });
  }

  /**
   * Validate Latitude and Longitude
   */
  checkIfValidLatitudeAndLongitude(str: string): boolean {
    const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;
    return regexExp.test(str);
  }

  /**
   * Reload Map Data
   */
  reloadData(): void {
    this.getSupplyChainData();
  }
}
