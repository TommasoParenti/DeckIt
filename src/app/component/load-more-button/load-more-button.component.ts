import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-load-more-button',
  imports: [],
  templateUrl: './load-more-button.component.html',
  styleUrl: './load-more-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadMoreButtonComponent {
  loading = input.required<boolean>();
  load = output<void>();
}
