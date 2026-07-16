'use strict';

/* ==================== CONFIG (easy to tweak) ==================== */
const CONFIG = {
  ROWS: 8,
  COLS: 8,
  TIME_LIMIT: 60,
  NORMAL_PIECE_COUNT: 6,        // total color palette size
  START_COLOR_COUNT: 5,         // colors in play when the round starts
  COLOR_RAMP_TIME_LEFT: 150,    // when timeLeft (via combo time bonus) rises to this, unlock the next color
  BASE_SCORE_PER_PIECE: 30,
  COMBO_MULTIPLIER_STEP: 0.5,   // score multiplier grows by this per chain step
  TIME_BONUS_CHAIN1: 1,         // +1s on the 1st chain step
  TIME_BONUS_CHAIN2: 1.5,       // +1.5s on the 2nd chain step
  TIME_BONUS_CHAIN3PLUS: 2,     // +2s on 3rd+ chain steps
  GAUGE_THRESHOLD: 90,          // tiles cleared (any match, chained or not) needed to drop a colorbomb
  IMAGES: {
    normal: [
      'images/kai1.png',
      'images/kai2.png',
      'images/kai3.png',
      'images/kai4.png',
      'images/kai5.png',
      'images/kai.png',
    ],
    line: 'images/special1.png',
    bomb: 'images/special2.png',
  },
};

// colorbomb pieces now render as the normal-colored shell they target, glowing
// in that color; these are the glow colors matched to each IMAGES.normal entry.
const COLORBOMB_GLOW = {
  1: ['rgba(61,196,120,0.65)', 'rgba(61,196,120,0.95)'],   // green
  2: ['rgba(255,140,189,0.65)', 'rgba(255,140,189,0.95)'], // pink
  3: ['rgba(178,140,214,0.65)', 'rgba(178,140,214,0.95)'], // purple
  4: ['rgba(122,206,219,0.65)', 'rgba(122,206,219,0.95)'], // teal
  5: ['rgba(255,205,75,0.65)', 'rgba(255,205,75,0.95)'],   // yellow
  6: ['rgba(255,255,255,0.75)', 'rgba(255,255,255,1)'],    // white/silver
};

// Fill these in later with real audio file paths (e.g. 'sounds/match.mp3').
const SOUND_PATHS = {
  bgm: 'audio/ThePowerOfShellfish.wav',
  match: 'audio/match.mp3',
  // line = row+col cross clear, bomb = 3x3 surrounding clear, colorbomb = same-color clear
  specialCreateLine: 'audio/specialcreate1.mp3',
  specialCreateBomb: 'audio/specialcreate2.mp3',
  // colorbomb only ever spawns from a full gauge, so gaugeMax doubles as its "create" sound
  specialActivateLine: 'audio/special1.mp3',
  specialActivateBomb: 'audio/special2.mp3',
  specialActivateColorbomb: 'audio/special3.mp3',
  combo: 'audio/combo.mp3',
  gameOver: 'audio/gameover.mp3',
  gaugeMax: 'audio/gagemax.mp3',
};

const SPECIAL_CREATE_SOUND_KEY = { line: 'specialCreateLine', bomb: 'specialCreateBomb' };
const SPECIAL_ACTIVATE_SOUND_KEY = { line: 'specialActivateLine', bomb: 'specialActivateBomb', colorbomb: 'specialActivateColorbomb' };

const HIGH_SCORE_KEYS = {
  normal: 'kai_puzzle_highscore_v1',
  timeAttack: 'kai_puzzle_highscore_timeattack_v1',
};
const RANKING_LIMIT = 5;

/* ==================== small utilities ==================== */
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function isAdjacent(a, b) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1; }
function loadHighScore(mode) { return Number(localStorage.getItem(HIGH_SCORE_KEYS[mode]) || 0); }
function saveHighScore(mode, v) { localStorage.setItem(HIGH_SCORE_KEYS[mode], String(v)); }
function formatBonus(v) { return Number.isInteger(v) ? String(v) : v.toFixed(1); }

