/* ============================================================================
   data.js — 这是你唯一需要经常改的文件
   THIS IS THE ONLY FILE YOU NEED TO EDIT REGULARLY
   ----------------------------------------------------------------------------
   1. SITE   = 你的名字、WhatsApp、邮箱、社交链接
   2. PROJECTS = 你的作品，加一个新项目就复制一整块 { ... } 出来改
   ============================================================================ */

const SITE = {
  /* 显示在左上角的品牌缩写（1-3 个字母最好看） */
  monogram: "JH",

  /* 你的名字 / 工作室名字 */
  brand: "JH Studio",

  /* ⚠️ 必改：你的 WhatsApp 号码。格式 = 国码 + 号码，不要 +、不要空格、不要短横线
     例如 +60 12-345 6789  →  写成  "60123456789"                              */
  whatsapp: "60123456789",

  /* ⚠️ 必改：你的邮箱 */
  email: "hello@yourdomain.com",

  /* 社交链接。不想放就留空字符串 ""，按钮会自动隐藏 */
  xiaohongshu: "",          /* 小红书主页链接 */
  instagram: "",            /* Instagram 链接 */

  /* 从业年份，用来自动算「X 年经验」。不想显示就设成 0 */
  startYear: 2021,

  /* 客户点 WhatsApp 按钮时，自动帮他打好的第一句话 */
  waMessage: {
    zh: "你好 JH，我在你的作品集网站看到你的作品，想咨询做网站。",
    en: "Hi JH, I saw your portfolio site and I'd like to enquire about a website.",
    ms: "Hai JH, saya lihat portfolio anda dan ingin bertanya tentang pembinaan laman web."
  }
};

/* ----------------------------------------------------------------------------
   作品列表 PROJECTS
   ----------------------------------------------------------------------------
   slug     : 截图文件名（assets/screenshots/<slug>.jpg），也用作占位图名字
   name     : 客户 / 项目名称
   url      : 真实网站链接
   category : 分类，必须是下面其中一个：
              corporate | industrial | ecommerce | education | lifestyle
   reveal   : 这个项目用哪一种入场动画（见 MOTION.md 第 4 节）。
              十种现成的：cinematic | strips | soft | playful | paper
                          network | silk | assemble | blueprint | slab
              新客户直接挑一个现成的复用，真的需要新的 personality 才加第 11 种。
              ⚠️ 不要为每个项目写一套独立动画 —— 那会变成维护地狱。
   year     : 年份
   tags     : 这个项目你做了什么（三语，各 2-4 个）
   blurb    : 一句话介绍（三语）
   ⚠️ 下面的介绍文案是我按行业先写的草稿，你自己最清楚项目细节，记得改成真实情况。
---------------------------------------------------------------------------- */

