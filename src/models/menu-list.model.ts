export type MenuListModel = GroupMenu[];
export interface GroupMenu {
  groupName: string;
  description: string;
  listItems: MenuItem[];
}
export interface MenuItem {
  matIcon: string;
  name: string;
  path: string;
}
