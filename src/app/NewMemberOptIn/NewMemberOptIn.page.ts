import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { MembersVistLog, Model } from '../tab2/model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import * as CONSTANTS from '../api/services/Constants';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-NewMemberOptIn',
  templateUrl: 'NewMemberOptIn.page.html',
  styleUrls: ['NewMemberOptIn.page.scss'],
})
export class NewMemberOptInPage {
  countDown: any;
  myInterval: any;
  value: any;
  prog1: any;
  members: any;
  response: any;
  display = '';
  phoneNumber: any = '';
  memberDataExist: any;
  memberProfileExist: any;
  memberVisitLogRes: any;
  newMemberProfileRes: any;
  isLoading = false;
  isMemberExist: any;
  isOverAged: any;
  memberLifeTimeVisit: any;
  signInLog: any = [];
  monthlist: any = [
    { name: 'Month', id: 0 },
    { name: 'January', id: '01' },
    { name: 'February', id: '02' },
    { name: 'March', id: '03' },
    { name: 'April', id: '04' },
    { name: 'May', id: '05' },
    { name: 'June', id: '06' },
    { name: 'July', id: '07' },
    { name: 'August', id: '08' },
    { name: 'September', id: '09' },
    { name: 'October', id: '10' },
    { name: 'November ', id: '11' },
    { name: 'December ', id: '12' },
  ];
  dayList: any = [
    { name: 'Day', id: 0 },
    { name: '1', id: '01' },
    { name: '2', id: '02' },
    { name: '3', id: '03' },
    { name: '4', id: '04' },
    { name: '5', id: '05' },
    { name: '6', id: '06' },
    { name: '7', id: '07' },
    { name: '8', id: '08' },
    { name: '9', id: '09' },
    { name: '10', id: '10' },
    { name: '11 ', id: '11' },
    { name: '12 ', id: '12' },
    { name: '13', id: '13' },
    { name: '14', id: '14' },
    { name: '15', id: '15' },
    { name: '16', id: '16' },
    { name: '17', id: '17' },
    { name: '18', id: '18' },
    { name: '19', id: '19' },
    { name: '20', id: '20' },
    { name: '21', id: '21' },
    { name: '22', id: '22' },
    { name: '23', id: '23' },
    { name: '24', id: '24' },
    { name: '25', id: '25' },
    { name: '26', id: '26' },
    { name: '27', id: '27' },
    { name: '28', id: '28' },
    { name: '29', id: '29' },
    { name: '30', id: '30' },
    { name: '31', id: '31' },
  ];
  _defaultOpts: {
    id: number;
    indexID: number;
    arctext: string;
    colorCode: string;
    probability: number;
    promotionId: number;
    isInteger: boolean;
    configName: string;
  }[] = [];
  displayPopup = 'none';
  multistep = new FormGroup({
    addMemberDetails: new FormGroup({
      optIn: new FormControl('', Validators.required),
      isOverAged: new FormControl(false),
    }),
  });
  newMemberProfileData: any;
  newMemberName: any;
  memberImage: any;
  BusinessGroupID: any = localStorage.getItem('businessGroupId');
  BusinessLocationID: any = localStorage.getItem('businessLocationId');
  SourceID: any = localStorage.getItem('sourceId');
  businessGroupName: any = localStorage.getItem('businessGroupName');
  isAgeRestriction: boolean;
  isOptInPopupRequired: boolean;
  OptInPopupText: string;

  constructor(
    private router: Router,
    private _memberProfile: GetMemberProfileService,
    private m: Model,
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private memberVistLog: MembersVistLog,
    private _spinService: GetMemberProfileService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    // let val = localStorage.getItem('isAgeRestriction');
    // this.isAgeRestriction = val != null && val != '' && val != undefined ? val : false;

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['memberPhone']) {
        this.phoneNumber = JSON.parse(params['memberPhone']);
      }
      if (params && params['isAgeRestriction']) {
        this.isAgeRestriction = JSON.parse(params['isAgeRestriction']);
      }
      if (params && params['memberData']) {
        this.newMemberProfileData = JSON.parse(params['memberData']);
      }
      if (params && params['memberName']) {
        this.newMemberName = JSON.parse(params['memberName']);
      }
      if (params && params['memberImage']) {
        this.memberImage = JSON.parse(params['memberImage']);
      }
      if (params && params['isMemberExist']) {
        this.isMemberExist = JSON.parse(params['isMemberExist']);
      }
      if (params && params['isOverAged']) {
        this.isOverAged = JSON.parse(params['isOverAged']);
        this.multistep.controls['addMemberDetails'].controls[
          'isOverAged'
        ].setValue(this.isOverAged);
        if (this.isOverAged == true) {
          this.multistep.controls['addMemberDetails'].controls[
            'isOverAged'
          ].disable();
        }
      }
      if (params && params['memberLifeTimeVisit']) {
        this.memberLifeTimeVisit = JSON.parse(params['memberLifeTimeVisit']);
      }
      if (params && params['isOptInPopupRequired']) {
        this.isOptInPopupRequired = JSON.parse(params['isOptInPopupRequired']);
      }

