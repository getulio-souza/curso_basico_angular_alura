import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Item } from '../../modules/order/model/item';
import { BootstrapModalHelper } from '../bootstrap-modal-helper';

export interface SelectItem {
  label: string;
  code: string;
}

export interface DeliveryTimeUnit {
  label: string;
  value: number;
}

interface Form {
  item: Item;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title: string;
  @Input() isFull: boolean = false;
  @Input() modalId: string = 'itemFormModal';
  @Input() delete: boolean = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() closed = new EventEmitter<Boolean>();

  constructor() {}

  ngAfterViewInit() {
    this.showItemFormModal();
  }

  showItemFormModal() {
    BootstrapModalHelper.open(this.modalId);
    BootstrapModalHelper.onHide(this.modalId, () => this.closed.emit(false));
  }

  closeModal() {
    BootstrapModalHelper.hide(this.modalId);
    this.closed.emit(false);
  }

  confirmModal() {
    this.confirm.emit();
    BootstrapModalHelper.hide(this.modalId);
    this.closeModal();
  }
}