/* ==================== sound manager ==================== */
const SoundManager = {
  muted: true,
  unlocked: false,
  bgm: new Audio(),
  sfx: {},
  init() {
    this.bgm.loop = true;
    if (SOUND_PATHS.bgm) this.bgm.src = SOUND_PATHS.bgm;
    Object.keys(SOUND_PATHS).forEach(name => {
      if (name === 'bgm') return;
      const paths = SOUND_PATHS[name];
      if (Array.isArray(paths)) {
        this.sfx[name] = paths.map(p => { const a = new Audio(); a.src = p; return a; });
      } else {
        const a = new Audio();
        if (paths) a.src = paths;
        this.sfx[name] = a;
      }
    });
  },
  // Mobile browsers block audio until a real user gesture plays/pauses it once.
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    const all = Object.values(this.sfx).flatMap(v => Array.isArray(v) ? v : [v]);
    all.forEach(a => {
      if (!a.src) return;
      const p = a.play();
      if (p && p.catch) p.then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
    });
  },
  play(name) {
    if (this.muted) return;
    const entry = this.sfx[name];
    const a = Array.isArray(entry) ? entry[randInt(0, entry.length - 1)] : entry;
    if (!a || !a.src) return;
    try {
      a.currentTime = 0;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* ignore */ }
  },
  playBgm() {
    if (this.muted || !this.bgm.src) return;
    this.bgm.currentTime = 0;
    const p = this.bgm.play();
    if (p && p.catch) p.catch(() => {});
  },
  stopBgm() { this.bgm.pause(); },
  resumeBgm() {
    if (this.muted || !this.bgm.src) return;
    const p = this.bgm.play();
    if (p && p.catch) p.catch(() => {});
  },
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.bgm.pause();
    else if (phase === 'playing') this.playBgm();
    return this.muted;
  },
};

/* ==================== game state ==================== */
let board = null;           // board[row][col] = TileObj | null
let locked = false;         // true while an animation/resolution is in progress
let phase = 'start';        // 'start' | 'playing' | 'paused' | 'result'
let selectedCell = null;
let pointerState = null;
let boardEl = null;

const state = {
  mode: 'normal',           // 'normal' | 'timeAttack'
  score: 0,
  timeLeft: CONFIG.TIME_LIMIT,
  cellSize: 44,
  rafHandle: null,
  lastTick: 0,
  gauge: 0,                 // cleared-tile counter toward the next colorbomb
  pendingColorBombs: [],     // variants queued to fall in as colorbombs on next refill
  activeColors: CONFIG.START_COLOR_COUNT, // colors currently in play (ramps up mid-round)
  pendingSwap: null,        // swap attempted while locked; replayed the moment the board frees up
};

/* ==================== tile object ==================== */
let tileUid = 0;

function imageForTile(kind, variant) {
  if (kind === 'normal') return CONFIG.IMAGES.normal[variant - 1];
  if (kind === 'line') return CONFIG.IMAGES.line;
  if (kind === 'colorbomb') return CONFIG.IMAGES.normal[(variant || 1) - 1];
  return CONFIG.IMAGES.bomb;
}

class TileObj {
  constructor(kind, variant) {
    this.id = ++tileUid;
    this.kind = kind;               // 'normal' | 'line' | 'bomb' | 'colorbomb'
    this.variant = variant || null; // 1..NORMAL_PIECE_COUNT for normal pieces; target color for colorbomb
    this.row = 0;
    this.col = 0;

    this.el = document.createElement('div');
    this.el.className = 'tile no-anim' + (kind !== 'normal' ? ' special ' + kind : '');

    this.inner = document.createElement('div');
    this.inner.className = 'tile-inner';

    this.img = document.createElement('img');
    this.img.draggable = false;
    this.img.alt = '';
    this.img.src = imageForTile(kind, variant);

    this.inner.appendChild(this.img);

    // colorbomb glows in the color of the piece it will clear
    if (kind === 'colorbomb' && variant) {
      const glow = COLORBOMB_GLOW[variant] || COLORBOMB_GLOW[1];
      this.el.style.setProperty('--glow-soft', glow[0]);
      this.el.style.setProperty('--glow-strong', glow[1]);
    }

    this.el.appendChild(this.inner);
    boardEl.appendChild(this.el);
  }

