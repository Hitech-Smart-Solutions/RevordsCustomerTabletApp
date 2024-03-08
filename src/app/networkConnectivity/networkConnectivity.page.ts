import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-networkConnectivity',
  templateUrl: 'networkConnectivity.page.html',
  styleUrls: ['networkConnectivity.page.scss']
})
export class NetworkConnectivityPage implements ViewWillEnter {
  token: any;

  constructor(public activatedRoute: ActivatedRoute, private router: Router) {
    this.token = localStorage.getItem("businessLocationId");
  }

  ionViewWillEnter() {
    //   this.ngOnInit();
  }

  ngOnInit() { }

  back() {
    if (this.token) {
      this.router.navigate(['tab1']);
    } else {
      this.router.navigate(['']);
    }
  }
}
