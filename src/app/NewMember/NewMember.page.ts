import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { Model } from '../tab2/model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import * as CONSTANTS from '../api/services/Constants';
import { Subscription, interval } from 'rxjs';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from 'ngx-countdown';

@Component({
  selector: 'app-NewMember',
  templateUrl: 'NewMember.page.html',
  styleUrls: ['NewMember.page.scss'],
})
export class NewMemberPage {
  prog1NewMember: any;
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
  newMemberData: any;
  monthlist: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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
      name: new FormControl(''),
      email: new FormControl(
        '',
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ),
      monthID: new FormControl(''),
      dayID: new FormControl(''),
      isOverAged: new FormControl(false),
      optIn: new FormControl('', Validators.required),
    }),
  });
  BusinessGroupID: any = localStorage.getItem('businessGroupId');
  BusinessLocationID: any = localStorage.getItem('businessLocationId');
  SourceID: any = localStorage.getItem('sourceId');
  businessGroupName: any = localStorage.getItem('businessGroupName');
  days: number[];
  isMonthSelect: any = false;
  isAgeRestriction: boolean;
  isOptInPopupRequired: boolean;
  OptInPopupText: string;
  dynamicField: any;
  data: any;
  bgImg: any = CONSTANTS.DownloadAPK_ENDPOINT + localStorage.getItem('BgImg');
  alert: any;

  constructor(
    private router: Router,
    private _memberProfile: GetMemberProfileService,
    private m: Model,
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['memberPhone']) {
        this.phoneNumber = JSON.parse(params['memberPhone']);
      }

      if (params && params['isAgeRestriction']) {
        this.isAgeRestriction = JSON.parse(params['isAgeRestriction']);
      }

      if (params && params['isOptInPopupRequired']) {
        this.isOptInPopupRequired = JSON.parse(params['isOptInPopupRequired']);
      }

      if (params && params['OptInPopupText']) {
        this.OptInPopupText = JSON.parse(params['OptInPopupText']);
      }
    });
  }
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  config: CountdownConfig = {
    leftTime:
      60 *
      (JSON.parse(localStorage.getItem('DynamicField') || '{}')
        .counterNewMember /
        60),
    formatDate: ({ date }) => `${date / 1000}`,
  };

  async ionViewWillEnter() {
    this.dynamicField = JSON.parse(
      localStorage.getItem('DynamicField') || '{}'
    );
    if (Object.keys(this.dynamicField).length == 0) {
      if (this.alert != undefined && this.alert != null) {
        this.alert.dismiss();
      }
      this.router.navigate(['tab1']);
      this._memberProfile.toastMessage(
        'Something went wrong. Please try again.',
        2500,
        'custom-toastDanger'
      );
    }
  }

  ngOnInit() {}

  handleEvent(e: CountdownEvent) {
    if (e.left <= 0) {
      if (this.alert != undefined && this.alert != null) {
        this.alert.dismiss();
      }
      this.router.navigate(['tab1']);
    }
  }

  get Email() {
    return this.multistep.controls['addMemberDetails'].get('email');
  }

  back() {
    if (this.alert != undefined && this.alert != null) {
      this.alert.dismiss();
    }
    this.router.navigate(['/tab1']);
  }

  onMonthChange() {
    if (
      this.AddMemberDetails.monthID.value != '' &&
      this.AddMemberDetails.monthID.value != null &&
      this.AddMemberDetails.monthID.value != undefined
    ) {
      this.isMonthSelect = true;
      this.multistep.controls['addMemberDetails'].controls['dayID'].setValue(
        ''
      );
      switch (this.AddMemberDetails.monthID.value) {
        case 'February':
          this.days = Array.from({ length: 29 }, (_, i) => i + 1);
          break;
        case 'April':
        case 'June':
        case 'September':
        case 'November':
          this.days = Array.from({ length: 30 }, (_, i) => i + 1);
          break;
        default:
          this.days = Array.from({ length: 31 }, (_, i) => i + 1);
          break;
      }
    }
  }

  async getSpinWheelConfig(memberId: any) {
    let action = this._memberProfile
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
    if (
      (this.AddMemberDetails.optIn.value == null ||
        this.AddMemberDetails.optIn.value == '') &&
      this.dynamicField.isOptInRequired == true
    ) {
      this._memberProfile.toastMessage(
        'Please select one option to opt-in.',
        2500,
        'custom-toast'
      );
    } else {
      let currentDate = CONSTANTS.ISODate();
      let currentYear = new Date().getFullYear();
      this.newMemberData = {
        uniqueID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        id: 0,
        memberName:
          this.AddMemberDetails.name.value == '' ||
          this.AddMemberDetails.name.value == null ||
          this.AddMemberDetails.name.value == undefined
            ? 'USER ' + this.phoneNumber.substring(5).toString()
            : this.AddMemberDetails.name.value,
        birthDate:
          this.AddMemberDetails.dayID.value == '' ||
          this.AddMemberDetails.monthID.value == '' ||
          this.AddMemberDetails.dayID.value == null ||
          this.AddMemberDetails.monthID.value == null ||
          this.AddMemberDetails.dayID.value == undefined ||
          this.AddMemberDetails.monthID.value == undefined
            ? null
            : `${currentYear}-${this.AddMemberDetails.monthID.value}-${this.AddMemberDetails.dayID.value}`,
        emailID:
          this.AddMemberDetails.email.value == '' ||
          this.AddMemberDetails.email.value == null ||
          this.AddMemberDetails.email.value == undefined
            ? null
            : this.AddMemberDetails.email.value,
        phoneNo: Number(this.phoneNumber),
        isActive: true,
        createdBy: 1,
        createdDate: currentDate,
        lastModifiedBy: 1,
        lastModifiedDate: currentDate,
        businessLocationId: this.BusinessLocationID,
        memberProfile: [
          {
            uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            id: 0,
            memberId: 0,
            notes: null,
            badgeId: 1,
            tagId: null,
            businessGroupId: this.BusinessGroupID,
            lastVisitDate: currentDate,
            lifeTimePoints: 0,
            lifeTimeVisits: 0,
            smsoptIn:
              this.AddMemberDetails.optIn.value == null ||
              this.AddMemberDetails.optIn.value == ''
                ? false
                : this.AddMemberDetails.optIn.value,
            emailOptIn:
              this.AddMemberDetails.email.value == '' ||
              this.AddMemberDetails.email.value == null ||
              this.AddMemberDetails.email.value == undefined
                ? false
                : true,
            notificationOptIn: false,
            currentPoints: 0,
            sourceId: this.SourceID,
            stateId: 3,
            isActive: true,
            createdBy: 1,
            createdDate: currentDate,
            lastModifiedBy: 1,
            lastModifiedDate: currentDate,
            isHighroller: false,
            isFreePlayer: false,
            baseLocationID: this.BusinessLocationID,
            isOverAged:
              this.isAgeRestriction == true
                ? this.AddMemberDetails.isOverAged.value
                : false,
            LastOptOutDate:
              this.AddMemberDetails.optIn.value == null ||
              this.AddMemberDetails.optIn.value == '' ||
              this.AddMemberDetails.optIn.value == 'false'
                ? currentDate
                : null,
          },
        ],
      };
      let optin =
        this.AddMemberDetails.optIn.value == null ||
        this.AddMemberDetails.optIn.value == ''
          ? false
          : this.AddMemberDetails.optIn.value;
      if (
        optin.toString() == 'false' &&
        this.dynamicField.isOptInRequired == true
      ) {
        this.alert = await this.alertCtrl.create({
          header: "Are you sure you don't want to opt-in ?",
          buttons: [
            {
              text: 'Yes',
              role: 'confirm',
              handler: () => {
                this.Save(this.newMemberData);
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {},
            },
          ],
        });
        await this.alert.present();
      } else {
        if (
          this.isOptInPopupRequired == true &&
          this.dynamicField.isOptInRequired == true
        ) {
          this.displayPopup = 'block';
        } else {
          this.Save(this.newMemberData);
        }
      }
    }
  }

  async submit() {
    if (this.Email?.valid) {
      if (this.isAgeRestriction == true) {
        if (this.AddMemberDetails.isOverAged.value?.toString() == 'true') {
          this.submitData();
        } else {
          // this.router.navigate(['/tab1']);
          this._memberProfile.toastMessage(
            'Please confirm that you are at least 21 years old to proceed.',
            3000,
            'custom-toastDanger'
          );
        }
      } else {
        this.submitData();
      }
    } else {
      this._memberProfile.toastMessage(
        'Please enter a valid email address.',
        2500,
        'custom-toast'
      );
    }
  }

  async Save(newMemberData: any) {
    try {
      this.isLoading = true;
      this._memberProfile.PostNewMemberInStore(newMemberData).subscribe(
        async (res: any) => {
          let members = res;
          this._memberProfile
            .GetMemberProfileByPhoneNo(
              this.BusinessGroupID,
              this.BusinessLocationID,
              this.phoneNumber
            )
            .subscribe((resProfile: any) => {
              let d = resProfile;
              localStorage.removeItem('memberDetails');
              this.m.name = members.memberName;
              this.m.currentPoints = members.memberProfile[0].currentPoints;
              this.m.memberId = members.memberProfile[0].id;
              this.m.memberTableID = members.memberProfile[0].memberId;
              this.m.memberSince = members.memberProfile[0].createdDate;
              this.m.badgeColor = d[0].badgeColor;
              localStorage.setItem('memberDetails', JSON.stringify(this.m));

              this._memberProfile
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

                    localStorage.setItem(
                      'OPTS',
                      JSON.stringify(this._defaultOpts)
                    );

                    this.phoneNumber = '';
                    this.isLoading = false;
                    this.router.navigate(['/tab2']);
                  },
                  async (error) => {
                    if (error.status == 404) {
                      this.router.navigate(['/customer-details']);
                      this.phoneNumber = '';
                      this.isLoading = false;
                    }
                  }
                  // error: error => {
                  //   this.phoneNumber = '';
                  //   this.isLoading = false;
                  // }
                );
            });
        },
        async (error) => {
          if (error.status == 409) {
            
            this.router.navigate(['/tab1']);
            this._memberProfile.toastMessage(
              "You're already a member. Please sign in again!",
              2500,
              'custom-toast'
            );
          } else {
            this.isLoading = false;
            this._memberProfile.toastMessage(
              "Something went wrong. Please try again.",
              3500,
              'custom-toast'
            );
          }
        }
      );
    } catch (error) {
      this.isLoading = false;
    }
  }

  async closePopupOptin() {
    this.Save(this.newMemberData);
    this.displayPopup = 'none';
  }
}
