import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'custom-select',
  templateUrl: `./custom-select.component.html`,
})

export class CustomSelectComponent {
  @Input() public itemClass: any = '';
  @Input() public itemLabel: string = '';
  @Input() public itemError: string = '';
  @Input() public itemValue: string = '';
  @Input() public itemType: string = '';
  @Input() public itemOptions: any[] = [];
  @Input() public itemDisabled: boolean = true;
  @Output() public itemChange = new EventEmitter();

  public valueChange() {
    console.log('CustomSelectComponent valueChange this.itemValue: ', this.itemValue);
    const val: any = this.itemOptions && this.itemOptions[0] && typeof this.itemOptions[0].value === 'number' ?
      parseInt(this.itemValue, 10) : this.itemValue;
    this.itemChange.next(val);
  }
}
