import { Component, input } from '@angular/core';

@Component({
  selector: 'app-wip',
  imports: [],
  templateUrl: './wip.component.html',
  styleUrl: './wip.component.scss'
})
export class WipComponent {
  label = input('Work in progress');
  description = input('This section is still under construction, so check back soon!');
  variant = input<'badge' | 'block'>('badge');
}