const PROJECTS = [
  {
    slug: "luma-club",
    name: "The Luma Club",
    url: "https://thelumaclub.com",
    category: "lifestyle",
    reveal: "cinematic",
    year: "2026",
    tags: {
      zh: ["品牌官网", "视觉设计", "会员/预约"],
      en: ["Brand site", "Visual design", "Membership"],
      ms: ["Laman jenama", "Reka bentuk visual", "Keahlian"]
    },
    blurb: {
      zh: "\u26a0 这段是我猜写的，请改成真实情况 —— 会员制品牌的官方网站，重点在品牌调性与入会/预约路径。",
      en: "\u26a0 Placeholder copy, please rewrite — brand site for a membership club, focused on tone of voice and the path to joining or booking.",
      ms: "\u26a0 Teks sementara, sila tukar — laman jenama untuk kelab keahlian."
    }
  },
  {
    slug: "exa-energy",
    name: "EXA Energy Sdn. Bhd.",
    url: "https://www.exaenergy.asia/",
    category: "industrial",
    reveal: "strips",
    year: "2025",
    tags: {
      zh: ["企业官网", "服务展示", "询盘表单"],
      en: ["Corporate site", "Service pages", "Enquiry form"],
      ms: ["Laman korporat", "Halaman servis", "Borang pertanyaan"]
    },
    blurb: {
      zh: "马来西亚建筑、维修保养、人力供应与工业服务公司的企业官网。重点是把复杂的服务线整理清楚，让工程发包方一眼看懂能力范围。",
      en: "Corporate website for a Malaysian construction, maintenance, manpower supply and industrial services company — structured so contractors can grasp the full scope of capability at a glance.",
      ms: "Laman web korporat untuk syarikat pembinaan, penyelenggaraan, bekalan tenaga kerja dan perkhidmatan industri di Malaysia."
    }
  },
  {
    slug: "pnc-lifecare",
    name: "PNC Lifecare",
    url: "https://pnclifecare.com",
    category: "lifestyle",
    reveal: "soft",
    year: "2025",
    tags: {
      zh: ["品牌官网", "产品介绍", "移动优先"],
      en: ["Brand site", "Product pages", "Mobile-first"],
      ms: ["Laman jenama", "Halaman produk", "Mobile-first"]
    },
    blurb: {
      zh: "健康与护理品牌的官方网站，用干净、可信的视觉语言呈现产品线与品牌理念。",
      en: "Official site for a health & lifecare brand, presenting the product range and brand story in a clean, trustworthy visual language.",
      ms: "Laman rasmi untuk jenama kesihatan dan penjagaan, memaparkan produk dan kisah jenama dengan visual yang bersih."
    }
  },
  {
    slug: "furfoo-pet",
    name: "Furfoo Pet",
    url: "https://furfoopet.com",
    category: "ecommerce",
    reveal: "playful",
    year: "2024",
    tags: {
      zh: ["电商", "产品目录", "购物流程"],
      en: ["E-commerce", "Catalogue", "Checkout flow"],
      ms: ["E-dagang", "Katalog", "Proses beli"]
    },
    blurb: {
      zh: "宠物品牌的线上商店，产品分类与购买路径都为手机端优化，减少客户流失。",
      en: "Online store for a pet brand — categories and the path to purchase optimised for mobile to reduce drop-off.",
      ms: "Kedai dalam talian untuk jenama haiwan peliharaan, dioptimumkan untuk telefon bimbit."
    }
  },
  {
    slug: "yh-ideal-academy",
    name: "YH Ideal Academy",
    url: "https://yhidealacademy.com",
    category: "education",
    reveal: "paper",
    year: "2024",
    tags: {
      zh: ["课程展示", "报名表单", "多语内容"],
      en: ["Course pages", "Sign-up form", "Multilingual"],
      ms: ["Halaman kursus", "Borang daftar", "Pelbagai bahasa"]
    },
    blurb: {
      zh: "教育机构官网，把课程体系、师资与报名流程整合在一起，家长可以直接在线咨询。",
      en: "Website for an education academy bringing courses, teachers and enrolment into one flow so parents can enquire directly online.",
      ms: "Laman web akademi pendidikan yang menyatukan kursus, tenaga pengajar dan pendaftaran dalam satu aliran."
    }
  },
  {
    slug: "mitic-asian",
    name: "MITIC Asian",
    url: "https://miticasian.org/",
    category: "corporate",
    reveal: "network",
    year: "2024",
    tags: {
      zh: ["组织官网", "活动资讯", "会员入口"],
      en: ["Organisation site", "Events", "Member area"],
      ms: ["Laman organisasi", "Acara", "Ruang ahli"]
    },
    blurb: {
      zh: "组织机构的官方网站，负责对外形象、活动资讯发布与会员信息的呈现。",
      en: "Official website for an organisation, handling public presence, event announcements and member-facing information.",
      ms: "Laman web rasmi organisasi untuk imej awam, pengumuman acara dan maklumat ahli."
    }
  },
  {
    slug: "etaeta",
    name: "ETAETA",
    url: "https://etaeta.co",
    category: "lifestyle",
    reveal: "silk",
    year: "2024",
    tags: {
      zh: ["品牌落地页", "视觉设计", "转化优化"],
      en: ["Landing page", "Visual design", "Conversion"],
      ms: ["Landing page", "Reka bentuk visual", "Penukaran"]
    },
    blurb: {
      zh: "品牌落地页，用强视觉与清晰的行动指引，把广告流量转成实际咨询。",
      en: "Brand landing page using strong visuals and a single clear call to action to turn ad traffic into real enquiries.",
      ms: "Landing page jenama dengan visual kuat dan satu ajakan bertindak yang jelas."
    }
  },
  {
    slug: "ec-diy-hardware",
    name: "EC DIY Hardware",
    url: "https://ecdiyhardware.com.my",
    category: "ecommerce",
    reveal: "assemble",
    year: "2023",
    tags: {
      zh: ["产品目录", "五金 / DIY", "分类检索"],
      en: ["Product catalogue", "Hardware / DIY", "Category search"],
      ms: ["Katalog produk", "Perkakasan / DIY", "Carian kategori"]
    },
    blurb: {
      zh: "五金与 DIY 用品的线上目录，重点解决「品类多、找货难」的问题。",
      en: "Online catalogue for a hardware & DIY supplier, built around the real problem: a large SKU range that customers struggle to navigate.",
      ms: "Katalog dalam talian untuk pembekal perkakasan & DIY dengan navigasi produk yang mudah."
    }
  },
  {
    slug: "oem4u2day",
    name: "OEM4U2DAY",
    url: "https://oem4u2day.com",
    category: "corporate",
    reveal: "blueprint",
    year: "2023",
    tags: {
      zh: ["OEM 服务", "询价流程", "B2B"],
      en: ["OEM services", "Quotation flow", "B2B"],
      ms: ["Perkhidmatan OEM", "Proses sebut harga", "B2B"]
    },
    blurb: {
      zh: "OEM 代工服务的 B2B 网站，把生产能力、流程与最小起订量讲清楚，缩短询价来回。",
      en: "B2B site for an OEM manufacturing service — capability, process and MOQ laid out clearly to shorten the back-and-forth before a quote.",
      ms: "Laman B2B untuk perkhidmatan pembuatan OEM dengan proses dan MOQ yang jelas."
    }
  },
  {
    slug: "master-materials",
    name: "Master Materials",
    url: "https://www.mastermaterials.com.my",
    category: "industrial",
    reveal: "slab",
    year: "2023",
    tags: {
      zh: ["建材展示", "产品规格", "询盘"],
      en: ["Building materials", "Spec sheets", "Enquiry"],
      ms: ["Bahan binaan", "Spesifikasi", "Pertanyaan"]
    },
    blurb: {
      zh: "建材供应商官网，产品规格与应用场景并列呈现，方便承包商快速判断是否适用。",
      en: "Website for a building-materials supplier, pairing specifications with application scenarios so contractors can judge fit quickly.",
      ms: "Laman web pembekal bahan binaan yang memaparkan spesifikasi bersama contoh penggunaan."
    }
  }
];

