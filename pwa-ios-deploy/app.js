
(function () {
  "use strict";

  const STORAGE_KEY = "pickbank_pwa_v20260315";
  const DAY_MS = 86400000;
  const INSTALL_PROMPT_SEEN_KEY = "pickbank_install_prompt_seen_v1";
  const INSTALL_PROMPT_DELAY_MS = 2800;
  const THEME_PALETTES = {
    MONO: ["#f4f4f4", "#d9d9d9", "#bdbdbd", "#9f9f9f", "#838383", "#6a6a6a", "#555555", "#3f3f3f"],
    WARM: ["#ffab91", "#a5d6a7", "#ffe082", "#90caf9", "#ce93d8", "#80cbc4", "#f48fb1", "#bcaaa4"]
  };

  const PREDEFINED_MODELS = [
    { name: "DeepSeek", baseUrl: "https://api.deepseek.com", defaultModel: "deepseek-chat" },
    { name: "OpenAI", baseUrl: "https://api.openai.com", defaultModel: "gpt-4o-mini" },
    { name: "Kimi (Moonshot)", baseUrl: "https://api.moonshot.cn", defaultModel: "moonshot-v1-8k" },
    { name: "通义千问 (DashScope)", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode", defaultModel: "qwen-plus" },
    { name: "智谱 AI", baseUrl: "https://open.bigmodel.cn/api/paas/v4", defaultModel: "glm-4-flash" }
  ];

  const DEFAULT_CATEGORIES = [
    { id: 1, name: "餐饮", icon: "restaurant", type: 0, sortOrder: 0, isDefault: true },
    { id: 2, name: "交通", icon: "directions_car", type: 0, sortOrder: 1, isDefault: true },
    { id: 3, name: "购物", icon: "shopping_bag", type: 0, sortOrder: 2, isDefault: true },
    { id: 4, name: "住房", icon: "home", type: 0, sortOrder: 3, isDefault: true },
    { id: 5, name: "娱乐", icon: "sports_esports", type: 0, sortOrder: 4, isDefault: true },
    { id: 6, name: "医疗", icon: "local_hospital", type: 0, sortOrder: 5, isDefault: true },
    { id: 7, name: "教育", icon: "school", type: 0, sortOrder: 6, isDefault: true },
    { id: 8, name: "其他", icon: "more_horiz", type: 0, sortOrder: 99, isDefault: true },
    { id: 101, name: "工资", icon: "payments", type: 1, sortOrder: 0, isDefault: true },
    { id: 102, name: "兼职", icon: "work", type: 1, sortOrder: 1, isDefault: true },
    { id: 103, name: "投资", icon: "trending_up", type: 1, sortOrder: 2, isDefault: true },
    { id: 104, name: "红包", icon: "redeem", type: 1, sortOrder: 3, isDefault: true },
    { id: 105, name: "其他", icon: "more_horiz", type: 1, sortOrder: 99, isDefault: true }
  ];

  const I18N = {
    zh: {
      tabRecords: "记录",
      tabSummary: "总结",
      budgetRemaining: "预算剩余",
      monthlyExpense: "本月支出",
      monthlyIncome: "本月收入",
      recordHint: "eg.刚刚买了一本十块钱的书",
      recentRecords: "最近记录",
      noRecords: "暂无记录",
      openBudget: "预算",
      openManual: "手动",
      importData: "导入",
      quickSubmit: "记一笔",
      week: "周",
      month: "月",
      year: "年",
      custom: "自定义",
      expense: "支出",
      income: "收入",
      categoryDist: "分类占比",
      trend: "趋势",
      aiInsights: "AI 洞察",
      getAiAdvice: "获取 AI 建议",
      aiAnalyzing: "分析中...",
      export: "导出",
      noDetail: "当天无记录",
      aiConfig: "AI 配置",
      save: "保存",
      cancel: "取消",
      testConnectivity: "连通性测试",
      testQa: "问答测试",
      language: "语言",
      themeColor: "主题配色",
      themeDefaultMono: "黑白主题",
      themeWarm: "默认暖色",
      manualTitleCreate: "手动录入",
      manualTitleEdit: "编辑记录",
      amount: "金额",
      category: "分类",
      remark: "备注",
      date: "日期",
      confirmRecord: "确认记录",
      budgetTitle: "设置活动预算",
      period: "时间范围",
      saveBudget: "保存预算",
      customStart: "开始日期",
      customEnd: "结束日期",
      installHint: "iOS 安装：在 Safari 点“分享”->“添加到主屏幕”",
      installManualHint: "可将本应用添加到主屏幕：点击浏览器菜单，选择“安装应用”或“添加到主屏幕”。",
      installRequestConfirm: "是否将 Pickbank 添加到主屏幕？",
      aiErrorPrefix: "获取建议失败",
      invalidAmount: "请输入有效金额",
      deleted: "记录已删除",
      saved: "已保存",
      parsedOk: "已记录",
      parseFail: "解析失败",
      batchRecorded: "已批量记录",
      importing: "AI 导入中...",
      importDone: "已导入",
      importEmpty: "未识别到可导入的记账记录",
      onboardingGuide: "新手教程",
      reopenOnboarding: "重新打开新手教程",
      onboardingSkip: "跳过",
      onboardingPrev: "上一步",
      onboardingNext: "下一步",
      onboardingStart: "开始使用",
      dayDetailTitle: "当日明细",
      model: "服务商",
      apiKey: "API Key",
      settingsSaved: "配置已保存",
      aiReply: "AI 回复",
      aiProviderTip: "注意：PWA 在浏览器中调用 AI 接口，请妥善保管你的 Key。",
      summaryTitle: "总结",
      homeTitle: "拾念记账",
      homeSub: "自然语言记账与预算管理",
      summarySub: "统计、趋势与 AI 建议",
      processing: "处理中..."
    },
    en: {
      tabRecords: "Records",
      tabSummary: "Summary",
      budgetRemaining: "Remaining",
      monthlyExpense: "Monthly Expense",
      monthlyIncome: "Monthly Income",
      recordHint: "Record what you think...",
      recentRecords: "Recent Records",
      noRecords: "No records",
      openBudget: "Budget",
      openManual: "Manual",
      importData: "Import",
      quickSubmit: "Add",
      week: "Week",
      month: "Month",
      year: "Year",
      custom: "Custom",
      expense: "Expense",
      income: "Income",
      categoryDist: "Category Distribution",
      trend: "Trend",
      aiInsights: "AI Insights",
      getAiAdvice: "Get AI Advice",
      aiAnalyzing: "Analyzing...",
      export: "Export",
      noDetail: "No records",
      aiConfig: "AI Config",
      save: "Save",
      cancel: "Cancel",
      testConnectivity: "Connectivity",
      testQa: "Q&A Test",
      language: "Language",
      themeColor: "Theme",
      themeDefaultMono: "Mono Theme",
      themeWarm: "Default Warm",
      manualTitleCreate: "Manual Entry",
      manualTitleEdit: "Edit Record",
      amount: "Amount",
      category: "Category",
      remark: "Remark",
      date: "Date",
      confirmRecord: "Save Record",
      budgetTitle: "Set Budget",
      period: "Range",
      saveBudget: "Save Budget",
      customStart: "Start date",
      customEnd: "End date",
      installHint: "iOS install: Safari -> Share -> Add to Home Screen",
      installManualHint: "Add this app to your home screen from browser menu: Install App / Add to Home Screen.",
      installRequestConfirm: "Install Pickbank to your home screen now?",
      aiErrorPrefix: "Failed to get advice",
      invalidAmount: "Invalid amount",
      deleted: "Deleted",
      saved: "Saved",
      parsedOk: "Recorded",
      parseFail: "Parse failed",
      batchRecorded: "Batch recorded",
      importing: "AI importing...",
      importDone: "Imported",
      importEmpty: "No importable ledger records found",
      onboardingGuide: "Onboarding",
      reopenOnboarding: "Open Onboarding Again",
      onboardingSkip: "Skip",
      onboardingPrev: "Back",
      onboardingNext: "Next",
      onboardingStart: "Start",
      dayDetailTitle: "Day Detail",
      model: "Provider",
      apiKey: "API Key",
      settingsSaved: "Saved",
      aiReply: "AI Reply",
      aiProviderTip: "PWA calls AI APIs from browser. Keep your key secure.",
      summaryTitle: "Summary",
      homeTitle: "Pickbank",
      homeSub: "Natural language logging & budgets",
      summarySub: "Statistics, trend and AI advice",
      processing: "Processing..."
    }
  };

  const state = {
    activeTab: "home",
    transactions: [],
    categories: [],
    budgets: [],
    preferences: {
      language: "zh",
      theme: "WARM",
      aiModelName: "DeepSeek",
      aiBaseUrl: "https://api.deepseek.com",
      aiApiKey: "",
      onboardingSeen: false
    },
    summary: {
      selectedPeriod: "MONTH",
      selectedTypeTab: "EXPENSE",
      customStartDateMs: null,
      customEndDateMs: null,
      aiAdvice: "",
      aiError: null,
      isAiLoading: false
    },
    ui: {
      isProcessingInput: false,
      quickInputText: "",
      onboardingOpen: false,
      onboardingStep: 0
    }
  };

  const elements = {
    splash: document.getElementById("splashScreen"),
    appShell: document.getElementById("app"),
    appMain: document.querySelector(".app-main"),
    appTitle: document.getElementById("appTitle"),
    titleSub: document.getElementById("titleSub"),
    home: document.getElementById("homeScreen"),
    summary: document.getElementById("summaryScreen"),
    navHome: document.getElementById("navHome"),
    navSummary: document.getElementById("navSummary"),
    headerActions: document.getElementById("headerActions"),
    toast: document.getElementById("toast"),
    installHint: document.getElementById("installHint"),
    overlay: document.getElementById("overlay"),
    manualModal: document.getElementById("manualModal"),
    budgetModal: document.getElementById("budgetModal"),
    aiModal: document.getElementById("aiModal"),
    dayDetailModal: document.getElementById("dayDetailModal"),
    onboarding: document.getElementById("onboardingLayer")
  };

  if (!elements.onboarding) {
    const layer = document.createElement("div");
    layer.id = "onboardingLayer";
    layer.className = "onboarding-layer hidden";
    document.body.appendChild(layer);
    elements.onboarding = layer;
  }

  const splashState = {
    shownAt: Date.now(),
    closing: false,
    dismissed: false
  };

  const onboardingState = {
    queued: false
  };

  let deferredInstallPromptEvent = null;
  let installPromptTimer = null;

  if (elements.splash) {
    document.body.classList.add("splash-active", "app-revealing");
  }

  function splitTextForLightUp(elementId, delayStart, staggerStep, animationName, duration = 0.5) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const text = element.innerText;
    element.innerHTML = "";
    for (let i = 0; i < text.length; i += 1) {
      const charSpan = document.createElement("span");
      charSpan.innerText = text[i] === " " ? "\u00A0" : text[i];
      charSpan.className = "char";
      const currentDelay = delayStart + i * staggerStep;
      charSpan.style.animation = `${animationName} ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) ${currentDelay}s forwards`;
      element.appendChild(charSpan);
    }
  }

  function finalizeSplash() {
    const splash = elements.splash;
    if (!splash || splashState.dismissed) return;
    splashState.dismissed = true;
    splashState.closing = true;
    splash.remove();
    document.body.classList.remove("splash-active");
    document.body.classList.add("splash-done");
    clearTimeout(finalizeSplash._revealTimer);
    finalizeSplash._revealTimer = setTimeout(() => {
      document.body.classList.remove("app-revealing");
    }, 900);
  }

  function setupSplashAnimation() {
    const splash = elements.splash;
    if (!splash) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    splitTextForLightUp("text-name", 0.36, 0.07, "lightUp", 0.62);
    splitTextForLightUp("text-slogan", 0.9, 0.08, "lightUpSlogan", 0.62);

    if (prefersReducedMotion) {
      splash.style.animation = "none";
      const chars = splash.querySelectorAll(".char");
      chars.forEach((char) => {
        char.style.opacity = "1";
        char.style.transform = "none";
      });
      setTimeout(() => {
        finalizeSplash();
      }, 700);
      return;
    }

    splash.addEventListener("animationend", (event) => {
      if (event.animationName === "splashFadeOut") {
        finalizeSplash();
      }
    });

    clearTimeout(setupSplashAnimation._fallbackTimer);
    setupSplashAnimation._fallbackTimer = setTimeout(() => {
      finalizeSplash();
    }, 2850);
  }

  const categoryKeywords = {
    "餐饮": ["饭", "餐", "吃", "外卖", "早餐", "午餐", "晚餐", "夜宵", "零食", "奶茶", "咖啡", "火锅", "烧烤", "食堂", "food", "meal", "coffee", "lunch", "dinner"],
    "交通": ["打车", "出租", "滴滴", "地铁", "公交", "高铁", "火车", "机票", "飞机", "油费", "加油", "停车", "过路费", "骑车", "taxi", "uber", "bus", "train", "metro", "fuel"],
    "购物": ["买", "购", "淘宝", "京东", "拼多多", "超市", "商场", "衣服", "鞋", "包", "数码", "电子", "shop", "shopping", "mall", "supermarket"],
    "住房": ["房租", "租金", "水电", "物业", "暖气", "燃气", "网费", "宽带", "rent", "utility", "internet"],
    "娱乐": ["电影", "游戏", "KTV", "旅游", "门票", "演唱会", "酒吧", "健身", "movie", "game", "travel", "ticket", "gym"],
    "医疗": ["医院", "药", "看病", "体检", "挂号", "手术", "hospital", "medicine", "medical"],
    "教育": ["学费", "书", "培训", "课程", "考试", "学习", "tuition", "course", "book", "study"],
    "工资": ["工资", "薪水", "薪资", "月薪", "发工资", "salary", "payroll", "wage"],
    "兼职": ["兼职", "外快", "副业", "接单", "part-time", "freelance", "side job"],
    "投资": ["利息", "分红", "收益", "理财", "股票", "基金", "investment", "interest", "stock", "fund"],
    "红包": ["红包", "转账收", "收到", "gift", "bonus", "transfer in"]
  };

  const incomeCategories = new Set(["工资", "兼职", "投资", "红包"]);
  const ICONS = {
    settings:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-7v2m0 18v2m11-11h-2M3 12H1m18.36 7.78-1.42-1.42M5.05 5.05 3.64 3.64m15.72 0-1.41 1.41M5.05 18.95l-1.41 1.41"/></svg>',
    edit:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 17.25 4.25-.75L18.4 5.35a1.5 1.5 0 0 0 0-2.12l-.63-.63a1.5 1.5 0 0 0-2.12 0L4.5 13.75 3.75 18Zm13.7-13.58.63.63"/></svg>',
    import:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a3 3 0 1 0-2.8-4 3 3 0 0 0 .1 1L8.7 8.3a3 3 0 0 0-1.7-.5 3 3 0 1 0 1.8 5.4l6.4 3.2a3 3 0 1 0 .7-1.4l-6.5-3.2a3 3 0 0 0 0-1L16 7.6A3 3 0 0 0 18 8Z"/></svg>',
    trash:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM7 10h2v8H7v-8Z"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    home:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 8-6 8 6v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8Z"/></svg>',
    summary:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h3v7H5v-7Zm5-7h3v14h-3V5Zm5 4h3v10h-3V9Z"/></svg>',
    trendDown:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h2.3l4 4 3.3-3.3L17 10V8h2v6h-6v-2h2l-2.4-2.4-3.3 3.3-5-5H3V5Z"/></svg>',
    trendUp:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 14h2.3l4-4 3.3 3.3L17 9v2h2V5h-6v2h2l-2.4 2.4-3.3-3.3-5 5H3v3Z"/></svg>',
    spark:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 13.8 7.2 18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Zm7 7 .9 2.1L22 13l-2.1.9L19 16l-.9-2.1L16 13l2.1-.9L19 10ZM5 14l1.2 2.8L9 18l-2.8 1.2L5 22l-1.2-2.8L1 18l2.8-1.2L5 14Z"/></svg>'
  };

  function t(key) {
    const lang = state.preferences.language === "en" ? "en" : "zh";
    return I18N[lang][key] || key;
  }

  function showToast(text) {
    elements.toast.textContent = text;
    elements.toast.classList.remove("hidden");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => elements.toast.classList.add("hidden"), 1800);
  }

  function getThemeKey() {
    return state.preferences.theme === "MONO" ? "MONO" : "WARM";
  }

  function getThemeColors() {
    return THEME_PALETTES[getThemeKey()] || THEME_PALETTES.WARM;
  }

  function getSparkThemeColor() {
    return getThemeKey() === "MONO" ? "#e9e9e9" : "#ffab91";
  }

  function getBudgetRingColor(progress) {
    if (getThemeKey() === "MONO") {
      return progress <= 0.5 ? "#f0f0f0" : progress <= 0.8 ? "#bcbcbc" : "#8d8d8d";
    }
    return progress <= 0.5 ? "#a5d6a7" : progress <= 0.8 ? "#ffe082" : "#ffab91";
  }

  function applyTheme() {
    document.body.setAttribute("data-theme", getThemeKey().toLowerCase());
  }

  function getMonthlyGridColor(alpha) {
    const a = Math.max(0, Math.min(1, alpha));
    return getThemeKey() === "MONO" ? `rgba(235,235,235,${a.toFixed(2)})` : `rgba(255,171,145,${a.toFixed(2)})`;
  }

  function dismissSplash(forceNow) {
    if (forceNow) {
      finalizeSplash();
      return;
    }
    if (splashState.dismissed || splashState.closing) return;
  }

  function applyDisplayModeLayout() {
    const vw = document.documentElement.clientWidth || window.innerWidth || 430;
    const frameWidth = Math.max(320, Math.min(vw, 430));
    document.body.setAttribute("data-device-mode", "phone");
    document.documentElement.style.setProperty("--frame-width-effective", `${Math.round(frameWidth)}px`);
    document.documentElement.style.setProperty("--bottom-nav-height", "110px");
    scheduleLayoutSync();
  }

  function syncLayoutMetrics() {
    const nav = document.querySelector(".bottom-nav");
    if (!nav) return;

    nav.style.left = "";
    nav.style.right = "";
    nav.style.transform = "";
    nav.style.width = "";
    nav.style.maxWidth = "";

    const navHeight = Math.ceil(nav.getBoundingClientRect().height || 0);
    if (navHeight > 0) {
      document.documentElement.style.setProperty("--bottom-nav-height", `${navHeight}px`);
    }
  }

  function scheduleLayoutSync() {
    cancelAnimationFrame(scheduleLayoutSync._raf);
    scheduleLayoutSync._raf = requestAnimationFrame(() => {
      syncLayoutMetrics();
      cancelAnimationFrame(scheduleLayoutSync._raf2);
      scheduleLayoutSync._raf2 = requestAnimationFrame(() => {
        syncLayoutMetrics();
      });
    });
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        state.categories = DEFAULT_CATEGORIES.slice();
        persist();
        return;
      }
      const parsed = JSON.parse(raw);
      state.transactions = Array.isArray(parsed.transactions) ? parsed.transactions : [];
      state.budgets = Array.isArray(parsed.budgets) ? parsed.budgets : [];
      state.categories = Array.isArray(parsed.categories) && parsed.categories.length ? parsed.categories : DEFAULT_CATEGORIES.slice();
      state.preferences = { ...state.preferences, ...(parsed.preferences || {}) };
      state.preferences.theme = state.preferences.theme === "MONO" ? "MONO" : "WARM";
      state.preferences.onboardingSeen = state.preferences.onboardingSeen === true || state.preferences.onboardingSeen === "true";
      if ("displayMode" in state.preferences) {
        delete state.preferences.displayMode;
      }
      state.summary = { ...state.summary, ...(parsed.summary || {}) };
    } catch (_e) {
      state.categories = DEFAULT_CATEGORIES.slice();
    }
  }

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        transactions: state.transactions,
        budgets: state.budgets,
        categories: state.categories,
        preferences: state.preferences,
        summary: {
          selectedPeriod: state.summary.selectedPeriod,
          selectedTypeTab: state.summary.selectedTypeTab,
          customStartDateMs: state.summary.customStartDateMs,
          customEndDateMs: state.summary.customEndDateMs
        }
      })
    );
  }

  function formatMoney(cents, digits = 0) {
    const value = cents / 100;
    return value.toFixed(digits);
  }

  function fmtDateTime(ms) {
    const lang = state.preferences.language === "en" ? "en-US" : "zh-CN";
    return new Date(ms).toLocaleString(lang, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function toDateInput(ms) {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function fromDateInput(value, endOfDay) {
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    if (endOfDay) d.setHours(23, 59, 59, 999);
    return d.getTime();
  }

  function getCurrentMonthRange() {
    const c = new Date();
    c.setDate(1);
    c.setHours(0, 0, 0, 0);
    const start = c.getTime();
    c.setMonth(c.getMonth() + 1);
    return [start, c.getTime()];
  }

  function getLast7DaysRange() {
    const c = new Date();
    c.setHours(23, 59, 59, 999);
    const end = c.getTime();
    c.setDate(c.getDate() - 6);
    c.setHours(0, 0, 0, 0);
    return [c.getTime(), end];
  }

  function align7Days(weekStartMs, txs) {
    const map = new Map();
    txs.forEach((tx) => {
      if (tx.type !== 0) return;
      const dayStart = Math.floor(tx.createdAt / DAY_MS) * DAY_MS;
      map.set(dayStart, (map.get(dayStart) || 0) + tx.amount);
    });
    const result = [];
    for (let i = 0; i < 7; i += 1) {
      const key = Math.floor(weekStartMs / DAY_MS + i) * DAY_MS;
      result.push((map.get(key) || 0) / 100);
    }
    return result;
  }

  function getLatestBudget() {
    const candidates = state.budgets.filter((b) => b.categoryId == null);
    if (!candidates.length) return null;
    return candidates.sort((a, b) => (b.id || 0) - (a.id || 0))[0];
  }

  function budgetRangeFromTimeKey(timeKey) {
    const parts = String(timeKey || "").split("_");
    return { start: Number(parts[0]) || 0, end: Number(parts[1]) || 0 };
  }

  function computeHomeState() {
    const [monthStart, monthEnd] = getCurrentMonthRange();
    const [weekStart, weekEnd] = getLast7DaysRange();
    const monthTx = state.transactions
      .filter((tx) => tx.createdAt >= monthStart && tx.createdAt <= monthEnd)
      .sort((a, b) => b.createdAt - a.createdAt);
    const monthExpense = monthTx.filter((tx) => tx.type === 0).reduce((s, tx) => s + tx.amount, 0);
    const monthIncome = monthTx.filter((tx) => tx.type === 1).reduce((s, tx) => s + tx.amount, 0);
    const weekTx = state.transactions.filter((tx) => tx.createdAt >= weekStart && tx.createdAt <= weekEnd);
    const weeklyTrend = align7Days(weekStart, weekTx);
    const budget = getLatestBudget();
    let budgetRemainingText = "--";
    let budgetProgress = 0;
    if (budget) {
      const range = budgetRangeFromTimeKey(budget.timeKey);
      const budgetSpent = state.transactions
        .filter((tx) => tx.type === 0 && tx.createdAt >= range.start && tx.createdAt <= range.end)
        .reduce((s, tx) => s + tx.amount, 0);
      budgetProgress = budget.amount > 0 ? Math.max(0, budgetSpent / budget.amount) : 0;
      budgetRemainingText = ((budget.amount - budgetSpent) / 100).toFixed(0);
    }
    return { monthTx, monthExpense, monthIncome, weeklyTrend, budgetRemainingText, budgetProgress };
  }

  function createSparklineSvg(data) {
    if (!data || data.length < 2) return "";
    const sparkColor = getSparkThemeColor();
    const width = 800;
    const height = 120;
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = 10 + (1 - (v - min) / range) * (height - 20);
      return `${x},${y}`;
    });
    const area = `0,${height} ${points.join(" ")} ${width},${height}`;
    return `
      <svg viewBox="0 0 ${width} ${height}" class="bar-chart" aria-hidden="true">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${sparkColor}" stop-opacity="0.40"></stop>
            <stop offset="100%" stop-color="${sparkColor}" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <polygon points="${area}" fill="url(#sparkGrad)"></polygon>
        <polyline points="${points.join(" ")}" fill="none" stroke="${sparkColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg>
    `;
  }

  function renderHeaderActions() {
    if (state.activeTab === "home") {
      elements.headerActions.innerHTML = `
        <button class="icon-btn icon-only" id="openImportBtn" aria-label="${t("importData")}">${ICONS.import}</button>
        <button class="icon-btn icon-only" id="openSettingBtn" aria-label="${t("aiConfig")}">${ICONS.settings}</button>
        <button class="icon-btn icon-only" id="openManualBtn" aria-label="${t("openManual")}">${ICONS.edit}</button>
      `;
      document.getElementById("openImportBtn").addEventListener("click", () => openImportDialog());
      document.getElementById("openSettingBtn").addEventListener("click", () => openAiConfigModal());
      document.getElementById("openManualBtn").addEventListener("click", () => openManualModal());
      return;
    }
    elements.headerActions.innerHTML = `<button class="icon-btn icon-only" id="exportBtn" aria-label="${t("export")}">${ICONS.share}</button>`;
    document.getElementById("exportBtn").addEventListener("click", exportSummaryData);
  }

  function fitHomeBudgetCard() {
    const card = elements.home.querySelector(".home-budget-card");
    if (!card) return;
    const layout = card.querySelector(".budget-layout");
    const value = card.querySelector(".kpi-value");
    const ring = card.querySelector(".budget-ring");
    if (!layout || !value || !ring) return;

    card.style.setProperty("--budget-value-scale", "1");
    card.style.setProperty("--budget-ring-scale", "1");

    const availableWidth = layout.clientWidth;
    if (!availableWidth) return;

    const styles = window.getComputedStyle(layout);
    const gap = parseFloat(styles.columnGap || styles.gap || "12") || 12;
    const textWidth = value.scrollWidth;
    const ringWidth = ring.getBoundingClientRect().width;

    if (!textWidth || !ringWidth) return;

    let valueScale = 1;
    let ringScale = 1;

    if (textWidth + ringWidth + gap > availableWidth) {
      const targetTextWidth = Math.max(availableWidth - ringWidth - gap, 84);
      valueScale = Math.max(0.42, Math.min(1, targetTextWidth / textWidth));

      const scaledTextWidth = textWidth * valueScale;
      const targetRingWidth = Math.max(68, availableWidth - scaledTextWidth - gap);
      ringScale = Math.max(0.62, Math.min(1, targetRingWidth / ringWidth));

      const stillOverflow = scaledTextWidth + ringWidth * ringScale + gap - availableWidth;
      if (stillOverflow > 0) {
        valueScale = Math.max(
          0.36,
          Math.min(valueScale, (availableWidth - ringWidth * ringScale - gap) / Math.max(textWidth, 1))
        );
      }
    }

    card.style.setProperty("--budget-value-scale", valueScale.toFixed(3));
    card.style.setProperty("--budget-ring-scale", ringScale.toFixed(3));
  }

  function getCategoryNameById(id) {
    const c = state.categories.find((item) => item.id === id);
    return c ? c.name : (state.preferences.language === "en" ? "Others" : "其他");
  }

  function renderHomeScreen() {
    const h = computeHomeState();
    const ringColor = getBudgetRingColor(h.budgetProgress);
    const ringDeg = Math.min(360, Math.round(h.budgetProgress * 360));
    const txList = h.monthTx
      .map((tx) => {
        const cls = tx.type === 1 ? "income" : "expense";
        const note = tx.note || tx.rawInput || "";
        const absYuan = Math.abs(tx.amount / 100);
        const amountText = Number.isInteger(absYuan) ? String(absYuan) : absYuan.toFixed(2);
        return `
          <article class="tx-item">
            <div class="tx-main" data-edit-tx="${tx.id}">
              <div class="tx-cat">${escapeHtml(getCategoryNameById(tx.categoryId))}</div>
              <div class="tx-note">${escapeHtml(`${fmtDateTime(tx.createdAt)}${note ? ` · ${note}` : ""}`)}</div>
            </div>
            <div class="tx-amount ${cls}">${tx.type === 1 ? "+" : "-"}${amountText}</div>
            <div class="tx-tools">
              <button class="tx-tool" data-del-tx="${tx.id}" aria-label="delete">${ICONS.trash}</button>
            </div>
          </article>
        `;
      })
      .join("");

    elements.home.innerHTML = `
      <article class="card budget-card home-budget-card" id="openBudgetCard">
        <div class="card-title">${t("budgetRemaining")}</div>
        <div class="budget-layout">
          <div class="budget-main">
            <div class="kpi-value ${Number(h.budgetRemainingText) < 0 ? "expense" : ""}">¥${h.budgetRemainingText}</div>
            <div class="budget-subrow">
              <span><i class="mini-icon">${ICONS.trendDown}</i> ¥${formatMoney(h.monthExpense, 0)}</span>
              <span><i class="mini-icon">${ICONS.trendUp}</i> ¥${formatMoney(h.monthIncome, 0)}</span>
            </div>
          </div>
          <div class="budget-ring" style="background:conic-gradient(${ringColor} ${ringDeg}deg, rgba(255,255,255,.1) 0deg)">
            <div class="budget-ring-inner">${Math.min(999, Math.round(h.budgetProgress * 100))}%</div>
          </div>
        </div>
      </article>

      <article class="home-wave-card">
        ${createSparklineSvg(h.weeklyTrend)}
      </article>

      <article class="home-input-card">
        <div class="quick-input">
          <input id="quickInput" type="text" placeholder="${t("recordHint")}" value="${escapeHtml(state.ui.quickInputText)}" ${state.ui.isProcessingInput ? "disabled" : ""}>
          <button class="primary-btn quick-send" id="quickSubmitBtn" ${state.ui.isProcessingInput ? "disabled" : ""}>
            ${state.ui.isProcessingInput ? `<span class="spinner" aria-hidden="true"></span>` : "↵"}
          </button>
        </div>
      </article>

      <section class="home-records">
        <div class="card-title home-records-title">${t("recentRecords")}</div>
        <div class="list" id="homeTxList">${txList || `<div class="small" style="margin-top:10px">${t("noRecords")}</div>`}</div>
      </section>
    `;

    const quickInput = document.getElementById("quickInput");
    quickInput.addEventListener("input", () => {
      state.ui.quickInputText = quickInput.value;
    });
    quickInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") submitQuickInput();
    });
    document.getElementById("quickSubmitBtn").addEventListener("click", submitQuickInput);
    document.getElementById("openBudgetCard").addEventListener("click", (ev) => {
      if (ev.target.closest(".tx-tool")) return;
      openBudgetModal();
    });

    elements.home.querySelectorAll("[data-edit-tx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-edit-tx"));
        openManualModal(id);
      });
    });

    elements.home.querySelectorAll("[data-del-tx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-del-tx"));
        deleteTransaction(id);
      });
    });

    fitHomeBudgetCard();
    requestAnimationFrame(fitHomeBudgetCard);
  }

  function getTimeRange(period) {
    const now = new Date();
    if (period === "WEEK") {
      const d = new Date(now);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - (day - 1));
      d.setHours(0, 0, 0, 0);
      const start = d.getTime();
      d.setDate(d.getDate() + 6);
      d.setHours(23, 59, 59, 999);
      return [start, d.getTime()];
    }
    if (period === "MONTH") {
      const d = new Date(now);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      const start = d.getTime();
      d.setMonth(d.getMonth() + 1);
      d.setMilliseconds(-1);
      return [start, d.getTime()];
    }
    if (period === "YEAR") {
      const d = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      const start = d.getTime();
      d.setFullYear(d.getFullYear() + 1);
      d.setMilliseconds(-1);
      return [start, d.getTime()];
    }
    const s = state.summary.customStartDateMs || now.getTime();
    const e = state.summary.customEndDateMs || now.getTime();
    return [s, e];
  }

  function buildBarData(period, startMs, txs) {
    if (period === "WEEK") {
      const labels = [];
      const data = [];
      const fmt = new Intl.DateTimeFormat(state.preferences.language === "en" ? "en-US" : "zh-CN", { weekday: "short" });
      for (let i = 0; i < 7; i += 1) {
        const dayStart = startMs + i * DAY_MS;
        const dayEnd = dayStart + DAY_MS;
        const sum = txs.filter((tx) => tx.createdAt >= dayStart && tx.createdAt < dayEnd).reduce((s, tx) => s + tx.amount, 0);
        labels.push(fmt.format(new Date(dayStart)));
        data.push(sum / 100);
      }
      return { labels, data };
    }

    if (period === "MONTH") {
      const d = new Date(startMs);
      const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const labels = Array.from({ length: days }, (_, i) => String(i + 1));
      const data = new Array(days).fill(0);
      txs.forEach((tx) => {
        const day = new Date(tx.createdAt).getDate() - 1;
        if (day >= 0 && day < data.length) data[day] += tx.amount / 100;
      });
      return { labels, data };
    }

    if (period === "YEAR") {
      const labels = Array.from({ length: 12 }, (_, i) => (state.preferences.language === "en" ? `M${i + 1}` : `${i + 1}月`));
      const data = new Array(12).fill(0);
      txs.forEach((tx) => {
        const m = new Date(tx.createdAt).getMonth();
        data[m] += tx.amount / 100;
      });
      return { labels, data };
    }

    const end = state.summary.customEndDateMs || startMs;
    const days = Math.max(1, Math.min(31, Math.floor((end - startMs) / DAY_MS) + 1));
    const labels = [];
    const data = new Array(days).fill(0);
    const fmt = new Intl.DateTimeFormat(state.preferences.language === "en" ? "en-US" : "zh-CN", {
      month: "2-digit",
      day: "2-digit"
    });
    for (let i = 0; i < days; i += 1) labels.push(fmt.format(new Date(startMs + i * DAY_MS)));
    txs.forEach((tx) => {
      const idx = Math.floor((tx.createdAt - startMs) / DAY_MS);
      if (idx >= 0 && idx < days) data[idx] += tx.amount / 100;
    });
    return { labels, data };
  }

  function computeSummaryState() {
    const [start, end] = getTimeRange(state.summary.selectedPeriod);
    const txs = state.transactions.filter((tx) => tx.createdAt >= start && tx.createdAt <= end);
    const expenses = txs.filter((tx) => tx.type === 0);
    const incomes = txs.filter((tx) => tx.type === 1);
    const totalExpense = expenses.reduce((s, tx) => s + tx.amount, 0) / 100;
    const totalIncome = incomes.reduce((s, tx) => s + tx.amount, 0) / 100;
    const buildShares = (list) => {
      const map = new Map();
      list.forEach((tx) => {
        const k = getCategoryNameById(tx.categoryId);
        map.set(k, (map.get(k) || 0) + tx.amount);
      });
      const total = list.reduce((s, tx) => s + tx.amount, 0) || 1;
      return Array.from(map.entries())
        .map(([name, amount]) => ({ name, amountYuan: amount / 100, percentage: amount / total }))
        .sort((a, b) => b.amountYuan - a.amountYuan);
    };
    return {
      start,
      end,
      txs,
      totalExpense,
      totalIncome,
      expenseShares: buildShares(expenses),
      incomeShares: buildShares(incomes),
      expenseBars: buildBarData(state.summary.selectedPeriod, start, expenses),
      incomeBars: buildBarData(state.summary.selectedPeriod, start, incomes)
    };
  }

  function createDonutGradient(shares) {
    if (!shares.length) return "conic-gradient(rgba(255,255,255,.12) 0deg 360deg)";
    const palette = getThemeColors();
    let acc = 0;
    const parts = shares.map((s, i) => {
      const from = acc;
      const sweep = Math.max(1, Math.round(s.percentage * 360));
      acc += sweep;
      return `${palette[i % palette.length]} ${from}deg ${Math.min(360, acc)}deg`;
    });
    if (acc < 360) parts.push(`rgba(255,255,255,.12) ${acc}deg 360deg`);
    return `conic-gradient(${parts.join(",")})`;
  }

  function buildBarChartMarkup(data, labels, period) {
    const max = Math.max(...data, 1);
    const wrapClass = period === "YEAR" ? "bars-wrap bars-wrap-year" : "bars-wrap";
    const bars = data
      .map((v, i) => {
        const h = Math.max(2, Math.round((v / max) * 140));
        return `
          <div class="bar-col" data-day-index="${i}">
            <div class="bar-fill" style="height:${h}px"></div>
            <div class="bar-label">${escapeHtml(labels[i] || "")}</div>
          </div>
        `;
      })
      .join("");
    return `<div class="${wrapClass}">${bars}</div>`;
  }

  function buildMonthlyGrid(data, labels) {
    return `
      <div class="calendar-grid">
        ${labels
          .map((label, i) => {
            const max = Math.max(...data, 1);
            const alpha = Math.min(0.8, data[i] / max + 0.1);
            return `<div class="calendar-cell" data-day-index="${i}" style="background:${getMonthlyGridColor(alpha)}">${escapeHtml(label)}</div>`;
          })
          .join("")}
      </div>
    `;
  }

  function renderSummaryScreen() {
    const s = computeSummaryState();
    const period = state.summary.selectedPeriod;
    const isExpense = state.summary.selectedTypeTab === "EXPENSE";
    const shares = isExpense ? s.expenseShares : s.incomeShares;
    const bars = isExpense ? s.expenseBars : s.incomeBars;
    const palette = getThemeColors();

    const periodButtons = [
      { key: "WEEK", label: t("week") },
      { key: "MONTH", label: t("month") },
      { key: "YEAR", label: t("year") },
      { key: "CUSTOM", label: t("custom") }
    ]
      .map((p) => `<button class="tab-btn ${period === p.key ? "active" : ""}" data-period="${p.key}">${p.label}</button>`)
      .join("");

    const typeButtons = [
      { key: "EXPENSE", label: t("expense") },
      { key: "INCOME", label: t("income") }
    ]
      .map((p) => `<button class="tab-btn ${state.summary.selectedTypeTab === p.key ? "active" : ""}" data-type="${p.key}">${p.label}</button>`)
      .join("");

    const donut = `
      <div class="donut-wrap">
        <div class="donut-ring" style="background:${createDonutGradient(shares)};">
          <div class="donut-center">
            <div class="small">${t("categoryDist")}</div>
            <div class="donut-total">¥${(isExpense ? s.totalExpense : s.totalIncome).toFixed(0)}</div>
          </div>
        </div>
      </div>
    `;

    const legend = shares
      .map(
        (item, i) => `
          <div class="legend-row">
            <span class="dot" style="background:${palette[i % palette.length]}"></span>
            <span>${escapeHtml(item.name)}</span>
            <span>¥${item.amountYuan.toFixed(0)}</span>
            <span>${Math.round(item.percentage * 100)}%</span>
          </div>
        `
      )
      .join("");

    elements.summary.innerHTML = `
      <article class="summary-period-panel">
        <div class="tabs">${periodButtons}</div>
        ${
          period === "CUSTOM"
            ? `<div class="form-grid custom-range-inline">
                <div class="form-row">
                  <label>${t("customStart")}</label>
                  <input type="date" id="customStartDate" value="${state.summary.customStartDateMs ? toDateInput(state.summary.customStartDateMs) : ""}">
                </div>
                <div class="form-row">
                  <label>${t("customEnd")}</label>
                  <input type="date" id="customEndDate" value="${state.summary.customEndDateMs ? toDateInput(state.summary.customEndDateMs) : ""}">
                </div>
              </div>`
            : ""
        }
      </article>

      <article class="kpi-grid summary-kpi-grid">
        <div class="kpi">
          <div class="kpi-label">${t("monthlyExpense")}</div>
          <div class="kpi-value expense">¥${s.totalExpense.toFixed(0)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">${t("monthlyIncome")}</div>
          <div class="kpi-value income">¥${s.totalIncome.toFixed(0)}</div>
        </div>
      </article>

      <article class="summary-type-panel">
        <div class="tabs">${typeButtons}</div>
      </article>

      <article class="card summary-donut-card">
        <div class="card-title">${t("categoryDist")}</div>
        ${donut}
        <div class="legend">${legend || `<div class="small">${t("noRecords")}</div>`}</div>
      </article>

      <article class="card summary-trend-card">
        <div class="card-title">${t("trend")}</div>
        <div class="summary-trend-inner">
          ${period === "MONTH" ? buildMonthlyGrid(bars.data, bars.labels) : buildBarChartMarkup(bars.data, bars.labels, period)}
        </div>
      </article>

      <article class="card summary-ai-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div class="card-title" style="margin:0">${t("aiInsights")}</div>
        </div>
        <div class="ai-entry ${state.summary.isAiLoading ? "disabled" : ""}" id="aiAdviceBtn">
          <span class="ai-entry-left">${ICONS.spark} ${state.summary.isAiLoading ? t("aiAnalyzing") : t("getAiAdvice")}</span>
          <button class="icon-btn icon-only ai-entry-gear" id="openAiConfigBtn" aria-label="${t("aiConfig")}">${ICONS.settings}</button>
        </div>
        <div class="ai-box">${escapeHtml(state.summary.aiAdvice || state.summary.aiError || "")}</div>
      </article>

    `;

    elements.summary.querySelectorAll("[data-period]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.summary.selectedPeriod = btn.getAttribute("data-period");
        if (state.summary.selectedPeriod === "CUSTOM" && (!state.summary.customStartDateMs || !state.summary.customEndDateMs)) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          state.summary.customStartDateMs = now.getTime();
          now.setHours(23, 59, 59, 999);
          state.summary.customEndDateMs = now.getTime();
        }
        persist();
        render();
      });
    });

    const customStart = document.getElementById("customStartDate");
    const customEnd = document.getElementById("customEndDate");
    if (customStart && customEnd) {
      customStart.addEventListener("change", () => {
        const ms = fromDateInput(customStart.value, false);
        if (ms != null) {
          state.summary.customStartDateMs = ms;
          persist();
          render();
        }
      });
      customEnd.addEventListener("change", () => {
        const ms = fromDateInput(customEnd.value, true);
        if (ms != null) {
          state.summary.customEndDateMs = ms;
          persist();
          render();
        }
      });
    }

    elements.summary.querySelectorAll("[data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.summary.selectedTypeTab = btn.getAttribute("data-type");
        persist();
        render();
      });
    });

    elements.summary.querySelectorAll("[data-day-index]").forEach((el) => {
      el.addEventListener("click", () => {
        const dayIndex = Number(el.getAttribute("data-day-index"));
        openDayDetail(dayIndex);
      });
    });

    document.getElementById("aiAdviceBtn").addEventListener("click", (ev) => {
      if (ev.target.closest("#openAiConfigBtn")) return;
      requestAiAdvice();
    });
    document.getElementById("openAiConfigBtn").addEventListener("click", openAiConfigModal);
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openModal(modalEl, html) {
    modalEl.innerHTML = `<div class="sheet-grip"></div>${html}`;
    elements.overlay.classList.remove("hidden");
    modalEl.classList.remove("hidden");
  }

  function closeAllModals() {
    [elements.manualModal, elements.budgetModal, elements.aiModal, elements.dayDetailModal].forEach((m) => {
      m.classList.add("hidden");
      m.classList.remove("modal-center", "modal-full", "day-detail-modal");
      m.innerHTML = "";
    });
    elements.overlay.classList.add("hidden");
  }

  function openManualModal(editId) {
    const editing = typeof editId === "number" ? state.transactions.find((tx) => tx.id === editId) : null;
    let selectedType = editing ? editing.type : 0;
    let selectedCategoryId = editing ? editing.categoryId : null;

    const renderCategoryChips = () => {
      const chips = state.categories
        .filter((c) => c.type === selectedType)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c) => `<button class="chip ${selectedCategoryId === c.id ? "active" : ""}" data-manual-category="${c.id}">${escapeHtml(c.name)}</button>`)
        .join("");
      return chips || `<div class="small">${t("noRecords")}</div>`;
    };

    openModal(
      elements.manualModal,
      `
      <h3>${editing ? t("manualTitleEdit") : t("manualTitleCreate")}</h3>
      <div class="form-grid" id="manualFormWrap">
        <div class="form-row">
          <label>${t("amount")}</label>
          <input id="manualAmount" type="number" min="0" step="0.01" value="${editing ? (editing.amount / 100).toFixed(2) : ""}">
        </div>
        <div class="form-row">
          <label>${t("expense")}/${t("income")}</label>
          <div class="tabs" id="manualTypeTabs">
            <button class="tab-btn ${selectedType === 0 ? "active" : ""}" data-manual-type="0">${t("expense")}</button>
            <button class="tab-btn ${selectedType === 1 ? "active" : ""}" data-manual-type="1">${t("income")}</button>
          </div>
        </div>
        <div class="form-row">
          <label>${t("category")}</label>
          <div class="chips" id="manualCategoryChips">${renderCategoryChips()}</div>
        </div>
        <div class="form-row">
          <label>${t("remark")}</label>
          <input id="manualRemark" type="text" value="${escapeHtml(editing ? editing.note || "" : "")}">
        </div>
        <div class="form-row">
          <label>${t("date")}</label>
          <input id="manualDate" type="date" value="${toDateInput(editing ? editing.createdAt : Date.now())}">
        </div>
      </div>
      <div class="modal-actions">
        <button class="secondary-btn" id="manualCancelBtn">${t("cancel")}</button>
        <button class="primary-btn" id="manualSaveBtn">${t("confirmRecord")}</button>
      </div>
    `
    );

    const mountManualHandlers = () => {
      elements.manualModal.querySelectorAll("[data-manual-type]").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectedType = Number(btn.getAttribute("data-manual-type"));
          if (!state.categories.some((c) => c.type === selectedType && c.id === selectedCategoryId)) {
            selectedCategoryId = state.categories.find((c) => c.type === selectedType)?.id ?? null;
          }
          elements.manualModal.querySelectorAll("[data-manual-type]").forEach((it) => it.classList.toggle("active", Number(it.getAttribute("data-manual-type")) === selectedType));
          document.getElementById("manualCategoryChips").innerHTML = renderCategoryChips();
          mountManualHandlers();
        });
      });

      elements.manualModal.querySelectorAll("[data-manual-category]").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectedCategoryId = Number(btn.getAttribute("data-manual-category"));
          elements.manualModal.querySelectorAll("[data-manual-category]").forEach((it) => it.classList.toggle("active", Number(it.getAttribute("data-manual-category")) === selectedCategoryId));
        });
      });
    };

    mountManualHandlers();

    document.getElementById("manualCancelBtn").addEventListener("click", closeAllModals);
    document.getElementById("manualSaveBtn").addEventListener("click", () => {
      const amount = Number(document.getElementById("manualAmount").value);
      const type = Number(elements.manualModal.querySelector("[data-manual-type].active")?.getAttribute("data-manual-type") || 0);
      const categoryId = selectedCategoryId;
      const remark = document.getElementById("manualRemark").value.trim();
      const dateMs = fromDateInput(document.getElementById("manualDate").value, false) || Date.now();

      if (!amount || amount <= 0) {
        showToast(t("invalidAmount"));
        return;
      }

      const tx = {
        id: editing ? editing.id : Date.now() + Math.floor(Math.random() * 999),
        amount: Math.round(amount * 100),
        type,
        categoryId,
        note: remark || null,
        rawInput: editing ? "手动修改" : "手动录入",
        createdAt: dateMs,
        updatedAt: Date.now()
      };

      if (editing) state.transactions = state.transactions.map((item) => (item.id === editing.id ? tx : item));
      else state.transactions.push(tx);

      state.transactions.sort((a, b) => b.createdAt - a.createdAt);
      persist();
      closeAllModals();
      render();
      showToast(t("saved"));
    });
  }

  function openBudgetModal() {
    openModal(
      elements.budgetModal,
      `
      <h3>${t("budgetTitle")}</h3>
      <div class="form-grid">
        <div class="form-row">
          <label>${t("amount")}</label>
          <input id="budgetAmount" type="number" min="0" step="0.01" placeholder="1000">
        </div>
        <div class="form-row">
          <label>${t("period")}</label>
          <select id="budgetPeriod">
            <option value="NEXT_DAY">${state.preferences.language === "en" ? "Next Day" : "未来一天"}</option>
            <option value="NEXT_WEEK">${state.preferences.language === "en" ? "Next Week" : "未来一周"}</option>
            <option value="NEXT_MONTH">${state.preferences.language === "en" ? "Next Month" : "未来一月"}</option>
            <option value="CUSTOM">${t("custom")}</option>
          </select>
        </div>
        <div id="budgetCustomRange" class="hidden">
          <div class="form-row">
            <label>${t("customStart")}</label>
            <input id="budgetStart" type="date">
          </div>
          <div class="form-row">
            <label>${t("customEnd")}</label>
            <input id="budgetEnd" type="date">
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="secondary-btn" id="budgetCancelBtn">${t("cancel")}</button>
        <button class="primary-btn" id="budgetSaveBtn">${t("saveBudget")}</button>
      </div>
    `
    );

    const periodSelect = document.getElementById("budgetPeriod");
    const customRange = document.getElementById("budgetCustomRange");
    periodSelect.addEventListener("change", () => {
      customRange.classList.toggle("hidden", periodSelect.value !== "CUSTOM");
      if (periodSelect.value === "CUSTOM") {
        const today = toDateInput(Date.now());
        document.getElementById("budgetStart").value = document.getElementById("budgetStart").value || today;
        document.getElementById("budgetEnd").value = document.getElementById("budgetEnd").value || today;
      }
    });

    document.getElementById("budgetCancelBtn").addEventListener("click", closeAllModals);
    document.getElementById("budgetSaveBtn").addEventListener("click", () => {
      const amount = Number(document.getElementById("budgetAmount").value);
      if (!amount || amount <= 0) {
        showToast(t("invalidAmount"));
        return;
      }

      const period = periodSelect.value;
      const now = new Date();
      let start = now.getTime();
      let end = now.getTime();

      if (period === "NEXT_DAY") {
        now.setDate(now.getDate() + 1);
        end = now.getTime();
      } else if (period === "NEXT_WEEK") {
        now.setDate(now.getDate() + 7);
        end = now.getTime();
      } else if (period === "NEXT_MONTH") {
        now.setMonth(now.getMonth() + 1);
        end = now.getTime();
      } else {
        const s = fromDateInput(document.getElementById("budgetStart").value, false);
        const e = fromDateInput(document.getElementById("budgetEnd").value, true);
        if (!s || !e || e < s) {
          showToast(state.preferences.language === "en" ? "Invalid date range" : "日期范围无效");
          return;
        }
        start = s;
        end = e;
      }

      const budget = { id: Date.now(), amount: Math.round(amount * 100), periodType: period, timeKey: `${start}_${end}`, categoryId: null };
      const idx = state.budgets.findIndex((b) => b.periodType === budget.periodType && b.timeKey === budget.timeKey && b.categoryId == null);
      if (idx >= 0) state.budgets[idx] = budget;
      else state.budgets.push(budget);

      persist();
      closeAllModals();
      render();
      showToast(t("saved"));
    });
  }

  function openAiConfigModal() {
    const currentProvider = PREDEFINED_MODELS.find((m) => m.name === state.preferences.aiModelName) || PREDEFINED_MODELS[0];
    let selectedLang = state.preferences.language;
    let selectedProviderName = currentProvider.name;
    let selectedTheme = getThemeKey();

    elements.aiModal.classList.add("modal-full");
    openModal(
      elements.aiModal,
      `
      <div class="config-head">
        <div>
          <h3 class="config-title">${state.preferences.language === "en" ? "AI Model Config" : "AI 模型配置"}</h3>
          <div class="small">${state.preferences.language === "en" ? "Set your API key to enable AI analysis" : "配置 API 密钥即可开启智能分析"}</div>
        </div>
        <button class="icon-btn icon-only close-icon-btn config-close-btn" id="aiCloseBtn" aria-label="${t("cancel")}">${ICONS.close}</button>
      </div>

      <div class="config-block-title">${t("language")}</div>
      <div class="seg-grid two" id="prefLangWrap">
        <button class="seg-btn" data-pref-lang="zh">中文</button>
        <button class="seg-btn" data-pref-lang="en">English</button>
      </div>

      <div class="config-block-title">${t("themeColor")}</div>
      <div class="seg-grid two" id="prefThemeWrap">
        <button class="seg-btn" data-pref-theme="WARM">${t("themeWarm")}</button>
        <button class="seg-btn" data-pref-theme="MONO">${t("themeDefaultMono")}</button>
      </div>

      <div class="config-block-title">${t("onboardingGuide")}</div>
      <div class="seg-grid">
        <button class="secondary-btn block-btn" id="reopenOnboardingBtn">${t("reopenOnboarding")}</button>
      </div>

      <div class="config-block-title">${state.preferences.language === "en" ? "Select Provider" : "选择服务商"}</div>
      <div class="seg-grid two" id="prefProviderWrap">
        ${PREDEFINED_MODELS.map((m) => `<button class="seg-btn" data-pref-provider="${escapeHtml(m.name)}">${escapeHtml(m.name)}</button>`).join("")}
      </div>

      <div class="config-block-title">API Key</div>
      <div class="form-row">
        <input id="prefApiKey" type="text" value="${escapeHtml(state.preferences.aiApiKey || "")}" placeholder="${state.preferences.language === "en" ? "Enter your API Key..." : "在此填入您的 API Key..."}">
      </div>

      <div class="config-block-title">${state.preferences.language === "en" ? "Function Tests" : "功能测试"}</div>
      <div class="seg-grid two">
        <button class="secondary-btn block-btn" id="aiTestConn">${t("testConnectivity")}</button>
        <button class="secondary-btn block-btn" id="aiTestQa">${t("testQa")}</button>
      </div>

      <div id="aiTestResult" class="small test-result"></div>

      <div class="modal-actions full-width-actions">
        <button class="primary-btn full-save-btn" id="aiSaveBtn">${state.preferences.language === "en" ? "Save Config" : "保存配置"}</button>
      </div>
    `
    );

    const refreshConfigSelection = () => {
      elements.aiModal.querySelectorAll("[data-pref-lang]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-pref-lang") === selectedLang);
      });
      elements.aiModal.querySelectorAll("[data-pref-provider]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-pref-provider") === selectedProviderName);
      });
      elements.aiModal.querySelectorAll("[data-pref-theme]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-pref-theme") === selectedTheme);
      });
    };
    refreshConfigSelection();

    elements.aiModal.querySelectorAll("[data-pref-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedLang = btn.getAttribute("data-pref-lang") || "zh";
        refreshConfigSelection();
      });
    });

    elements.aiModal.querySelectorAll("[data-pref-provider]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedProviderName = btn.getAttribute("data-pref-provider") || currentProvider.name;
        refreshConfigSelection();
      });
    });

    elements.aiModal.querySelectorAll("[data-pref-theme]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedTheme = btn.getAttribute("data-pref-theme") === "WARM" ? "WARM" : "MONO";
        refreshConfigSelection();
      });
    });

    document.getElementById("reopenOnboardingBtn").addEventListener("click", () => {
      closeAllModals();
      startOnboarding(true);
    });

    document.getElementById("aiCloseBtn").addEventListener("click", closeAllModals);
    document.getElementById("aiSaveBtn").addEventListener("click", () => {
      const provider = PREDEFINED_MODELS.find((m) => m.name === selectedProviderName) || PREDEFINED_MODELS[0];
      state.preferences.language = selectedLang === "en" ? "en" : "zh";
      state.preferences.aiModelName = provider.name;
      state.preferences.aiBaseUrl = provider.baseUrl;
      state.preferences.aiApiKey = document.getElementById("prefApiKey").value.trim();
      state.preferences.theme = selectedTheme;
      persist();
      applyTheme();
      applyDisplayModeLayout();
      closeAllModals();
      render();
      showToast(t("settingsSaved"));
    });

    document.getElementById("aiTestConn").addEventListener("click", async () => {
      const output = document.getElementById("aiTestResult");
      output.textContent = state.preferences.language === "en" ? "Testing..." : "测试中...";
      try {
        const provider = PREDEFINED_MODELS.find((m) => m.name === selectedProviderName) || PREDEFINED_MODELS[0];
        await callChatApi([{ role: "user", content: "ping" }], 8, provider.baseUrl, document.getElementById("prefApiKey").value.trim(), provider.defaultModel);
        output.innerHTML = `<span class="badge-ok">${state.preferences.language === "en" ? "Connectivity OK" : "连接成功"}</span>`;
      } catch (err) {
        output.innerHTML = `<span class="badge-error">${state.preferences.language === "en" ? "Failed" : "失败"}: ${escapeHtml(err.message)}</span>`;
      }
    });

    document.getElementById("aiTestQa").addEventListener("click", async () => {
      const output = document.getElementById("aiTestResult");
      output.textContent = state.preferences.language === "en" ? "Testing..." : "测试中...";
      try {
        const provider = PREDEFINED_MODELS.find((m) => m.name === selectedProviderName) || PREDEFINED_MODELS[0];
        const text = await callChatApi(
          [{ role: "user", content: "你好，请用一句话自我介绍。" }],
          64,
          provider.baseUrl,
          document.getElementById("prefApiKey").value.trim(),
          provider.defaultModel
        );
        output.innerHTML = `<span class="badge-ok">${t("aiReply")}: ${escapeHtml(text)}</span>`;
      } catch (err) {
        output.innerHTML = `<span class="badge-error">${state.preferences.language === "en" ? "Failed" : "失败"}: ${escapeHtml(err.message)}</span>`;
      }
    });
  }

  function openDayDetail(dayIndex) {
    const summary = computeSummaryState();
    const [start] = getTimeRange(state.summary.selectedPeriod);
    const dayStart = start + dayIndex * DAY_MS;
    const dayEnd = dayStart + DAY_MS;
    const list = summary.txs.filter((tx) => tx.createdAt >= dayStart && tx.createdAt < dayEnd);
    const d = new Date(dayStart);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const titleLabel = state.preferences.language === "en" ? `${month}/${day}` : `${month}月${day}日`;

    elements.dayDetailModal.classList.add("modal-center", "day-detail-modal");
    elements.overlay.classList.remove("hidden");
    elements.dayDetailModal.classList.remove("hidden");
    elements.dayDetailModal.innerHTML = `
      <div class="day-detail-head">
        <h3>${titleLabel} ${t("dayDetailTitle")}</h3>
        <button class="icon-btn icon-only close-icon-btn day-close-btn" id="closeDayDetail" aria-label="${t("cancel")}">${ICONS.close}</button>
      </div>
      <div class="day-detail-list">
        ${
          list.length
            ? list
                .map(
                  (tx) => `
                  <article class="day-detail-row">
                    <div>
                      <div class="tx-cat">${escapeHtml(getCategoryNameById(tx.categoryId))}</div>
                      <div class="tx-note">${escapeHtml(tx.note || tx.rawInput || "")}</div>
                    </div>
                    <div class="tx-amount ${tx.type === 1 ? "income" : "expense"}">${tx.type === 1 ? "+" : "-"}¥${(tx.amount / 100).toFixed(2)}</div>
                  </article>
                `
                )
                .join("")
            : `<div class="day-empty">${t("noDetail")}</div>`
        }
      </div>
    `;

    document.getElementById("closeDayDetail").addEventListener("click", closeAllModals);
  }

  function getOnboardingSteps() {
    const isEn = state.preferences.language === "en";
    if (isEn) {
      return [
        {
          icon: ICONS.home,
          title: "Welcome to Pickbank",
          desc: "Simple money notes, day by day. Start from Home and keep every income and expense clear.",
          tip: "Tip: use bottom tabs to switch Records and Summary."
        },
        {
          icon: ICONS.spark,
          title: "Quick Input with AI",
          desc: "Just type what happened. AI reads amount, category and remark for you.",
          tip: "Multiple amounts in one sentence can be split into multiple records."
        },
        {
          icon: ICONS.import,
          title: "AI File Import",
          desc: "Tap Import at top-right. Ledger-related files can be parsed and saved in one go.",
          tip: "Supports common formats like text, CSV and JSON."
        },
        {
          icon: ICONS.trendDown,
          title: "Budget Card",
          desc: "Set a budget with one tap. Remaining amount and progress update automatically.",
          tip: "Long numbers are auto-fitted inside the card."
        },
        {
          icon: ICONS.edit,
          title: "Manual Entry & Edit",
          desc: "Prefer manual? Add, edit or delete records anytime.",
          tip: "Date, category and remark are all editable."
        },
        {
          icon: ICONS.summary,
          title: "Summary & Trend",
          desc: "Switch week, month, year or custom range to see where money goes.",
          tip: "Tap bars or cells to open day details."
        },
        {
          icon: ICONS.share,
          title: "AI Insights & Export",
          desc: "On Summary, get AI suggestions and export the report with one tap.",
          tip: "Set your AI key in Settings first."
        },
        {
          icon: ICONS.settings,
          title: "Settings Center",
          desc: "Language, theme and AI provider are all here.",
          tip: "You're ready. Add your first record now."
        }
      ];
    }

    return [
      {
        icon: ICONS.home,
        title: "欢迎使用拾念记账",
        desc: "记账不用复杂，从今天开始把每一笔记清楚。",
        tip: "底部可切换“记录 / 总结”。"
      },
      {
        icon: ICONS.spark,
        title: "自然语言快速记账",
        desc: "想到就写一句，AI 会识别金额、分类和备注。",
        tip: "一句里有多笔，也能自动拆开记。"
      },
      {
        icon: ICONS.import,
        title: "AI 文件导入",
        desc: "点右上角“导入”，账单文件可一键分析并入账。",
        tip: "支持文本、CSV、JSON 等常见格式。"
      },
      {
        icon: ICONS.trendDown,
        title: "预算与剩余",
        desc: "点预算卡片设目标，剩余和进度会自动更新。",
        tip: "数字再长，也会自动适配。"
      },
      {
        icon: ICONS.edit,
        title: "手动录入与编辑",
        desc: "不想用 AI？手动录入、编辑、删除都很顺手。",
        tip: "日期、分类、备注都能改。"
      },
      {
        icon: ICONS.summary,
        title: "总结与趋势图",
        desc: "周/月/年随时切，钱花在哪儿一眼看懂。",
        tip: "点图表可看当天明细。"
      },
      {
        icon: ICONS.share,
        title: "AI 洞察与导出",
        desc: "在总结页点一下，AI 会给你可执行的建议。",
        tip: "也支持一键导出当前报表。"
      },
      {
        icon: ICONS.settings,
        title: "设置中心",
        desc: "语言、主题、AI 服务商和密钥都在这里。",
        tip: "准备好了，记下今天第一笔。"
      }
    ];
  }

  function finishOnboarding(markSeen = true) {
    state.ui.onboardingOpen = false;
    if (markSeen) {
      state.preferences.onboardingSeen = true;
      persist();
    }
    renderOnboarding();
  }

  function startOnboarding(force = false) {
    if (!force && state.preferences.onboardingSeen) return;
    state.ui.onboardingStep = 0;
    state.ui.onboardingOpen = true;
    renderOnboarding();
  }

  function maybeStartOnboarding() {
    if (state.preferences.onboardingSeen || onboardingState.queued) return;
    onboardingState.queued = true;
    const elapsed = Date.now() - splashState.shownAt;
    const waitMs = Math.max(0, 2450 - elapsed);
    setTimeout(() => {
      if (!state.preferences.onboardingSeen) startOnboarding(false);
    }, waitMs);
  }

  function renderOnboarding() {
    const layer = elements.onboarding;
    if (!layer) return;
    if (!state.ui.onboardingOpen) {
      layer.classList.add("hidden");
      layer.innerHTML = "";
      document.body.classList.remove("onboarding-open");
      return;
    }

    const steps = getOnboardingSteps();
    const maxIndex = steps.length - 1;
    const stepIndex = Math.max(0, Math.min(maxIndex, Number(state.ui.onboardingStep) || 0));
    state.ui.onboardingStep = stepIndex;
    const step = steps[stepIndex];
    const stepCounter = `${String(stepIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    const dots = steps
      .map((_, i) => `<span class="onboarding-dot ${i === stepIndex ? "active" : ""}"></span>`)
      .join("");

    layer.innerHTML = `
      <div class="onboarding-panel">
        <div class="onboarding-head">
          <div class="onboarding-counter">${stepCounter}</div>
          <button class="text-btn onboarding-skip" id="onboardingSkipBtn">${t("onboardingSkip")}</button>
        </div>
        <div class="onboarding-art">
          <span class="onboarding-line"></span>
          <span class="onboarding-art-icon">${step.icon}</span>
          <span class="onboarding-line"></span>
        </div>
        <h3 class="onboarding-title">${escapeHtml(step.title)}</h3>
        <p class="onboarding-desc">${escapeHtml(step.desc)}</p>
        <p class="onboarding-tip">${escapeHtml(step.tip)}</p>
        <div class="onboarding-dots">${dots}</div>
        <div class="onboarding-actions">
          <button class="secondary-btn ${stepIndex === 0 ? "hidden" : ""}" id="onboardingPrevBtn">${t("onboardingPrev")}</button>
          <button class="primary-btn" id="onboardingNextBtn">${stepIndex >= maxIndex ? t("onboardingStart") : t("onboardingNext")}</button>
        </div>
      </div>
    `;

    layer.classList.remove("hidden");
    document.body.classList.add("onboarding-open");

    document.getElementById("onboardingSkipBtn").addEventListener("click", () => finishOnboarding(true));
    const prevBtn = document.getElementById("onboardingPrevBtn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        state.ui.onboardingStep = Math.max(0, state.ui.onboardingStep - 1);
        renderOnboarding();
      });
    }
    document.getElementById("onboardingNextBtn").addEventListener("click", () => {
      if (state.ui.onboardingStep >= maxIndex) {
        finishOnboarding(true);
        return;
      }
      state.ui.onboardingStep += 1;
      renderOnboarding();
    });
  }

  function parseLocalInput(input) {
    const text = input.trim();
    if (!text) return null;
    const lowerText = text.toLowerCase();
    const m = text.match(/(\d+\.?\d*)/);
    if (!m) return null;
    const amountYuan = Number(m[1]);
    if (!Number.isFinite(amountYuan) || amountYuan <= 0) return null;

    let category = "其他";
    Object.keys(categoryKeywords).some((name) => {
      if (categoryKeywords[name].some((k) => lowerText.includes(String(k).toLowerCase()))) {
        category = name;
        return true;
      }
      return false;
    });

    const type = incomeCategories.has(category) ? 1 : 0;
    const note = text.replace(m[1], "").replace(/[花了用了元块钱]/g, "").trim();
    return { amountCents: Math.round(amountYuan * 100), categoryName: category, type, note: note || null };
  }

  function countAmountHints(text) {
    return (String(text || "").match(/(\d+\.?\d*)/g) || []).length;
  }

  function findCategoryIdByName(name, type) {
    const hit = state.categories.find((c) => c.type === type && c.name.includes(name));
    return hit ? hit.id : null;
  }

  function normalizeLlmType(rawType) {
    const v = String(rawType || "").toLowerCase();
    if (v.includes("income") || v.includes("收入")) return 1;
    return 0;
  }

  function parseCreatedAtValue(value, fallbackMs) {
    if (typeof value === "number" && Number.isFinite(value)) {
      if (value > 1e12) return Math.round(value);
      if (value > 1e9) return Math.round(value * 1000);
    }
    if (typeof value === "string" && value.trim()) {
      const ms = new Date(value).getTime();
      if (Number.isFinite(ms)) return ms;
    }
    return fallbackMs;
  }

  function guessCategoryName(candidate, type, contextText) {
    const source = String(candidate || "").trim();
    if (source) {
      const direct = state.categories.find(
        (c) => c.type === type && (c.name === source || c.name.includes(source) || source.includes(c.name))
      );
      if (direct) return direct.name;
    }

    const probe = `${source} ${String(contextText || "")}`.toLowerCase();
    let guessed = "其他";
    Object.keys(categoryKeywords).some((name) => {
      const isIncomeCategory = incomeCategories.has(name);
      if ((type === 1 && !isIncomeCategory) || (type === 0 && isIncomeCategory)) return false;
      if (categoryKeywords[name].some((k) => probe.includes(String(k).toLowerCase()))) {
        guessed = name;
        return true;
      }
      return false;
    });

    if (type === 1 && incomeCategories.has(guessed)) return guessed;
    if (type === 0 && !incomeCategories.has(guessed)) return guessed;
    return "其他";
  }

  function parseJsonLoose(content) {
    const cleaned = String(content).replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const candidates = [cleaned];
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (arrMatch) candidates.push(arrMatch[0]);
    if (objMatch) candidates.push(objMatch[0]);

    for (const fragment of candidates) {
      try {
        return JSON.parse(fragment);
      } catch (_e) {
        const relaxed = fragment
          .replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":')
          .replace(/:\s*'([^']*)'/g, (_m, value) => `: "${String(value).replace(/"/g, '\\"')}"`);
        try {
          return JSON.parse(relaxed);
        } catch (_e2) {
          // keep trying fallback fragments
        }
      }
    }
    throw new Error("Invalid AI JSON");
  }

  function normalizeTransactionsPayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.transactions)) return payload.transactions;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.records)) return payload.records;
    return [payload];
  }

  function buildTransactionsFromAiPayload(payload, rawInput, options = {}) {
    const list = normalizeTransactionsPayload(payload);
    const baseMs = Number(options.baseMs) || Date.now();
    const sourceTag = options.sourceTag ? String(options.sourceTag) : "";
    const normalizedRaw = sourceTag ? `${sourceTag} | ${rawInput}` : String(rawInput || "");

    const txs = [];
    list.forEach((item, index) => {
      if (!item || typeof item !== "object") return;
      const type = normalizeLlmType(item.type ?? item.direction ?? item.kind);
      const amountYuan = Number(item.amount ?? item.money ?? item.value);
      const amount = Math.round(amountYuan * 100);
      if (!Number.isFinite(amount) || amount <= 0) return;

      const noteText = String(item.remark ?? item.note ?? item.desc ?? "").trim();
      const categoryName = guessCategoryName(item.category ?? item.categoryName ?? "", type, `${noteText} ${rawInput}`);
      const createdAt = parseCreatedAtValue(item.createdAt ?? item.time ?? item.date, baseMs + index * 1000);

      txs.push({
        id: baseMs + index + Math.floor(Math.random() * 1000000),
        amount,
        type,
        categoryId: findCategoryIdByName(categoryName, type),
        note: noteText || null,
        rawInput: normalizedRaw || null,
        createdAt,
        updatedAt: Date.now()
      });
    });
    return txs;
  }

  function commitTransactions(transactions) {
    if (!Array.isArray(transactions) || !transactions.length) return 0;
    state.transactions.push(...transactions);
    state.transactions.sort((a, b) => b.createdAt - a.createdAt);
    persist();
    return transactions.length;
  }

  async function parseTransactionsByLlm(text, contextMeta = {}) {
    const provider = PREDEFINED_MODELS.find((m) => m.name === state.preferences.aiModelName) || PREDEFINED_MODELS[0];
    const systemPrompt =
      '你是专业的记账抽取引擎。你必须从输入中尽可能抽取多条收入/支出明细，同一句里多个金额必须拆成多条记录。只输出 JSON，不要 Markdown。输出格式固定为数组：[{"amount":123.45,"category":"餐饮","type":"expense","remark":"备注","createdAt":"2026-03-16T08:30:00+08:00"}]。可根据语义推断分类（如苹果/吃饭=>餐饮，买书=>购物，打车/公交=>交通）。若无法识别返回[]。';

    const contextLines = [
      contextMeta.sourceName ? `来源: ${contextMeta.sourceName}` : "",
      contextMeta.fileType ? `文件类型: ${contextMeta.fileType}` : "",
      contextMeta.lastModified ? `文件修改时间: ${new Date(contextMeta.lastModified).toLocaleString()}` : "",
      `当前时间: ${new Date().toLocaleString()}`
    ]
      .filter(Boolean)
      .join("\n");

    const content = await callChatApi(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${contextLines}\n\n待解析内容:\n${text}` }
      ],
      900,
      state.preferences.aiBaseUrl || provider.baseUrl,
      state.preferences.aiApiKey,
      provider.defaultModel
    );

    return parseJsonLoose(content);
  }

  async function readImportFileForAi(file) {
    const name = file?.name || "unknown";
    const type = file?.type || "application/octet-stream";
    const textExt = /\.(txt|csv|json|md|log|tsv|xml|html|yaml|yml)$/i;

    if ((type && type.startsWith("text/")) || textExt.test(name)) {
      const raw = await file.text();
      return raw.slice(0, 30000);
    }

    if (type.startsWith("image/")) {
      return `文件名: ${name}\n文件类型: ${type}\n提示: 这是图片文件，若没有文字内容可返回空数组。`;
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer.slice(0, 100000));
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    return `文件名: ${name}\n文件类型: ${type}\n文件大小: ${file.size}\n二进制片段(base64): ${base64.slice(0, 24000)}`;
  }

  async function openImportDialog() {
    if (state.ui.isProcessingInput) return;
    const picker = document.createElement("input");
    picker.type = "file";
    picker.multiple = true;
    picker.style.display = "none";
    picker.accept = ".txt,.csv,.json,.md,.log,.tsv,.xml,.html,.yaml,.yml,.xlsx,.xls,.pdf,.doc,.docx,image/*";

    picker.addEventListener("change", async () => {
      const files = Array.from(picker.files || []);
      picker.remove();
      if (!files.length) return;

      state.ui.isProcessingInput = true;
      render();
      showToast(`${t("importing")} (${files.length})`);

      let createdTotal = 0;
      try {
        for (const file of files) {
          const content = await readImportFileForAi(file);
          const payload = await parseTransactionsByLlm(content, {
            sourceName: file.name,
            fileType: file.type,
            lastModified: file.lastModified
          });
          const txs = buildTransactionsFromAiPayload(payload, content.slice(0, 500), {
            sourceTag: `导入:${file.name}`,
            baseMs: file.lastModified || Date.now()
          });
          createdTotal += commitTransactions(txs);
        }

        state.ui.isProcessingInput = false;
        render();
        if (createdTotal > 0) {
          const unit = state.preferences.language === "en" ? "items" : "条";
          showToast(`${t("importDone")} ${createdTotal} ${unit}`);
        } else {
          showToast(t("importEmpty"));
        }
      } catch (err) {
        state.ui.isProcessingInput = false;
        render();
        showToast(`${t("parseFail")}: ${err.message}`);
      }
    });

    document.body.appendChild(picker);
    picker.click();
  }

  async function submitQuickInput() {
    const inputEl = document.getElementById("quickInput");
    const text = ((inputEl?.value ?? state.ui.quickInputText) || "").trim();
    if (!text || state.ui.isProcessingInput) return;
    state.ui.quickInputText = text;

    state.ui.isProcessingInput = true;
    render();

    const local = parseLocalInput(text);
    const amountHints = countAmountHints(text);
    if (local && local.amountCents > 0 && amountHints <= 1) {
      const tx = {
        id: Date.now() + Math.floor(Math.random() * 999),
        amount: local.amountCents,
        type: local.type,
        categoryId: findCategoryIdByName(local.categoryName, local.type),
        note: local.note,
        rawInput: text,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      state.transactions.push(tx);
      state.transactions.sort((a, b) => b.createdAt - a.createdAt);
      persist();
      state.ui.quickInputText = "";
      state.ui.isProcessingInput = false;
      render();
      showToast(`${t("parsedOk")} ${local.categoryName} ¥${(local.amountCents / 100).toFixed(2)}`);
      return;
    }

    try {
      const payload = await parseTransactionsByLlm(text, { sourceName: "quick-input" });
      const txs = buildTransactionsFromAiPayload(payload, text, { sourceTag: "AI", baseMs: Date.now() });
      const created = commitTransactions(txs);
      if (!created) throw new Error(t("parseFail"));

      state.ui.quickInputText = "";
      state.ui.isProcessingInput = false;
      render();
      if (created > 1) {
        const unit = state.preferences.language === "en" ? "items" : "条";
        showToast(`${t("batchRecorded")} ${created} ${unit}`);
      } else {
        const tx = txs[0];
        showToast(`${t("parsedOk")} ${getCategoryNameById(tx.categoryId)} ¥${(tx.amount / 100).toFixed(2)}`);
      }
    } catch (err) {
      state.ui.isProcessingInput = false;
      render();
      showToast(`${t("parseFail")}: ${err.message}`);
    }
  }

  async function callChatApi(messages, maxTokens, baseUrl, apiKey, model) {
    const safeBase = String(baseUrl || "").trim().replace(/\/+$/, "");
    if (!safeBase) throw new Error("Base URL missing");
    if (!apiKey) throw new Error("API key missing");

    const resp = await fetch(`${safeBase}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "deepseek-chat",
        messages,
        temperature: 0.1,
        max_tokens: maxTokens || 256
      })
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${text.slice(0, 140)}`.trim());
    }

    const data = await resp.json();
    const msg = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!msg) throw new Error("Empty AI response");
    return msg;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function animateAiText(text) {
    state.summary.aiAdvice = "";
    render();
    const box = elements.summary.querySelector(".ai-box");
    if (!box) {
      state.summary.aiAdvice = text;
      return;
    }
    for (let i = 1; i <= text.length; i += 1) {
      box.textContent = text.slice(0, i);
      await sleep(10);
    }
    state.summary.aiAdvice = text;
  }

  async function requestAiAdvice() {
    if (state.summary.isAiLoading) return;
    state.summary.isAiLoading = true;
    state.summary.aiError = null;
    state.summary.aiAdvice = "";
    render();

    const s = computeSummaryState();
    const shares = state.summary.selectedTypeTab === "EXPENSE" ? s.expenseShares : s.incomeShares;
    const payload = {
      总支出: s.totalExpense,
      总收入: s.totalIncome,
      分类: shares.reduce((acc, item) => {
        acc[item.name] = item.amountYuan;
        return acc;
      }, {})
    };

    const provider = PREDEFINED_MODELS.find((m) => m.name === state.preferences.aiModelName) || PREDEFINED_MODELS[0];
    const systemPrompt = "你是一个冷静、专业的财务分析师。基于数据，100字内指出消费结构问题并给出一个可执行建议。";

    try {
      const content = await callChatApi(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(payload) }
        ],
        180,
        state.preferences.aiBaseUrl || provider.baseUrl,
        state.preferences.aiApiKey,
        provider.defaultModel
      );
      await animateAiText(content);
      state.summary.aiError = null;
    } catch (err) {
      const msg = String(err && err.message ? err.message : "");
      const normalized =
        /timeout|timed out/i.test(msg)
          ? (state.preferences.language === "en" ? "Network timeout" : "网络超时")
          : /api key/i.test(msg)
            ? (state.preferences.language === "en" ? "Please set API Key first" : "请先配置 API Key")
            : /Failed to fetch|network|ERR_/i.test(msg)
              ? (state.preferences.language === "en" ? "Network unavailable" : "网络不可用")
              : msg;
      state.summary.aiError = `${t("aiErrorPrefix")}: ${normalized}`;
    } finally {
      state.summary.isAiLoading = false;
      render();
    }
  }

  function deleteTransaction(id) {
    state.transactions = state.transactions.filter((tx) => tx.id !== id);
    persist();
    render();
    showToast(t("deleted"));
  }

  async function exportSummaryData() {
    const s = computeSummaryState();
    const isEn = state.preferences.language === "en";

    const periodText = {
      WEEK: isEn ? "Weekly" : "周",
      MONTH: isEn ? "Monthly" : "月",
      YEAR: isEn ? "Yearly" : "年",
      CUSTOM: isEn ? "Custom" : "自定义"
    }[state.summary.selectedPeriod];

    const lines = [];
    lines.push(isEn ? "Pickbank Financial Export" : "拾念记账 财务记录导出");
    let periodLine = periodText;
    if (state.summary.selectedPeriod === "CUSTOM") {
      const [start, end] = getTimeRange("CUSTOM");
      const a = new Date(start).toLocaleDateString();
      const b = new Date(end).toLocaleDateString();
      periodLine = `${periodText} (${a} ${isEn ? "to" : "至"} ${b})`;
    }
    lines.push(`${isEn ? "Period" : "统计区间"}: ${periodLine}`);
    lines.push(`${isEn ? "Generated" : "生成日期"}: ${new Date().toLocaleString()}`);
    lines.push("--------------------------------------------------");
    lines.push("");

    lines.push(`${isEn ? "Date" : "日期"} | ${isEn ? "Type" : "类型"} | ${isEn ? "Category" : "分类"} | ${isEn ? "Amount" : "金额(元)"} | ${isEn ? "Remark" : "备注"}`);
    lines.push("----------------------------------------------------------------------------------------------------");

    s.txs
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach((tx) => {
        lines.push(
          `${new Date(tx.createdAt).toLocaleString()} | ${tx.type === 1 ? t("income") : t("expense")} | ${getCategoryNameById(tx.categoryId)} | ${(tx.amount / 100).toFixed(2)} | ${
            tx.note || tx.rawInput || ""
          }`
        );
      });

    lines.push("----------------------------------------------------------------------------------------------------");
    lines.push(`${isEn ? "Total" : "总计"}: ${t("expense")} ¥${s.totalExpense.toFixed(2)} | ${t("income")} ¥${s.totalIncome.toFixed(2)}`);

    if (state.summary.aiAdvice) {
      lines.push("");
      lines.push(isEn ? "[ AI Financial Advisor Analysis ]" : "[ AI 财务顾问分析 ]");
      lines.push(state.summary.aiAdvice);
    }

    const text = lines.join("\n");
    const fileName = `Pickbank_${state.summary.selectedPeriod}_${Date.now()}.txt`;

    if (navigator.share) {
      try {
        await navigator.share({ title: fileName, text });
        return;
      } catch (_err) {
      }
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function render() {
    elements.appTitle.textContent = state.activeTab === "home" ? t("homeTitle") : t("summaryTitle");
    if (elements.titleSub) elements.titleSub.textContent = "";
    elements.navHome.innerHTML = `<span class="nav-icon">${ICONS.home}</span><span class="nav-label">${t("tabRecords")}</span>`;
    elements.navSummary.innerHTML = `<span class="nav-icon">${ICONS.summary}</span><span class="nav-label">${t("tabSummary")}</span>`;
    elements.navHome.classList.toggle("active", state.activeTab === "home");
    elements.navSummary.classList.toggle("active", state.activeTab === "summary");
    elements.home.classList.toggle("hidden", state.activeTab !== "home");
    elements.summary.classList.toggle("hidden", state.activeTab !== "summary");

    renderHeaderActions();
    renderHomeScreen();
    renderSummaryScreen();
    scheduleLayoutSync();
    dismissSplash(false);
    renderOnboarding();
  }

  function showInstallHintIfNeeded() {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    const isStandalone = isStandaloneApp();
    if (isIOS && !isStandalone) {
      elements.installHint.textContent = t("installHint");
      elements.installHint.classList.remove("hidden");
    }
  }

  function isStandaloneApp() {
    const byDisplayMode = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    return byDisplayMode || window.navigator.standalone === true;
  }

  function requestInstallPrompt() {
    if (isStandaloneApp()) return;

    if (deferredInstallPromptEvent) {
      const shouldInstall = window.confirm(t("installRequestConfirm"));
      if (!shouldInstall) return;
      const promptEvent = deferredInstallPromptEvent;
      deferredInstallPromptEvent = null;
      promptEvent.prompt();
      promptEvent.userChoice.catch(() => {});
      return;
    }

    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    window.alert(isIOS ? t("installHint") : t("installManualHint"));
  }

  function maybePromptInstallOnFirstVisit() {
    const alreadyShown = localStorage.getItem(INSTALL_PROMPT_SEEN_KEY) === "1";
    if (alreadyShown || isStandaloneApp()) return;
    localStorage.setItem(INSTALL_PROMPT_SEEN_KEY, "1");
    clearTimeout(installPromptTimer);
    installPromptTimer = setTimeout(() => {
      requestInstallPrompt();
    }, INSTALL_PROMPT_DELAY_MS);
  }

  function setupPwa() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPromptEvent = event;
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPromptEvent = null;
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  function bindGlobalEvents() {
    elements.navHome.addEventListener("click", () => {
      state.activeTab = "home";
      render();
    });

    elements.navSummary.addEventListener("click", () => {
      state.activeTab = "summary";
      render();
    });

    elements.overlay.addEventListener("click", closeAllModals);
    document.addEventListener("keydown", (ev) => {
      if (state.ui.onboardingOpen) {
        if (ev.key === "Escape") {
          finishOnboarding(true);
          return;
        }
        if (ev.key === "ArrowRight") {
          const maxStep = getOnboardingSteps().length - 1;
          state.ui.onboardingStep = Math.min(maxStep, state.ui.onboardingStep + 1);
          renderOnboarding();
          return;
        }
        if (ev.key === "ArrowLeft") {
          state.ui.onboardingStep = Math.max(0, state.ui.onboardingStep - 1);
          renderOnboarding();
          return;
        }
      }
      if (ev.key === "Escape") closeAllModals();
    });

    window.addEventListener("resize", () => {
      applyDisplayModeLayout();
      scheduleLayoutSync();
      if (state.activeTab === "home") {
        requestAnimationFrame(fitHomeBudgetCard);
      }
    });
    window.addEventListener(
      "scroll",
      () => {
        scheduleLayoutSync();
      },
      { passive: true }
    );

    window.addEventListener("load", () => {
      scheduleLayoutSync();
      dismissSplash(false);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleLayoutSync).catch(() => {});
    }
  }

  loadStore();
  applyTheme();
  applyDisplayModeLayout();
  setupSplashAnimation();
  bindGlobalEvents();
  showInstallHintIfNeeded();
  setupPwa();
  render();
  maybeStartOnboarding();
  maybePromptInstallOnFirstVisit();
})();

