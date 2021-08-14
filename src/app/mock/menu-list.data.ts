import { MenuListModel } from 'src/models/menu-list.model';

export const MenuListData: MenuListModel = [
  {
    groupName: 'Applications',
    description: 'Custom application designs',
    listItems: [
      {
        matIcon: 'library_music',
        name: 'Music',
        path: '/music',
      },
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
