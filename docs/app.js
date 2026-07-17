const EVENT_ID = "henduo-0718";
const EVENT = {
  eventId: EVENT_ID,
  eventName: "2026/07/18 舞廳復興 慢搖最高",
  eventDate: "2026.07.18",
  venue: "錦州街浪漫屋",
};
const SOCIALS = [
  ["Instagram", "https://www.instagram.com/henduo.music_tw/"],
  ["Threads", "https://www.instagram.com/henduo.music_tw/"],
  ["X", "https://www.instagram.com/henduo.music_tw/"],
  ["Website", "https://www.instagram.com/henduo.music_tw/"],
];

const basePath = "/henduo-checkin";
const checkedInKey = `henduo_checked_in_${EVENT_ID}`;
const successKey = `henduo_checkin_success_${EVENT_ID}`;

function normalize(value) {
  return value.trim().toLowerCase();
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(normalize(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function appPath(path) {
  return `${basePath}${path}`;
}

function go(path) {
  window.location.href = appPath(path);
}

function phone(content, activeStep) {
  const steps = [
    ["scan", "01 掃碼進入"],
    ["input", "02 輸入資訊"],
    ["success", "03 報到成功"],
    ["reward", "04 抽獎結果"],
  ];
  return `
    <section class="shell">
      <header class="journey">
        <div class="brand-row">
          <div>
            <p class="kicker">Check-in Journey</p>
            <h1>活動報到系統</h1>
          </div>
          <img class="brand-logo" src="${basePath}/henduo-duo-logo.png" alt="HENDUO MUSIC">
        </div>
        <div class="steps">
          ${steps.map(([id, label]) => `<div class="step ${id === activeStep ? "active" : ""}">${label}</div>`).join("")}
        </div>
      </header>
      <div class="phone">
        <div class="status"><span>11:34</span><span>▱ ▰ ▭</span></div>
        <img class="duo" src="${basePath}/henduo-duo-logo.png" alt="HENDUO MUSIC">
        ${content}
      </div>
      <p class="footer mono">HENDUO MUSIC</p>
    </section>
  `;
}

function renderCheckin() {
  document.querySelector("#app").innerHTML = phone(`
    <div class="title">
      <p class="mono">Event Check-in</p>
      <h2>請輸入您的資訊</h2>
    </div>
    <form id="checkin-form">
      <div class="tabs"><span>電子郵件 Email</span><span>中文姓名 Name</span></div>
      <input id="lookup" class="input" autocomplete="email name" placeholder="請輸入電子郵件或中文姓名">
      <button id="search" class="button" type="submit">查詢 Search</button>
      <div id="message"></div>
      <div id="matches"></div>
    </form>
    <div class="divider">或</div>
    <div class="help">
      <p>找不到報名資料？<br>請洽現場工作人員</p>
      <p class="mono">Event ID / ${EVENT_ID}</p>
    </div>
  `, "input");

  const form = document.querySelector("#checkin-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await lookupRegistration();
  });
}

async function lookupRegistration(selectedRegistrationId = "") {
  const input = document.querySelector("#lookup");
  const message = document.querySelector("#message");
  const matchesNode = document.querySelector("#matches");
  const lookup = input.value.trim();
  message.innerHTML = "";
  matchesNode.innerHTML = "";

  if (!lookup) {
    message.innerHTML = `<div class="message">請輸入 Email 或中文姓名。</div>`;
    return;
  }

  const lookupHash = await sha256(lookup);
  let matches = [];
  const emailMatch = window.HENDUO_REGISTRATIONS.find(
    (registration) => registration.eventId === EVENT_ID && registration.emailHash === lookupHash
  );

  if (emailMatch) {
    completeCheckin(emailMatch);
    return;
  }

  matches = window.HENDUO_REGISTRATIONS.filter(
    (registration) => registration.eventId === EVENT_ID && registration.nameHash === lookupHash
  );

  if (selectedRegistrationId) {
    const selected = matches.find((registration) => registration.id === selectedRegistrationId);
    if (selected) {
      completeCheckin(selected);
      return;
    }
  }

  if (matches.length === 1) {
    completeCheckin(matches[0]);
    return;
  }

  if (matches.length > 1) {
    message.innerHTML = `<div class="message">找到多筆同名資料，請選擇你的票券完成報到。</div>`;
    matchesNode.innerHTML = matches
      .map((match) => `
        <button class="match" type="button" data-id="${match.id}">
          <span><strong>${match.maskedName}</strong><br><small>${match.maskedEmail} / ${match.ticketType}</small></span>
          <span class="mono">Select</span>
        </button>
      `)
      .join("");
    matchesNode.querySelectorAll(".match").forEach((button) => {
      button.addEventListener("click", () => lookupRegistration(button.dataset.id));
    });
    return;
  }

  message.innerHTML = `<div class="message">找不到報名資料，請洽現場工作人員協助。</div>`;
}

function completeCheckin(registration) {
  const checkedInIds = JSON.parse(localStorage.getItem(checkedInKey) || "[]");
  if (checkedInIds.includes(registration.id)) {
    document.querySelector("#message").innerHTML = `<div class="message">你已經完成本場活動報到。</div>`;
    return;
  }

  const payload = {
    eventId: EVENT_ID,
    eventName: registration.eventName,
    eventDate: registration.eventDate,
    venue: registration.venue,
    attendeeName: registration.maskedName,
    ticketType: registration.ticketType,
    totalCheckins: registration.totalCheckins,
    checkinTime: new Date().toISOString(),
  };
  localStorage.setItem(checkedInKey, JSON.stringify([...checkedInIds, registration.id]));
  sessionStorage.setItem(successKey, JSON.stringify(payload));
  go(`/checkin-success/${EVENT_ID}/`);
}

function renderSuccess() {
  const data = JSON.parse(sessionStorage.getItem(successKey) || "null") || {
    attendeeName: "Guest",
    totalCheckins: 1,
    eventName: EVENT.eventName,
    eventDate: EVENT.eventDate,
    venue: EVENT.venue,
  };

  document.querySelector("#app").innerHTML = phone(`
    <div class="check">✓</div>
    <div class="success-copy">
      <h2>報到成功！</h2>
      <p class="mono">Check-in Successful</p>
      <p>Hi, ${data.attendeeName}</p>
      <p>歡迎回來！這是你第 ${data.totalCheckins} 次參加我們的活動</p>
    </div>
    <div class="card">
      <small>本次活動</small>
      <strong>${data.eventName}</strong>
      <p class="mono">${data.eventDate} / ${data.venue}</p>
    </div>
    <p class="center mono" style="margin-top:24px;color:var(--text-muted);font-size:12px;">關注我們 / Follow Us</p>
    <div class="social-grid">
      ${SOCIALS.map(([label, href]) => `<a class="social" href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
    </div>
    <a class="button" href="${appPath(`/reward/${EVENT_ID}/`)}">參加抽獎</a>
    <button class="button" type="button" onclick="alert('目前為展示版；正式版會產出可分享 IG 限動的圖片。')">分享至限動</button>
  `, "success");
}

function renderReward() {
  document.querySelector("#app").innerHTML = phone(`
    <div class="title">
      <p class="mono">Lucky Draw</p>
      <h2>恭喜你！</h2>
      <p class="mono">Congratulations!</p>
    </div>
    <div class="ticket"><span class="ticket-icon">▽</span><span class="ticket-cut"></span></div>
    <div class="center" style="margin-top:28px;">
      <p style="color:var(--text-muted);">你抽中了</p>
      <h2>免費酒水兌換券</h2>
      <p class="mono" style="color:var(--text-muted);">Free Drink Voucher</p>
    </div>
    <div class="card center">
      <p class="mono">兌換說明 / Redemption Info</p>
      <p>請至吧台出示此畫面，即可兌換酒水一杯。</p>
    </div>
    <button class="button" type="button" onclick="alert('目前為展示版；正式版會產出可分享 IG 限動的圖片。')">分享至限動</button>
    <a class="button" href="${appPath(`/checkin-success/${EVENT_ID}/`)}">查看我的獎品</a>
  `, "reward");
}

const path = window.location.pathname;
if (path.includes("/reward/")) {
  renderReward();
} else if (path.includes("/checkin-success/")) {
  renderSuccess();
} else {
  renderCheckin();
}
