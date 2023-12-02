import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { LoaderService } from '../components/epm-loader/loader.service';

@Directive({
  selector: '[epmPagination]',
  standalone: true
})
export class EpmPaginationDirective {
  @Output() paginate = new EventEmitter<void>();

  private readonly bottomOffset = 100;

  constructor(private loaderService: LoaderService) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.loaderService.isLoading()) {
      return;
    }

    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (docHeight - windowBottom < this.bottomOffset) {
      this.paginate.emit();
    }
  }
}
