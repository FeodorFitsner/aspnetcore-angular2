"use strict";

import { Component, View, ElementRef, Renderer } from 'angular2/core';
import { NgFor } from 'angular2/common';
import * as router from 'angular2/router';

@Component({
	selector: 'app'
})

@View({
	templateUrl: './app/app.html',
	directives: [router.ROUTER_DIRECTIVES, NgFor]
})

export class App {

	constructor(private el: ElementRef, private renderer: Renderer) {
	}

}