
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

let ace = require('brace');

@Directive({
  selector: '[ace-editor]'
})
export class AceEditorDirective {

  _text: string;
  _mode: string;
  _theme: string;
  _readOnly: boolean;
  _roptionseadOnly: boolean;
  editor: any;
  oldVal: any;

  @Output() textChanged = new EventEmitter<any>();
  @Output() editorRef = new EventEmitter<any>();


  @Input()
  set options(value: any) {
    this.editor.setOptions(value || {});
  }

  @Input()
  set readOnly(value: boolean) {
    this._readOnly = value;
    this.editor.setReadOnly(value);
  }

  @Input()
  set theme(value: string) {
    this._theme = value;
    this.editor.setTheme(`ace/theme/${value}`);
  }

  @Input()
  set mode(value: string) {
    this._mode = value;
    this.editor.getSession().setMode(`ace/mode/${value}`);
  }

  @Input()
  set text(value: string) {
    if (value === this.oldVal) return;
    this.editor.setValue(value);
    this.editor.clearSelection();
    this.editor.focus();
  }

  constructor(private elementRef: ElementRef) {
    const el = elementRef.nativeElement;
    el.classList.add('editor');
    this.editor = ace.edit(el);

    setTimeout(() => {
      this.editorRef.emit(this.editor);
    });
    this.editor.on('change', () => {
      const newVal = this.editor.getValue();
      if (newVal === this.oldVal) return;
      if (typeof this.oldVal !== 'undefined') {
        this.textChanged.emit(newVal);
      }
      this.oldVal = newVal;
    });
  }
}
