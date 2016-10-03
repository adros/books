import { Injectable, Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Injectable()
export class ErrorHandler {

  constructor(public modal: Modal) {
  }

  displayDialog(err): void {
    this.modal.alert()
      .title('Error')
      .body(err.message)
      .open();
  }

}
