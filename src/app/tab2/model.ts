export class Model {
    name: string;
    badgeColor: string;
    currentPoints: number;
    memberId: number;
    lastVisit: Date;
    memberSince: Date;
    spinWheelPoint: any;
    memberImg: any;
    memberTableID: any;
}

export class MembersVistLog {
    UniqueId:string;
    Id: number;
    MemberId: number;
    SignIn: string;
    SourceId: number;
    BusinessLocationId: number;
    StateId: number;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    LastModifiedBy: number;
    LastModifiedDate: string;
}

export class ActivityHistory {
    uniqueId:string;
    id: number;
    memberId?: number;
    activityDate: string;
    activityTypeId: number;
    points: number;
    sourceId: number;
    stateId: number;
    isActive: boolean;
    createdBy: number;
    createdDate: string;
    lastModifiedBy: number;
    lastModifiedDate: string;
    promotionID: number;
    autopilotID: number;
    spinWheelID: number;
    businessLocationId: number;
    spinWheelText: string;
    isSpinRedeem: boolean;
}