  setPos(row, col, opts) {
    opts = opts || {};
    this.row = row;
    this.col = col;
    const x = col * state.cellSize;
    const y = row * state.cellSize;
    if (opts.noAnim) {
      this.el.classList.add('no-anim');
      this.el.style.transform = `translate(${x}px, ${y}px)`;
      // release the no-anim guard next frame so future moves animate again
      requestAnimationFrame(() => this.el.classList.remove('no-anim'));
    } else {
      this.el.classList.remove('no-anim');
      this.el.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  destroy() { this.el.remove(); }
}

function matchKey(tile) {
  if (!tile) return null;
  if (tile.kind === 'normal') return 'n' + tile.variant;
  if (tile.kind === 'colorbomb') return 'n' + tile.variant; // matches normal pieces of the same color
  return tile.kind; // 'line' pieces match each other regardless of orientation
}

/* ==================== layout ==================== */
function computeLayout() {
  const wrap = document.getElementById('board-wrap');
  const wrapStyle = getComputedStyle(wrap);
  const padX = parseFloat(wrapStyle.paddingLeft) + parseFloat(wrapStyle.paddingRight);
  const padY = parseFloat(wrapStyle.paddingTop) + parseFloat(wrapStyle.paddingBottom);
  const availW = wrap.clientWidth - padX - 4;
  const availH = wrap.clientHeight - padY - 4;
  const cellSize = Math.floor(Math.min(availW / CONFIG.COLS, availH / CONFIG.ROWS));
  state.cellSize = Math.max(20, cellSize);
  document.documentElement.style.setProperty('--cell-size', state.cellSize + 'px');
  boardEl.style.width = (state.cellSize * CONFIG.COLS) + 'px';
  boardEl.style.height = (state.cellSize * CONFIG.ROWS) + 'px';

  if (board) {
    for (let r = 0; r < CONFIG.ROWS; r++) {
      for (let c = 0; c < CONFIG.COLS; c++) {
        const t = board[r][c];
        if (t) t.setPos(r, c, { noAnim: true });
      }
    }
  }
}

/* ==================== match finding ==================== */
// Groups runs of 3+ same-key cells; runs that touch (share a cell) are merged
// into one group so L/T intersections are detected as a single shape.
function findMatchGroups() {
  const rows = CONFIG.ROWS, cols = CONFIG.COLS;
  const runs = [];

  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      const key = matchKey(board[r][c]);
      let c2 = c + 1;
      if (key) while (c2 < cols && matchKey(board[r][c2]) === key) c2++;
      if (key && c2 - c >= 3) {
        const cells = [];
        for (let cc = c; cc < c2; cc++) cells.push([r, cc]);
        runs.push({ dir: 'h', cells });
      }
      c = c2;
    }
  }
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      const key = matchKey(board[r][c]);
      let r2 = r + 1;
      if (key) while (r2 < rows && matchKey(board[r2][c]) === key) r2++;
      if (key && r2 - r >= 3) {
        const cells = [];
        for (let rr = r; rr < r2; rr++) cells.push([rr, c]);
        runs.push({ dir: 'v', cells });
      }
      r = r2;
    }
  }
  if (runs.length === 0) return [];

  const parent = runs.map((_, i) => i);
  function find(i) { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; }
  function union(a, b) { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; }

  const cellRunMap = new Map();
  runs.forEach((run, idx) => {
    run.cells.forEach(([r, c]) => {
      const k = r + ',' + c;
      if (!cellRunMap.has(k)) cellRunMap.set(k, []);
      cellRunMap.get(k).push(idx);
    });
  });
  cellRunMap.forEach(idxs => { for (let i = 1; i < idxs.length; i++) union(idxs[0], idxs[i]); });

  const groupsMap = new Map();
  runs.forEach((run, idx) => {
    const root = find(idx);
    if (!groupsMap.has(root)) groupsMap.set(root, { cellsSet: new Map(), runs: [] });
    const g = groupsMap.get(root);
    g.runs.push(run);
    run.cells.forEach(([r, c]) => g.cellsSet.set(r + ',' + c, [r, c]));
  });

  return Array.from(groupsMap.values()).map(g => ({
    cells: Array.from(g.cellsSet.values()),
    runs: g.runs,
  }));
}

// Decides whether a matched group spawns a special piece and where.
function classifyGroup(group) {
  if (group.runs.length > 1) {
    // Multiple runs sharing a cell = L/T shape -> area-explode piece.
    const cellCount = {};
    group.runs.forEach(run => run.cells.forEach(([r, c]) => {
      const k = r + ',' + c;
      cellCount[k] = (cellCount[k] || 0) + 1;
    }));
    const intersections = Object.keys(cellCount).filter(k => cellCount[k] > 1).map(k => k.split(',').map(Number));
    return { type: 'bomb', spawnCandidates: intersections.length ? intersections : group.cells };
  }
  const run = group.runs[0];
  const len = run.cells.length;
  if (len >= 5) return { type: 'bomb', spawnCandidates: [run.cells[Math.floor(len / 2)]] };
  if (len === 4) return { type: 'line', spawnCandidates: [run.cells[Math.floor(len / 2)]] };
  return { type: null, spawnCandidates: [] };
}

