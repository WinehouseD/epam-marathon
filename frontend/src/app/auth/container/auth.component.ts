import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { EpmHeaderComponent } from '../../shared/components/epm-header/epm-header.component';

@Component({
  selector: 'epm-auth',
  standalone: true,
  imports: [CommonModule, RouterOutlet, EpmHeaderComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {}
