import { Component, OnInit, ViewChild } from '@angular/core';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CONSTANTS from '../api/services/Constants';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from 'ngx-countdown';

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
  BusinessLocationLatitude: any = localStorage.getItem(
    'businessLocationLatitude'
  );
  BusinessLocationLongitude: any = localStorage.getItem(
    'businessLocationLongitude'
  );
  SourceID: any = localStorage.getItem('sourceId');
  memberImage: any;
  constant: any = CONSTANTS;
  configFavorite: CountdownConfig = {
    leftTime:
      60 *
      (JSON.parse(localStorage.getItem('DynamicField') || '{}')
        .counterFavorite /
        60),
    formatDate: ({ date }) => `${date / 1000}`,
  };
  bgImgPath2: any =
    CONSTANTS.DownloadAPK_ENDPOINT + localStorage.getItem('BgImg1');
  isTimeOut: any;

  constructor(
    private _memberProfile: GetMemberProfileService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  @ViewChild('cdFavorite', { static: false })
  private countdownFavorite: CountdownComponent;

  ionViewWillEnter() {
    this.isLoading = true;
    this.value1 = 30000;
    this.countDown1 = 30;
    let member: any = JSON.parse(localStorage.getItem('memberDetails') || '{}');
    this.memberId = member.memberId;
    // this.memberId = 25025;
    this.memberTableId = member.memberTableID;
    // this.memberTableId = 15025;
    this.memberName = member.name;
    this.memberSince = member.memberSince;
    this.memberImage = member.memberImg;
    this.memberCurrentPoints =
      typeof member.spinWheelPoint == 'number'
        ? member.currentPoints + member.spinWheelPoint
        : member.currentPoints;
    this.badgeColor = member.badgeColor;

    this.GetBusinessProfilesForFavorite();

    this.isLoading = false;
  }

  ngOnInit() {}

  handleEventFavorite(e: CountdownEvent) {
    if (e.left <= 0) {
      this.isTimeOut = true;
      this.router.navigate(['tab1']);
    }
  }

  likeProfile(business: any) {
    let currentDate = CONSTANTS.ISODate();

    let wishlistData = {
      uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      id: 0,
      memberId: this.memberTableId,
      notes: null,
      badgeId: 1,
      tagId: null,
      businessGroupId: business.businessGroupID,
      lastVisitDate: currentDate,
      lifeTimePoints: 0,
      lifeTimeVisits: 0,
      smsoptIn: false,
      emailOptIn: true,
      notificationOptIn: false,
      isHighroller: false,
      isFreePlayer: false,
      currentPoints: 0,
      sourceId: 14,
      stateId: 3,
      isActive: true,
      createdBy: this.memberId,
      createdDate: currentDate,
      lastModifiedBy: this.memberId,
      lastModifiedDate: currentDate,
      businessLocationID: business.id,
      baseLocationID: business.id,
    };
    this._memberProfile.PostMemberWishlistByLike(wishlistData).subscribe(
      async (data) => {
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

  async GetBusinessProfilesForFavorite() {
    await this._memberProfile
      .GetBusinessProfilesForFavorite(
        this.memberTableId,
        this.BusinessLocationID
      )
      .subscribe(
        (data: any) => {
          this.businessData = data;

          this.businessData.forEach((element: any) => {
            element.imagePath =
              CONSTANTS.DownloadAPK_ENDPOINT + element.imagePath;
            element.logoPath =
              CONSTANTS.DownloadAPK_ENDPOINT + element.logoPath;
            element.businessName =
              element.businessName.toString().length > 21
                ? element.businessName.toString().substring(0, 20) + '...'
                : element.businessName;
            element.distance = Math.ceil(element.distance);
          });
        },
        async (error) => {
          console.log(error);
        }
      );
  }

  toRadian(Value: any) {
    return (Value * Math.PI) / 180;
  }

  submit() {
    if (!this.isTimeOut) {
      this.isLoading = false;
      this.countdownFavorite.stop();
      this.router.navigate(['tab1']);
    }
  }
}
