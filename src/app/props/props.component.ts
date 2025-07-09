import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-props',
  imports: [],
  templateUrl: './props.component.html',
  styleUrl: './props.component.css',
})
export class PropsComponent {
  @Input() child: string = 'Default Child Prop Value';
  @Output() parent: EventEmitter<string> = new EventEmitter<string>();

  // Method to emit a value to the parent component
  emitToParent(value: string) {
    this.parent.emit(value);
  }
}
