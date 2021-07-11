import { MenuListModel } from 'src/models/menu-list.model';

export const MenuListData: MenuListModel = [
  {
    groupName: 'Dashboards',
    description: 'Unique dashboard designs',
    listItems: [
      {
        matIcon: 'dashboard',
        name: 'Dashboard',
        path: '/dashboard',
      },
      {
        matIcon: 'pie_chart',
        name: 'Analytics',
        path: '/asdasd',
      },
    ],
  },
  {
    groupName: 'Applications',
    description: 'Custom application designs',
    listItems: [
      {
        matIcon: 'calendar_today',
        name: 'Calendar',
        path: '/safsa',
      },
      {
        matIcon: 'question_answer',
        name: 'Chat',
        path: '/asfsa',
      },
      {
        matIcon: 'cloud',
        name: 'File manager',
        path: '/asfsa',
      },
    ],
  },
];
