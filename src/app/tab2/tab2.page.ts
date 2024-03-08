import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Model, ActivityHistory } from './model';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import * as CONSTANTS from '../api/services/Constants';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  number: any = Math.ceil(Math.random() * 1000);
  memberId: any;
  memberTableId: any;
  memberName: any;
  memberImage: any;
  memberSince: any;
  memberCurrentPoints: any = 0;
  badgeColor: any;
  spinning: boolean = false;
  spanclassname: any = 'arrow1';
  spanclasshover: any = 'spanHover';
  winningPrize: any = '';
  spinWheelOpts: any;
  spinWheelIndex: any;
  BusinessGroupID: any = localStorage.getItem('businessGroupId');
  BusinessLocationID: any = localStorage.getItem('businessLocationId');
  SourceID: any = localStorage.getItem('sourceId');
  display = "none";
  countDownBefore: any;
  countDownAfter: any;
  myIntervalBefore: any;
  myIntervalAfter: any;
  valueBefore: any;
  valueAfter: any;
  prog: any;
  showSpinCountdown: boolean = true;
  constnt: any = CONSTANTS;
  isSpin: boolean;

  constructor(public dataService: DataService, public activatedRoute: ActivatedRoute, private _memberProfile: GetMemberProfileService,
    private router: Router, private memberData: Model, private activity: ActivityHistory, private toastCtrl: ToastController,
    private platform: Platform) {
    let member: any = JSON.parse(localStorage.getItem("memberDetails") || '{}');
    this.memberId = member.memberId;
    this.memberTableId = member.memberTableID;
    this.memberName = member.name;
    this.memberImage = member.memberImg;
    this.memberSince = member.memberSince;
    this.memberCurrentPoints = member.currentPoints;
    this.badgeColor = member.badgeColor;

    this.spinWheelOpts = JSON.parse(localStorage.getItem("OPTS") || '{}');

    // this.countDown = 20;
  }
  @ViewChild("wheel", { static: false }) wheel: ElementRef;


  ionViewWillEnter() {
    this.isSpin = true;
    this.countDownBefore = 40;
    this.valueBefore = 40000;
    this.GetSpinWheelProbabilityByMemberIDBusinessGroupID();
    this.number = Math.ceil(Math.random() * 1000);
    this.spinning = false;
    this.spanclassname = 'arrow1';
    this.spanclasshover = 'spanHover';
    this.winningPrize = '';
    this.closePopup();
    this.wheel.nativeElement.style.transform = "rotate(0)";

    this.myIntervalBefore = setInterval(() => {
      this.counterBefore(this.valueBefore);
    }, 1000);
    const subscription = this.platform.backButton.subscribeWithPriority(99999, async () => {
    });
  }

  ngOnInit(): void {
  }

  openPopup() {
    this.display = "block";
    this.countDownAfter = 20;
    this.valueAfter = 20000;
  }
  closePopup() {
    this.display = "none";
  }

  resetWheel() {
    this.dataService.resetToDefault();
  }

  GetSpinWheelProbabilityByMemberIDBusinessGroupID() {
    this._memberProfile.GetSpinWheelProbabilityByMemberIDBusinessGroupID(this.memberId, this.BusinessGroupID, this.spinWheelOpts[0].promotionId)
      .subscribe((data: any) => {
        this.spinWheelIndex = data["spinwheelindex"];
      },
        async (error) => {
          // console.log(error);
        });
  }

  continue() {
    if (this.spinWheelOpts[this.spinWheelIndex].isInteger == true) {
      clearInterval(this.myIntervalAfter);
      this.showSpinCountdown = false;
      this.countDownBefore = 40;
      this.valueBefore = 40000;
      this.router.navigate(['/revord-summary']);
    }
    else {
      clearInterval(this.myIntervalAfter);
      this.showSpinCountdown = false;
      this.countDownBefore = 40;
      this.valueBefore = 40000;
      this.router.navigate(['/customer-details']);
    }
  }

  counterBefore(numbercheck: any) {
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    if (progressBar != null) {
      this.valueBefore = this.valueBefore - 1000;
      this.prog = (((numbercheck - (this.valueBefore / 1000)) * 100) / numbercheck);

      progressBar.setAttribute('data-progress', (this.valueBefore / 1000).toString());
      if (this.valueBefore == 0) {
        clearInterval(this.myIntervalBefore);
        this.router.navigate(['tab1']);
        this.countDownBefore = 40;
        this.valueBefore = 40000;
      }
    }
  }

  counterAfter(numbercheck: any) {
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    if (progressBar != null) {
      this.valueAfter = this.valueAfter - 1000;
      this.prog = (((numbercheck - (this.valueAfter / 1000)) * 100) / numbercheck);

      progressBar.setAttribute('data-progress', (this.valueAfter / 1000).toString());
      if (this.valueAfter == 0) {
        clearInterval(this.myIntervalAfter);
        this.router.navigate(['tab1']);
        this.countDownAfter = 20;
        this.valueAfter = 20000;
      }
    }
  }

  ionViewDidLeave() {
    // Do actions here
    clearInterval(this.myIntervalBefore);
    clearInterval(this.myIntervalAfter);
  }

  async Spin() {
    this.spinning = true;
    this.isSpin = false;
    let rotate = (this.spinWheelIndex * 45);
    clearInterval(this.myIntervalBefore);
    this.showSpinCountdown = false;
    let rand = Math.random();
    this.number += Math.ceil(rand * 10000);
    this.wheel.nativeElement.style.transform = "rotate(" + (rotate + (30 * 360)) + "deg)";
    this.wheel.nativeElement.style.transition = "all 15s";
    setTimeout(() => {
      this.spanclassname = 'arrow1 arrowanimation';
      this.spanclasshover = "spanHover spanHoveranimation";

      for (let i = 0; i < this.spinWheelOpts.length; i++) {
        if (i == this.spinWheelIndex) {
          this.winningPrize = this.spinWheelOpts[i].arctext;

          if (this.spinWheelOpts[i].isInteger == true) {
            let p = Number(this.winningPrize.replace(" Points", ""));
            let currentDate = CONSTANTS.ISODate();
            let updatedPoints = {
              "memberId": this.memberId,
              "currentPoints": p,
              "lastVisitDate": currentDate,
              "lastModifiedDate": currentDate,
              "lastModifiedBy": this.BusinessLocationID
            }
            this._memberProfile.PutMemberProfilePoints(updatedPoints).subscribe(data => {

              localStorage.removeItem("memberDetails");
              this.memberData.memberId = this.memberId;
              this.memberData.memberTableID = this.memberTableId;
              this.memberData.name = this.memberName;
              this.memberData.memberSince = this.memberSince;
              this.memberData.memberImg = this.memberImage;
              this.memberData.currentPoints = this.memberCurrentPoints;
              this.memberData.spinWheelPoint = p;
              this.memberData.badgeColor = this.badgeColor;
              localStorage.setItem("memberDetails", JSON.stringify(this.memberData));

              let currentDate = CONSTANTS.ISODate();
              this.activity.memberId = parseInt(this.memberId);
              this.activity.activityDate = currentDate;
              this.activity.activityTypeId = 4;
              this.activity.points = p;
              this.activity.sourceId = this.SourceID;
              this.activity.stateId = 3;
              this.activity.isActive = true;
              this.activity.createdBy = 1;
              this.activity.createdDate = currentDate;
              this.activity.lastModifiedBy = 1;
              this.activity.lastModifiedDate = currentDate;
              this.activity.promotionID = this.spinWheelOpts[i].promotionId;
              this.activity.spinWheelID = this.spinWheelOpts[i].id;
              this.activity.businessLocationId = this.BusinessLocationID;
              this.activity.spinWheelText = this.winningPrize;
              this.activity.isSpinRedeem = true;

              this._memberProfile.PostActivityHistory(this.activity).subscribe(data => {
              },
                async (error) => {
                  const toast = await this.toastCtrl.create({
                    message: error.statusText,
                    duration: 3000
                  });
                  // toast.present();
                });
            });
          }
          else {
            localStorage.removeItem("memberDetails");
            this.memberData.memberId = this.memberId;
            this.memberData.memberTableID = this.memberTableId;
            this.memberData.name = this.memberName;
            this.memberData.memberSince = this.memberSince;
            this.memberData.memberImg = this.memberImage;
            this.memberData.currentPoints = this.memberCurrentPoints;
            this.memberData.spinWheelPoint = this.winningPrize;
            this.memberData.badgeColor = this.badgeColor;
            localStorage.setItem("memberDetails", JSON.stringify(this.memberData));

            let currentDate = CONSTANTS.ISODate();
            this.activity.memberId = parseInt(this.memberId);
            this.activity.activityDate = currentDate;
            this.activity.activityTypeId = 4;
            this.activity.points = 0;
            this.activity.sourceId = this.SourceID;
            this.activity.stateId = 3;
            this.activity.isActive = true;
            this.activity.createdBy = 1;
            this.activity.createdDate = currentDate;
            this.activity.lastModifiedBy = 1;
            this.activity.lastModifiedDate = currentDate;
            this.activity.promotionID = this.spinWheelOpts[i].promotionId;
            this.activity.spinWheelID = this.spinWheelOpts[i].id;
            this.activity.businessLocationId = this.BusinessLocationID;
            this.activity.spinWheelText = this.winningPrize;
            this.activity.isSpinRedeem = false;

            this._memberProfile.PostActivityHistory(this.activity).subscribe(data => {
            },
              async (error) => {
                const toast = await this.toastCtrl.create({
                  message: error.statusText,
                  duration: 3000
                });
                // toast.present();
              });
          }
        }
      }
    }, 15300);

    setTimeout(() => {
      this.openPopup();
      this.countDownAfter = 20;
      this.valueAfter = 20000;
      this.showSpinCountdown = true;
      this.myIntervalAfter = setInterval(() => {
        this.counterAfter(20);
      }, 1000);
    },
      18000);
  }
}