      if (params && params['OptInPopupText']) {
        this.OptInPopupText = JSON.parse(params['OptInPopupText']);
      }
    });
  }

  ionViewWillEnter() {
    this.countDown = 30;
    this.value = 30000;
    this.myInterval = setInterval(() => {
      this.counter(30);
    }, 1000);
  }

  ngOnInit() {}

  counter(numbercheck: any) {
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    if (progressBar != null) {
      this.value = this.value - 1000;
      this.prog1 = ((numbercheck - this.value / 1000) * 100) / numbercheck;
      progressBar.setAttribute('data-progress', (this.value / 1000).toString());
      if (this.value <= 1000) {
        clearInterval(this.myInterval);
        this.countDown = 30;
        this.value = 30000;
        this.router.navigate(['tab1']);
      }
    }
  }

  back() {
    this.router.navigate(['/tab1']);
    clearInterval(this.myInterval);
  }

  async getSpinWheelConfig(memberId: any) {
    let action = this._spinService
      .GetSpinWheelConfigByMemberIDBusinessLocationID(
        memberId,
        this.BusinessLocationID,
        1
      )
      .pipe()
      .subscribe({
        next: (data) => {
          this._defaultOpts = [];
          localStorage.removeItem('OPTS');
          data.forEach((element: any) => {
            this._defaultOpts.push({
              id: element.id,
              indexID: element.indexID,
              arctext: element.arctext,
              colorCode: element.colorCode,
              probability: element.probability,
              promotionId: element.promotionId,
              isInteger: element.isInteger,
              configName: element.configName,
            });
          });

          localStorage.setItem('OPTS', JSON.stringify(this._defaultOpts));
        },
        error: (error) => {},
      });
    await Promise.resolve(action);
  }

  get AddMemberDetails() {
    return this.multistep.controls['addMemberDetails']['controls'];
  }

  async submitData() {
    if (this.AddMemberDetails.optIn.value == '') {
      const toast = await this.toastCtrl.create({
        message: 'Please select one option for opt-in!!',
        duration: 3500,
        cssClass: 'custom-toast',
      });
      toast.present();
    } else {
      let optin =
        this.AddMemberDetails.optIn.value == null ||
        this.AddMemberDetails.optIn.value == ''
          ? false
          : this.AddMemberDetails.optIn.value;
      if (optin.toString() == 'false') {
        const alert = await this.alertCtrl.create({
          header: "Are you sure you don't want to opt-in ? ",
          buttons: [
            {
              text: 'Yes',
              role: 'confirm',
              handler: () => {
                this.Save();
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {},
            },
          ],
        });
        await alert.present();
      } else {
        if (this.isOptInPopupRequired == true) {
          this.displayPopup = 'block';
        } else {
          this.Save();
        }
      }
    }
  }

  async submit() {
    if (this.isAgeRestriction == true) {
      if (this.AddMemberDetails.isOverAged.value?.toString() == 'true') {
        this.submitData();
      } else {
        // this.router.navigate(['/tab1']);
        const toast = await this.toastCtrl.create({
          message:
            'Please confirm that you are at least 21 years old to proceed!!',
          duration: 3500,
          cssClass: 'custom-toastDanger',
        });
        toast.present();
      }
    } else {
      this.submitData();
    }
  }

  async Save() {
    try {
      this.isLoading = true;
      if (this.isMemberExist == 'true') {
        let smsoptInValue =
          this.AddMemberDetails.optIn.value == null
            ? false
            : this.AddMemberDetails.optIn.value;
        let overAgedValue =
          this.isAgeRestriction == true
            ? this.AddMemberDetails.isOverAged.value
            : false;
        let idte = this.newMemberProfileData.id;

        this._memberProfile
          .PutSmsOptin(idte, smsoptInValue, overAgedValue)
          .subscribe((data) => {
            let currentDate = CONSTANTS.ISODate();
            this.memberVistLog.MemberId = this.newMemberProfileData.id;
            this.memberVistLog.SignIn = currentDate;
            this.memberVistLog.SourceId = this.SourceID;
            this.memberVistLog.BusinessLocationId = this.BusinessLocationID;
            this.memberVistLog.StateId = 3;
            this.memberVistLog.IsActive = true;
            this.memberVistLog.CreatedBy = 1;
            this.memberVistLog.CreatedDate = currentDate;
            this.memberVistLog.LastModifiedBy = 1;
            this.memberVistLog.LastModifiedDate = currentDate;
            try {
              this._memberProfile
                .PostMemberVisitLog(this.memberVistLog)
                .subscribe(async (data) => {
                  this.memberVisitLogRes = data;
                  if (this.memberVisitLogRes.id > 0) {
                    localStorage.removeItem('memberDetails');
                    this.m.name = this.newMemberName;
                    this.m.currentPoints =
                      this.newMemberProfileData.currentpoints;
                    this.m.memberId = this.newMemberProfileData.id;
                    this.m.memberTableID = this.newMemberProfileData.memberId;
                    this.m.memberSince = this.newMemberProfileData.membersince;
                    this.m.badgeColor = this.newMemberProfileData.badgeColor;
                    this.m.memberImg = this.memberImage;

                    localStorage.setItem(
                      'memberDetails',
                      JSON.stringify(this.m)
                    );

                    await this.getReduceFnSpinwheelConfig();
                  }
                });
            } catch (error) {
              this.isLoading = false;
            }
          });
      } else {
        let currentDate = CONSTANTS.ISODate();

        this.newMemberProfileData.smsoptIn =
          this.AddMemberDetails.optIn.value == null
            ? false
            : this.AddMemberDetails.optIn.value;
        this.newMemberProfileData.lastOptOutDate =
          this.AddMemberDetails.optIn.value == null ||
          this.AddMemberDetails.optIn.value == 'false'
            ? currentDate
            : null;

        this._memberProfile
          .PostMemberProfile(this.newMemberProfileData)
          .subscribe((res: any) => {
            this.newMemberProfileRes = res;

            this.memberVistLog.MemberId = this.newMemberProfileRes.id;
            this.memberVistLog.SignIn = currentDate;
            this.memberVistLog.SourceId = this.SourceID;
            this.memberVistLog.BusinessLocationId = this.BusinessLocationID;
            this.memberVistLog.StateId = 3;
            this.memberVistLog.IsActive = true;
            this.memberVistLog.CreatedBy = 1;
            this.memberVistLog.CreatedDate = currentDate;
            this.memberVistLog.LastModifiedBy = 1;
            this.memberVistLog.LastModifiedDate = currentDate;
            try {
              this._memberProfile
                .PostMemberVisitLog(this.memberVistLog)
                .subscribe((data) => {
                  this.memberVisitLogRes = data;
                  if (this.memberVisitLogRes.id > 0) {
                    this._memberProfile
                      .GetMemberProfileByPhoneNo(
                        this.BusinessGroupID,
                        this.BusinessLocationID,
                        this.phoneNumber
                      )
                      .subscribe(async (resProfile: any) => {
                        let d = resProfile;

                        localStorage.removeItem('memberDetails');
                        this.m.name = this.newMemberName;
                        this.m.currentPoints =
                          this.newMemberProfileRes.currentPoints;
                        this.m.memberId = this.newMemberProfileRes.id;
                        this.m.memberTableID =
                          this.newMemberProfileRes.memberId;
                        this.m.memberSince =
                          this.newMemberProfileRes.createdDate;
                        this.m.badgeColor = d[0].badgeColor;
                        this.m.memberImg = this.memberImage;
                        localStorage.setItem(
                          'memberDetails',
                          JSON.stringify(this.m)
                        );

                        await this.getReduceFnSpinwheelConfig();
                      });
                  }
                });
            } catch (error) {
              this.isLoading = false;
            }
          });
      }

      // ,
      //   async (error) => {
      //     const toast = await this.toastCtrl.create({
      //       message: "Something went wrong, Try again!",
      //       duration: 5000
      //     });
      //     this.isLoading = false;

      //     toast.present();
      //   }
    } catch (error) {
      console.log(error);
    }
  }

  async getReduceFnSpinwheelConfig() {
    this._spinService
      .GetSpinWheelConfigByMemberIDBusinessLocationID(
        this.m.memberId,
        this.BusinessLocationID,
        1
      )
      .pipe()
      .subscribe(
        (data) => {
          this._defaultOpts = [];
          localStorage.removeItem('OPTS');
          data.forEach((element: any) => {
            this._defaultOpts.push({
              id: element.id,
              indexID: element.indexID,
              arctext: element.arctext,
              colorCode: element.colorCode,
              probability: element.probability,
              promotionId: element.promotionId,
              isInteger: element.isInteger,
              configName: element.configName,
            });
          });

          // if (this.memberLifeTimeVisit == 0) {
          localStorage.setItem('OPTS', JSON.stringify(this._defaultOpts));
          this.router.navigate(['/tab2']);
          clearInterval(this.myInterval);
          // } else {
          //   if (this._defaultOpts[0].configName == 'Config 1') {
          //     this.router.navigate(['/customer-details']);
          //   } else {
          //     localStorage.setItem('OPTS', JSON.stringify(this._defaultOpts));
          //     this.router.navigate(['/tab2']);
          //   }
          // }

          this.isLoading = false;
          this.display = '';
          this.phoneNumber = '';
        },
        async (error) => {
          if (error.status == 404) {
            this.router.navigate(['/customer-details']);
            clearInterval(this.myInterval);
            this.isLoading = false;
            this.display = '';
            this.phoneNumber = '';
          }
        }
        // error: error => {
        //   this.isLoading = false;
        //   this.display = '';
        //   this.phoneNumber = '';
        // }
      );
  }

  async closePopupOptin() {
    this.Save();
    this.displayPopup = 'none';
  }
}
