/** Every workspace/session transition invalidates requests started in the previous scope. */
export class PlatformRequestScope {
  #generation = 0;
  /** @type {number|null} */
  #mutation = null;
  #identity;
  #getIdentity;
  /** @param {() => unknown} getIdentity */
  constructor(getIdentity = () => undefined) { this.#getIdentity = getIdentity; this.#identity = getIdentity(); }
  current() { if (this.#identity !== this.#getIdentity()) this.reset(); return this.#generation; }
  reset() { this.#identity = this.#getIdentity(); this.#mutation = null; return ++this.#generation; }
  isCurrent(generation) { return generation === this.#generation && this.#identity === this.#getIdentity(); }
  isBusy() { return this.#mutation === this.#generation && this.isCurrent(this.#generation); }
  beginMutation() {
    this.current();
    if (this.isBusy()) return null;
    this.#mutation = this.#generation;
    return this.#generation;
  }
  finishMutation(generation) {
    if (!this.isCurrent(generation) || this.#mutation !== generation) return false;
    this.#mutation = null; return true;
  }
}
