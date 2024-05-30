import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { MembersVistLog, Model } from '../tab2/model';
import { FormBuilder } from '@angular/forms';
import * as CONSTANTS from '../api/services/Constants';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  members: any;
  response: any;
  display = '';
  phoneNumber: any = '';
  memberDataExist: any;
  memberProfileExist: any;
  memberVisitLogRes: any;
  newMemberProfileRes: any;
  isLoading = false;
  signInLog: any = [];
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
  BusinessGroupID: any = localStorage.getItem('businessGroupId');
  BusinessLocationID: any = localStorage.getItem('businessLocationId');
  SourceID: any = localStorage.getItem('sourceId');
  currentVersion: any;
  @ViewChild(IonModal) modal: IonModal;
  isModalOpen = false;
  isInfoModalOpen = false;
  businessGroupLogo: any;
  isAgeRestriction: boolean;
  isOptInPopupRequired: boolean;
  OptInPopupText: string;
  businessGroupName: any;
  sourceName: any;
  businessGroupId: any;
  InfoText: any;
  dynamicField: any;
  bgImg: any;

  constructor(
    private router: Router,
    private _memberProfile: GetMemberProfileService,
    private m: Model,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private _spinService: GetMemberProfileService,
    private platform: Platform,
    private memberVisitLog: MembersVistLog,
    private toastCtrl: ToastController,
    private appVersionNative: AppVersion
  ) {
    this.sourceName = localStorage.getItem('sourceName');
    this.businessGroupName = localStorage.getItem('businessGroupName');
    // this.businessGroupLogo = localStorage.getItem('businessGroupImage');
    this.businessGroupId = localStorage.getItem('businessGroupId');

    this.appVersionNative
      .getVersionNumber()
      .then(async (versionNumber: any) => {
        this.currentVersion = versionNumber;
      });
  }

  ionViewDidEnter() {
    const subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        // do nothing
      }
    );
  }

  ionViewWillEnter() {
    this.GetChecklistByBusinessGroupID();
    this.GetDynamicFieldsByBusinessGroupId();
    this._memberProfile
      .GetBusinessProfilesByID(this.BusinessLocationID)
      .subscribe((data: any) => {
        this.isAgeRestriction = data.isAgeRestriction;
        this.isOptInPopupRequired = data.isOptInPopupRequired;
        this.OptInPopupText = data.optInPopupText;
        this.businessGroupLogo =
          CONSTANTS.DownloadAPK_ENDPOINT + data.businessGroupLogo;
      });
  }

  ngOnInit() {}

  async DisplayToastSignIn() {
    const toast = await this.toastCtrl.create({
      message: "You're already Sign In!",
      duration: 3500,
      cssClass: 'custom-toast',
    });
    toast.present();
  }

  async signUp() {
    if (!this.isModalOpen) {
      this.isLoading = true;
      localStorage.removeItem('memberDetails');
      if (
        this.phoneNumber.length == 10 &&
        !/^([0-9])\1*$/.test(this.phoneNumber) &&
        !/^[0][0-9]/.test(this.phoneNumber)
      ) {
        this._memberProfile.GetMemberExistByPhoneNo(this.phoneNumber).subscribe(
          (res: any) => {
            this.memberDataExist = res;

            this._memberProfile
              .GetMemberProfileByPhoneNo(
                this.BusinessGroupID,
                this.BusinessLocationID,
                this.phoneNumber
              )
              .subscribe(
                (resProfile: any) => {
                  this.memberProfileExist = resProfile;

                  this._memberProfile
                    .GetMemberBySignout(this.BusinessLocationID, this.SourceID)
                    .subscribe((data: any) => {
                      this.signInLog = data;
                      let signInId: Array<number> = [];

                      this.signInLog.forEach((element: any) => {
                        signInId.push(element.memberId);
                      });

                      if (signInId.includes(this.memberProfileExist[0].id)) {
                        this.display = '';
                        this.phoneNumber = '';
                        this.isLoading = false;
                        this.DisplayToastSignIn();
                      } else {
                        this.m.name = this.memberProfileExist[0].name;
                        this.m.currentPoints =
                          this.memberProfileExist[0].currentpoints;
                        this.m.memberId = this.memberProfileExist[0].id;
                        this.m.memberTableID =
                          this.memberProfileExist[0].memberId;
                        this.m.memberSince =
                          this.memberProfileExist[0].membersince;
                        this.m.badgeColor =
                          this.memberProfileExist[0].badgeColor;
                        this.m.memberImg =
                          this.memberDataExist[0].memberImageFile;
                        localStorage.setItem(
                          'memberDetails',
                          JSON.stringify(this.m)
                        );

                        if (this.memberProfileExist[0].isAskOptIn == true) {
                          let navigationExtras: NavigationExtras = {
                            queryParams: {
                              memberName: JSON.stringify(
                                this.memberProfileExist[0].name
                              ),
                              memberImage: JSON.stringify(
                                this.memberProfileExist[0].memberImageFile
                              ),
                              memberPhone: JSON.stringify(this.phoneNumber),
                              isMemberExist: JSON.stringify('true'),
                              memberLifeTimeVisit: JSON.stringify(
                                this.memberProfileExist[0].lifetimeVisits
                              ),
                              isAgeRestriction: JSON.stringify(
                                this.isAgeRestriction
                              ),
                              isOptInPopupRequired: JSON.stringify(
                                this.isOptInPopupRequired
                              ),
                              OptInPopupText: JSON.stringify(
                                this.OptInPopupText
                              ),
                              isOverAged: JSON.stringify(
                                this.memberProfileExist[0].isOverAged
                              ),
                              memberData: JSON.stringify(
                                this.memberProfileExist[0]
                              ),
                            },
                          };
                          this.display = '';
                          this.phoneNumber = '';
                          this.isLoading = false;
                          this.router.navigate(
                            ['/NewMemberOptIn'],
                            navigationExtras
                          );
                        } else {
                          this._spinService
                            .GetSpinWheelConfigByMemberIDBusinessLocationID(
                              this.m.memberId,
                              this.BusinessLocationID,
                              1
                            )
                            .pipe()
                            .subscribe(
                              (data: any) => {
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

                                localStorage.setItem(
                                  'OPTS',
                                  JSON.stringify(this._defaultOpts)
                                );
                                let currentDate = CONSTANTS.ISODate();
                                this.memberVisitLog.MemberId =
                                  this.memberProfileExist[0].id;
                                this.memberVisitLog.SignIn = currentDate;
                                this.memberVisitLog.SourceId = this.SourceID;
                                this.memberVisitLog.BusinessLocationId =
                                  this.BusinessLocationID;
                                this.memberVisitLog.StateId = 3;
                                this.memberVisitLog.IsActive = true;
                                this.memberVisitLog.CreatedBy = 1;
                                this.memberVisitLog.CreatedDate = currentDate;
                                this.memberVisitLog.LastModifiedBy = 1;
                                this.memberVisitLog.LastModifiedDate =
                                  currentDate;

                                this._memberProfile
                                  .PostMemberVisitLog(this.memberVisitLog)
                                  .subscribe((data) => {
                                    this.response = data;
                                  });

                                this.router.navigate(['/tab2']);
                                this.display = '';
                                this.phoneNumber = '';
                                this.isLoading = false;
                              },
                              async (error) => {
                                if (error.status == 404) {
                                  let currentDate = CONSTANTS.ISODate();
                                  this.memberVisitLog.MemberId =
                                    this.memberProfileExist[0].id;
                                  this.memberVisitLog.SignIn = currentDate;
                                  this.memberVisitLog.SourceId = this.SourceID;
                                  this.memberVisitLog.BusinessLocationId =
                                    this.BusinessLocationID;
                                  this.memberVisitLog.StateId = 3;
                                  this.memberVisitLog.IsActive = true;
                                  this.memberVisitLog.CreatedBy = 1;
                                  this.memberVisitLog.CreatedDate = currentDate;
                                  this.memberVisitLog.LastModifiedBy = 1;
                                  this.memberVisitLog.LastModifiedDate =
                                    currentDate;

                                  this._memberProfile
                                    .PostMemberVisitLog(this.memberVisitLog)
                                    .subscribe((data) => {
                                      this.response = data;
                                      this.router.navigate([
                                        '/customer-details',
                                      ]);
                                      this.display = '';
                                      this.phoneNumber = '';
                                      this.isLoading = false;
                                    });
                                }
                              }
                            );
                        }
                      }
                    });
                },
                async (error) => {
                  if (error.status == 404) {
                    let currentDate = CONSTANTS.ISODate();
                    let newMemberProfileData = {
                      uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                      id: 0,
                      memberId: this.memberDataExist[0].memberId,
                      notes: null,
                      badgeId: 1,
                      tagId: null,
                      businessGroupId: this.BusinessGroupID,
                      lastVisitDate: currentDate,
                      lifeTimePoints: 0,
                      lifeTimeVisits: 0,
                      emailOptIn: true,
                      notificationOptIn: true,
                      currentPoints: 0,
                      sourceId: this.SourceID,
                      stateId: 3,
                      isActive: true,
                      createdBy: 1,
                      createdDate: currentDate,
                      lastModifiedBy: 1,
                      lastModifiedDate: currentDate,
                      isHighroller: 0,
                      businessLocationID: this.BusinessLocationID,
                      baseLocationID: this.BusinessLocationID,
                    };

                    let navigationExtras: NavigationExtras = {
                      queryParams: {
                        memberName: JSON.stringify(
                          this.memberDataExist[0].name
                        ),
                        memberImage: JSON.stringify(
                          this.memberDataExist[0].memberImageFile
                        ),
                        memberPhone: JSON.stringify(this.phoneNumber),
                        isMemberExist: JSON.stringify('false'),
                        memberLifeTimeVisit: JSON.stringify(0),
                        isAgeRestriction: JSON.stringify(this.isAgeRestriction),
                        isOptInPopupRequired: JSON.stringify(
                          this.isOptInPopupRequired
                        ),
                        OptInPopupText: JSON.stringify(this.OptInPopupText),
                        isOverAged: JSON.stringify('false'),
                        memberData: JSON.stringify(newMemberProfileData),
                      },
                    };
                    this.display = '';
                    this.phoneNumber = '';
                    this.isLoading = false;
                    this.router.navigate(['/NewMemberOptIn'], navigationExtras);
                  } else {
                    const toast = await this.toastCtrl.create({
                      message: 'Something went wrong, Try again!',
                      duration: 5000,
                      cssClass: 'custom-toast',
                    });
                    toast.present();
                  }
                }
              );
          },
          async (error) => {
            if (error.status == 404) {
              this.isLoading = false;
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  memberPhone: JSON.stringify(this.phoneNumber),
                  isAgeRestriction: JSON.stringify(this.isAgeRestriction),
                  isOptInPopupRequired: JSON.stringify(
                    this.isOptInPopupRequired
                  ),
                  OptInPopupText: JSON.stringify(this.OptInPopupText),
                },
              };
              this.router.navigate(['/NewMember'], navigationExtras);
              this.display = '';
              this.phoneNumber = '';
            } else {
              this.isLoading = false;
              const toast = await this.toastCtrl.create({
                message: 'Something went wrong, Try again!',
                duration: 5000,
                cssClass: 'custom-toast',
              });
              toast.present();
            }
          }
        );
      } else {
        this.isLoading = false;
        this.display = '';
        this.phoneNumber = '';
        const toast = await this.toastCtrl.create({
          message: 'Enter Valid Phone Number',
          duration: 5000,
          cssClass: 'custom-toastDanger',
        });
        toast.present();
      }
    }
  }

  setPrivacyModal(value: any) {
    this.isModalOpen = value;
  }

  setInfoModal(value: any) {
    this.isInfoModalOpen = value;
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

  click(val: any) {
    if (!this.isModalOpen) {
      switch (val) {
        case 'delete-left':
          if (this.phoneNumber) {
            let displayLength = this.phoneNumber.length;
            this.phoneNumber = this.phoneNumber.substring(0, displayLength - 1);

            let len = this.display.length;
            if (len == 11) {
              this.display = this.display.substring(0, this.display.length - 2);
            } else if (len == 7) {
              this.display = this.display.substring(0, this.display.length - 2);
            } else if (len == 5) {
              this.display = this.display.substring(0, this.display.length - 2);
            } else if (len == 2) {
              this.display = '';
            } else {
              this.display = this.display.substring(0, this.display.length - 1);
            }
          }
          break;
        case '0':
          this.addnumber('0');
          break;
        case '1':
          this.addnumber('1');
          break;
        case '2':
          this.addnumber('2');
          break;
        case '3':
          this.addnumber('3');
          break;
        case '4':
          this.addnumber('4');
          break;
        case '5':
          this.addnumber('5');
          break;
        case '6':
          this.addnumber('6');
          break;
        case '7':
          this.addnumber('7');
          break;
        case '8':
          this.addnumber('8');
          break;
        case '9':
          this.addnumber('9');
          break;
      }
    }
  }

  addnumber(nbr: string) {
    let len = this.phoneNumber.length;

    if (len >= 10) {
      this.display = this.display;
      this.phoneNumber = this.phoneNumber;
    } else {
      this.phoneNumber = this.phoneNumber.toString() + nbr;

      if (len == 0) {
        this.display = '(' + nbr;
      } else if (len == 2) {
        this.display += nbr + ')';
      } else if (len == 3) {
        this.display += ' ' + nbr;
      } else if (len == 6) {
        this.display += '-' + nbr;
      } else if (len == 10) {
        this.display = this.phoneNumber;
      } else {
        this.display += nbr;
      }
    }
  }

  GetChecklistByBusinessGroupID() {
    //For getting checklist if no member sign in currently
    this._memberProfile
      .GetBusinessGroupWiseTextconfiguration(this.businessGroupId)
      .subscribe((data: any) => {
        this.InfoText = data;
      });
  }

  GetDynamicFieldsByBusinessGroupId() {
    this._memberProfile
      .GetDynamicFieldsByBusinessGroupId(this.businessGroupId)
      .subscribe(async (data: any) => {
        localStorage.removeItem('DynamicField');

        localStorage.setItem('DynamicField', JSON.stringify(data));
        if (
          localStorage.getItem('BgImg') == null ||
          localStorage.getItem('BgImg') == undefined ||
          localStorage.getItem('BgImg') == ''
        ) {
          localStorage.removeItem('BgImg');
          localStorage.setItem('BgImg', String(data.customerBGPath1));
        } else {
          if (
            (localStorage.getItem('BgImg') || '').toString().trim() !=
            data.customerBGPath1.toString().trim()
          ) {
            localStorage.removeItem('BgImg');
            localStorage.setItem('BgImg', String(data.customerBGPath1));
          }
        }
        this.bgImg =
          CONSTANTS.DownloadAPK_ENDPOINT + localStorage.getItem('BgImg');

        if (
          localStorage.getItem('BgImg1') == null ||
          localStorage.getItem('BgImg1') == undefined ||
          localStorage.getItem('BgImg1') == ''
        ) {
          localStorage.removeItem('BgImg1');
          localStorage.setItem('BgImg1', String(data.customerBGPath2));
        } else {
          if (
            (localStorage.getItem('BgImg1') || '').toString().trim() !=
            data.customerBGPath2.toString().trim()
          ) {
            localStorage.removeItem('BgImg1');
            localStorage.setItem('BgImg1', String(data.customerBGPath2));
          }
        }

        this.dynamicField = JSON.parse(
          localStorage.getItem('DynamicField') || '{}'
        );
      });
  }
}
