export default class Emitter {
  addEventListener(type, handler) {
    this.handlers = this.handlers || {};
    this.handlers[type] = this.handlers[type] || [];
    this.handlers[type].push(handler);
  }

  dispatchEvent(event) {
    this.handlers = this.handlers || {};
    var handlers = this.handlers[event.type] || [];
    handlers.forEach((handler) => {
      handler.apply(this, event);
    });
  }
}
