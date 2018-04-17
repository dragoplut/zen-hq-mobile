import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'input-select',
  templateUrl: `./input-select.component.html`,
})

export class InputSelectComponent {
  @Input() public itemClass: any = '';
  @Input() public itemLabel: string = '';
  @Input() public itemError: string = '';
  @Input() public itemValue: string = '';
  @Input() public itemType: string = '';
  @Input() public itemOptions: any[] = [];
  @Input() public itemDisabled: boolean = true;
  @Input() public itemMultiple: boolean = false;
  @Output() public itemChange = new EventEmitter();
  @Output() public itemChangeSearch = new EventEmitter();

  public valueChange(value?: any) {
    this.itemChange.next(value || this.itemValue);
  }

  public valueChangeSearch(value?: any) {
    this.itemChangeSearch.next(value);
  }
}
