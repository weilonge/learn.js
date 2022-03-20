class Galileo {
  constructor() {
    this.isStarted = false;
    this.mode = '';
    this.elems = {
      start: document.getElementById('start'),
      mode: document.getElementById('mode'),
      status: document.getElementById('status'),
      touchPanel: document.getElementById('touch_panel'),
      apply: document.getElementById('apply'),
      cancel: document.getElementById('cancel'),
      loupe: document.getElementById('loupe'),
      loupeStart: document.getElementById('loupe-start'),
    };
  }

  init() {
    this.elems.start.addEventListener('click', this.handleStartClick.bind(this));
    this.hideMovementIndicator();
    this.hideLoupe();

    // prevent contextmenu with long press touch
    window.addEventListener('contextmenu', e => e.preventDefault());
  }

  hideMovementIndicator() {
    this.updateMovementIndicator(-130, -130);
  }

  updateMovementIndicator(x, y) {
    this.elems.loupeStart.style.transform = `translate(${x}px, ${y}px)`;
  }

  hideLoupe() {
    this.updatePosition('', -130, -130);
  }

  registerEvents() {
    this.binds = {
      handleWindowClick: this.handleWindowClick.bind(this),
      handleWindowMousemove: this.handleWindowMousemove.bind(this),
      handleWindowTouchstart: this.handleWindowTouchstart.bind(this),
      handleWindowTouchmove: this.handleWindowTouchmove.bind(this),
      handleWindowTouchend: this.handleWindowTouchend.bind(this),
      handleApplyTouchend: this.handleApplyTouchend.bind(this),
      handleCancelTouchend: this.handleCancelTouchend.bind(this),
    };
    window.addEventListener('click', this.binds.handleWindowClick);
    window.addEventListener('mousemove', this.binds.handleWindowMousemove);

    window.addEventListener('touchstart', this.binds.handleWindowTouchstart);
    window.addEventListener('touchmove', this.binds.handleWindowTouchmove);
    window.addEventListener('touchend', this.binds.handleWindowTouchend);

    this.elems.apply.addEventListener('touchend', this.binds.handleApplyTouchend);
    this.elems.cancel.addEventListener('touchend', this.binds.handleCancelTouchend);
  }

  unregisterEvents() {
    window.removeEventListener('click', this.binds.handleWindowClick);
    window.removeEventListener('mousemove', this.binds.handleWindowMousemove);

    window.removeEventListener('touchstart', this.binds.handleWindowTouchstart);
    window.removeEventListener('touchmove', this.binds.handleWindowTouchmove);
    window.removeEventListener('touchend', this.binds.handleWindowTouchend);

    this.elems.apply.removeEventListener('touchend', this.binds.handleApplyTouchend);
    this.elems.cancel.removeEventListener('touchend', this.binds.handleCancelTouchend);

    this.binds = {};
  }

  handleStartClick(event) {
    if (this.isStarted) {
      return;
    }

    event.stopPropagation();
    this.updateStart(true);

    setTimeout(() => {
      this.registerEvents();
    }, 0);
  }

  end(status) {
    this.elems.touchPanel.classList.add('hidden');
    this.updateStart(false);
    this.elems.status.textContent = status;
    this.unregisterEvents();
  }

  handleWindowClick() {
    this.end('click end');
  }

  handleApplyTouchend(event) {
    event.stopPropagation();
    this.end('touch apply');
  }

  handleCancelTouchend(event) {
    event.stopPropagation();
    this.end('touch cancel');
  }

  handleWindowMousemove(event) {
    const { pageX, pageY } = event;
    this.updatePosition('mouse', pageX, pageY);
  }

  handleWindowTouchstart(event) {
    const { pageX, pageY } = event.changedTouches[0];
    this.startPos = { x: pageX, y: pageY };
    this.lastAppliedPos = {
      x: this.appliedPos.x,
      y: this.appliedPos.y,
    };
    this.hasDiff = false;
  }

  handleWindowTouchmove(event) {
    const { pageX, pageY } = event.changedTouches[0];
    this.updateMovementIndicator(pageX, pageY)
    this.updateDiffPos(pageX - this.startPos.x, pageY - this.startPos.y, 0.2);
  }

  handleWindowTouchend(event) {
    event.preventDefault();
    const { pageX, pageY } = event.changedTouches[0];
    if (this.hasDiff) {
      this.hideMovementIndicator();
      return;
    }
    this.updatePosition('touch', pageX, pageY);
  }

  updateStart(isStarted) {
    this.isStarted = isStarted;
    this.elems.start.disabled = this.isStarted;
    this.elems.status.textContent = isStarted ? 'started...' : 'UNKNOWN...';
  }

  updateDiffPos(diffX, diffY, rate = 1) {
    const { x, y } = this.lastAppliedPos;
    this.appliedPos = { x: x + diffX * rate, y: y + diffY * rate };
    this.elems.loupe.style.transform = `translate(${x + diffX * rate}px, ${y + diffY * rate}px)`;
    this.hasDiff = true;
  }

  updatePosition(mode, x, y) {
    this.updateMode(mode);
    this.elems.status.textContent = `[${Date.now()}] ${mode}move(${x}, ${y})`;
    this.appliedPos = { x, y };
    this.elems.loupe.style.transform = `translate(${x}px, ${y}px)`;
  }

  updateMode(mode) {
    this.elems.mode.textContent = mode;
    if (mode === 'touch') {
      this.elems.touchPanel.classList.remove('hidden');
    } else if (mode === 'mouse') {
      this.elems.touchPanel.classList.add('hidden');
    }
  }
}

const g = new Galileo();
g.init();
