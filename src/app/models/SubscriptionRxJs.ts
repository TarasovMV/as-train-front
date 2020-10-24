import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class SubscriptionRxJs implements OnDestroy {
    protected subscriptions: Subscription[] = [];

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
