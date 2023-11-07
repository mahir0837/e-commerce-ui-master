import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { FileHandle } from './_model/file-handle.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output()files:EventEmitter<FileHandle>=new EventEmitter();
  @HostBinding("style.backround")private backround="#eee";

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"])
  public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.backround="#999";
  }
  @HostListener("dragleave",["$event"])
  public onDragLeave(evt:DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.backround="#eee";
  }
  @HostListener("drop",["$event"])
  public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.backround="#eee";

    let fileHandle:FileHandle;

    if (evt.dataTransfer!==null) {
      const file = evt.dataTransfer.files[0];
      const url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const fileHandle: FileHandle = { file, url };
      this.files.emit(fileHandle);
    }

  }


}
