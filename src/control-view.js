import Emitter from './emitter';

class ControlView extends Emitter {
  constructor(element) {
    this.previous = element.getElementsByClassName('button-previous')[0];
    this.next = element.getElementsByClassName('button-next')[0];
    this.beginning = element.getElementsByClassName('button-beginning')[0];
    this.last = element.getElementsByClassName('button-last')[0];

    this._currentCount = element.getElementsByClassName('current-count')[0];
    this._blackPrisoner = element.getElementsByClassName('black-prisoner')[0];
    this._whitePrisoner = element.getElementsByClassName('white-prisoner')[0];

    this.previous.addEventListener('click', (event) => {
      var e = new Event('previous');
      this.dispatchEvent(e);
    });
    this.next.addEventListener('click', (event) => {
      var e = new Event('next');
      this.dispatchEvent(e);
    });
    this.beginning.addEventListener('click', (event) => {
      var e = new Event('beginning');
      this.dispatchEvent(e);
    });
    this.last.addEventListener('click', (event) => {
      var e = new Event('last');
      this.dispatchEvent(e);
    });
  }

  set currentCount(count) {
    this._currentCount.innerHTML = count;
  }

  set blackPrisoner(prisoner) {
    this._blackPrisoner.innerHTML = prisoner;
  }

  set whitePrisoner(prisoner) {
    this._whitePrisoner.innerHTML = prisoner;
  }
}

// HACK: export default and extends don't work together at this time.
export default ControlView;
