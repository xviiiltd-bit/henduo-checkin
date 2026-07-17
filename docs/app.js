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
const successPath = "/success/";
const rewardPath = "/reward/";
const checkedInKey = `henduo_checked_in_${EVENT_ID}`;
const successKey = `henduo_checkin_success_${EVENT_ID}`;
const languageKey = "henduo_checkin_language";
let currentLanguage = localStorage.getItem(languageKey) || "zh";

const copy = {
  zh: {
    journey: "Check-in Journey",
    systemTitle: "活動報到系統",
    steps: ["01 掃碼進入", "02 輸入資訊", "03 報到成功", "04 抽獎結果"],
    languageButton: "EN",
    checkinTitle: "請輸入您的資訊",
    emailTab: "電子郵件 Email",
    nameTab: "中文姓名 Name",
    lookupPlaceholder: "請輸入電子郵件或中文姓名",
    searchButton: "查詢 Search",
    divider: "或",
    help: "找不到報名資料？<br>請洽現場工作人員",
    activeEventLabel: "目前活動資料",
    emptyLookup: "請輸入 Email 或中文姓名。",
    duplicateName: "找到多筆同名資料，請選擇你的票券完成報到。",
    notFound: "找不到報名資料，請洽現場工作人員協助。",
    alreadyCheckedIn: "你已經完成本場活動報到。",
    successTitle: "報到成功！",
    successSub: "Check-in Successful",
    welcome: (name) => `Hi, ${name}`,
    attendance: (count) => `歡迎回來！這是你第 ${count} 次參加我們的活動`,
    currentEvent: "本次活動",
    followUs: "關注我們 / Follow Us",
    drawButton: "參加抽獎",
    shareButton: "分享至限動",
    shareAlert: "目前為展示版；正式版會產出可分享 IG 限動的圖片。",
    luckyDraw: "Lucky Draw",
    congrats: "恭喜你！",
    congratsSub: "Congratulations!",
    won: "你抽中了",
    rewardName: "免費酒水兌換券",
    rewardNameEn: "Free Drink Voucher",
    redemption: "兌換說明 / Redemption Info",
    redemptionInfo: "請至吧台出示此畫面，即可兌換酒水一杯。",
    viewReward: "查看我的獎品",
  },
  en: {
    journey: "Check-in Journey",
    systemTitle: "Event Check-in System",
    steps: ["01 Scan QR", "02 Enter Info", "03 Checked In", "04 Lucky Draw"],
    languageButton: "中",
    checkinTitle: "Enter your information",
    emailTab: "Email",
    nameTab: "Chinese Name",
    lookupPlaceholder: "Enter your email or Chinese name",
    searchButton: "Search",
    divider: "or",
    help: "Cannot find your registration?<br>Please contact event staff.",
    activeEventLabel: "Current event data",
    emptyLookup: "Please enter your email or Chinese name.",
    duplicateName: "Multiple registrations were found. Please select your ticket.",
    notFound: "Registration not found. Please contact event staff.",
    alreadyCheckedIn: "You have already checked in for this event.",
    successTitle: "Checked in!",
    successSub: "Check-in Successful",
    welcome: (name) => `Hi, ${name}`,
    attendance: (count) => `Welcome back. This is your ${count} event with us.`,
    currentEvent: "Current Event",
    followUs: "Follow Us",
    drawButton: "Enter Lucky Draw",
    shareButton: "Share to Story",
    shareAlert: "Demo mode. The official version will generate an IG Story image.",
    luckyDraw: "Lucky Draw",
    congrats: "Congratulations!",
    congratsSub: "You won a reward",
    won: "You received",
    rewardName: "Free Drink Voucher",
    rewardNameEn: "Free Drink Voucher",
    redemption: "Redemption Info",
    redemptionInfo: "Show this screen at the bar to redeem one drink.",
    viewReward: "View My Reward",
  },
};

