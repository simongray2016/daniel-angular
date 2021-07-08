import { animate, style, transition, trigger } from '@angular/animations';

export const SlideYTrigger = trigger('SlideYTrigger', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('200ms', style({ transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0)' }),
    animate('200ms', style({ transform: 'translateY(-100%)' })),
  ]),
]);
