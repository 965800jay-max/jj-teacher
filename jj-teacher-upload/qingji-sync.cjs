"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/mount.ts
var mount_exports = {};
__export(mount_exports, {
  handle: () => handle
});
module.exports = __toCommonJS(mount_exports);
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");

// server/http.ts
var import_node_http = require("node:http");

// server/store.ts
var import_node_crypto = require("node:crypto");
var import_node_sqlite = require("node:sqlite");
var import_node_util = require("node:util");
var import_node_events = require("node:events");

// src/domain/ledger.ts
var KINDS = ["expense", "income", "lend", "borrow", "repaymentIn", "repaymentOut"];
var AVATARS = ["\u{1F33F}", "\u2600\uFE0F", "\u{1F34A}", "\u{1F30A}", "\u{1F338}", "\u{1F431}", "\u{1F340}", "\u{1FA90}"];
var COLORS = ["#E4EEE6", "#F8ECD2", "#F9E5D8", "#E1ECF3", "#F6E3EA", "#EEE7DD", "#E6EDD9", "#E9E4F4"];
var EXPENSE_CATEGORIES = ["\u9910\u996E", "\u4EA4\u901A", "\u8D2D\u7269", "\u5C45\u4F4F", "\u5A31\u4E50", "\u5065\u5EB7", "\u5B66\u4E60", "\u5176\u4ED6"];
var INCOME_CATEGORIES = ["\u5DE5\u8D44", "\u5956\u91D1", "\u517C\u804C", "\u793C\u91D1", "\u5176\u4ED6"];
var MAX_CENTS = 999999999;
function localDate(date = /* @__PURE__ */ new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isValidDate(value) {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(value)) return false;
  const date = /* @__PURE__ */ new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDate(date) === value;
}
function isDebt(kind) {
  return kind !== "income" && kind !== "expense";
}
function debtDelta(entry) {
  if (entry.kind === "lend" || entry.kind === "repaymentOut") return entry.amountCents;
  if (entry.kind === "borrow" || entry.kind === "repaymentIn") return -entry.amountCents;
  return 0;
}
function orderedEntries(entries) {
  return [...entries].sort((left, right) => right.occurredOn.localeCompare(left.occurredOn) || right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id));
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function shortText(value, max, allowEmpty = false) {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function validTimestamp(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
}
function validId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
}
function validateLedger(value) {
  assert(isRecord(value) && value.version === 1, "\u8D26\u672C\u7248\u672C\u4E0D\u652F\u6301\uFF0C\u8BF7\u52FF\u8986\u76D6\u539F\u59CB\u6570\u636E\u3002");
  assert(Array.isArray(value.friends) && value.friends.length <= 2e3, "\u597D\u53CB\u6570\u636E\u65E0\u6548\u6216\u8D85\u8FC7 2000 \u4EBA\u3002");
  assert(Array.isArray(value.entries) && value.entries.length <= 5e4, "\u8D26\u76EE\u6570\u636E\u65E0\u6548\u6216\u8D85\u8FC7 50,000 \u7B14\u3002");
  const friendIds = /* @__PURE__ */ new Set();
  const names = /* @__PURE__ */ new Set();
  for (const friend of value.friends) {
    assert(isRecord(friend) && validId(friend.id) && !friendIds.has(friend.id), "\u597D\u53CB\u7F16\u53F7\u91CD\u590D\u6216\u65E0\u6548\u3002");
    assert(shortText(friend.name, 24), "\u597D\u53CB\u59D3\u540D\u9700\u4E3A 1\u201324 \u4E2A\u5B57\u7B26\u3002");
    const normalizedName = friend.name.trim().toLocaleLowerCase();
    assert(friend.accountId !== void 0 || !names.has(normalizedName), `\u5DF2\u5B58\u5728\u540D\u4E3A\u300C${friend.name}\u300D\u7684\u597D\u53CB\uFF0C\u8BF7\u4F7F\u7528\u4E0D\u540C\u5907\u6CE8\u540D\u3002`);
    assert(friend.accountId === void 0 || validId(friend.accountId), "\u597D\u53CB\u8D26\u53F7\u65E0\u6548\u3002");
    assert(friend.connected === void 0 || typeof friend.connected === "boolean", "\u597D\u53CB\u8FDE\u63A5\u72B6\u6001\u65E0\u6548\u3002");
    assert(typeof friend.avatar === "string" && AVATARS.includes(friend.avatar), "\u8BF7\u9009\u62E9\u63D0\u4F9B\u7684\u5934\u50CF\u3002");
    assert(typeof friend.color === "string" && COLORS.includes(friend.color), "\u5934\u50CF\u989C\u8272\u65E0\u6548\u3002");
    assert(shortText(friend.note, 80, true) && validTimestamp(friend.createdAt), "\u597D\u53CB\u5907\u6CE8\u6216\u521B\u5EFA\u65E5\u671F\u65E0\u6548\u3002");
    friendIds.add(friend.id);
    names.add(normalizedName);
  }
  const entryIds = /* @__PURE__ */ new Set();
  for (const entry of value.entries) {
    assert(isRecord(entry) && validId(entry.id) && !entryIds.has(entry.id), "\u8D26\u76EE\u7F16\u53F7\u91CD\u590D\u6216\u65E0\u6548\u3002");
    assert(typeof entry.kind === "string" && KINDS.includes(entry.kind), "\u8D26\u76EE\u7C7B\u578B\u65E0\u6548\u3002");
    assert(typeof entry.amountCents === "number" && Number.isSafeInteger(entry.amountCents) && entry.amountCents > 0 && entry.amountCents <= MAX_CENTS, "\u8D26\u76EE\u91D1\u989D\u65E0\u6548\u3002");
    assert(shortText(entry.reason, 160), "\u8BF7\u586B\u5199 1\u2013160 \u4E2A\u5B57\u7B26\u7684\u8BB0\u8D26\u539F\u56E0\u3002");
    assert(typeof entry.occurredOn === "string" && isValidDate(entry.occurredOn), "\u65E5\u671F\u65E0\u6548\uFF0C\u8BF7\u4F7F\u7528 YYYY-MM-DD \u683C\u5F0F\uFF082000\u20132099 \u5E74\uFF09\u3002");
    assert(entry.friendId === null || typeof entry.friendId === "string" && friendIds.has(entry.friendId), "\u5173\u8054\u7684\u597D\u53CB\u4E0D\u5B58\u5728\u3002");
    const debt = isDebt(entry.kind);
    assert(!debt || entry.friendId !== null, "\u501F\u8FD8\u6B3E\u5FC5\u987B\u9009\u62E9\u4E00\u4F4D\u597D\u53CB\u3002");
    const categories = entry.kind === "expense" ? EXPENSE_CATEGORIES : entry.kind === "income" ? INCOME_CATEGORIES : ["\u5F80\u6765"];
    assert(typeof entry.category === "string" && categories.includes(entry.category), "\u8BF7\u9009\u62E9\u6709\u6548\u7684\u8D26\u76EE\u5206\u7C7B\u3002");
    assert(validTimestamp(entry.createdAt) && validTimestamp(entry.updatedAt), "\u8D26\u76EE\u65F6\u95F4\u65E0\u6548\u3002");
    assert(entry.ownerId === void 0 || validId(entry.ownerId), "\u8D26\u76EE\u4E0A\u4F20\u8D26\u53F7\u65E0\u6548\u3002");
    assert(entry.ownerName === void 0 || shortText(entry.ownerName, 24), "\u8D26\u76EE\u4E0A\u4F20\u8005\u59D3\u540D\u65E0\u6548\u3002");
    assert(entry.revision === void 0 || typeof entry.revision === "number" && Number.isSafeInteger(entry.revision) && entry.revision > 0, "\u8D26\u76EE\u7248\u672C\u65E0\u6548\u3002");
    assert(entry.sharedOnly === void 0 || typeof entry.sharedOnly === "boolean", "\u8D26\u76EE\u5206\u4EAB\u6807\u8BB0\u65E0\u6548\u3002");
    entryIds.add(entry.id);
  }
  const ledger = value;
  const running = /* @__PURE__ */ new Map();
  for (const entry of orderedEntries(ledger.entries).reverse()) {
    if (!entry.friendId || !isDebt(entry.kind)) continue;
    const balance = running.get(entry.friendId) ?? 0;
    const name = ledger.friends.find((friend) => friend.id === entry.friendId)?.name ?? "\u597D\u53CB";
    if (entry.kind === "repaymentIn") {
      assert(balance >= entry.amountCents, `${entry.occurredOn}\u300C${name}\u300D\u7684\u6536\u5230\u8FD8\u6B3E\u8D85\u8FC7\u5F53\u65F6\u5E94\u6536\u6B20\u6B3E\uFF0C\u8BF7\u5148\u8C03\u6574\u76F8\u5173\u501F\u6B3E\u6216\u8FD8\u6B3E\u3002`);
    }
    if (entry.kind === "repaymentOut") {
      assert(-balance >= entry.amountCents, `${entry.occurredOn}\u5411\u300C${name}\u300D\u5F52\u8FD8\u7684\u91D1\u989D\u8D85\u8FC7\u5F53\u65F6\u5E94\u4ED8\u6B20\u6B3E\uFF0C\u8BF7\u5148\u8C03\u6574\u76F8\u5173\u501F\u6B3E\u6216\u8FD8\u6B3E\u3002`);
    }
    running.set(entry.friendId, balance + debtDelta(entry));
  }
  return ledger;
}

