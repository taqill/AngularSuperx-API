import { Component, OnInit, Output, EventEmitter, Input, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';

type UserProfile = {
  username: string;
  email: string;
  role: string;
  token: string;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,   // Add CommonModule here
    MatToolbar, 
    MatToolbarRow, 
    MatIconButton, 
    MatIcon, 
    MatMenuTrigger, 
    MatMenu, 
    MatMenuItem
  ]
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);

  userProfile: UserProfile = {
    username: '',
    email: '',
    role: '',
    token: ''
  };

  @Output() sidenavToggle = new EventEmitter<void>();
  @Input() isOpened?: boolean;

  pageName: string = 'Stock Management';
  version = '17.3';

  lastActivity: number = Date.now();
  statusColor: string = 'green'; // Default color

  ngOnInit(): void {
    this.userProfile = this.authService.getUser();
    this.startActivityCheck();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onClickSignout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  onClickUserProfile() {
    window.location.href = '/userprofile';
  }

  @HostListener('window:mousemove') onUserActivity() {
    this.lastActivity = Date.now();
  }

  @HostListener('window:keypress') onUserActivityKeypress() {
    this.lastActivity = Date.now();
  }

  startActivityCheck() {
    setInterval(() => {
      const now = Date.now();
      const minutesInactive = (now - this.lastActivity) / 1000 / 60;

      if (minutesInactive >= 10) {
        this.statusColor = 'red';
      } else if (minutesInactive >= 1) {
        this.statusColor = 'orange';
      } else {
        this.statusColor = 'green';
      }
    }, 10000); // Check every 10 seconds
  }
}
