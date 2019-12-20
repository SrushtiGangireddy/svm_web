import {Component, OnChanges, OnInit} from '@angular/core';
import { SodaService } from '../service/SodaService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
  title = 'frontendApp';
  coin: number;
  coinAmount:  number;

  insertAmountResponse: any;
  returnChangeSuccess: any;
  dispenseSodaResponse: any;

  loadAmountSuccess: boolean = false;
  removeAmountSuccess: boolean = false;
  dispenseSodaSuccess: boolean = false;

  changeAvailable: boolean = false;

  notEnoughMoneyMessage: string;

  inventoryDetails: any;

  sodaType: String;

  amountAvailable = 0;
  sodasAvailable = 0;

  values = [
    { id: 1, name: "Lemon Soda" },
    { id: 2, name: "Ginger Soda" },
    { id: 3, name: "Soda Water" },
    { id: 4, name: "Root Beer" },
    { id: 5, name: "Cococola" }
  ];

  coins = [
    { id: 1, name: "dollar" },
    { id: 2, name: "quarter" },
    { id: 3, name: "dime" },
    { id: 4, name: "nickel" },
    { id: 5, name: "penny" }
  ];

  selectedSoda: String = "Lemon Soda";
  selectedDenomination: String = "dollar";

  constructor(private sodaService: SodaService) {}

  ngOnInit() {
    this.getAvail();
  }

  ngOnChanges() {
    this.loadAmountSuccess = false;
    this.removeAmountSuccess = false;
    this.dispenseSodaSuccess = false;
  }

  public insertAmount() {
    this.refreshFlags();
    if (this.selectedDenomination && this.coinAmount) {
      this.sodaService.insertAmount(this.selectedDenomination, this.coinAmount).subscribe(data =>
      this.setAddMoneyResponse(data));
    }
  }

  public returnChange() {
    this.refreshFlags();
    if (this.coin && this.coinAmount) {
      this.sodaService.returnChange().subscribe(data =>
        this.setRemoveMoneyResponse(data));
    }
  }

  public getAvail() {
    this.sodaService.getAvail().subscribe(data =>
      this.updateInventory(data)
    );
  }

  public onChange(event): void {
    const newVal = event.target.value;
    this.selectedSoda = this.values.filter(x => x.id == newVal)[0].name;
  }

  public onCoinSelect(event): void {
    const newVal = event.target.value;
    this.selectedDenomination = this.coins.filter(x => x.id == newVal)[0].name;
  }

  public dispenseSoda() {
    this.refreshFlags();
    let sodaSelection = this.values.filter(x => x.name === this.selectedSoda)[0].id;
    this.sodaService.dispenseSoda(sodaSelection).subscribe(data =>
      this.setDispenseSodaResponse(data));
    this.refreshFlags();
  }

  public refreshFlags() {
    this.loadAmountSuccess = false;
    this.returnChangeSuccess = false;
    this.dispenseSodaSuccess = false;
    this.notEnoughMoneyMessage = '';
    this.changeAvailable = false;
  }

  public setAddMoneyResponse(data) {
    this.insertAmountResponse = data;
    this.amountAvailable = this.insertAmountResponse['Balance'];
    this.sodasAvailable = this.insertAmountResponse['Soda List'];
    if (this.insertAmountResponse['Machine state'] && this.insertAmountResponse['Machine state'].toLowerCase().indexOf("loaded your money") > -1) {
      this.loadAmountSuccess = true;
    } else {
      this.loadAmountSuccess = false;
    }
  }

  public setRemoveMoneyResponse(data) {
    this.returnChangeSuccess = data;
    this.amountAvailable = this.returnChangeSuccess.amountRemaining;
    this.sodasAvailable = this.returnChangeSuccess.sodaRemaining;
    if (this.returnChangeSuccess.message.toLowerCase().indexOf("collect") > -1) {
      this.removeAmountSuccess = true;
    } else {
      this.removeAmountSuccess = false;
    }
  }

  public setDispenseSodaResponse(data) {
    this.dispenseSodaResponse = data;
    this.amountAvailable = this.dispenseSodaResponse['Balance'];
    this.sodasAvailable = this.dispenseSodaResponse['Soda List'];
    if (this.dispenseSodaResponse['Machine state'] && this.dispenseSodaResponse['Machine state'].toLowerCase().indexOf("enjoy") > -1) {
      this.dispenseSodaSuccess = true;
      let change = this.dispenseSodaResponse['Change'];
      if (change['dollars'] > 0 || change['quarters'] > 0 || change['nickels'] > 0 || change['pennies'] > 0 || change['dimes'] > 0) {
        this.changeAvailable = true;
      } else {
        this.changeAvailable = false;
      }
      this.notEnoughMoneyMessage = '';
    } else {
      this.dispenseSodaSuccess = false;
      this.notEnoughMoneyMessage = this.dispenseSodaResponse['Machine state'];
      let change = this.dispenseSodaResponse['Change'];
      if (change['dollars'] > 0 || change['quarters'] > 0 || change['nickels'] > 0 || change['pennies'] > 0 || change['dimes'] > 0) {
        this.changeAvailable = true;
      } else {
        this.changeAvailable = false;
      }
    }
  }

  public updateInventory(data) {
    this.inventoryDetails = data;
    this.sodasAvailable = this.inventoryDetails['Soda List'];
  }
}