/* ==================== cascade resolution ==================== */
async function resolveCascade(chainIndex, swapHint) {
  const groups = findMatchGroups();
  if (groups.length === 0) return;

  const cellsToClear = new Map(); // key -> [r,c]
  const specialSpawns = [];       // {r,c,type}

  groups.forEach(group => {
    group.cells.forEach(([r, c]) => cellsToClear.set(r + ',' + c, [r, c]));
    const info = classifyGroup(group);
    if (info.type) {
      let spawnCell = null;
      if (swapHint) {
        const hintKey = swapHint.r + ',' + swapHint.c;
        if (group.cells.some(([r, c]) => r + ',' + c === hintKey)) spawnCell = [swapHint.r, swapHint.c];
      }
      if (!spawnCell) spawnCell = info.spawnCandidates[0];
      specialSpawns.push({ r: spawnCell[0], c: spawnCell[1], type: info.type });
    }
  });

  // Cells matched directly (before special-triggered explosions expand the set)
  // are what feed the gauge; explosion fallout doesn't count toward it.
  const baseMatchCount = cellsToClear.size;

  // Any existing special pieces caught in the blast trigger their own effect,
  // possibly chaining into further specials (handles specials-adjacent-to-specials too).
  const triggeredKinds = new Set();
  {
    const queue = Array.from(cellsToClear.keys());
    const processed = new Set();
    while (queue.length) {
      const k = queue.pop();
      if (processed.has(k)) continue;
      processed.add(k);
      const [r, c] = k.split(',').map(Number);
      const tile = board[r][c];
      if (!tile || tile.kind === 'normal') continue;
      triggeredKinds.add(tile.kind);
      const extra = [];
      if (tile.kind === 'line') {
        // Anchor the cross on the piece the player actually moved, not on
        // wherever this line piece happens to be sitting; falls back to its
        // own cell when there's no swap behind this trigger (chain reactions).
        const anchorR = swapHint ? swapHint.r : r;
        const anchorC = swapHint ? swapHint.c : c;
        for (let cc = 0; cc < CONFIG.COLS; cc++) extra.push([anchorR, cc]);
        for (let rr = 0; rr < CONFIG.ROWS; rr++) extra.push([rr, anchorC]);
      } else if (tile.kind === 'colorbomb') {
        for (let rr = 0; rr < CONFIG.ROWS; rr++) {
          for (let cc = 0; cc < CONFIG.COLS; cc++) {
            const t2 = board[rr][cc];
            if (t2 && t2.kind === 'normal' && t2.variant === tile.variant) extra.push([rr, cc]);
          }
        }
      } else {
        for (let rr = r - 1; rr <= r + 1; rr++) {
          for (let cc = c - 1; cc <= c + 1; cc++) {
            if (rr >= 0 && rr < CONFIG.ROWS && cc >= 0 && cc < CONFIG.COLS) extra.push([rr, cc]);
          }
        }
      }
      extra.forEach(([rr, cc]) => {
        const ek = rr + ',' + cc;
        if (!cellsToClear.has(ek)) cellsToClear.set(ek, [rr, cc]);
        if (!processed.has(ek)) queue.push(ek);
      });
    }
  }

  // --- scoring & time bonus ---
  const clearedCount = cellsToClear.size;
  const multiplier = 1 + (chainIndex - 1) * CONFIG.COMBO_MULTIPLIER_STEP;
  const gained = Math.round(clearedCount * CONFIG.BASE_SCORE_PER_PIECE * multiplier);
  state.score += gained;
  updateScoreUI();

  const timeBonus = chainIndex === 1 ? CONFIG.TIME_BONUS_CHAIN1
    : chainIndex === 2 ? CONFIG.TIME_BONUS_CHAIN2
    : CONFIG.TIME_BONUS_CHAIN3PLUS;
  if (state.mode !== 'timeAttack') {
    state.timeLeft += timeBonus;
    updateTimerUI();
  }

  // --- special gauge: fills from every cleared tile, drops a colorbomb when full ---
  const variantTally = {};
  cellsToClear.forEach(([r, c]) => {
    const t = board[r][c];
    if (t && t.kind === 'normal') variantTally[t.variant] = (variantTally[t.variant] || 0) + 1;
  });
  state.gauge += baseMatchCount;
  let queuedColorBomb = false;
  while (state.gauge >= CONFIG.GAUGE_THRESHOLD) {
    state.gauge -= CONFIG.GAUGE_THRESHOLD;
    let bestVariant = randInt(1, state.activeColors), bestCount = -1;
    Object.keys(variantTally).forEach(k => {
      if (variantTally[k] > bestCount) { bestCount = variantTally[k]; bestVariant = Number(k); }
    });
    state.pendingColorBombs.push(bestVariant);
    queuedColorBomb = true;
  }
  updateGaugeUI();

  const firstCell = swapHint || (() => { const it = cellsToClear.values().next().value; return { r: it[0], c: it[1] }; })();
  spawnFloatText(firstCell, `+${gained}`, 'score-text', -12);
  if (state.mode !== 'timeAttack') spawnFloatText(firstCell, `+${formatBonus(timeBonus)}s`, 'time-bonus', 12);
  if (chainIndex > 1) showComboBanner(chainIndex);

  new Set(specialSpawns.map(s => s.type)).forEach(type => SoundManager.play(SPECIAL_CREATE_SOUND_KEY[type]));
  if (queuedColorBomb) SoundManager.play('gaugeMax');
  triggeredKinds.forEach(kind => SoundManager.play(SPECIAL_ACTIVATE_SOUND_KEY[kind]));
  SoundManager.play(chainIndex > 1 ? 'combo' : 'match');

  // --- clear animation ---
  const destroyList = [];
  cellsToClear.forEach(([r, c]) => {
    const tile = board[r][c];
    if (!tile) return;
    tile.el.classList.add('clear-anim');
    destroyList.push(tile);
    board[r][c] = null;
  });
  if (destroyList.length) await wait(200);
  destroyList.forEach(t => t.destroy());

  // --- spawn new special pieces (cell-disjoint by construction, so no collisions) ---
  specialSpawns.forEach(s => {
    const newTile = new TileObj(s.type, null);
    newTile.setPos(s.r, s.c, { noAnim: true });
    board[s.r][s.c] = newTile;
    requestAnimationFrame(() => {
      newTile.el.classList.add('spawn');
      setTimeout(() => newTile.el.classList.remove('spawn'), 750);
    });
  });

  await applyGravity();
  await resolveCascade(chainIndex + 1, null);
}

