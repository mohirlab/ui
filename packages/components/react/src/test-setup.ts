// jsdom does not implement the modal parts of <dialog>; model just enough of them.
function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '');
}
function close(this: HTMLDialogElement) {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
}
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
}
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
})) as unknown as typeof window.matchMedia;

// jsdom has no Popover API either: toggle the :popover-open state with an attribute.
function setPopover(this: HTMLElement, open: boolean) {
  if (this.hasAttribute('data-popover-open') === open) return;
  this.toggleAttribute('data-popover-open', open);
  const event = new Event('toggle') as Event & { newState: string };
  Object.assign(event, { newState: open ? 'open' : 'closed' });
  this.dispatchEvent(event);
}
if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
    setPopover.call(this, true);
  };
  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
    setPopover.call(this, false);
  };
  const matches = Element.prototype.matches;
  Element.prototype.matches = function patchedMatches(this: Element, selector: string) {
    if (selector === ':popover-open') return this.hasAttribute('data-popover-open');
    return matches.call(this, selector);
  };
}

// jsdom has no ResizeObserver; components only need it to exist.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