/* ----------------------------------------------------------------------------
   个人档案 PROFILE —— PROFIL 那一屏的内容
   ⚠️ 下面全部是示例数据，请改成你自己的真实情况。
---------------------------------------------------------------------------- */

const PROFILE = {
  /* 你的照片：放一张到 assets/img/me.jpg 就会自动显示。
     没放的话会显示一个占位剪影，不会破图。
     建议：半身照、背景干净、竖构图（大概 800 x 1000）。 */
  photo: "assets/img/me.jpg",

  /* 你的名字（显示在 HELLO, I AM 下面） */
  name: "YUDHA / JH",

  /* 年龄，不想放就写 "" */
  age: "",

  /* 你常用的软件。code 是显示在图标里的缩写，最多 2-3 个字母。
     color 是那个图标的颜色。改成你实际在用的。 */
  software: [
    { code: "Fg", label: "Figma",      color: "#F24E1E" },
    { code: "Ps", label: "Photoshop",  color: "#31A8FF" },
    { code: "Ai", label: "Illustrator",color: "#FF9A00" },
    { code: "Wp", label: "WordPress",  color: "#21759B" },
    { code: "</>",label: "HTML / CSS", color: "#E44D26" },
    { code: "JS", label: "JavaScript", color: "#F7DF1E" }
  ],

  /* 教育背景（三语） */
  education: {
    zh: [{ years: "2019 - 2022", school: "（改成你的学校）", major: "（改成你的专业）" }],
    en: [{ years: "2019 - 2022", school: "(your school)",   major: "(your major)" }],
    ms: [{ years: "2019 - 2022", school: "(sekolah anda)",  major: "(jurusan anda)" }]
  },

  /* 经历 / 成绩（三语）—— 写数字最有说服力 */
  experience: {
    zh: ["自由接单网页设计师", "已交付 9 个上线网站", "服务过 5 个不同行业"],
    en: ["Freelance web designer", "9 websites delivered & live", "5 industries served"],
    ms: ["Pereka web bebas", "9 laman web telah dilancarkan", "5 industri berbeza"]
  },

  /* 语言能力。数字是百分比，会画成进度条。 */
  languages: [
    { name: { zh: "中文",   en: "Chinese", ms: "Cina" },    level: 100 },
    { name: { zh: "英文",   en: "English", ms: "Inggeris" },level: 85  },
    { name: { zh: "马来文", en: "Malay",   ms: "Melayu" },  level: 70  }
  ]
};
