import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[alias]',
})
export class AliasDirective {
  private context: AliasContext = { $implicit: null, alias: null };
  private viewRef: EmbeddedViewRef<AliasContext> | null = null;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<AliasContext>,
  ) {}

  @Input()
  set alias(source: any) {
    this.context.$implicit = this.context.alias = source;
    if (!this.viewRef) {
      this.viewContainer.clear();
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    } else {
      this.viewRef.markForCheck();
    }
  }
}

interface AliasContext {
  $implicit: any;
  alias: any;
}
