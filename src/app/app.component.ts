import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundService } from './api/services/backgroundService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private backgroundService: BackgroundService) { 
    const token = localStorage.getItem("businessLocationId")
    if (token) {
      this.router.navigate(['tab1']);
    } else {
      this.router.navigate(['']);
    }
    this.backgroundService.startBackgroundTask();
    // this.backgroundService.checkNetworkConnectivity();
  }
}
