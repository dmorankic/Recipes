import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  authSub: Subscription;
  isAuthenticated: boolean = false;
  constructor(
    private datastorage: DataStorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onFetch() {
    this.datastorage.fetchData().subscribe();
  }
  onSave() {
    this.datastorage.storeData();
  }
  logOut() {
    this.authService.logOut();
  }
  collapsed = true;
}