async function applyGravity() {
  let anyMoved = false;
  for (let c = 0; c < CONFIG.COLS; c++) {
    let writeRow = CONFIG.ROWS - 1;
    for (let r = CONFIG.ROWS - 1; r >= 0; r--) {
      if (board[r][c]) {
        if (writeRow !== r) {
          const tile = board[r][c];
          board[writeRow][c] = tile;
          board[r][c] = null;
          tile.el.classList.add('falling');
          tile.setPos(writeRow, c);
          anyMoved = true;
        }
        writeRow--;
      }
    }
    let spawnOffset = 1;
    for (let r = writeRow; r >= 0; r--) {
      const tile = state.pendingColorBombs.length
        ? new TileObj('colorbomb', state.pendingColorBombs.shift())
        : new TileObj('normal', randInt(1, state.activeColors));
      tile.setPos(-spawnOffset, c, { noAnim: true });
      tile.el.classList.add('falling');
      board[r][c] = tile;
      requestAnimationFrame(() => tile.setPos(r, c));
      spawnOffset++;
      anyMoved = true;
    }
  }
  if (anyMoved) await wait(260);
  for (let r = 0; r < CONFIG.ROWS; r++) {
    for (let c = 0; c < CONFIG.COLS; c++) {
      if (board[r][c]) board[r][c].el.classList.remove('falling');
    }
  }
}

/* ==================== board setup / no-move handling ==================== */
function causesImmediateMatchAt(r, c, variant) {
  if (c >= 2) {
    const a = board[r][c - 1], b = board[r][c - 2];
    if (a && b && a.kind === 'normal' && b.kind === 'normal' && a.variant === variant && b.variant === variant) return true;
  }
  if (r >= 2) {
    const a = board[r - 1][c], b = board[r - 2][c];
    if (a && b && a.kind === 'normal' && b.kind === 'normal' && a.variant === variant && b.variant === variant) return true;
  }
  return false;
}

function hasAnyValidMove() {
  for (let r = 0; r < CONFIG.ROWS; r++) {
    for (let c = 0; c < CONFIG.COLS; c++) {
      if (c + 1 < CONFIG.COLS) {
        const a = { r, c }, b = { r, c: c + 1 };
        swapData(a, b);
        const has = findMatchGroups().length > 0;
        swapData(a, b);
        if (has) return true;
      }
      if (r + 1 < CONFIG.ROWS) {
        const a = { r, c }, b = { r: r + 1, c };
        swapData(a, b);
        const has = findMatchGroups().length > 0;
        swapData(a, b);
        if (has) return true;
      }
    }
  }
  return false;
}

function swapData(a, b) {
  const t = board[a.r][a.c];
  board[a.r][a.c] = board[b.r][b.c];
  board[b.r][b.c] = t;
}

function createInitialBoard() {
  board = [];
  for (let r = 0; r < CONFIG.ROWS; r++) {
    board.push([]);
    for (let c = 0; c < CONFIG.COLS; c++) {
      let variant, tries = 0;
      do { variant = randInt(1, state.activeColors); tries++; }
      while (tries < 30 && causesImmediateMatchAt(r, c, variant));
      board[r][c] = new TileObj('normal', variant);
    }
  }
  let guard = 0;
  while (!hasAnyValidMove() && guard < 20) {
    const flat = [];
    for (let r = 0; r < CONFIG.ROWS; r++) for (let c = 0; c < CONFIG.COLS; c++) flat.push(board[r][c]);
    shuffleArray(flat);
    let idx = 0;
    for (let r = 0; r < CONFIG.ROWS; r++) for (let c = 0; c < CONFIG.COLS; c++) board[r][c] = flat[idx++];
    guard++;
  }
  for (let r = 0; r < CONFIG.ROWS; r++) {
    for (let c = 0; c < CONFIG.COLS; c++) board[r][c].setPos(r, c, { noAnim: true });
  }
}

