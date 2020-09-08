import { Component, ViewChild, Inject, HostListener } from '@angular/core';
import { IonToggle } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonToggle) toggle: IonToggle;

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  changeTheme() {
    this.document.body.classList.toggle('dark', this.toggle.checked);
  }

  @HostListener('window:matchMedia("(prefers-color-scheme: dark)"):change')
  checkToggle(shouldCheck: boolean): void {
    this.toggle.checked = shouldCheck;
  }

  ionSelectable($event: any) {
    console.log($event);
  }

}
