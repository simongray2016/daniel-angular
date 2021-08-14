import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeautifyCodePipe } from './beautify-code.pipe';

@NgModule({
  declarations: [BeautifyCodePipe],
  imports: [CommonModule],
  exports: [BeautifyCodePipe],
})
export class BeautifyCodeModule {}