// src/domain/sync.ts
var INVERSE_KIND = {
  lend: "borrow",
  borrow: "lend",
  repaymentIn: "repaymentOut",
  repaymentOut: "repaymentIn",
  income: "income",
  expense: "expense"
};
function entryForViewer(entry, viewerId, ownerName) {
  const received = entry.ownerId !== viewerId;
  return {
    ...entry,
    kind: received ? INVERSE_KIND[entry.kind] : entry.kind,
    ownerName,
    sharedOnly: received && (entry.kind === "income" || entry.kind === "expense")
  };
}

// src/domain/groups.ts
function billCategory(bill) {
  const name = (bill.category ?? bill.name).trim();
  if (/^(网络|网费|网络费|宽带|宽带费)$/.test(name)) return "\u7F51\u7EDC";
  if (/^(房租|租金|店租)$/.test(name)) return "\u623F\u79DF";
  return name;
}
var validMonth = (value) => typeof value === "string" && /^(20\d{2})-(0[1-9]|1[0-2])$/.test(value);

// server/store.ts
var scrypt = (0, import_node_util.promisify)(import_node_crypto.scrypt);
var hash = (value) => (0, import_node_crypto.createHash)("sha256").update(value).digest("hex");
var code = () => (0, import_node_crypto.randomBytes)(10).toString("hex").toUpperCase();
var ApiError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
  status;
};
function check(value, message, status = 400) {
  if (!value) throw new ApiError(status, message);
}
function text(value, max) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}
function checkedDraft(value) {
  check(typeof value === "object" && value !== null && !Array.isArray(value), "\u8D26\u76EE\u5185\u5BB9\u65E0\u6548\u3002");
  const draft = value;
  check(typeof draft.kind === "string" && KINDS.includes(draft.kind), "\u8D26\u76EE\u7C7B\u578B\u65E0\u6548\u3002");
  check(typeof draft.amountCents === "number" && Number.isSafeInteger(draft.amountCents) && draft.amountCents > 0 && draft.amountCents <= MAX_CENTS, "\u8D26\u76EE\u91D1\u989D\u65E0\u6548\u3002");
  check(text(draft.reason, 160), "\u8BF7\u586B\u5199 1\u2013160 \u4E2A\u5B57\u7B26\u7684\u8BB0\u8D26\u539F\u56E0\u3002");
  check(typeof draft.occurredOn === "string" && isValidDate(draft.occurredOn), "\u65E5\u671F\u65E0\u6548\u3002");
  check(draft.friendId === null || typeof draft.friendId === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(draft.friendId), "\u597D\u53CB\u7F16\u53F7\u65E0\u6548\u3002");
  const categories = draft.kind === "income" ? INCOME_CATEGORIES : draft.kind === "expense" ? EXPENSE_CATEGORIES : ["\u5F80\u6765"];
  check(typeof draft.category === "string" && categories.includes(draft.category), "\u8D26\u76EE\u5206\u7C7B\u65E0\u6548\u3002");
  check(draft.kind === "income" || draft.kind === "expense" || draft.friendId !== null, "\u501F\u8FD8\u6B3E\u5FC5\u987B\u5173\u8054\u597D\u53CB\u3002");
  return {
    kind: draft.kind,
    amountCents: draft.amountCents,
    reason: draft.reason.trim(),
    occurredOn: draft.occurredOn,
    friendId: draft.friendId,
    category: draft.category
  };
}
var SyncStore = class {
  events = new import_node_events.EventEmitter();
  database;
  clock = 0;
  constructor(path) {
    this.database = new import_node_sqlite.DatabaseSync(path);
    this.database.exec(`
      PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, login TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL,
        name TEXT NOT NULL, avatar TEXT NOT NULL, color TEXT NOT NULL, friend_code TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS friendships (
        id TEXT PRIMARY KEY, user_a TEXT NOT NULL REFERENCES users(id), user_b TEXT NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, blocked_by TEXT,
        UNIQUE(user_a,user_b), CHECK(user_a < user_b)
      );
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id), friendship_id TEXT REFERENCES friendships(id),
        kind TEXT NOT NULL, amount_cents INTEGER NOT NULL, category TEXT NOT NULL, reason TEXT NOT NULL,
        occurred_on TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 1, deleted_at TEXT
      );
      CREATE TABLE IF NOT EXISTS audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id TEXT NOT NULL, entry_id TEXT NOT NULL,
        action TEXT NOT NULL, revision INTEGER NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS entry_friendship ON entries(friendship_id);
      CREATE INDEX IF NOT EXISTS entry_owner ON entries(owner_id);
      CREATE INDEX IF NOT EXISTS session_user ON sessions(user_id);
      CREATE TABLE IF NOT EXISTS shop_groups (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, owner_id TEXT NOT NULL REFERENCES users(id),
        revision INTEGER NOT NULL DEFAULT 1, payload TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS shop_members (
        group_id TEXT NOT NULL REFERENCES shop_groups(id), user_id TEXT NOT NULL REFERENCES users(id),
        PRIMARY KEY(group_id,user_id)
      );
      CREATE INDEX IF NOT EXISTS shop_member_user ON shop_members(user_id);
      CREATE TABLE IF NOT EXISTS shop_tasks (
        id TEXT PRIMARY KEY, group_id TEXT NOT NULL REFERENCES shop_groups(id), name TEXT NOT NULL,
        created_by TEXT NOT NULL REFERENCES users(id), starts_on TEXT NOT NULL, archived_on TEXT
      );
      CREATE TABLE IF NOT EXISTS shop_task_completions (
        task_id TEXT NOT NULL REFERENCES shop_tasks(id), task_date TEXT NOT NULL, task_name TEXT NOT NULL,
        completed_by TEXT NOT NULL REFERENCES users(id), completed_name TEXT NOT NULL, completed_at TEXT NOT NULL,
        PRIMARY KEY(task_id,task_date)
      );
      CREATE INDEX IF NOT EXISTS shop_task_group ON shop_tasks(group_id);
      CREATE TABLE IF NOT EXISTS deletion_requests (
        id TEXT PRIMARY KEY, scope TEXT NOT NULL, scope_id TEXT NOT NULL, target_id TEXT NOT NULL,
        title TEXT NOT NULL, requested_by TEXT NOT NULL, required TEXT NOT NULL, approved TEXT NOT NULL,
        action TEXT NOT NULL, input TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS pending_deletion ON deletion_requests(scope,target_id) WHERE status='pending';
    `);
    this.transaction(() => {
      if (!this.all("PRAGMA table_info(shop_tasks)").some((column) => column.name === "frequency")) this.database.exec("ALTER TABLE shop_tasks ADD COLUMN frequency TEXT NOT NULL DEFAULT 'daily'");
      if (!this.all("PRAGMA table_info(users)").some((column) => column.name === "public_id")) this.database.exec("ALTER TABLE users ADD COLUMN public_id TEXT");
      this.database.exec("CREATE UNIQUE INDEX IF NOT EXISTS user_public_id ON users(public_id)");
      for (const user of this.all("SELECT id FROM users WHERE public_id IS NULL")) {
        this.run("UPDATE users SET public_id=?,revision=revision+1 WHERE id=?", this.newPublicId(), String(user.id));
      }
    });
    const latest = this.one("SELECT MAX(created_at) AS latest FROM entries");
    this.clock = latest?.latest ? Date.parse(String(latest.latest)) : 0;
    this.events.setMaxListeners(1e3);
  }
  one(sql, ...values) {
    return this.database.prepare(sql).get(...values);
  }
  all(sql, ...values) {
    return this.database.prepare(sql).all(...values);
  }
  run(sql, ...values) {
    return this.database.prepare(sql).run(...values);
  }
  transaction(callback) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const result = callback();
      this.database.exec("COMMIT");
      return result;
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
  timestamp() {
    this.clock = Math.max(Date.now(), this.clock + 1);
    return new Date(this.clock).toISOString();
  }
  changed(userIds) {
    for (const userId of new Set(userIds)) this.run("UPDATE users SET revision=revision+1 WHERE id=?", userId);
  }
  publish(userIds) {
    for (const userId of new Set(userIds)) this.events.emit(userId);
  }
  newPublicId() {
    let candidate;
    do {
      candidate = String((0, import_node_crypto.randomInt)(1e9, 1e10));
    } while (this.one("SELECT id FROM users WHERE public_id=?", candidate));
    return candidate;
  }
  account(userId) {
    const row = this.one("SELECT * FROM users WHERE id=?", userId);
    check(row, "\u8D26\u53F7\u4E0D\u5B58\u5728\u3002", 401);
    return {
      id: String(row.id),
      login: String(row.login),
      name: String(row.name),
      avatar: String(row.avatar),
      color: String(row.color),
      friendCode: String(row.friend_code),
      publicId: String(row.public_id)
    };
  }
  authenticate(token) {
    check(token.length >= 40 && token.length <= 100, "\u8BF7\u5148\u767B\u5F55\u3002", 401);
    const row = this.one("SELECT user_id FROM sessions WHERE token_hash=? AND expires_at>?", hash(token), Date.now());
    check(row, "\u767B\u5F55\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\u3002", 401);
    return String(row.user_id);
  }
  session(userId) {
    const token = (0, import_node_crypto.randomBytes)(32).toString("base64url");
    this.run("DELETE FROM sessions WHERE expires_at<?", Date.now());
    this.run("INSERT INTO sessions VALUES (?,?,?)", hash(token), userId, Date.now() + 30 * 864e5);
    return { token, snapshot: this.snapshot(userId) };
  }
  async register(input) {
    check(text(input.login, 32) && /^[\p{L}\p{N}_-]{3,32}$/u.test(input.login), "\u8D26\u53F7\u9700\u4E3A 3\u201332 \u4F4D\u6587\u5B57\u3001\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u6216\u77ED\u6A2A\u7EBF\u3002");
    check(typeof input.password === "string" && input.password.length >= 10 && input.password.length <= 128, "\u5BC6\u7801\u9700\u4E3A 10\u2013128 \u4E2A\u5B57\u7B26\u3002");
    check(text(input.name, 24), "\u6635\u79F0\u9700\u4E3A 1\u201324 \u4E2A\u5B57\u7B26\u3002");
    const login = input.login.normalize("NFKC").toLocaleLowerCase();
    const salt = (0, import_node_crypto.randomBytes)(16).toString("hex");
    const passwordHash = (await scrypt(input.password, salt, 64)).toString("hex");
    check(!this.one("SELECT id FROM users WHERE login=?", login), "\u8FD9\u4E2A\u8D26\u53F7\u5DF2\u88AB\u4F7F\u7528\uFF0C\u8BF7\u6362\u4E00\u4E2A\u3002", 409);
    const id = (0, import_node_crypto.randomUUID)();
    this.run(
      "INSERT INTO users (id,login,password_hash,salt,name,avatar,color,friend_code,created_at,public_id) VALUES (?,?,?,?,?,?,?,?,?,?)",
      id,
      login,
      passwordHash,
      salt,
      input.name.trim(),
      AVATARS[0],
      COLORS[0],
      code(),
      this.timestamp(),
      this.newPublicId()
    );
    return this.session(id);
  }
  async login(input) {
    check(text(input.login, 32) && typeof input.password === "string" && input.password.length <= 128, "\u8BF7\u8F93\u5165\u8D26\u53F7\u548C\u5BC6\u7801\u3002");
    const row = this.one("SELECT * FROM users WHERE login=?", input.login.normalize("NFKC").toLocaleLowerCase());
    const derived = await scrypt(input.password, String(row?.salt ?? "account-not-found"), 64);
    check(row && (0, import_node_crypto.timingSafeEqual)(derived, Buffer.from(String(row.password_hash), "hex")), "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF\u3002", 401);
    return this.session(String(row.id));
  }
  logout(token) {
    this.run("DELETE FROM sessions WHERE token_hash=?", hash(token));
  }
  snapshot(userId) {
    const me = this.account(userId);
    const relations = this.all(`SELECT f.*, u.id AS peer_id, u.name AS peer_name, u.login AS peer_login,
      u.avatar AS peer_avatar,u.color AS peer_color,u.public_id AS peer_public_id FROM friendships f JOIN users u
      ON u.id=CASE WHEN f.user_a=? THEN f.user_b ELSE f.user_a END
      WHERE (f.user_a=? OR f.user_b=?) AND (f.active=1 OR EXISTS(SELECT 1 FROM entries e WHERE e.friendship_id=f.id AND e.deleted_at IS NULL))`, userId, userId, userId);
    const friends = relations.map((row) => ({
      id: String(row.id),
      accountId: String(row.peer_id),
      name: String(row.peer_name),
      avatar: String(row.peer_avatar),
      color: String(row.peer_color),
      note: `ID\uFF1A${row.peer_public_id}${row.active ? "" : " \xB7 \u5DF2\u89E3\u9664\u597D\u53CB"}`,
      connected: row.active === 1,
      createdAt: String(row.created_at)
    }));
    const rows = this.all(`SELECT e.*,u.name AS owner_name FROM entries e JOIN users u ON u.id=e.owner_id
      LEFT JOIN friendships f ON f.id=e.friendship_id WHERE e.deleted_at IS NULL
      AND (e.owner_id=? OR f.user_a=? OR f.user_b=?) ORDER BY e.created_at`, userId, userId, userId);
    const entries = rows.map((row) => entryForViewer({
      id: String(row.id),
      ownerId: String(row.owner_id),
      kind: row.kind,
      amountCents: Number(row.amount_cents),
      category: String(row.category),
      reason: String(row.reason),
      occurredOn: String(row.occurred_on),
      friendId: row.friendship_id === null ? null : String(row.friendship_id),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
      revision: Number(row.revision)
    }, userId, String(row.owner_name)));
    return { me, revision: Number(this.one("SELECT revision FROM users WHERE id=?", userId).revision), ledger: { version: 1, friends, entries }, groups: this.groups(userId), deletionRequests: this.pendingDeletions(userId) };
  }
  pendingDeletions(userId) {
    return this.all("SELECT * FROM deletion_requests WHERE status='pending'").map((row) => ({ id: String(row.id), scope: row.scope, scopeId: String(row.scope_id), targetId: String(row.target_id), title: String(row.title), requestedBy: String(row.requested_by), required: JSON.parse(String(row.required)), approved: JSON.parse(String(row.approved)) })).filter((request) => request.required.some((member) => member.id === userId));
  }
  deletionPending(scope, targetId) {
    return this.one("SELECT * FROM deletion_requests WHERE scope=? AND target_id=? AND status='pending'", scope, targetId);
  }
  requestDeletion(userId, scope, scopeId, targetId, title, members, action, input) {
    let request = this.deletionPending(scope, targetId);
    if (!request) {
      const id = (0, import_node_crypto.randomUUID)();
      this.transaction(() => {
        this.run("INSERT INTO deletion_requests (id,scope,scope_id,target_id,title,requested_by,required,approved,action,input,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)", id, scope, scopeId, targetId, title, userId, JSON.stringify(members), JSON.stringify([userId]), action, JSON.stringify(input), this.timestamp());
        this.changed(members.map((member) => member.id));
      });
      this.publish(members.map((member) => member.id));
      request = this.deletionPending(scope, targetId);
    }
    const required = JSON.parse(String(request.required));
    const approved = JSON.parse(String(request.approved));
    return !required.every((member) => approved.includes(member.id));
  }
  voteDeletion(userId, id, input) {
    const request = this.one("SELECT * FROM deletion_requests WHERE id=? AND status='pending'", id);
    check(request, "\u8BE5\u5220\u9664\u7533\u8BF7\u5DF2\u5904\u7406\uFF0C\u8BF7\u5237\u65B0\u3002", 409);
    const required = JSON.parse(String(request.required));
    check(required.some((member) => member.id === userId), "\u65E0\u6743\u5904\u7406\u8BE5\u5220\u9664\u7533\u8BF7\u3002", 403);
    check(typeof input.approved === "boolean", "\u540C\u610F\u72B6\u6001\u65E0\u6548\u3002");
    const affected = required.map((member) => member.id);
    const previous = String(request.approved);
    this.transaction(() => {
      const approved = new Set(JSON.parse(previous));
      if (input.approved) approved.add(userId);
      this.run("UPDATE deletion_requests SET approved=?,status=? WHERE id=?", JSON.stringify([...approved]), input.approved ? "pending" : "rejected", id);
      this.changed(affected);
    });
    if (input.approved) {
      const current = this.pendingDeletions(userId).find((item) => item.id === id);
      if (current.required.every((member) => current.approved.includes(member.id))) {
        try {
          if (request.scope === "entry") {
            const entry = this.one("SELECT revision FROM entries WHERE id=? AND deleted_at IS NULL", String(request.target_id));
            check(entry, "\u8D26\u76EE\u5DF2\u4E0D\u5B58\u5728\u3002", 409);
            this.writeEntry(String(request.requested_by), String(request.target_id), { revision: entry.revision }, "delete");
          } else {
            const group = this.groups(userId).find((group2) => group2.id === request.scope_id);
            check(group, "\u7FA4\u5DF2\u4E0D\u5B58\u5728\u3002", 409);
            this.groupAction(String(request.requested_by), group.id, String(request.action), { ...JSON.parse(String(request.input)), revision: group.revision });
          }
        } catch (cause) {
          this.run("UPDATE deletion_requests SET approved=? WHERE id=?", previous, id);
          this.publish(affected);
          throw cause;
        }
      }
    }
    this.publish(affected);
    return this.snapshot(userId);
  }
  groups(userId) {
    return this.all("SELECT g.* FROM shop_groups g JOIN shop_members m ON m.group_id=g.id WHERE m.user_id=? ORDER BY g.rowid", userId).map((row) => ({
      ...JSON.parse(String(row.payload)),
      id: String(row.id),
      name: String(row.name),
      ownerId: String(row.owner_id),
      revision: Number(row.revision),
      members: this.all("SELECT u.id,u.name,u.public_id FROM users u JOIN shop_members m ON m.user_id=u.id WHERE m.group_id=? ORDER BY m.rowid", String(row.id)).map((member) => ({ id: String(member.id), name: String(member.name), publicId: String(member.public_id) })),
      tasks: this.all("SELECT * FROM shop_tasks WHERE group_id=? ORDER BY rowid", String(row.id)).map((task) => ({ id: String(task.id), name: String(task.name), createdBy: String(task.created_by), startsOn: String(task.starts_on), archivedOn: task.archived_on === null ? null : String(task.archived_on), frequency: task.frequency === "once" ? "once" : "daily" })),
      taskCompletions: this.all("SELECT c.* FROM shop_task_completions c JOIN shop_tasks t ON t.id=c.task_id WHERE t.group_id=? ORDER BY c.task_date,c.task_id", String(row.id)).map((completion) => ({ taskId: String(completion.task_id), date: String(completion.task_date), taskName: String(completion.task_name), completedBy: String(completion.completed_by), completedName: String(completion.completed_name), completedAt: String(completion.completed_at) }))
    }));
  }
  createGroup(userId, input) {
    check(text(input.name, 40), "\u8BF7\u8F93\u5165 1\u201340 \u5B57\u7684\u5E97\u94FA\u6216\u7FA4\u540D\u79F0\u3002");
    check(Number(this.one("SELECT COUNT(*) AS count FROM shop_members WHERE user_id=?", userId).count) < 100, "\u6700\u591A\u52A0\u5165 100 \u4E2A\u7FA4\u3002");
    const id = (0, import_node_crypto.randomUUID)();
    this.transaction(() => {
      this.run("INSERT INTO shop_groups (id,name,owner_id,payload) VALUES (?,?,?,?)", id, input.name.toString().trim(), userId, JSON.stringify({ items: [], bills: [], months: [] }));
      this.run("INSERT INTO shop_members VALUES (?,?)", id, userId);
      this.changed([userId]);
    });
    this.publish([userId]);
    return this.snapshot(userId);
  }
  groupAction(userId, groupId, action, input) {
    const group = this.groups(userId).find((group2) => group2.id === groupId);
    check(group, "\u4F60\u4E0D\u662F\u8BE5\u7FA4\u6210\u5458\u3002", 403);
    check(input.revision === group.revision, "\u7FA4\u8D26\u5DF2\u66F4\u65B0\uFF0C\u8BF7\u67E5\u770B\u6700\u65B0\u5185\u5BB9\u540E\u91CD\u8BD5\u3002", 409);
    const ownerActions = ["member", "item", "edit-item", "remove-item", "rename"];
    check(!ownerActions.includes(action) || group.ownerId === userId, "\u53EA\u6709\u7FA4\u4E3B\u53EF\u4EE5\u7BA1\u7406\u6210\u5458\u548C\u56FA\u5B9A\u8D26\u3002", 403);
    const affected = group.members.map((member) => member.id);
    if (action === "member") check(!this.pendingDeletions(userId).some((request) => request.scope === "group" && request.scopeId === groupId), "\u8BF7\u5148\u5904\u7406\u7FA4\u5185\u5220\u9664\u7533\u8BF7\uFF0C\u518D\u6DFB\u52A0\u6210\u5458\u3002");
    const targetId = String(input.billId ?? input.taskId ?? input.itemId ?? "");
    if (["delete-bill", "archive-task", "remove-item"].includes(action)) {
      const target = action === "delete-bill" ? group.bills.find((item) => item.id === targetId) : action === "archive-task" ? group.tasks.find((item) => item.id === targetId) : group.items.find((item) => item.id === targetId);
      check(target, "\u9879\u76EE\u4E0D\u5B58\u5728\u3002", 404);
      if (action === "archive-task") check(typeof input.date === "string" && isValidDate(input.date) && "startsOn" in target && input.date >= String(target.startsOn) && "archivedOn" in target && !target.archivedOn, "\u4EFB\u52A1\u65E5\u671F\u65E0\u6548\u6216\u4EFB\u52A1\u5DF2\u505C\u7528\u3002");
      check(group.ownerId === userId || "createdBy" in target && target.createdBy === userId, "\u53EA\u6709\u521B\u5EFA\u4EBA\u6216\u7FA4\u4E3B\u53EF\u53D1\u8D77\u5220\u9664\u3002", 403);
      if ("settledBy" in target) check(!target.settledBy, "\u5DF2\u7ED3\u7B97\u8D26\u76EE\u9700\u5148\u53D6\u6D88\u52FE\u9009\u624D\u80FD\u4FEE\u6539\u6216\u5220\u9664\u3002");
      const title = `${group.name} \xB7 ${target.name}${"amountCents" in target ? ` \xA5${(Number(target.amountCents) / 100).toFixed(2)}` : ""}${"occurredOn" in target ? ` \xB7 ${target.occurredOn}` : ""}`;
      if (this.requestDeletion(userId, "group", groupId, targetId, title, group.members, action, input)) return this.snapshot(userId);
    } else if (["edit-bill", "settle", "edit-task", "complete-task", "edit-item"].includes(action)) {
      check(!this.deletionPending("group", targetId), "\u8BE5\u9879\u76EE\u6B63\u5728\u7533\u8BF7\u5220\u9664\uFF0C\u8BF7\u5148\u5904\u7406\u7533\u8BF7\u3002");
      if (action === "edit-item") check(!group.bills.some((bill) => bill.itemId === targetId && bill.month === input.month && this.deletionPending("group", bill.id)), "\u8BE5\u9879\u76EE\u6B63\u5728\u7533\u8BF7\u5220\u9664\uFF0C\u8BF7\u5148\u5904\u7406\u7533\u8BF7\u3002");
    }
    this.transaction(() => {
      if (action === "member") {
        check(typeof input.publicId === "string" && /^[1-9][0-9]{9}$/.test(input.publicId), "\u8BF7\u8F93\u5165 10 \u4F4D\u6570\u5B57 ID\u3002");
        const peer = this.one("SELECT id FROM users WHERE public_id=?", input.publicId);
        check(peer, "\u627E\u4E0D\u5230\u8BE5 ID\u3002", 404);
        check(group.members.length < 50, "\u6BCF\u7FA4\u6700\u591A 50 \u4EBA\u3002");
        check(Number(this.one("SELECT COUNT(*) AS count FROM shop_members WHERE user_id=?", String(peer.id)).count) < 100, "\u8BE5\u6210\u5458\u52A0\u5165\u7684\u7FA4\u8FC7\u591A\u3002");
        this.run("INSERT OR IGNORE INTO shop_members VALUES (?,?)", groupId, String(peer.id));
        affected.push(String(peer.id));
      } else if (action === "rename") {
        check(text(input.name, 40), "\u7FA4\u540D\u79F0\u9700\u4E3A 1\u201340 \u5B57\u3002");
        this.run("UPDATE shop_groups SET name=? WHERE id=?", input.name.trim(), groupId);
      } else if (action === "task") {
        check(text(input.name, 60), "\u4EFB\u52A1\u540D\u79F0\u9700\u4E3A 1\u201360 \u5B57\u3002");
        check(typeof input.date === "string" && isValidDate(input.date), "\u4EFB\u52A1\u65E5\u671F\u65E0\u6548\u3002");
        check(input.frequency === void 0 || input.frequency === "daily" || input.frequency === "once", "\u4EFB\u52A1\u7C7B\u578B\u65E0\u6548\u3002");
        check(group.tasks.filter((task) => !task.archivedOn).length < 100, "\u6BCF\u4E2A\u5E97\u94FA\u6700\u591A\u8BBE\u7F6E 100 \u4E2A\u4F7F\u7528\u4E2D\u7684\u4EFB\u52A1\u3002");
        this.run("INSERT INTO shop_tasks (id,group_id,name,created_by,starts_on,frequency) VALUES (?,?,?,?,?,?)", (0, import_node_crypto.randomUUID)(), groupId, input.name.trim(), userId, input.date, input.frequency === "once" ? "once" : "daily");
      } else if (["edit-task", "archive-task", "complete-task"].includes(action)) {
        const task = group.tasks.find((task2) => task2.id === input.taskId);
        check(task, "\u4EFB\u52A1\u4E0D\u5B58\u5728\u3002", 404);
        check(typeof input.date === "string" && isValidDate(input.date) && input.date >= task.startsOn, "\u8BF7\u9009\u62E9\u4EFB\u52A1\u5F00\u59CB\u4E4B\u540E\u7684\u6709\u6548\u65E5\u671F\u3002");
        if (action === "edit-task") {
          check(task.createdBy === userId || group.ownerId === userId, "\u53EA\u6709\u4EFB\u52A1\u521B\u5EFA\u4EBA\u6216\u7FA4\u4E3B\u80FD\u4FEE\u6539\u4EFB\u52A1\u3002", 403);
          check(text(input.name, 60), "\u4EFB\u52A1\u540D\u79F0\u9700\u4E3A 1\u201360 \u5B57\u3002");
          check(!task.archivedOn, "\u5DF2\u505C\u7528\u7684\u4EFB\u52A1\u4E0D\u80FD\u4FEE\u6539\u3002");
          this.run("UPDATE shop_tasks SET name=? WHERE id=?", input.name.trim(), task.id);
        } else if (action === "archive-task") {
          check(task.createdBy === userId || group.ownerId === userId, "\u53EA\u6709\u4EFB\u52A1\u521B\u5EFA\u4EBA\u6216\u7FA4\u4E3B\u80FD\u505C\u7528\u4EFB\u52A1\u3002", 403);
          check(!task.archivedOn, "\u4EFB\u52A1\u5DF2\u7ECF\u505C\u7528\u3002");
          this.run("UPDATE shop_tasks SET archived_on=? WHERE id=?", input.date, task.id);
        } else {
          check(typeof input.completed === "boolean", "\u5B8C\u6210\u72B6\u6001\u65E0\u6548\u3002");
          const previous = task.frequency === "once" ? this.one("SELECT completed_by,task_date FROM shop_task_completions WHERE task_id=?", task.id) : this.one("SELECT completed_by,task_date FROM shop_task_completions WHERE task_id=? AND task_date=?", task.id, input.date);
          if (input.completed) {
            check(!task.archivedOn || input.date < task.archivedOn, "\u8BE5\u65E5\u671F\u7684\u4EFB\u52A1\u5DF2\u7ECF\u505C\u7528\u3002");
            check(!previous, "\u8FD9\u9879\u4EFB\u52A1\u5DF2\u7531\u5176\u4ED6\u64CD\u4F5C\u5B8C\u6210\uFF0C\u8BF7\u67E5\u770B\u6700\u65B0\u5185\u5BB9\u3002", 409);
            this.run("INSERT INTO shop_task_completions VALUES (?,?,?,?,?,?)", task.id, input.date, task.name, userId, this.account(userId).name, this.timestamp());
          } else {
            check(previous, "\u8BE5\u4EFB\u52A1\u5C1A\u672A\u5B8C\u6210\u3002", 409);
            check(previous.completed_by === userId || group.ownerId === userId, "\u53EA\u6709\u5B8C\u6210\u4EBA\u6216\u7FA4\u4E3B\u80FD\u53D6\u6D88\u5B8C\u6210\u72B6\u6001\u3002", 403);
            this.run("DELETE FROM shop_task_completions WHERE task_id=? AND task_date=?", task.id, String(previous.task_date));
          }
        }
      } else if (action === "month") {
        check(validMonth(input.month), "\u6708\u4EFD\u65E0\u6548\u3002");
        if (!group.months.includes(input.month)) {
          check(group.months.length < 120, "\u6BCF\u7FA4\u6700\u591A\u4FDD\u7559 120 \u4E2A\u8D26\u671F\u3002");
          group.months.push(input.month);
          for (const item of group.items) group.bills.push({ ...item, id: (0, import_node_crypto.randomUUID)(), itemId: item.id, month: input.month, settledBy: null, settledAt: null });
        }
      } else if (["bill", "edit-bill", "delete-bill"].includes(action)) {
        const existing = group.bills.find((bill) => bill.id === input.billId);
        if (action !== "bill") {
          check(existing, "\u8D26\u76EE\u4E0D\u5B58\u5728\u3002", 404);
          check(existing.createdBy === userId || group.ownerId === userId, "\u53EA\u6709\u8BB0\u8D26\u4EBA\u6216\u7FA4\u4E3B\u53EF\u4EE5\u4FEE\u6539\u6216\u5220\u9664\u8D26\u76EE\u3002", 403);
          check(!existing.settledBy, "\u5DF2\u7ED3\u7B97\u8D26\u76EE\u9700\u5148\u53D6\u6D88\u52FE\u9009\u624D\u80FD\u4FEE\u6539\u6216\u5220\u9664\u3002");
        }
        if (action === "delete-bill") group.bills = group.bills.filter((bill) => bill.id !== input.billId);
        else {
          check(text(input.category, 40), "\u8BF7\u9009\u62E9\u6216\u8F93\u5165 1\u201340 \u5B57\u7684\u5206\u7C7B\u3002");
          check(Number.isSafeInteger(input.amountCents) && Number(input.amountCents) > 0 && Number(input.amountCents) <= MAX_CENTS, "\u8BF7\u8F93\u5165\u6709\u6548\u91D1\u989D\u3002");
          check(typeof input.occurredOn === "string" && isValidDate(input.occurredOn), "\u8BB0\u8D26\u65E5\u671F\u65E0\u6548\u3002");
          check(typeof input.reason === "string" && input.reason.length <= 160, "\u5907\u6CE8\u6700\u591A 160 \u5B57\u3002");
          const category = billCategory({ name: input.category.trim() });
          const month = input.occurredOn.slice(0, 7);
          const draft = { name: category, category, amountCents: Number(input.amountCents), reason: input.reason.trim(), occurredOn: input.occurredOn, month };
          if (existing && action === "edit-bill") Object.assign(existing, draft);
          else {
            check(group.bills.length < 1e4, "\u6BCF\u7FA4\u6700\u591A\u4FDD\u7559 10,000 \u7B14\u8D26\u76EE\u3002");
            const id = (0, import_node_crypto.randomUUID)();
            group.bills.push({ ...draft, id, itemId: id, createdBy: userId, settledBy: null, settledAt: null });
          }
          if (!group.months.includes(month)) group.months.push(month);
        }
      } else if (action === "item" || action === "edit-item") {
        check(text(input.name, 40), "\u9879\u76EE\u540D\u79F0\u9700\u4E3A 1\u201340 \u5B57\u3002");
        check(Number.isSafeInteger(input.amountCents) && Number(input.amountCents) > 0 && Number(input.amountCents) <= MAX_CENTS, "\u8BF7\u8F93\u5165\u6709\u6548\u91D1\u989D\uFF0C\u6700\u591A\u4E24\u4F4D\u5C0F\u6570\u3002");
        check(validMonth(input.month), "\u6708\u4EFD\u65E0\u6548\u3002");
        const existing = action === "edit-item" ? group.items.find((item) => item.id === input.itemId) : void 0;
        check(action !== "edit-item" || existing, "\u56FA\u5B9A\u9879\u76EE\u4E0D\u5B58\u5728\u3002", 404);
        const bill = existing && group.bills.find((bill2) => bill2.month === input.month && bill2.itemId === existing.id);
        check(!bill?.settledBy, "\u8BE5\u6708\u9879\u76EE\u5DF2\u7ED3\u7B97\uFF1B\u9700\u5148\u53D6\u6D88\u52FE\u9009\u624D\u80FD\u4FEE\u6539\u3002");
        if (existing) {
          existing.name = input.name.trim();
          existing.amountCents = Number(input.amountCents);
        } else {
          check(group.items.length < 100, "\u6BCF\u7FA4\u6700\u591A\u8BBE\u7F6E 100 \u4E2A\u56FA\u5B9A\u9879\u76EE\u3002");
          const item = { id: (0, import_node_crypto.randomUUID)(), name: input.name.trim(), amountCents: Number(input.amountCents) };
          group.items.push(item);
          if (group.months.includes(input.month)) group.bills.push({ ...item, id: (0, import_node_crypto.randomUUID)(), itemId: item.id, month: input.month, settledBy: null, settledAt: null });
        }
        if (bill) {
          bill.name = input.name.trim();
          bill.amountCents = Number(input.amountCents);
        }
      } else if (action === "remove-item") {
        check(group.items.some((item) => item.id === input.itemId), "\u56FA\u5B9A\u9879\u76EE\u4E0D\u5B58\u5728\u3002", 404);
        group.items = group.items.filter((item) => item.id !== input.itemId);
      } else if (action === "settle") {
        const bill = group.bills.find((bill2) => bill2.id === input.billId);
        check(bill && typeof input.settled === "boolean", "\u8D26\u76EE\u6216\u7ED3\u7B97\u72B6\u6001\u65E0\u6548\u3002");
        bill.settledBy = input.settled ? userId : null;
        bill.settledAt = input.settled ? this.timestamp() : null;
      } else throw new ApiError(404, "\u7FA4\u64CD\u4F5C\u4E0D\u5B58\u5728\u3002");
      this.run("UPDATE shop_groups SET payload=?,revision=revision+1 WHERE id=?", JSON.stringify({ items: group.items, bills: group.bills, months: group.months }), groupId);
      if (["delete-bill", "archive-task", "remove-item"].includes(action)) this.run("UPDATE deletion_requests SET status='applied' WHERE scope='group' AND target_id=? AND status='pending'", targetId);
      this.changed(affected);
    });
    this.publish(affected);
    return this.snapshot(userId);
  }
  addFriend(userId, invitation) {
    check(typeof invitation === "string", "\u8BF7\u8F93\u5165\u5BF9\u65B9\u7684\u56FA\u5B9A ID\u3002");
    const normalized = invitation.replace(/[\s-]/g, "").toUpperCase();
    check(/^[0-9]{10}$/.test(normalized) || /^[A-F0-9]{20}$/.test(normalized), "ID \u5E94\u4E3A\u7CFB\u7EDF\u751F\u6210\u7684 10 \u4F4D\u6570\u5B57\u3002");
    const target = /^[0-9]{10}$/.test(normalized) ? this.one("SELECT id FROM users WHERE public_id=?", normalized) : this.one("SELECT id FROM users WHERE friend_code=?", normalized);
    check(target && target.id !== userId, "ID \u4E0D\u5B58\u5728\uFF0C\u6216\u662F\u4F60\u81EA\u5DF1\u7684 ID\u3002", 404);
    const peerId = String(target.id);
    const [first = "", second = ""] = [userId, peerId].sort();
    this.transaction(() => {
      const existing = this.one("SELECT * FROM friendships WHERE user_a=? AND user_b=?", first, second);
      check(!existing?.blocked_by || existing.blocked_by === userId, "\u5BF9\u65B9\u5DF2\u89E3\u9664\u597D\u53CB\u5173\u7CFB\uFF0C\u6682\u65F6\u4E0D\u80FD\u91CD\u65B0\u6DFB\u52A0\u3002", 403);
      if (existing) this.run("UPDATE friendships SET active=1,blocked_by=NULL WHERE id=?", String(existing.id));
      else this.run("INSERT INTO friendships (id,user_a,user_b,created_at) VALUES (?,?,?,?)", (0, import_node_crypto.randomUUID)(), first, second, this.timestamp());
      this.changed([userId, peerId]);
    });
    this.publish([userId, peerId]);
    return this.snapshot(userId);
  }
  disconnect(userId, relationId) {
    const relation = this.relation(userId, relationId);
    this.transaction(() => {
      this.run("UPDATE friendships SET active=0,blocked_by=? WHERE id=?", userId, relationId);
      this.changed([String(relation.user_a), String(relation.user_b)]);
    });
    this.publish([String(relation.user_a), String(relation.user_b)]);
    return this.snapshot(userId);
  }
  relation(userId, id) {
    const relation = this.one("SELECT * FROM friendships WHERE id=? AND (user_a=? OR user_b=?)", id, userId, userId);
    check(relation, "\u627E\u4E0D\u5230\u8FD9\u6BB5\u597D\u53CB\u5173\u7CFB\u3002", 404);
    return relation;
  }
  profile(userId, input) {
    check(text(input.name, 24) && typeof input.avatar === "string" && AVATARS.includes(input.avatar), "\u6635\u79F0\u6216\u5934\u50CF\u65E0\u6548\u3002");
    const index = AVATARS.indexOf(input.avatar);
    const name = input.name.trim();
    const avatar = input.avatar;
    const peers = this.all("SELECT user_a,user_b FROM friendships WHERE user_a=? OR user_b=?", userId, userId);
    const groupPeers = this.all("SELECT DISTINCT peer.user_id FROM shop_members own JOIN shop_members peer ON own.group_id=peer.group_id WHERE own.user_id=?", userId);
    const affected = [userId, ...peers.flatMap((row) => [String(row.user_a), String(row.user_b)]), ...groupPeers.map((row) => String(row.user_id))];
    this.transaction(() => {
      this.run("UPDATE users SET name=?,avatar=?,color=? WHERE id=?", name, avatar, COLORS[index], userId);
      this.changed(affected);
    });
    this.publish(affected);
    return this.snapshot(userId);
  }
  rotateCode(userId) {
    this.run("UPDATE users SET friend_code=?,revision=revision+1 WHERE id=?", code(), userId);
    this.publish([userId]);
    return this.snapshot(userId);
  }
  writeEntry(userId, id, input, action) {
    check(/^[a-zA-Z0-9_-]{1,100}$/.test(id), "\u8D26\u76EE\u7F16\u53F7\u65E0\u6548\u3002");
    const existing = this.one("SELECT * FROM entries WHERE id=?", id);
    if (action !== "create") {
      check(existing && !existing.deleted_at, "\u8FD9\u7B14\u8D26\u76EE\u5DF2\u4E0D\u5B58\u5728\uFF0C\u8BF7\u540C\u6B65\u540E\u91CD\u8BD5\u3002", 404);
      check(existing.owner_id === userId, "\u53EA\u80FD\u4FEE\u6539\u6216\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u8D26\u76EE\u3002", 403);
      check(input.revision === existing.revision, "\u8D26\u76EE\u5DF2\u88AB\u5176\u4ED6\u8BBE\u5907\u4FEE\u6539\uFF0C\u8BF7\u5237\u65B0\u540E\u518D\u8BD5\u3002", 409);
    }
    const draft = action === "delete" ? void 0 : checkedDraft(input.draft);
    if (action === "update") {
      check(!this.deletionPending("entry", id), "\u8BE5\u8D26\u76EE\u6B63\u5728\u7533\u8BF7\u5220\u9664\uFF0C\u8BF7\u5148\u5904\u7406\u7533\u8BF7\u3002");
      check(!existing?.friendship_id || draft?.friendId === existing.friendship_id, "\u5171\u4EAB\u8D26\u4E0D\u80FD\u53D6\u6D88\u6216\u66F4\u6362\u5173\u8054\u597D\u53CB\uFF0C\u8BF7\u53CC\u65B9\u540C\u610F\u5220\u9664\u540E\u91CD\u65B0\u8BB0\u8D26\u3002");
    }
    if (action === "delete" && existing?.friendship_id) {
      const relation = this.relation(userId, String(existing.friendship_id));
      const members = [String(relation.user_a), String(relation.user_b)].map((id2) => ({ id: id2, name: this.account(id2).name }));
      if (this.requestDeletion(userId, "entry", String(existing.friendship_id), id, `${existing.reason} \xB7 \xA5${(Number(existing.amount_cents) / 100).toFixed(2)} \xB7 ${existing.occurred_on}`, members, "delete", input)) return this.snapshot(userId);
    }
    if (action === "create" && existing) {
      const same = draft && existing.owner_id === userId && !existing.deleted_at && existing.kind === draft.kind && existing.amount_cents === draft.amountCents && existing.category === draft.category && existing.reason === draft.reason.trim() && existing.occurred_on === draft.occurredOn && existing.friendship_id === draft.friendId;
      check(same, "\u91CD\u590D\u8BF7\u6C42\u7684\u8D26\u76EE\u5185\u5BB9\u4E0D\u540C\uFF0C\u8BF7\u540C\u6B65\u540E\u91CD\u8BD5\u3002", 409);
      return this.snapshot(userId);
    }
    const affected = /* @__PURE__ */ new Set([userId]);
    for (const relationId of [existing?.friendship_id, draft?.friendId]) {
      if (relationId !== void 0 && relationId !== null) {
        check(typeof relationId === "string", "\u597D\u53CB\u7F16\u53F7\u65E0\u6548\u3002");
        const relation = this.relation(userId, relationId);
        if (action !== "delete" && relationId === draft?.friendId) check(relation.active === 1, "\u597D\u53CB\u5173\u7CFB\u5DF2\u89E3\u9664\uFF0C\u4E0D\u80FD\u518D\u4E0A\u4F20\u5230\u8FD9\u4EFD\u5171\u4EAB\u8D26\u672C\u3002", 403);
        affected.add(String(relation.user_a));
        affected.add(String(relation.user_b));
      }
    }
    this.transaction(() => {
      const timestamp = this.timestamp();
      if (action === "create") {
        check(this.one("SELECT COUNT(*) AS count FROM entries WHERE owner_id=? AND deleted_at IS NULL", userId).count < 5e4, "\u8D26\u76EE\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\u3002");
        this.run(
          "INSERT INTO entries (id,owner_id,friendship_id,kind,amount_cents,category,reason,occurred_on,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
          id,
          userId,
          draft.friendId,
          draft.kind,
          draft.amountCents,
          draft.category,
          draft.reason,
          draft.occurredOn,
          timestamp,
          timestamp
        );
      } else if (action === "update") {
        this.run(
          "UPDATE entries SET friendship_id=?,kind=?,amount_cents=?,category=?,reason=?,occurred_on=?,updated_at=?,revision=revision+1 WHERE id=?",
          draft.friendId,
          draft.kind,
          draft.amountCents,
          draft.category,
          draft.reason,
          draft.occurredOn,
          timestamp,
          id
        );
      } else this.run("UPDATE entries SET deleted_at=?,updated_at=?,revision=revision+1 WHERE id=?", timestamp, timestamp, id);
      if (action === "delete") this.run("UPDATE deletion_requests SET status='applied' WHERE scope='entry' AND target_id=? AND status='pending'", id);
      for (const viewer of affected) {
        try {
          validateLedger(this.snapshot(viewer).ledger);
        } catch (cause) {
          throw new ApiError(400, cause instanceof Error ? cause.message : "\u8D26\u76EE\u65E0\u6CD5\u901A\u8FC7\u6821\u9A8C\u3002");
        }
      }
      const revision = Number(this.one("SELECT revision FROM entries WHERE id=?", id).revision);
      this.run(
        "INSERT INTO audit (actor_id,entry_id,action,revision,payload,created_at) VALUES (?,?,?,?,?,?)",
        userId,
        id,
        action,
        revision,
        JSON.stringify(action === "delete" ? existing : draft),
        timestamp
      );
      this.changed([...affected]);
    });
    this.publish([...affected]);
    return this.snapshot(userId);
  }
  close() {
    this.events.removeAllListeners();
    this.database.close();
  }
};

