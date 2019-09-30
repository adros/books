import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-val',
  templateUrl: './val.component.html'
})
export class ValComponent {

  @Input()
  public value: number;

  public abs(value) {
    return Math.abs(value).toLocaleString('sk', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }


}
