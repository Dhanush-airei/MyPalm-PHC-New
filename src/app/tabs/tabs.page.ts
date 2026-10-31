import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppTab } from 'src/app/shared/models/app-tab.model';
import { RoleTabsService } from 'src/app/shared/services/role-tabs-service/role-tabs-service';
import { RoleService } from 'src/app/shared/services/role-service/role-service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  private destroy$ = new Subject<void>();
  tabs: AppTab[] = [];
  constructor(
    private router: Router,
    private roleTabsService: RoleTabsService,
    private roleService: RoleService,
    private navCtrl: NavController,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.tabs = this.roleTabsService.getTabs();
        console.log('From Tabs page');
        console.log(this.tabs);
      });
    this.navigateToDefaultPage();
  }
  ionViewDidEnter() {
    console.log('==========');
    console.log('ionViewDidEnter');
    this.tabs = this.roleTabsService.getTabs();
    console.log(this.tabs);
  }
  private navigateToDefaultPage(): void {
    const homeRoute = this.roleService.getCurrentHomeRoute();
    this.navCtrl.navigateRoot(homeRoute, { animated: false });
    console.log(`${homeRoute} - homeRoute`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