// server/http.ts
function createSyncServer(store, options = {}) {
  const origins = new Set(options.allowedOrigins ?? []);
  const attempts = /* @__PURE__ */ new Map();
  const waiting = /* @__PURE__ */ new Map();
  const throttle = (key, limit) => {
    const now = Date.now();
    if (attempts.size > 1e4) {
      for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry);
    }
    const previous = attempts.get(key);
    const next = previous && previous.until > now ? { ...previous, count: previous.count + 1 } : { count: 1, until: now + 6e4 };
    attempts.set(key, next);
    if (next.count > limit) throw new ApiError(429, "\u8BF7\u6C42\u592A\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
  };
  const send = (response, status, payload) => {
    if (response.destroyed || response.writableEnded) return;
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(JSON.stringify(payload));
  };
  const body = async (request) => {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > 65536) throw new ApiError(413, "\u8BF7\u6C42\u5185\u5BB9\u8FC7\u5927\u3002");
      chunks.push(Buffer.from(chunk));
    }
    try {
      const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
      return parsed;
    } catch {
      throw new ApiError(400, "\u8BF7\u6C42\u683C\u5F0F\u5E94\u4E3A JSON \u5BF9\u8C61\u3002");
    }
  };
  const server = (0, import_node_http.createServer)(async (request, response) => {
    try {
      const origin = request.headers.origin;
      if (origin) {
        if (!origins.has(origin)) throw new ApiError(403, "\u8BE5\u7F51\u9875\u6765\u6E90\u672A\u88AB\u5141\u8BB8\u8BBF\u95EE\u540C\u6B65\u670D\u52A1\u3002");
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
      }
      if (request.method === "OPTIONS") {
        response.writeHead(204, { "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Authorization,Content-Type" });
        response.end();
        return;
      }
      const path = new URL(request.url ?? "/", "http://localhost");
      if (path.pathname === "/health" && request.method === "GET") {
        send(response, 200, { ok: true, service: "qingji-sync", version: 1 });
        return;
      }
      const address = options.trustProxy ? String(request.headers["x-forwarded-for"] ?? request.socket.remoteAddress).split(",")[0].trim() : request.socket.remoteAddress ?? "unknown";
      if (options.rateLimit !== false) throttle(`ip:${address}`, 240);
      if (request.method === "POST" && ["/v1/register", "/v1/login"].includes(path.pathname)) {
        const input = await body(request);
        if (options.rateLimit !== false) {
          throttle(`auth-ip:${address}`, 20);
          throttle(`auth-login:${String(input.login).normalize("NFKC").toLocaleLowerCase()}`, 10);
        }
        const result = path.pathname === "/v1/register" ? await store.register(input) : await store.login(input);
        send(response, 200, result);
        return;
      }
      const authorization = request.headers.authorization ?? "";
      const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
      const userId = store.authenticate(token);
      if (options.rateLimit !== false) throttle(`user:${userId}`, 180);
      if (path.pathname === "/v1/snapshot" && request.method === "GET") {
        const after = Number(path.searchParams.get("after") ?? -1);
        const wait = Math.min(25e3, Math.max(0, Number(path.searchParams.get("wait") ?? 0) || 0));
        const current = store.snapshot(userId);
        if (current.revision !== after || !wait) {
          send(response, 200, current);
          return;
        }
        if ((waiting.get(userId) ?? 0) >= 4) throw new ApiError(429, "\u6B64\u8D26\u53F7\u540C\u65F6\u5728\u7EBF\u7684\u540C\u6B65\u8FDE\u63A5\u8FC7\u591A\u3002");
        waiting.set(userId, (waiting.get(userId) ?? 0) + 1);
        let complete = false;
        const finish = (changed) => {
          if (complete) return;
          complete = true;
          cleanup();
          if (changed) send(response, 200, store.snapshot(userId));
          else send(response, 200, { revision: after, unchanged: true });
        };
        const listener = () => finish(true);
        const timer = setTimeout(() => finish(false), wait);
        const cleanup = () => {
          clearTimeout(timer);
          store.events.off(userId, listener);
          waiting.set(userId, Math.max(0, (waiting.get(userId) ?? 1) - 1));
        };
        response.once("close", () => {
          if (!complete) {
            complete = true;
            cleanup();
          }
        });
        store.events.once(userId, listener);
        if (store.snapshot(userId).revision !== after) listener();
        return;
      }
      if (request.method === "POST" && path.pathname === "/v1/logout") {
        store.logout(token);
        send(response, 200, { ok: true });
        return;
      }
      if (request.method === "POST" && path.pathname === "/v1/friends") {
        send(response, 200, store.addFriend(userId, (await body(request)).code));
        return;
      }
      if (request.method === "POST" && path.pathname === "/v1/groups") {
        send(response, 200, store.createGroup(userId, await body(request)));
        return;
      }
      const groupMatch = /^\/v1\/groups\/([a-zA-Z0-9_-]+)\/([a-z-]+)$/.exec(path.pathname);
      if (request.method === "POST" && groupMatch) {
        send(response, 200, store.groupAction(userId, groupMatch[1], groupMatch[2], await body(request)));
        return;
      }
      const friendMatch = /^\/v1\/friends\/([a-zA-Z0-9_-]+)$/.exec(path.pathname);
      if (request.method === "DELETE" && friendMatch) {
        send(response, 200, store.disconnect(userId, friendMatch[1]));
        return;
      }
      if (request.method === "POST" && path.pathname === "/v1/profile") {
        send(response, 200, store.profile(userId, await body(request)));
        return;
      }
      if (request.method === "POST" && path.pathname === "/v1/friend-code") {
        send(response, 200, store.rotateCode(userId));
        return;
      }
      const entryMatch = /^\/v1\/entries\/([a-zA-Z0-9_-]+)$/.exec(path.pathname);
      const deletionMatch = /^\/v1\/deletions\/([a-zA-Z0-9_-]+)$/.exec(path.pathname);
      if (request.method === "POST" && deletionMatch) {
        send(response, 200, store.voteDeletion(userId, deletionMatch[1], await body(request)));
        return;
      }
      if (entryMatch && ["POST", "PATCH", "DELETE"].includes(request.method ?? "")) {
        const action = request.method === "POST" ? "create" : request.method === "PATCH" ? "update" : "delete";
        send(response, 200, store.writeEntry(userId, entryMatch[1], await body(request), action));
        return;
      }
      throw new ApiError(404, "\u63A5\u53E3\u4E0D\u5B58\u5728\u3002");
    } catch (cause) {
      send(response, cause instanceof ApiError ? cause.status : 500, { error: cause instanceof ApiError ? cause.message : "\u670D\u52A1\u5668\u6682\u65F6\u65E0\u6CD5\u5904\u7406\u8BF7\u6C42\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" });
    }
  });
  server.requestTimeout = 35e3;
  server.headersTimeout = 1e4;
  return server;
}

// server/mount.ts
var mounted;
function handle(request, response) {
  if (!mounted) {
    const databasePath = (0, import_node_path.resolve)(process.env.QINGJI_DATABASE_PATH ?? "/var/data/qingji/qingji.sqlite");
    (0, import_node_fs.mkdirSync)((0, import_node_path.dirname)(databasePath), { recursive: true, mode: 448 });
    const store = new SyncStore(databasePath);
    mounted = createSyncServer(store, {
      allowedOrigins: String(process.env.QINGJI_ALLOWED_ORIGINS ?? "https://jj-teacher.onrender.com,http://localhost:8090,http://localhost:8093").split(",").map((origin) => origin.trim()).filter(Boolean),
      trustProxy: true
    });
  }
  request.url = (request.url ?? "/").slice("/qingji".length) || "/";
  mounted.emit("request", request, response);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handle
});