async function shuffleBoard() {
  locked = true;
  const tiles = [];
  for (let r = 0; r < CONFIG.ROWS; r++) for (let c = 0; c < CONFIG.COLS; c++) tiles.push(board[r][c]);

  let attempts = 0, ok = false;
  while (attempts < 80 && !ok) {
    shuffleArray(tiles);
    let idx = 0;
    for (let r = 0; r < CONFIG.ROWS; r++) for (let c = 0; c < CONFIG.COLS; c++) board[r][c] = tiles[idx++];
    if (findMatchGroups().length === 0 && hasAnyValidMove()) ok = true;
    attempts++;
  }
  for (let r = 0; r < CONFIG.ROWS; r++) {
    for (let c = 0; c < CONFIG.COLS; c++) board[r][c].setPos(r, c);
  }
  await wait(380);
  locked = false;
}

async function ensurePlayableBoard() {
  if (!hasAnyValidMove()) await shuffleBoard();
}

function clearBoardTiles() {
  if (!board) return;
  for (let r = 0; r < CONFIG.ROWS; r++) for (let c = 0; c < CONFIG.COLS; c++) {
    if (board[r][c]) board[r][c].destroy();
  }
  board = null;
}

/* ==================== swapping / input ==================== */
// Runs the queued swap (if any) the instant the board frees up, so a swipe
// made mid-cascade doesn't just get silently dropped.
function unlock() {
  locked = false;
  if (state.pendingSwap) {
    const { a, b } = state.pendingSwap;
    state.pendingSwap = null;
    trySwap(a, b);
  }
}

async function trySwap(a, b) {
  if (phase !== 'playing') return;
  if (!isAdjacent(a, b)) return;
  if (locked) { state.pendingSwap = { a, b }; return; }
  locked = true;
  clearSelection();

  swapData(a, b);
  animateSwapVisual(a, b);
  await wait(140);

  const groups = findMatchGroups();
  if (groups.length === 0) {
    swapData(a, b);
    animateSwapVisual(a, b);
    const ta = board[a.r][a.c], tb = board[b.r][b.c];
    if (ta) ta.el.classList.add('invalid-swap');
    if (tb) tb.el.classList.add('invalid-swap');
    await wait(260);
    if (ta) ta.el.classList.remove('invalid-swap');
    if (tb) tb.el.classList.remove('invalid-swap');
    unlock();
    return;
  }

  await resolveCascade(1, b);
  await ensurePlayableBoard();
  unlock();
}

function animateSwapVisual(a, b) {
  const ta = board[a.r][a.c];
  const tb = board[b.r][b.c];
  if (ta) ta.setPos(a.r, a.c);
  if (tb) tb.setPos(b.r, b.c);
}

function cellFromEvent(e) {
  const rect = boardEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const c = Math.floor(x / state.cellSize);
  const r = Math.floor(y / state.cellSize);
  if (r < 0 || r >= CONFIG.ROWS || c < 0 || c >= CONFIG.COLS) return null;
  return { r, c };
}

function onPointerDown(e) {
  if (phase !== 'playing') return;
  const cell = cellFromEvent(e);
  if (!cell) return;
  e.preventDefault();
  pointerState = { r: cell.r, c: cell.c, x: e.clientX, y: e.clientY, moved: false, pointerId: e.pointerId };
}

function onPointerMove(e) {
  if (!pointerState || pointerState.pointerId !== e.pointerId || pointerState.moved) return;
  const dx = e.clientX - pointerState.x;
  const dy = e.clientY - pointerState.y;
  const threshold = Math.max(16, state.cellSize * 0.32);
  if (Math.max(Math.abs(dx), Math.abs(dy)) <= threshold) return;

  pointerState.moved = true;
  const start = { r: pointerState.r, c: pointerState.c };
  pointerState = null;

  const target = Math.abs(dx) > Math.abs(dy)
    ? { r: start.r, c: start.c + (dx > 0 ? 1 : -1) }
    : { r: start.r + (dy > 0 ? 1 : -1), c: start.c };
  if (target.r >= 0 && target.r < CONFIG.ROWS && target.c >= 0 && target.c < CONFIG.COLS) {
    clearSelection();
    trySwap(start, target);
  }
}

function onPointerUp(e) {
  if (!pointerState || pointerState.pointerId !== e.pointerId) { pointerState = null; return; }
  if (!pointerState.moved) handleTap({ r: pointerState.r, c: pointerState.c });
  pointerState = null;
}

function handleTap(cell) {
  if (locked || phase !== 'playing') return;
  if (!selectedCell) {
    selectedCell = cell;
    const t = board[cell.r][cell.c];
    if (t) t.el.classList.add('selected');
    return;
  }
  if (selectedCell.r === cell.r && selectedCell.c === cell.c) { clearSelection(); return; }
  if (isAdjacent(selectedCell, cell)) {
    const a = selectedCell;
    clearSelection();
    trySwap(a, cell);
  } else {
    clearSelection();
    selectedCell = cell;
    const t = board[cell.r][cell.c];
    if (t) t.el.classList.add('selected');
  }
}

