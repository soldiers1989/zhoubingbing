import { Component } from '@angular/core';

@Component({
	//selector: 'footer',
	template: `<h3>footer</h3><button (click)="name='zhou'">buttom</button>`,
	styles: [
		`h3{border-top:1px #333 solid; color:red;}`,
		`h3{ text-align:center}`
	]
})
export class FooterComponent{
	name:string = 'zhoubingbing'
}