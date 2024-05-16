import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilterByPipePipe } from './filter-by-pipe.pipe';

@NgModule({
  declarations: [FilterByPipePipe],
  imports: [
    CommonModule
  ],
  exports: [FilterByPipePipe],
})
export class PipesModule { }