function clearSelection() {
  if (selectedCell) {
    const t = board[selectedCell.r][selectedCell.c];
    if (t) t.el.classList.remove('selected');
  }
  selectedCell = null;
}

/* ==================== floating texts / combo banner ==================== */
function spawnFloatText(cell, text, cls, dyOffset) {
  const el = document.createElement('div');
  el.className = 'float-text ' + cls;
  el.textContent = text;
  el.style.left = ((cell.c + 0.5) * state.cellSize) + 'px';
  el.style.top = ((cell.r + 0.5) * state.cellSize + (dyOffset || 0)) + 'px';
  boardEl.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

function showBanner(text, durationMs) {
  const el = document.getElementById('combo-banner');
  el.textContent = text;
  el.style.setProperty('--banner-duration', ((durationMs || 900) / 1000) + 's');
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function showComboBanner(chainIndex) {
  showBanner(`${chainIndex} コンボ！`);
}

/* ==================== HUD / timer ==================== */
function updateScoreUI() {
  document.getElementById('score-value').textContent = Math.floor(state.score);
}

function updateTimerUI() {
  const secs = Math.max(0, Math.ceil(state.timeLeft));
  document.getElementById('timer-value').textContent = secs;
  document.getElementById('timer-panel').classList.toggle('warn', state.timeLeft <= 10 && state.timeLeft > 0);
}

function updateGaugeUI() {
  const pct = Math.max(0, Math.min(100, (state.gauge / CONFIG.GAUGE_THRESHOLD) * 100));
  document.getElementById('gauge-fill').style.width = pct + '%';
}

function timerTick(now) {
  if (phase !== 'playing') return;
  const dt = (now - state.lastTick) / 1000;
  state.lastTick = now;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    updateTimerUI();
    endGame();
    return;
  }
  if (state.activeColors < CONFIG.NORMAL_PIECE_COUNT && state.timeLeft >= CONFIG.COLOR_RAMP_TIME_LEFT) {
    state.activeColors = CONFIG.NORMAL_PIECE_COUNT;
    showBanner('新しい色が登場！', 2000);
  }
  updateTimerUI();
  state.rafHandle = requestAnimationFrame(timerTick);
}

/* ==================== game flow ==================== */
function startGame(mode) {
  state.mode = mode || state.mode || 'normal';
  phase = 'playing';
  locked = false;
  document.getElementById('start-overlay').classList.add('hidden');
  document.getElementById('result-overlay').classList.add('hidden');
  document.querySelector('#timer-panel .timer-label').textContent =
    state.mode === 'timeAttack' ? 'タイムアタック' : 'カウントダウン';
  state.score = 0;
  state.timeLeft = CONFIG.TIME_LIMIT;
  state.gauge = 0;
  state.pendingColorBombs = [];
  state.activeColors = CONFIG.START_COLOR_COUNT;
  state.pendingSwap = null;
  updateScoreUI();
  updateTimerUI();
  updateGaugeUI();
  document.getElementById('timer-panel').classList.remove('warn');

  clearBoardTiles();
  computeLayout();
  createInitialBoard();
  computeLayout();

  SoundManager.playBgm();
  state.lastTick = performance.now();
  cancelAnimationFrame(state.rafHandle);
  state.rafHandle = requestAnimationFrame(timerTick);
}

function pauseGame() {
  if (phase !== 'playing') return;
  phase = 'paused';
  cancelAnimationFrame(state.rafHandle);
  SoundManager.stopBgm();
  document.getElementById('pause-overlay').classList.remove('hidden');
}

function resumeGame() {
  if (phase !== 'paused') return;
  phase = 'playing';
  document.getElementById('pause-overlay').classList.add('hidden');
  SoundManager.resumeBgm();
  state.lastTick = performance.now();
  cancelAnimationFrame(state.rafHandle);
  state.rafHandle = requestAnimationFrame(timerTick);
}

function endGame() {
  phase = 'result';
  cancelAnimationFrame(state.rafHandle);
  SoundManager.stopBgm();
  SoundManager.play('gameOver');

  const finalScore = Math.floor(state.score);
  const high = Math.max(finalScore, loadHighScore(state.mode));
  saveHighScore(state.mode, high);
  document.getElementById('result-score').textContent = finalScore;
  document.getElementById('result-highscore').textContent = high;
  document.getElementById('ranking-title-result').textContent =
    state.mode === 'timeAttack' ? 'TIME ATTACK RANKING' : 'RANKING';
  document.getElementById('result-overlay').classList.remove('hidden');
  openRankingEntry(finalScore);
}

/* ==================== ranking ==================== */
let rankingScoreForEntry = 0;

function renderRankingList(list, message) {
  const listEl = document.getElementById('ranking-list-result');
  listEl.innerHTML = '';
  if (message) {
    const li = document.createElement('li');
    li.className = 'rk-empty';
    li.textContent = message;
    listEl.appendChild(li);
    return;
  }
  if (!list.length) {
    const li = document.createElement('li');
    li.className = 'rk-empty';
    li.textContent = 'まだ記録がありません';
    listEl.appendChild(li);
    return;
  }
  list.forEach((item, i) => {
    const li = document.createElement('li');
    const pos = document.createElement('span'); pos.className = 'rk-pos'; pos.textContent = String(i + 1);
    const name = document.createElement('span'); name.className = 'rk-name'; name.textContent = item.name;
    const sc = document.createElement('span'); sc.className = 'rk-score'; sc.textContent = item.score;
    li.append(pos, name, sc);
    listEl.appendChild(li);
  });
}

function refreshRanking() {
  renderRankingList([], 'ランキングを確認中…');
  if (!window.KaiRanking) {
    renderRankingList([], 'ランキング機能を読み込めませんでした');
    return Promise.resolve([]);
  }
  return window.KaiRanking.fetchTop(state.mode, RANKING_LIMIT).then(list => {
    renderRankingList(list, null);
    return list;
  }).catch(err => {
    console.error('[KaiRanking] fetchTop failed:', err);
    renderRankingList([], 'ランキングを取得できませんでした');
    return [];
  });
}

function openRankingEntry(score) {
  rankingScoreForEntry = score;
  const entry = document.getElementById('name-entry-result');
  const input = document.getElementById('name-input-result');
  const submitBtn = document.getElementById('name-submit-result');
  input.value = '';
  submitBtn.disabled = true;
  entry.style.display = 'none';
  refreshRanking().then(list => {
    const qualifies = list.length < RANKING_LIMIT || score > list[list.length - 1].score;
    if (qualifies) entry.style.display = 'flex';
  });
}

function wireRankingEvents() {
  const input = document.getElementById('name-input-result');
  const submitBtn = document.getElementById('name-submit-result');
  const skipBtn = document.getElementById('name-skip-result');
  const entry = document.getElementById('name-entry-result');

  input.addEventListener('input', () => {
    const v = input.value.replace(/[^A-Za-z]/g, '').slice(0, 3);
    if (v !== input.value) input.value = v;
    submitBtn.disabled = v.length < 1;
  });

  skipBtn.addEventListener('click', () => {
    entry.style.display = 'none';
  });

  submitBtn.addEventListener('click', () => {
    const name = input.value.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
    if (name.length < 1 || !window.KaiRanking) return;
    submitBtn.disabled = true;
    window.KaiRanking.add(state.mode, name, rankingScoreForEntry).then(() => {
      entry.style.display = 'none';
      return refreshRanking();
    }).catch(err => {
      console.error('[KaiRanking] add failed:', err);
      submitBtn.disabled = false;
      renderRankingList([], '登録に失敗しました。通信環境をご確認ください');
    });
  });
}

/* ==================== init ==================== */
function wireEvents() {
  boardEl.addEventListener('pointerdown', onPointerDown);
  boardEl.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('resize', computeLayout);

  const soundBtn = document.getElementById('sound-toggle');
  soundBtn.addEventListener('click', () => {
    const muted = SoundManager.toggleMute();
    document.getElementById('icon-sound-on').style.display = muted ? 'none' : '';
    document.getElementById('icon-sound-off').style.display = muted ? '' : 'none';
    soundBtn.setAttribute('aria-pressed', String(!muted));
  });

  document.getElementById('start-btn-normal').addEventListener('click', () => {
    SoundManager.unlock();
    startGame('normal');
  });
  document.getElementById('start-btn-timeattack').addEventListener('click', () => {
    SoundManager.unlock();
    startGame('timeAttack');
  });
  document.getElementById('restart-btn').addEventListener('click', () => {
    SoundManager.unlock();
    startGame(state.mode);
  });

  document.getElementById('logo-btn').addEventListener('click', () => {
    pauseGame();
  });
  document.getElementById('pause-resume-btn').addEventListener('click', () => {
    resumeGame();
  });
  document.getElementById('pause-restart-btn').addEventListener('click', () => {
    document.getElementById('pause-overlay').classList.add('hidden');
    SoundManager.unlock();
    startGame(state.mode);
  });

  wireRankingEvents();
}

document.addEventListener('DOMContentLoaded', () => {
  boardEl = document.getElementById('board');
  SoundManager.init();
  document.getElementById('result-highscore').textContent = loadHighScore('normal');
  computeLayout();
  wireEvents();
});
