import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { GetMemberProfileService } from "./api/services/get-member-profile.service";

@Injectable()
export class DataService {
  _defaultOpts: { id: number, indexID: number, arctext: string, colorCode: string, probability: number, promotionId: number }[] = [];

  optionSource: BehaviorSubject<String[]>;
  option$: any;

  winnersSource: BehaviorSubject<String[]>;
  winner$: Observable<String[]>;

  constructor(private _speenService: GetMemberProfileService) {
    this.optionSource = new BehaviorSubject(this.getOptions());
    this.option$ = this.optionSource.asObservable();

    // this.winnersSource = new BehaviorSubject([]);
    this.winnersSource = new BehaviorSubject<String[]>([]);
    this.winner$ = this.winnersSource.asObservable();
  }

  addNewOption(value: any) {
    const currentOpts = [...this.optionSource.getValue()];
    currentOpts.push(value);
    this.optionSource.next(currentOpts);
    this.persistOptions();
  }

  deleteNewOption(value: any) {
    const currentOpts = this.optionSource.getValue();
    this.optionSource.next(currentOpts.filter(opts => opts != value));
    this.persistOptions();
  }

  addWinner(value: any) {
    let winners = this.winnersSource.getValue();
    winners = [...winners, value];
    this.winnersSource.next(winners);
  }

  restartWinners() {
    this.winnersSource.next([]);
  }

  persistOptions() {
    localStorage.setItem("OPTS", JSON.stringify(this.optionSource.getValue()));
  }

  getOptions(): String[] {
    const value = localStorage.getItem("OPTS");
    return value ? JSON.parse(value) : this._defaultOpts;
  }

  resetToDefault() {
    const value = localStorage.getItem("OPTS");
    this.optionSource.next(value ? JSON.parse(value) : this._defaultOpts);
  }
}