import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editable-item',
  templateUrl: './editable-item.component.html',
  styleUrls: ['./editable-item.component.css']
})
export class EditableItemComponent implements OnInit {

	@Input() title: string = "";
	@Output() onClick = new EventEmitter();
	visibility: boolean = true;

	constructor() { }

	ngOnInit(): void {

	}

	toggleVisibility() {
		this.visibility = !this.visibility;
	}

	onToggle() {
		this.toggleVisibility();
		this.onClick.emit();
	}
}
