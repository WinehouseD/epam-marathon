import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpmHeaderComponent } from '../../shared/components/epm-header/epm-header.component';
import { EpmToasterComponent } from '../../shared/components/epm-toaster/epm-toaster.component';
import { UserSearchComponent } from '../components/user-search/user-search.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'epm-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, EpmHeaderComponent, EpmToasterComponent, UserSearchComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {}