function t() {
  return copy[currentLanguage];
}

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
  const text = t();
  const steps = [
    ["scan", text.steps[0]],
    ["input", text.steps[1]],
    ["success", text.steps[2]],
    ["reward", text.steps[3]],
  ];
  return `
    <section class="shell">
      <header class="journey">
        <div class="brand-row">
          <div>
            <p class="kicker">${text.journey}</p>
            <h1>${text.systemTitle}</h1>
          </div>
          <div class="brand-actions">
            <button class="language-toggle" type="button" data-language-toggle>${text.languageButton}</button>
            <img class="brand-logo" src="${basePath}/henduo-duo-logo.png" alt="HENDUO MUSIC">
          </div>
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
  const text = t();
  document.querySelector("#app").innerHTML = phone(`
    <div class="title">
      <p class="mono">Event Check-in</p>
      <h2>${text.checkinTitle}</h2>
    </div>
    <form id="checkin-form">
      <div class="tabs"><span>${text.emailTab}</span><span>${text.nameTab}</span></div>
      <input id="lookup" class="input" autocomplete="email name" placeholder="${text.lookupPlaceholder}">
      <button id="search" class="button" type="submit">${text.searchButton}</button>
      <div id="message"></div>
      <div id="matches"></div>
    </form>
    <div class="divider">${text.divider}</div>
    <div class="help">
      <p>${text.help}</p>
      <p class="mono">${text.activeEventLabel} / ${EVENT.eventDate}</p>
    </div>
  `, "input");

  bindLanguageToggle(renderCheckin);
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
    message.innerHTML = `<div class="message">${t().emptyLookup}</div>`;
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
    message.innerHTML = `<div class="message">${t().duplicateName}</div>`;
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

  message.innerHTML = `<div class="message">${t().notFound}</div>`;
}

function completeCheckin(registration) {
  const checkedInIds = JSON.parse(localStorage.getItem(checkedInKey) || "[]");
  if (checkedInIds.includes(registration.id)) {
    document.querySelector("#message").innerHTML = `<div class="message">${t().alreadyCheckedIn}</div>`;
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
  go(successPath);
}

function renderSuccess() {
  const text = t();
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
      <h2>${text.successTitle}</h2>
      <p class="mono">${text.successSub}</p>
      <p>${text.welcome(data.attendeeName)}</p>
      <p>${text.attendance(data.totalCheckins)}</p>
    </div>
    <div class="card">
      <small>${text.currentEvent}</small>
      <strong>${data.eventName}</strong>
      <p class="mono">${data.eventDate} / ${data.venue}</p>
    </div>
    <p class="center mono" style="margin-top:24px;color:var(--text-muted);font-size:12px;">${text.followUs}</p>
    <div class="social-grid">
      ${SOCIALS.map(([label, href]) => `<a class="social" href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
    </div>
    <a class="button" href="${appPath(rewardPath)}">${text.drawButton}</a>
    <button class="button" type="button" data-share-button>${text.shareButton}</button>
  `, "success");
  bindLanguageToggle(renderSuccess);
  bindShareButton();
}

function renderReward() {
  const text = t();
  document.querySelector("#app").innerHTML = phone(`
    <div class="title">
      <p class="mono">${text.luckyDraw}</p>
      <h2>${text.congrats}</h2>
      <p class="mono">${text.congratsSub}</p>
    </div>
    <div class="ticket"><span class="ticket-icon">▽</span><span class="ticket-cut"></span></div>
    <div class="center" style="margin-top:28px;">
      <p style="color:var(--text-muted);">${text.won}</p>
      <h2>${text.rewardName}</h2>
      <p class="mono" style="color:var(--text-muted);">${text.rewardNameEn}</p>
    </div>
    <div class="card center">
      <p class="mono">${text.redemption}</p>
      <p>${text.redemptionInfo}</p>
    </div>
    <button class="button" type="button" data-share-button>${text.shareButton}</button>
    <a class="button" href="${appPath(successPath)}">${text.viewReward}</a>
  `, "reward");
  bindLanguageToggle(renderReward);
  bindShareButton();
}

function bindLanguageToggle(renderCurrentPage) {
  const button = document.querySelector("[data-language-toggle]");
  if (!button) return;
  button.addEventListener("click", () => {
    currentLanguage = currentLanguage === "zh" ? "en" : "zh";
    localStorage.setItem(languageKey, currentLanguage);
    renderCurrentPage();
  });
}

function bindShareButton() {
  document.querySelectorAll("[data-share-button]").forEach((button) => {
    button.addEventListener("click", () => alert(t().shareAlert));
  });
}

const path = window.location.pathname;
if (path.includes("/reward/")) {
  renderReward();
} else if (path.includes("/checkin-success/")) {
  renderSuccess();
} else {
  renderCheckin();
}
