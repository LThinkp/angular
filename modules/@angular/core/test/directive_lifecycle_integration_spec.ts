/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnInit} from '@angular/core';
import {Component, Directive} from '@angular/core/src/metadata';
import {ViewMetadata} from '@angular/core/src/metadata/view';
import {AsyncTestCompleter, Log, TestComponentBuilder, beforeEach, beforeEachProviders, ddescribe, describe, expect, iit, inject, it, xdescribe, xit} from '@angular/core/testing/testing_internal';

export function main() {
  describe('directive lifecycle integration spec', () => {

    beforeEachProviders(() => { return [Log]; });

    it('should invoke lifecycle methods ngOnChanges > ngOnInit > ngDoCheck > ngAfterContentChecked',
       inject(
           [TestComponentBuilder, Log, AsyncTestCompleter],
           (tcb: TestComponentBuilder, log: Log, async: AsyncTestCompleter) => {
             tcb.overrideView(MyComp5, new ViewMetadata({
                                template: '<div [field]="123" lifecycle></div>',
                                directives: [LifecycleCmp]
                              }))
                 .createAsync(MyComp5)
                 .then((tc) => {
                   tc.detectChanges();

                   expect(log.result())
                       .toEqual(
                           'ngOnChanges; ngOnInit; ngDoCheck; ngAfterContentInit; ngAfterContentChecked; child_ngDoCheck; ' +
                           'ngAfterViewInit; ngAfterViewChecked');

                   log.clear();
                   tc.detectChanges();

                   expect(log.result())
                       .toEqual(
                           'ngDoCheck; ngAfterContentChecked; child_ngDoCheck; ngAfterViewChecked');

                   async.done();
                 });
           }));
  });
}


@Directive({selector: '[lifecycle-dir]'})
class LifecycleDir implements DoCheck {
  constructor(private _log: Log) {}
  ngDoCheck() { this._log.add('child_ngDoCheck'); }
}

@Component({
  selector: '[lifecycle]',
  inputs: ['field'],
  template: `<div lifecycle-dir></div>`,
  directives: [LifecycleDir]
})
class LifecycleCmp implements OnChanges,
    OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  field: any /** TODO #9100 */;
  constructor(private _log: Log) {}

  ngOnChanges(_: any /** TODO #9100 */) { this._log.add('ngOnChanges'); }

  ngOnInit() { this._log.add('ngOnInit'); }

  ngDoCheck() { this._log.add('ngDoCheck'); }

  ngAfterContentInit() { this._log.add('ngAfterContentInit'); }

  ngAfterContentChecked() { this._log.add('ngAfterContentChecked'); }

  ngAfterViewInit() { this._log.add('ngAfterViewInit'); }

  ngAfterViewChecked() { this._log.add('ngAfterViewChecked'); }
}

@Component({selector: 'my-comp', directives: []})
class MyComp5 {
}
