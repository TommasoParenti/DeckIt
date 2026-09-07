import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../services/toast-notifications.service';

@Component({
  selector: 'app-toast-notification',
  imports: [],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastNotificationComponent {
  protected toastService = inject(ToastService);

  private readonly icons: Record<ToastType, string> = {
    success: 'ti-circle-check',
    error: 'ti-alert-circle',
    warning: 'ti-alert-triangle',
    info: 'ti-info-circle',
  };

  iconFor(type: ToastType): string {
    return this.icons[type];
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
