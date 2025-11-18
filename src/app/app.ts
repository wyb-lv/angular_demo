import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { SidebarComponent } from './sidebar/sidebar';
import { FooterComponent } from './footer/footer';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent,NgxPaginationModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo');
}
