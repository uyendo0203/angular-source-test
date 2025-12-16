import { ChangeDetectionStrategy, Component, effect, inject, signal, resource } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DecorativeHeaderComponent } from '~shared/components/decorative-header/decorative-header.component';
import { CardComponent } from '~shared/components/card/card.component';
import { interval } from 'rxjs';
import { AnalyticsService } from '~core/services/analytics.service';

@Component({
  selector: 'app-home',
  imports: [DecorativeHeaderComponent, NgOptimizedImage, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly http = inject(HttpClient);
  private readonly reload$ = signal(0);

  readonly activeUsersResource = resource({
    loader: async () => {
      this.reload$(); // Track signal changes
      const result = await this.http
        .get<{ activeUsers: number }>(this.analyticsService.getRealtimeUsersUrl())
        .toPromise();
      return result || { activeUsers: 1 };
    },
  });

  constructor() {
    effect(() => {
      const sub = interval(5000).subscribe(() => {
        this.reload$.update(v => v + 1);
      });
      return () => {
        sub.unsubscribe();
      };
    });
  }
}
