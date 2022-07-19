class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(field) {
    this.observers.push(field);
  }

  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

export { Observable };
