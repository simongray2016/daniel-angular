import { Component, OnInit } from '@angular/core';
import { MenuListData } from 'src/app/mock/menu-list.data';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  menuListData = MenuListData;

  constructor() {}

  ngOnInit(): void {}
}
