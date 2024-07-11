import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  static instance: LoaderService;

  fetched = signal(true);

  constructor() {
    LoaderService.instance = this;
  }
}
