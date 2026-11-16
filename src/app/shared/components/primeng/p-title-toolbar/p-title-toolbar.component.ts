import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-prime-title-toolbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './p-title-toolbar.component.html',
  styleUrls: ['./p-title-toolbar.component.scss']
})
export class PrimeTitleToolBarComponent {
  @Input() pageTitle: string = '';
  @Input() totalCount: number | null = null;
}
