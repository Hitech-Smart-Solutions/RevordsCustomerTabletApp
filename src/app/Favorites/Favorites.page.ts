import { Component, OnInit } from '@angular/core';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CONSTANTS from '../api/services/Constants';

@Component({
  selector: 'app-favorites',
  templateUrl: './Favorites.page.html',
  styleUrls: ['./Favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  businessData: any;
  businessDataTemp: any;
  memberId: any;
  memberTableId: any;
  memberName: any;
  memberSince: any;
  memberCurrentPoints: any = 0;
  badgeColor: any;
  value1: any;
  countDown1: any;
  myInterval1: any;
  isLoading: boolean = false;
  BusinessGroupID: any = localStorage.getItem('businessGroupId');
  BusinessLocationID: any = localStorage.getItem('businessLocationId');
  BusinessLocationLatitude: any = localStorage.getItem('businessLocationLatitude');
  BusinessLocationLongitude: any = localStorage.getItem('businessLocationLongitude');
  SourceID: any = localStorage.getItem('sourceId');
  memberImage: any;
  constant: any = CONSTANTS;

  constructor(private _memberProfile: GetMemberProfileService, private toastCtrl: ToastController, private router: Router) { }

  ionViewWillEnter() {
    this.isLoading = true;
    this.value1 = 30000;
    this.countDown1 = 30;
    let member: any = JSON.parse(localStorage.getItem("memberDetails") || '{}');
    this.memberId = member.memberId;
    // this.memberId = 25025;
    this.memberTableId = member.memberTableID;
    // this.memberTableId = 15025;
    this.memberName = member.name;
    this.memberSince = member.memberSince;
    this.memberImage = member.memberImg;
    this.memberCurrentPoints = (typeof (member.spinWheelPoint) == 'number' ? member.currentPoints + member.spinWheelPoint :
      member.currentPoints);
    this.badgeColor = member.badgeColor;


    this.GetBusinessProfileForFavoriteList();

    setTimeout(() => {
      this.isLoading = false;
      this.myInterval1 = setInterval(() => {
        this.counter();
      }, 1000);
    }, 200)
  }

  ngOnInit() { }

  counter() {
    this.value1 = this.value1 - 1000;
    this.countDown1 = this.countDown1 - 1;
    if (this.value1 === 0) {
      clearInterval(this.myInterval1);
      this.router.navigate(['tab1']);
    }
  }

  likeProfile(business: any) {
    let currentDate = CONSTANTS.ISODate();

    let wishlistData = {
      "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": 0,
      "memberId": this.memberTableId,
      "notes": null,
      "badgeId": 1,
      "tagId": null,
      "businessGroupId": business.businessGroupID,
      "lastVisitDate": currentDate,
      "lifeTimePoints": 0,
      "lifeTimeVisits": 0,
      "smsoptIn": false,
      "emailOptIn": true,
      "notificationOptIn": false,
      "isHighroller": false,
      "currentPoints": 0,
      "sourceId": 14,
      "stateId": 3,
      "isActive": true,
      "createdBy": this.memberId,
      "createdDate": currentDate,
      "lastModifiedBy": this.memberId,
      "lastModifiedDate": currentDate,
      "businessLocationID": business.id,
      "baseLocationID": business.id
    };
    this._memberProfile.PostMemberWishlistByLike(wishlistData).subscribe(async (data) => {
      this.businessData.forEach((element: any) => {
        if (element.id == business.id) {
          element.isLiked = true;
        }
      });
      // this.GetBusinessProfileForFavoriteList();
    },
      async (error) => {
        console.log(error);
      }
    );
  }


  async GetBusinessProfileForFavoriteList() {
    await this._memberProfile.GetBusinessProfileForFavorite(this.memberTableId).subscribe((data: any) => {
      this.businessData = data;
      this.businessData.forEach((element: any) => {

        let lat2 = parseFloat(element.latitude)
        let lon2 = parseFloat(element.longitude)

        let lat1 = this.BusinessLocationLatitude
        let lon1 = this.BusinessLocationLongitude

        let R = 6371  // km
        let x1 = lat2 - lat1
        let dLat = this.toRadian(x1)
        let x2 = lon2 - lon1
        let dLon = this.toRadian(x2)
        let a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.toRadian(lat1)) * Math.cos(this.toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let d = R * c
        element.distance = Number(d * 0.621371);
      });

      this.businessDataTemp = this.businessData;
      this.businessDataTemp = this.businessData.slice().sort((a: any, b: any) => a.distance - b.distance);

      this.businessData = this.businessData.filter((x: any) => x.isLiked == false && x.distance != 0);

      if (this.businessData.length == 0) {
        this.businessData = this.businessDataTemp.filter((x: any) => x.distance != 0);
        this.businessData = this.businessDataTemp.slice(1, 4);
      } else {
        this.businessData = this.businessData.slice().sort((a: any, b: any) => a.distance - b.distance);
        this.businessData = this.businessData.slice(0, 3);
      }

      this.businessData.forEach((element: any) => {
        element.imagePath = CONSTANTS.DownloadAPK_ENDPOINT + element.imagePath;
        element.logoPath = CONSTANTS.DownloadAPK_ENDPOINT + element.logoPath;
        element.businessName = element.businessName.toString().length > 21 ? element.businessName.toString().substring(0, 20) + '...' : element.businessName;
        element.distance = Math.ceil(element.distance);
      });
    },
      async (error) => {
        console.log(error);
      }
    );
  }

  toRadian(Value: any) {
    return Value * Math.PI / 180;
  }

  ionViewDidLeave() {
    // Do actions here
    clearInterval(this.myInterval1);
  }

  submit() {
    clearInterval(this.myInterval1);
    this.isLoading = false;
    this.router.navigate(['tab1']);
  }
}
