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
   blurb    : 一句话介绍（三语）。卡片上和作品详情页都用这一段，只写一次。

   study    : 作品详情页（点卡片打开的那一页）的内容。
              subtitle  = 标题下面那行小字，一句话说清这是什么网站
              challenge = 挑战：客户来找你的时候，问题是什么
              work      = 我的工作：你实际做了什么
              result    = 成果 ⚠️ 必改，见下面
              services  = 服务范围标签，显示成小方块。英文大写，不用翻译。
                          可选：BRANDING / WEB DESIGN / DEVELOPMENT / MOBILE / SEO /
                                E-COMMERCE / CONTENT / UI DESIGN / MAINTENANCE /
                                MULTILINGUAL

   ⚠️ 关于 study.result（成果）——
   我不会帮你编造「预约量提升 182%」这种数字。放在作品集上就是对客户的承诺，
   编出来的数字一旦被追问，你会当场被问倒，那比没有数字伤害大得多。
   所以这一栏我全部留成了提示文字，请你自己填。填法建议：
     1. 有后台数据 → 写真实数字（「询盘从每月 3 个到 11 个」）
     2. 没有数据   → 引用客户原话（「客户说现在不用一条条发链接了」）
     3. 都没有     → 写你交付了什么（「7 天内上线，含 3 语言与手机版」）
   三种都比编造的百分比强。

   ⚠️ 其余 study 文案是我按行业先写的草稿。你最清楚项目细节，请逐个核对。
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
      zh: "⚠ 这段是我猜写的，请改成真实情况 —— 会员制品牌的官方网站，重点在品牌调性与入会/预约路径。",
      en: "⚠ Placeholder copy, please rewrite — brand site for a membership club, focused on tone of voice and the path to joining or booking.",
      ms: "⚠ Teks sementara, sila tukar — laman jenama untuk kelab keahlian."
    },
    study: {
      subtitle: {
        zh: "高端生活方式品牌官网",
        en: "Lifestyle membership brand site",
        ms: "Laman jenama gaya hidup premium"
      },
      challenge: {
        zh: "会员制品牌卖的是感觉，不是功能列表。难点在于：第一屏就要让人相信这是个够格的地方，同时不能让「怎么入会 / 怎么预约」被气氛淹没。",
        en: "A membership brand sells a feeling, not a feature list. The hard part: the first screen has to earn trust instantly, without the atmosphere burying the one thing that matters — how to join or book.",
        ms: "Jenama keahlian menjual rasa, bukan senarai fungsi. Cabarannya: skrin pertama perlu meyakinkan serta-merta, tanpa suasana menenggelamkan cara untuk menyertai atau menempah."
      },
      work: {
        zh: "定下整套视觉语言（留白、字体层级、图片调性），把预约入口固定在每一屏都碰得到的位置，手机端单独排版而不是缩小桌面版。",
        en: "Set the full visual language — whitespace, type hierarchy, image treatment — pinned the booking entry point within reach on every screen, and laid out mobile as its own design instead of a shrunken desktop.",
        ms: "Menetapkan bahasa visual penuh, meletakkan pintu tempahan dalam jangkauan pada setiap skrin, dan mereka bentuk versi telefon secara tersendiri."
      },
      result: {
        zh: "⚠ 请填真实成果。例如：上线后预约从每月 X 个变成 Y 个。没有后台数字就引用客户原话，或写你交付了什么（上线时间、语言数、手机版）。编造的百分比一被追问就会当场露馅。",
        en: "⚠ Fill in a real outcome. e.g. bookings went from X to Y a month. No analytics? Quote what the client actually said, or state what you delivered (launch time, languages, mobile). An invented percentage collapses the moment someone asks about it.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: tempahan meningkat dari X ke Y sebulan. Tiada angka? Petik kata pelanggan atau nyatakan apa yang anda hantar."
      },
      services: ["BRANDING", "WEB DESIGN", "DEVELOPMENT", "MOBILE", "SEO"]
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
      zh: ["三语官网", "询价路径", "项目案例"],
      en: ["Trilingual site", "Quotation flow", "Project reference"],
      ms: ["Laman tiga bahasa", "Aliran sebut harga", "Rujukan projek"]
    },
    blurb: {
      zh: "马来西亚工业与工程服务公司的三语官网 —— 工程支援、土木工程、工业清洁、人力供应四条服务线，全站围绕一个「索取报价」的动作来组织。",
      en: "Trilingual site for a Malaysian industrial and engineering services company — engineering support, civil works, industrial cleaning and manpower supply, with the whole site organised around one action: request a quotation.",
      ms: "Laman tiga bahasa untuk syarikat perkhidmatan industri dan kejuruteraan di Malaysia — sokongan kejuruteraan, kerja awam, pencucian industri dan bekalan tenaga kerja."
    },
    study: {
      subtitle: {
        zh: "三语工业与工程服务企业官网",
        en: "Trilingual industrial & engineering services site",
        ms: "Laman perkhidmatan industri & kejuruteraan (tiga bahasa)"
      },
      challenge: {
        zh: "一家公司同时做工程支援、土木工程、工业清洁、人力供应四条线，客户群还横跨英文、中文、马来文。服务线越多，网站越容易变成一堆看不完的清单 —— 发包方点进来三十秒内判断不出「你到底能不能接我这个工程」，就直接走了。",
        en: "One company running four service lines at once — engineering support, civil works, industrial cleaning, manpower supply — for a client base reading English, Chinese and Malay. The more service lines, the easier the site turns into an unreadable list, and a contractor who can't tell within thirty seconds whether you can take on their job simply leaves.",
        ms: "Satu syarikat menjalankan empat barisan servis serentak — sokongan kejuruteraan, kerja awam, pencucian industri, bekalan tenaga kerja — untuk pelanggan yang membaca dalam tiga bahasa. Kontraktor yang tidak dapat menilai keupayaan anda dalam tiga puluh saat akan terus keluar."
      },
      work: {
        zh: "全站做成 EN / 中文 / BM 三语。「索取报价」定成全站唯一的主动作，顶栏和首屏各放一次，其余按钮一律降成次要。首屏正下方压一条数据带（年资 / 项目数 / 工业客户 / 技术人员），把可信度放在人还没往下滚之前。案例另开一页 Project Reference，让发包方自己去看做过什么，不用业务再解释一遍。",
        en: "Built the whole site in three languages (EN / 中文 / BM). Made \"Request a Quotation\" the single primary action — once in the header, once in the hero — and demoted every other button to secondary. Put a credibility strip directly under the hero (years, projects, industrial clients, skilled staff) so the proof lands before anyone scrolls. Gave the case work its own Project Reference page, so a contractor can check the track record without sales walking them through it.",
        ms: "Membina keseluruhan laman dalam tiga bahasa (EN / 中文 / BM), menjadikan \"Request a Quotation\" satu-satunya tindakan utama, meletakkan jalur kredibiliti tepat di bawah hero, dan memberikan rujukan projek halaman tersendiri."
      },
      result: {
        zh: "⚠ 请填真实成果。工业类可写：询盘品质变好（对方一来就说清要哪一类服务）、业务不用再重复解释服务范围。 ⚠️ 注意：首屏那四个数字（10+ 年 / 30+ 项目 / 15+ 客户 / 80+ 技术人员）是 EXA 自己的资历，是网站上的内容，不是你做网站带来的结果，别搬到这一栏。",
        en: "⚠ Fill in a real outcome. For industrial work: enquiry quality improved — people now name the service line they need up front, so sales stops re-explaining scope. ⚠️ Note: the four figures in the hero (10+ years, 30+ projects, 15+ clients, 80+ staff) are EXA's own credentials — content on the site, not results your work produced. Don't move them into this field.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: kualiti pertanyaan meningkat kerana pelanggan sudah tahu servis yang diperlukan. ⚠️ Nota: empat angka di hero itu ialah kredensial EXA sendiri, bukan hasil kerja anda."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "MULTILINGUAL", "CONTENT", "SEO"]
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
    },
    study: {
      subtitle: {
        zh: "健康护理品牌官网",
        en: "Health & lifecare brand site",
        ms: "Laman jenama kesihatan & penjagaan"
      },
      challenge: {
        zh: "健康护理类产品，客户第一个反应是「这可信吗」。视觉一花就像卖保健品的广告页，太素又显得没人打理。要在「专业」和「亲切」之间找到不出错的位置。",
        en: "With health and care products the first reaction is always \"can I trust this?\" Too much decoration and it reads like a supplement ad; too plain and it looks abandoned. The job was finding the safe point between clinical and warm.",
        ms: "Untuk produk kesihatan, reaksi pertama sentiasa \"bolehkah dipercayai?\" Terlalu banyak hiasan nampak seperti iklan; terlalu ringkas nampak terbiar."
      },
      work: {
        zh: "用干净的排版和克制的配色建立可信感，产品页统一成同一个结构（用途 → 成分/规格 → 使用方式），手机优先排版，因为这类产品几乎全部在手机上被看到。",
        en: "Built trust through clean typography and a restrained palette, standardised every product page on one structure — what it's for, what's in it, how to use it — and designed mobile-first, because this category is browsed almost entirely on phones.",
        ms: "Membina kepercayaan melalui tipografi bersih dan palet terkawal, menyeragamkan struktur halaman produk, dan mereka bentuk mobile-first."
      },
      result: {
        zh: "⚠ 请填真实成果。例如：客户不用再逐个用 WhatsApp 解释产品规格 / 手机端跳出率下降。没有数据就写客户原话。",
        en: "⚠ Fill in a real outcome. e.g. the client stopped re-explaining product specs one by one over WhatsApp, or mobile bounce rate dropped. No data? Quote the client.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: pelanggan tidak perlu lagi menerangkan spesifikasi produk satu demi satu."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "MOBILE", "CONTENT"]
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
    },
    study: {
      subtitle: {
        zh: "宠物用品线上商店",
        en: "Pet supplies online store",
        ms: "Kedai dalam talian bekalan haiwan"
      },
      challenge: {
        zh: "宠物用品是冲动型消费，但买之前又会反复比较（体型、年龄、口味）。分类做不好，客人找不到适合自己宠物的那一款，就直接关掉了。",
        en: "Pet supplies are an impulse buy that people still compare carefully — size, age, flavour. Get the categories wrong and a customer who can't find the version that fits their own pet simply closes the tab.",
        ms: "Bekalan haiwan adalah pembelian spontan yang masih dibandingkan mengikut saiz, umur dan rasa. Kategori yang lemah menyebabkan pelanggan terus keluar."
      },
      work: {
        zh: "按「宠物是谁」而不是「产品是什么」重做分类，把加入购物车到结账压到最少步骤，全程按手机屏幕设计，按钮大小和拇指范围都对齐。",
        en: "Rebuilt the categories around who the pet is rather than what the product is, cut the add-to-cart-to-checkout path to the fewest possible steps, and designed the whole thing at phone size with tap targets sized for thumbs.",
        ms: "Membina semula kategori berdasarkan haiwan, memendekkan proses beli, dan mereka bentuk untuk saiz telefon dengan sasaran sentuh yang sesuai."
      },
      result: {
        zh: "⚠ 请填真实成果。电商是最容易拿到真数字的类型 —— 后台直接看得到：转化率、加购率、手机端订单占比。请翻一下后台再写。",
        en: "⚠ Fill in a real outcome. E-commerce is the easiest place to get real numbers — conversion rate, add-to-cart rate, share of mobile orders are all in the dashboard. Check it before writing this.",
        ms: "⚠ Sila isi keputusan sebenar. E-dagang paling mudah mendapat angka sebenar dari papan pemuka."
      },
      services: ["E-COMMERCE", "WEB DESIGN", "DEVELOPMENT", "MOBILE"]
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
    },
    study: {
      subtitle: {
        zh: "教育机构课程与报名网站",
        en: "Academy course & enrolment site",
        ms: "Laman kursus & pendaftaran akademi"
      },
      challenge: {
        zh: "做决定的是家长，上课的是孩子。家长要知道：教什么、谁教、多少钱、怎么报名。这四个问题以前散在传单、微信和电话里，家长每次都要重新问一遍。",
        en: "The parent decides, the child attends. Parents need four things: what's taught, who teaches it, what it costs, how to sign up. Those four answers used to be scattered across flyers, WeChat and phone calls, so every parent asked from scratch.",
        ms: "Ibu bapa membuat keputusan, anak yang hadir. Empat soalan — apa diajar, siapa mengajar, harga, cara mendaftar — sebelum ini bertaburan di pamflet dan panggilan."
      },
      work: {
        zh: "每个课程一页，四个问题按同一顺序回答完。师资单独一块建立信任。报名表单直接接到咨询，家长不用再另外打电话。三语内容，因为家长群本身就是多语的。",
        en: "One page per course, answering those four questions in the same order every time. A separate teachers block to build trust. The sign-up form feeds enquiries directly, so no follow-up phone call is needed — and all of it trilingual, because the parent base is.",
        ms: "Satu halaman untuk setiap kursus, menjawab empat soalan itu dalam susunan sama, blok tenaga pengajar berasingan, dan borang pendaftaran terus kepada pertanyaan."
      },
      result: {
        zh: "⚠ 请填真实成果。教育类可写：家长在线咨询数量、招生季省下的重复解释时间、或者「家长现在自己看完才来问价钱」。",
        en: "⚠ Fill in a real outcome. For education: number of online enquiries, time saved re-explaining during enrolment season, or simply that parents now read everything first and only call about price.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: bilangan pertanyaan dalam talian atau masa yang dijimatkan semasa musim pendaftaran."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "SEO"]
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
    },
    study: {
      subtitle: {
        zh: "组织机构官方网站",
        en: "Organisation official website",
        ms: "Laman web rasmi organisasi"
      },
      challenge: {
        zh: "一个网站要同时服务两种人：不认识这个组织的外人（要看公信力），和已经是会员的人（要看活动和通知）。这两种需求塞在同一个首页上，很容易互相干扰。",
        en: "One site serving two audiences at once: outsiders who don't know the organisation yet and are judging its credibility, and existing members who just want events and notices. Put both on one homepage and they get in each other's way.",
        ms: "Satu laman melayani dua kumpulan: orang luar yang menilai kredibiliti, dan ahli yang mencari acara dan notis."
      },
      work: {
        zh: "首页上半部分给外人（组织是谁、做什么、公信力），下半部分给会员（最新活动、通知入口）。活动资讯做成可以自己更新的结构，不用每次找我改。",
        en: "Gave the top of the homepage to outsiders — who the organisation is, what it does, why it's credible — and the lower half to members, with latest events and notice entry points. Events were built as a structure the team can update themselves rather than coming back to me each time.",
        ms: "Bahagian atas laman utama untuk orang luar, bahagian bawah untuk ahli, dengan acara dibina supaya pasukan boleh mengemas kini sendiri."
      },
      result: {
        zh: "⚠ 请填真实成果。组织类可写：活动报名变成线上、通知不用再靠群发、或者对外介绍时终于有一个正式链接可以发。",
        en: "⚠ Fill in a real outcome. For organisations: event sign-ups moved online, notices no longer depend on group broadcasts, or simply that there is finally one official link to send when introducing the organisation.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: pendaftaran acara kini dalam talian atau ada satu pautan rasmi untuk dikongsi."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "MAINTENANCE"]
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
    },
    study: {
      subtitle: {
        zh: "品牌落地页 · 广告流量转化",
        en: "Brand landing page for paid traffic",
        ms: "Landing page jenama untuk trafik iklan"
      },
      challenge: {
        zh: "落地页只有一个任务：把点广告进来的人变成咨询。多一个出口就多一个走掉的理由，所以要做的不是加内容，是拿掉内容。",
        en: "A landing page has exactly one job: turn ad clicks into enquiries. Every extra exit is another reason to leave — so the work here was removing things, not adding them.",
        ms: "Landing page ada satu tugas sahaja: menukar klik iklan kepada pertanyaan. Setiap pintu keluar tambahan adalah sebab untuk pergi."
      },
      work: {
        zh: "整页只留一个行动按钮，重复出现但始终是同一个。首屏就把「这是什么、为什么值得」讲完，下面全部是支撑证据。删掉导航栏，因为落地页不需要让人逛。",
        en: "Kept one call to action for the entire page — repeated, but always the same one. The first screen answers what this is and why it's worth it; everything below is supporting evidence. Removed the nav bar entirely, because a landing page isn't for browsing.",
        ms: "Satu ajakan bertindak untuk seluruh halaman, skrin pertama menjawab apa dan mengapa, dan bar navigasi dibuang sepenuhnya."
      },
      result: {
        zh: "⚠ 请填真实成果。落地页最该有数字：广告点击到咨询的转化率、每个咨询的成本。跑过广告就一定拿得到，请去后台看。",
        en: "⚠ Fill in a real outcome. Landing pages are where numbers matter most: click-to-enquiry conversion rate, cost per enquiry. If ads ran, this data exists — go and read it.",
        ms: "⚠ Sila isi keputusan sebenar. Landing page paling memerlukan angka: kadar penukaran dan kos setiap pertanyaan."
      },
      services: ["BRANDING", "UI DESIGN", "DEVELOPMENT", "MOBILE"]
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
    },
    study: {
      subtitle: {
        zh: "五金 DIY 产品目录网站",
        en: "Hardware & DIY product catalogue",
        ms: "Katalog produk perkakasan & DIY"
      },
      challenge: {
        zh: "五金行的真实问题不是网站好不好看，是品类太多。客人要的是一颗特定规格的螺丝，如果三层点下去还找不到，他就打电话了 —— 网站等于白做。",
        en: "The real problem in a hardware business isn't how the site looks, it's the sheer number of SKUs. A customer wants one specific screw size; if three clicks in they still haven't found it, they pick up the phone and the site might as well not exist.",
        ms: "Masalah sebenar kedai perkakasan bukan rupa laman, tetapi jumlah produk. Jika pelanggan tidak jumpa dalam tiga klik, mereka akan telefon."
      },
      work: {
        zh: "把分类树压到两层以内，每一层的名字用客人会说的词（不是供应商目录上的编号）。产品页固定放规格表，因为五金客人第一眼看的就是尺寸和材质。",
        en: "Flattened the category tree to two levels at most and named every level the way a customer would say it, not the way the supplier catalogue codes it. Every product page leads with a spec table, because size and material are the first things a hardware buyer looks for.",
        ms: "Memendekkan pokok kategori kepada dua peringkat dengan nama yang digunakan pelanggan, dan setiap halaman produk bermula dengan jadual spesifikasi."
      },
      result: {
        zh: "⚠ 请填真实成果。可写：客人打电话问「有没有这个」的次数减少、店里可以直接发产品页链接给客人。",
        en: "⚠ Fill in a real outcome. e.g. fewer \"do you carry this?\" phone calls, or the shop can now just send a product page link instead of describing items over the phone.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: panggilan \"ada tak barang ini?\" berkurangan."
      },
      services: ["E-COMMERCE", "WEB DESIGN", "DEVELOPMENT", "SEO"]
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
    },
    study: {
      subtitle: {
        zh: "OEM 代工 B2B 询价网站",
        en: "OEM manufacturing B2B site",
        ms: "Laman B2B pembuatan OEM"
      },
      challenge: {
        zh: "B2B 询价最耗时间的不是报价，是来回确认那几件事：能不能做、最小起订量多少、要多久。这些不写在网站上，每一个询盘都要重新解释一轮。",
        en: "The slow part of a B2B enquiry isn't the quote, it's the back-and-forth confirming the same few things: can you make it, what's the MOQ, how long does it take. If the site doesn't say, every single enquiry re-runs that conversation.",
        ms: "Bahagian paling lambat dalam pertanyaan B2B bukan sebut harga, tetapi mengulang soalan sama: boleh buat atau tidak, MOQ, dan tempoh masa."
      },
      work: {
        zh: "把生产能力、最小起订量、生产周期直接写在页面上，不藏在「联系我们了解详情」后面。流程做成一条清楚的步骤线，客户看完就知道自己在第几步、下一步要准备什么。",
        en: "Put capability, MOQ and lead time directly on the page instead of hiding them behind \"contact us for details\". Laid the process out as one clear step line, so a client can see which step they're at and what to prepare next.",
        ms: "Meletakkan keupayaan, MOQ dan tempoh masa terus di halaman, dengan proses sebagai satu barisan langkah yang jelas."
      },
      result: {
        zh: "⚠ 请填真实成果。B2B 最有说服力的是省下的来回次数：例如「以前平均 5 轮邮件才报得出价，现在 2 轮」。问一下客户就知道。",
        en: "⚠ Fill in a real outcome. For B2B the most convincing number is rounds saved: \"quotes used to take five email exchanges, now two.\" Just ask the client.",
        ms: "⚠ Sila isi keputusan sebenar. Untuk B2B, angka paling meyakinkan ialah pusingan e-mel yang dijimatkan."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "SEO"]
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
    },
    study: {
      subtitle: {
        zh: "建材供应商产品展示网站",
        en: "Building materials supplier site",
        ms: "Laman pembekal bahan binaan"
      },
      challenge: {
        zh: "承包商挑建材看两件事：规格对不对，和别人用在什么工程上。大部分建材网站只放规格表，看起来专业但帮不到判断 —— 因为规格看得懂，不代表知道适不适合自己这个项目。",
        en: "A contractor picking materials checks two things: do the specs match, and where has this actually been used. Most materials sites publish only the spec table — it looks professional but doesn't help the decision, because reading a spec isn't the same as knowing it fits your project.",
        ms: "Kontraktor menilai dua perkara: spesifikasi dan di mana bahan itu pernah digunakan. Banyak laman hanya menunjukkan jadual spesifikasi."
      },
      work: {
        zh: "规格表和应用场景并排放，同一屏看得完。每个产品配真实使用照片，不用素材图。询盘按钮跟着产品走，看到合适的当场就能问。",
        en: "Put the spec table and the application scenarios side by side, readable in one screen. Paired every product with real installation photography rather than stock imagery, and attached the enquiry button to the product itself so a contractor can ask the moment they find a fit.",
        ms: "Meletakkan jadual spesifikasi bersebelahan senario penggunaan, dengan foto pemasangan sebenar dan butang pertanyaan pada setiap produk."
      },
      result: {
        zh: "⚠ 请填真实成果。建材类可写：承包商询盘时已经知道要哪个规格、业务不用再重复寄规格表 PDF。",
        en: "⚠ Fill in a real outcome. For materials: contractors now name the spec they want when they enquire, and sales stops emailing the same spec-sheet PDF over and over.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: kontraktor sudah tahu spesifikasi yang dikehendaki semasa bertanya."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "MOBILE"]
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
