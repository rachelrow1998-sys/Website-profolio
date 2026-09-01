/* ============================================================================
   data.js — 这是你唯一需要经常改的文件
   THIS IS THE ONLY FILE YOU NEED TO EDIT REGULARLY
   ----------------------------------------------------------------------------
   1. SITE   = 你的名字、WhatsApp、邮箱、社交链接
   2. PROJECTS = 你的作品，加一个新项目就复制一整块 { ... } 出来改
   ============================================================================ */

const SITE = {
  /* 显示在左上角的品牌缩写（1-3 个字母最好看） */
  monogram: "WD",

  /* 你的名字 / 工作室名字 */
  brand: "Web Design & Development",

  /* ⚠️ 必改：你的 WhatsApp 号码。格式 = 国码 + 号码，不要 +、不要空格、不要短横线
     例如 +60 12-345 6789  →  写成  "60123456789"                              */
  whatsapp: "60173046796",

  /* ⚠️ 必改：你的邮箱 */
  email: "rachelrow1998@gmail.com",

  /* 社交链接。不想放就留空字符串 ""，按钮会自动隐藏 */
  xiaohongshu: "",          /* 小红书主页链接 */
  instagram: "",            /* Instagram 链接 */

  /* 从业年份，用来自动算「X 年经验」。不想显示就设成 0 */
  startYear: 2021,

  /* 客户点 WhatsApp 按钮时，自动帮他打好的第一句话 */
  waMessage: {
    zh: "你好 Rachel，我在你的作品集网站看到你的作品，想咨询做网站。",
    en: "Hi Rachel, I saw your portfolio site and I'd like to enquire about a website.",
    ms: "Hai Rachel, saya lihat portfolio anda dan ingin bertanya tentang pembinaan laman web."
  }
};

/* ----------------------------------------------------------------------------
   作品列表 PROJECTS
   ----------------------------------------------------------------------------
   slug     : 截图文件名（assets/screenshots/<slug>.jpg），也用作占位图名字
   name     : 客户 / 项目名称
   client   : （可选）客户短名。封面卡片小标签和底部客户条用这个，
              不写就退回 name。名字太长会把小标签撑爆，才需要填。
   url      : 真实网站链接
   category : 分类，必须是下面其中一个：
              corporate | industrial | ecommerce | education | lifestyle | system
              （system = 系统 / 工具，不是网站的那一类）
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
                                MULTILINGUAL / PRODUCT DESIGN / INVENTORY /
                                MULTI-CURRENCY

   ⚠️ 关于 study.result（成果）——
   我不会帮你编造「预约量提升 182%」这种数字。放在作品集上就是对客户的承诺，
   编出来的数字一旦被追问，你会当场被问倒，那比没有数字伤害大得多。
   所以这一栏我全部留成了提示文字，请你自己填。填法建议：
     1. 有后台数据 → 写真实数字（「询盘从每月 3 个到 11 个」）
     2. 没有数据   → 引用客户原话（「客户说现在不用一条条发链接了」）
     3. 都没有     → 写你交付了什么（「7 天内上线，含 3 语言与手机版」）
   三种都比编造的百分比强。

   ⚠️ 其余 study 文案是我按行业先写的草稿。你最清楚项目细节，请逐个核对。

   ── 两个可选字段（不写就是默认值）──
   live : false = 这个站已经下线了。卡片上会标「已下线」，
          详情页底部的「打开网站」也会自动变成不可点的说明，不会把客户
          送去一个域名停放页。死链比少一个作品更伤。
   mine : true  = 这是你自己的品牌 / 产品，不是客户委托的。
          卡片和详情页都会标出来。⚠️ 一定要标 —— 把自己的品牌
          混在客户作品里，被人发现一次，前面九个的可信度一起赔进去。
          而且老实标出来其实更强：「从 branding 到官网我一个人做完」
          是比多一个客户 logo 更完整的故事。
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
      zh: ["会员制俱乐部", "视觉与调性", "叙事式导航"],
      en: ["Members' club", "Tone of voice", "Narrative navigation"],
      ms: ["Kelab keahlian", "Nada jenama", "Navigasi naratif"]
    },
    blurb: {
      zh: "会员制俱乐部的官方网站。首屏不压标题、不放按钮，整屏交给建筑本身；导航从 Philosophy 开始，先讲理念再讲事实，入会是其中一项，不是一个追着你跑的按钮。",
      en: "Site for a members' club. The homepage gives its entire first screen to the building — no headline over it, no button — and the navigation opens with Philosophy before About, with joining as one item in it rather than a button chasing you down the page.",
      ms: "Laman untuk kelab keahlian. Skrin pertama diserahkan sepenuhnya kepada bangunan itu sendiri, dan navigasi bermula dengan Philosophy sebelum About."
    },
    study: {
      subtitle: {
        zh: "会员制生活方式俱乐部官网",
        en: "Membership lifestyle club site",
        ms: "Laman kelab gaya hidup keahlian"
      },
      challenge: {
        zh: "会员制俱乐部卖的是归属感，不是功能列表。首屏压一个「立即加入」的大按钮，会当场把调性拉低 —— 可是「怎么才能成为会员」又必须找得到。整个设计的分寸就在这两者中间。",
        en: "A members' club sells belonging, not a feature list. A Join Now button stamped across the hero cheapens it on sight — yet how a person actually becomes a member still has to be findable. The whole design sits in the gap between those two.",
        ms: "Kelab keahlian menjual rasa kekitaan, bukan senarai fungsi. Butang \"Sertai Sekarang\" di atas hero akan merendahkan nadanya serta-merta, tetapi cara menjadi ahli tetap perlu mudah dijumpai."
      },
      work: {
        zh: "首屏整屏交给一张建筑照片，不压标题、不压按钮 —— 这一类项目里，空间本身就是最强的提案，加字只会削弱它。导航顺序当叙事顺序排：Philosophy 放在 About 前面，先给理念再给事实。入会不做成悬浮按钮，而是导航里的 Membership 一项，和 Community 并排，让「加入」读起来像归属，不像结账。手机端单独排版，不是缩小桌面版。",
        en: "Gave the entire first screen to one photograph of the building — no headline, no button over it. In this category the space is the strongest pitch there is, and type laid on top only weakens it. Ordered the navigation as a narrative: Philosophy before About, ethos before facts. Kept joining out of a floating button and made it Membership in the nav, sitting beside Community, so joining reads as belonging rather than checkout. Mobile laid out as its own design, not a shrunken desktop.",
        ms: "Menyerahkan seluruh skrin pertama kepada satu gambar bangunan — tanpa tajuk, tanpa butang. Menyusun navigasi sebagai naratif (Philosophy sebelum About), dan menjadikan keahlian satu item dalam navigasi di sebelah Community, bukan butang terapung."
      },
      result: {
        zh: "⚠ 请填真实成果。会员制可写：上线后咨询入会的人数、或者客户终于不用再一个个私信解释「这是什么地方」。没有后台数字就引用客户原话，或写你交付了什么（上线时间、页数、手机版）。编造的百分比一被追问就会当场露馅。",
        en: "⚠ Fill in a real outcome. For a members' club: enquiries about joining after launch, or simply that the client stopped explaining \"what this place is\" one DM at a time. No analytics? Quote what the client actually said, or state what you delivered (launch time, pages, mobile). An invented percentage collapses the moment someone asks about it.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: pertanyaan keahlian selepas pelancaran, atau pelanggan tidak perlu lagi menerangkan \"tempat ini apa\" satu demi satu."
      },
      services: ["BRANDING", "WEB DESIGN", "DEVELOPMENT", "MOBILE", "SEO"]
    }
  },
  {
    slug: "exa-energy",
    name: "EXA Energy Sdn. Bhd.",
    client: "EXA Energy",
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
    name: "Pure & Cure LifeCareLab",
    client: "PNC Lifecare",
    url: "https://pnclifecare.com",
    category: "lifestyle",
    reveal: "soft",
    year: "2025",
    tags: {
      zh: ["疗程服务", "信任建立", "预防定位"],
      en: ["Therapy services", "Building trust", "Prevention positioning"],
      ms: ["Perkhidmatan terapi", "Membina kepercayaan", "Kedudukan pencegahan"]
    },
    blurb: {
      zh: "非侵入式健康预防疗程的官方网站。整站站在「预防重于治疗」这一个立场上，用柔和的粉调和衬线标题把「医疗」讲得不吓人。",
      en: "Site for a non-invasive health prevention practice. The whole thing stands on one position — prevention over cure — and uses a soft blush palette with serif headlines so that \"medical\" never reads as intimidating.",
      ms: "Laman untuk amalan pencegahan kesihatan tanpa pembedahan, berdiri di atas satu pendirian: pencegahan lebih baik daripada rawatan."
    },
    study: {
      subtitle: {
        zh: "健康预防疗程服务官网",
        en: "Health prevention therapy site",
        ms: "Laman perkhidmatan terapi pencegahan"
      },
      challenge: {
        zh: "卖「预防」比卖「治疗」难：人没病的时候不觉得需要你。而且健康类网站一花就像卖保健品的广告页，一素又像没人打理。要在「专业到可信」和「柔和到愿意点进来」之间，找到不出错的那个位置。",
        en: "Selling prevention is harder than selling treatment — nobody feels they need you while they are still well. And health sites tip easily: too decorated and it reads as a supplement ad, too plain and it looks abandoned. The work was finding the point that is clinical enough to trust and soft enough to approach.",
        ms: "Menjual pencegahan lebih sukar daripada menjual rawatan — orang tidak rasa memerlukan anda ketika masih sihat. Cabarannya ialah mencari titik yang cukup profesional untuk dipercayai dan cukup lembut untuk didekati."
      },
      work: {
        zh: "把整站的立场收成一句话放在首屏正中：Prevent, Protect, Thrive。配色走柔和粉调，标题用衬线体加一段暗红斜体强调，让医疗感降下来但不失专业。技术来源（日本与德国）写进首屏正文，那是这类服务最快建立信任的一句。首屏下面排一列不同年龄、不同族裔的人像，说明「这是给所有人的」——不用文字讲，看图就懂。",
        en: "Compressed the whole position into one line and put it dead centre of the first screen: Prevent, Protect, Thrive. Chose a soft blush palette with serif headlines and one dark-red italic for emphasis, so the medical edge comes down without losing authority. Put the technology origin — Japan and Germany — in the opening paragraph, because for this kind of service that is the fastest sentence to trust. Ran a row of portraits across ages and ethnicities under the fold: this is for everyone, shown rather than stated.",
        ms: "Memadatkan keseluruhan pendirian ke dalam satu baris di tengah skrin pertama, memilih palet merah jambu lembut dengan tajuk serif, meletakkan asal teknologi (Jepun dan Jerman) dalam perenggan pembuka, dan memaparkan potret pelbagai usia dan bangsa di bawahnya."
      },
      result: {
        zh: "⚠ 请填真实成果。这类服务可写：咨询的人一来就知道自己要哪个疗程、客户不用再从头解释「什么是非侵入式预防」。没有后台数据就引用客户原话。",
        en: "⚠ Fill in a real outcome. For this kind of practice: people now arrive already knowing which therapy they want, or the client stopped explaining \"what non-invasive prevention means\" from scratch every time. No analytics? Quote the client.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: pelanggan datang sudah tahu terapi yang dikehendaki. Tiada data? Petik kata pelanggan."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "MOBILE", "CONTENT"]
    }
  },
  {
    slug: "furfoo-pet",
    name: "Furfoo Pet",
    url: "https://furfoopet.com",
    category: "ecommerce",
    mine: true,                       /* 自有品牌，不是客户委托 */
    reveal: "playful",
    year: "2024",
    tags: {
      zh: ["品牌塑造", "手作产品", "俏皮语气"],
      en: ["Brand building", "Handmade range", "Playful voice"],
      ms: ["Pembinaan jenama", "Produk buatan tangan", "Nada ceria"]
    },
    blurb: {
      zh: "马来西亚手作宠物护理品牌的官网。小批量烘的零食、草本浴包、植物性洗毛精、喷雾和耳部护理，猫狗都做。主打「宠物是家人」这一层感情，先讲故事再讲产品。",
      en: "Site for a Malaysian handmade pet-care brand — small-batch baked treats, herbal bath sachets, botanical shampoos, sprays and ear care, for dogs and cats. Built on the idea that pets are family, so the story comes before the product.",
      ms: "Laman untuk jenama penjagaan haiwan buatan tangan dari Malaysia — snek panggang kelompok kecil, sachet mandian herba, syampu botani, semburan dan penjagaan telinga untuk anjing dan kucing."
    },
    study: {
      subtitle: {
        zh: "手作宠物用品品牌官网",
        en: "Handmade pet-care brand site",
        ms: "Laman jenama penjagaan haiwan buatan tangan"
      },
      challenge: {
        zh: "手作宠物用品最大的对手不是别家品牌，是货架上便宜一半的量产货。光比价永远输 —— 而且这类产品是要吃进肚子、抹在皮肤上的，客人不放心就不会买。所以网站要先解决「这是谁做的、用什么做的」，感情和安全感都建立起来了，价格才不再是唯一的标准。",
        en: "A handmade pet brand's real competitor is not another brand, it is the mass-produced product at half the price on the shelf. On price alone you lose every time — and this is food going into an animal and lotion going onto its skin, so an owner who isn't reassured simply doesn't buy. The site has to answer who made this and what is in it first; once both the feeling and the safety land, price stops being the only measure.",
        ms: "Pesaing sebenar jenama buatan tangan ialah produk pukal separuh harga. Ini juga produk yang dimakan dan disapu pada haiwan, jadi laman ini perlu menjawab siapa yang membuatnya dan apa kandungannya terlebih dahulu."
      },
      work: {
        zh: "先定语气：整站用暖奶油底配一个红，标题走圆润的字形，猫狗照片上加对话气泡（「…MEOW.（翻译：hi.）」「WOOF~（翻译：Hello, hooman.）」）—— 这一处玩心是刻意的，宠物品牌最忌讳板着脸。首屏两个按钮并排、地位相同：「Discover Our Story」和「Explore Our Creations」，先认人再看货。产品统一叫 Creations 不叫 Products，是因为它们真的是手作的。",
        en: "Set the voice first: warm cream ground with a single red, rounded display type, and speech bubbles over the cat-and-dog photograph (\"...MEOW. (Translation: hi.)\" / \"WOOF~ (Translation: Hello, hooman.)\"). That bit of play is deliberate — a straight face is the one thing a pet brand cannot afford. Gave the hero two buttons of equal weight, Discover Our Story beside Explore Our Creations: meet the maker, then see the goods. Called them Creations rather than Products throughout, because they genuinely are handmade.",
        ms: "Menetapkan nada dahulu: latar krim hangat dengan satu warna merah, tipografi bulat, dan gelembung dialog di atas foto kucing dan anjing. Dua butang seimbang di hero: kenali kisahnya dahulu, kemudian lihat produknya."
      },
      result: {
        zh: "⚠ 请填真实成果。这是你自己的品牌，后台数字你手上就有，不用等谁给 —— 上线后的订单量、回头客比例、私信转订单的比例，挑一个真实的写。这一条应该是十个里最容易填的。",
        en: "⚠ Fill in a real outcome. This is your own brand, so the numbers are already in your hands rather than a client's — orders since launch, repeat-customer share, how many DMs turn into orders. Pick one that is true. This should be the easiest of the ten to fill in.",
        ms: "⚠ Sila isi keputusan sebenar. Ini jenama anda sendiri, jadi angkanya ada pada anda — pesanan sejak pelancaran, kadar pelanggan berulang, atau kadar mesej yang menjadi pesanan."
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
      zh: ["个人教学品牌", "线上课平台", "购课与账户"],
      en: ["Personal teaching brand", "Online course platform", "Accounts & checkout"],
      ms: ["Jenama pengajaran peribadi", "Platform kursus dalam talian", "Akaun & pembayaran"]
    },
    blurb: {
      zh: "「赵老师历史讲堂」的线上课平台 —— 专攻 SPM 历史（SEJARAH）的华文补习品牌，学生可以直接注册账户、选课、下单，不用再私信问价。",
      en: "Online course platform for 赵老师历史讲堂 (Teacher Zhao's History Classroom), a Chinese-medium tutoring brand focused on SPM SEJARAH. Students register an account, pick a course and check out, instead of asking the price by private message.",
      ms: "Platform kursus dalam talian untuk jenama tuisyen SPM Sejarah dalam bahasa Cina — pelajar mendaftar akaun, memilih kursus dan membayar terus."
    },
    study: {
      subtitle: {
        zh: "SPM 历史线上课平台",
        en: "SPM history online course platform",
        ms: "Platform kursus Sejarah SPM dalam talian"
      },
      challenge: {
        zh: "补习老师的招生几乎全靠私信：多少钱、教什么、怎么上课，同样的问题一天答十遍，还常常在这一来一回里流失掉。而且卖的是一个人的教学能力，网站得同时做到两件互相拉扯的事 —— 显得够专业，又不能把「老师本人」做没了。",
        en: "A tutor's enrolment runs almost entirely through private messages: what it costs, what is covered, how classes work — the same questions answered ten times a day, with students lost in the back-and-forth. And what is being sold is one person's teaching, so the site has to do two things that pull against each other: look professional enough to pay for, without designing the teacher out of it.",
        ms: "Pendaftaran tuisyen hampir semuanya melalui mesej peribadi — soalan yang sama dijawab sepuluh kali sehari. Lamannya perlu kelihatan profesional tanpa menghilangkan guru itu sendiri."
      },
      work: {
        zh: "把老师本人做成品牌：卡通头像加「赵老师历史讲堂」直接当站标，一眼就知道跟谁上课。首屏标题用三段式打卖点 ——「系统教学｜独家笔记｜核心考点」，再一句「三步搞懂 SEJARAH，轻松拿下高分!」，说的是学生真正在意的结果，不是课程大纲。接上购物车、账户和通知，让选课下单在站内走完，把私信问价那一段砍掉；同时右下角保留 WhatsApp 浮标，还想问人的随时能问。全站中文，因为这个补习市场本来就是华文的 —— 硬做三语只会稀释语气。",
        en: "Made the teacher the brand: a cartoon avatar beside 赵老师历史讲堂 as the site mark, so you know immediately whose class this is. Built the headline as three claims — systematic teaching, exclusive notes, core exam points — then one line promising what students actually care about: understand SEJARAH in three steps and score well. Not a syllabus. Added cart, accounts and notifications so choosing and paying for a course finishes on the site, cutting out the price-by-DM stage, while keeping a WhatsApp float in the corner for anyone who still wants a human. Chinese throughout, because this tutoring market is Chinese-medium — forcing three languages would only dilute the voice.",
        ms: "Menjadikan guru itu sendiri sebagai jenama, membina tajuk sebagai tiga tuntutan dan satu janji keputusan, serta menambah troli, akaun dan notifikasi supaya pendaftaran selesai di dalam laman — dengan butang WhatsApp kekal di sudut."
      },
      result: {
        zh: "⚠ 请填真实成果。这个站有账户和购物车，后台一定拿得到数字：注册人数、线上完成购课的比例、招生季省下的重复回复时间。请翻后台再写，这一类最容易拿到真数据。",
        en: "⚠ Fill in a real outcome. This site has accounts and a cart, so the numbers exist: registrations, share of course purchases completed online, hours saved not re-answering the same questions during enrolment season. Check the dashboard — this is one of the easier ones to get real data for.",
        ms: "⚠ Sila isi keputusan sebenar. Laman ini ada akaun dan troli, jadi angkanya wujud: pendaftaran, kadar pembelian dalam talian, masa yang dijimatkan."
      },
      services: ["BRANDING", "WEB DESIGN", "DEVELOPMENT", "E-COMMERCE", "CONTENT"]
    }
  },
  {
    slug: "mitic-asian",
    name: "MITIC Asian",
    url: "https://miticasian.org/",  /* 域名已过期，url 留着备查，靠 live:false 断掉链接 */
    live: false,
    category: "corporate",
    reveal: "network",
    year: "2024",
    tags: {
      zh: ["商会官网", "中文受众", "公信力呈现"],
      en: ["Chamber website", "Chinese-speaking audience", "Institutional credibility"],
      ms: ["Laman dewan perniagaan", "Audiens berbahasa Cina", "Kredibiliti institusi"]
    },
    blurb: {
      zh: "马来西亚国际贸易投资商会（MITIC）的中文官网。商会 2014 年成立，做中马双边经贸对接，帮中国企业进马来西亚市场 —— 注册合规、市场准入、投融资对接、法税顾问。",
      en: "Chinese-language site for MITIC, the Malaysia International Trade and Investment Chamber. Founded in 2014, the chamber works on China–Malaysia trade and helps Chinese companies enter the Malaysian market: registration and compliance, market entry, investment matching, legal and tax advisory.",
      ms: "Laman web berbahasa Cina untuk MITIC, Dewan Perniagaan Perdagangan dan Pelaburan Antarabangsa Malaysia, yang membantu syarikat China memasuki pasaran Malaysia."
    },
    study: {
      subtitle: {
        zh: "中马贸易商会中文官网",
        en: "China–Malaysia trade chamber site",
        ms: "Laman dewan perniagaan perdagangan China–Malaysia"
      },
      challenge: {
        zh: "读者是准备把钱和公司搬进另一个国家的中国企业主 —— 决定金额大、风险高、而且人在国外，只能靠这个网站判断这家商会到底靠不靠谱。所以整站要解决的是公信力：一个看起来随便做的网站，会让人怀疑背后的机构也是随便的。同时它还要同时服务两种人：还在观望的外人，和已经入会、只想看活动通知的会员。",
        en: "The reader is a Chinese business owner about to move money and a company into another country — a large decision, taken at a distance, with this website as one of the few things available to judge whether the chamber is real. So the whole job is credibility: a site that looks thrown together makes people wonder whether the institution behind it is too. It also has to serve two audiences at once — outsiders still deciding, and members who only want the event notices.",
        ms: "Pembacanya ialah pemilik perniagaan China yang bakal memindahkan modal dan syarikat ke negara lain. Tugas utamanya ialah kredibiliti, sambil melayani dua kumpulan: orang luar yang masih menimbang dan ahli yang mahukan notis acara."
      },
      work: {
        zh: "⚠ 这一段请你自己补 —— 这个站已经下线，我没办法看到你当时做的版面，不想凭空替你写。可以写的方向：首页怎么分给「外人」和「会员」两种读者、公信力靠什么呈现（理事名单、合作单位、活动照片）、活动资讯有没有做成客户能自己更新的结构、全站中文是怎么定下来的。",
        en: "⚠ Please fill this in yourself — the site is offline and I cannot see the layout you actually built, so I am not going to invent it. Directions worth covering: how the homepage was divided between outsiders and members, what carried the credibility (council listing, partner organisations, event photography), whether events were built so the chamber could update them without you, and how the decision to run the site in Chinese was reached.",
        ms: "⚠ Sila isi bahagian ini sendiri — laman ini sudah tidak dalam talian dan saya tidak dapat melihat reka bentuk sebenar anda."
      },
      result: {
        zh: "⚠ 请填真实成果。组织类可写：活动报名变成线上、通知不用再靠群发、或者对外介绍时终于有一个正式链接可以发。\n           ⚠️ 另外：这个站现在是下线状态，卡片上已经标了「已下线」。如果它其实只是换了域名，把新地址给我，我改回可点的。",
        en: "⚠ Fill in a real outcome. For organisations: sign-ups moved online, notices no longer sent by group broadcast, or simply having one official link to send. ⚠️ Note: this site is currently offline and the card says so. If it only moved to a new domain, send me the address and I will make it clickable again.",
        ms: "⚠ Sila isi keputusan sebenar. ⚠️ Nota: laman ini kini tidak aktif dan kad menunjukkannya. Jika ia hanya bertukar domain, beri saya alamat baharu."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "MAINTENANCE"]
    }
  },
  {
    slug: "etaeta",
    name: "ÉTÀ",
    url: "https://etaeta.co",
    category: "ecommerce",
    reveal: "silk",
    year: "2024",
    tags: {
      zh: ["品牌电商", "会员与结账", "认证展示"],
      en: ["Brand e-commerce", "Accounts & checkout", "Certification"],
      ms: ["E-dagang jenama", "Akaun & pembayaran", "Pensijilan"]
    },
    blurb: {
      zh: "多语言品牌电商站。首屏整屏一张航拍海滩，只压一个纤细的 ÉTÀ 字标；下面接的是完整的商城 —— 商品、会员账户、购物车结账，还有独立一页放产品认证。",
      en: "Multilingual brand e-commerce site. The first screen is one aerial photograph of a beach with nothing on it but a thin ÉTÀ wordmark; underneath sits a full store — products, member accounts, cart and checkout, plus a page of its own for product certification.",
      ms: "Laman e-dagang jenama berbilang bahasa. Skrin pertama hanya satu foto udara pantai dengan tanda kata ÉTÀ; di bawahnya kedai penuh — produk, akaun ahli, troli dan pembayaran, serta halaman pensijilan tersendiri."
    },
    study: {
      subtitle: {
        zh: "多语言品牌电商站",
        en: "Multilingual brand e-commerce store",
        ms: "Kedai e-dagang jenama berbilang bahasa"
      },
      challenge: {
        zh: "这类品牌的两难：调性要够高，才卖得起价；但电商需要的东西（购物车、注册登录、运费规则、认证文件）每一样都在往下拉调性。堆上去像杂货店，藏起来客人不敢下单 —— 尤其是入口的产品，没看到认证就不会掏钱。",
        en: "The bind with a brand like this: the tone has to sit high enough to justify the price, yet everything e-commerce needs — cart, login, shipping rules, certification documents — pulls that tone straight back down. Pile it on and it reads as a general store; hide it and nobody buys, least of all for a product that goes in your body, where an unseen certificate means an abandoned cart.",
        ms: "Dilemanya: nada jenama perlu tinggi untuk menyokong harga, tetapi setiap keperluan e-dagang — troli, log masuk, kos penghantaran, sijil — menariknya ke bawah. Terlalu banyak nampak seperti kedai runcit; disembunyikan pula tiada siapa berani membeli."
      },
      work: {
        zh: "把调性和功能分层：首屏什么都不放，一张航拍海滩加一个纤细字标，先让人认这个牌子；商城的那一整套压在下面，需要的时候才出现。「CERTIFICATION」提到主导航当独立一项 —— 这类产品认证是下单前的硬门槛，藏在页脚或 FAQ 里等于没有。满额免运费（西马 RM200 / 东马 RM300）做成顶部可关闭的横条，是拉高客单价最省事的一招，看完能关掉，不占版面。多语言 + 会员账户 + 购物车全站打通，右下角留 WhatsApp，愿意直接问人的不用注册。",
        en: "Separated tone from function. The first screen carries nothing but an aerial beach photograph and a thin wordmark — recognise the brand first; the whole store sits below, surfacing only when wanted. Promoted CERTIFICATION to its own top-level nav item, because for this kind of product a certificate is a hard gate before purchase and burying it in the footer or an FAQ is the same as not having it. Put the free-shipping threshold (RM200 West Malaysia, RM300 East) in a dismissible top bar — the cheapest lever there is on average order value, and it closes once read. Multilingual, member accounts and cart wired through the whole site, with a WhatsApp float in the corner so anyone who would rather just ask a person doesn't have to register.",
        ms: "Memisahkan nada daripada fungsi: skrin pertama hanya foto pantai dan tanda kata, kedai penuh di bawahnya. Menaikkan CERTIFICATION ke navigasi utama kerana sijil ialah penghalang sebelum pembelian, dan meletakkan ambang penghantaran percuma di bar atas yang boleh ditutup."
      },
      result: {
        zh: "⚠ 请填真实成果。这个站有购物车和会员系统，后台一定有数字：转化率、客单价（尤其是免运费门槛设了之后有没有拉起来）、注册会员数、回头客比例。这是十个项目里最容易拿到硬数据的一个，请翻后台再写。",
        en: "⚠ Fill in a real outcome. This site has a cart and a member system, so the numbers are there: conversion rate, average order value (particularly whether the free-shipping threshold lifted it), registrations, repeat-purchase share. Of these ten projects this is the easiest one to get hard data for — check the dashboard before writing.",
        ms: "⚠ Sila isi keputusan sebenar. Laman ini ada troli dan sistem ahli, jadi angkanya wujud: kadar penukaran, nilai pesanan purata, pendaftaran ahli, kadar pembelian berulang."
      },
      services: ["BRANDING", "E-COMMERCE", "DEVELOPMENT", "MULTILINGUAL", "UI DESIGN"]
    }
  },
  {
    slug: "ec-diy-hardware",
    name: "EC DIY Hardware",
    url: "https://ecdiyhardware.com.my",
    category: "industrial",
    reveal: "assemble",
    year: "2023",
    tags: {
      zh: ["单页官网", "实体店门面", "WhatsApp 询问"],
      en: ["One-page site", "Shopfront online", "WhatsApp enquiry"],
      ms: ["Laman satu halaman", "Kedai dalam talian", "Pertanyaan WhatsApp"]
    },
    blurb: {
      zh: "Taman Keramat Permai 一间五金店的单页官网。做电工与金属五金，开了五年，客人从 DIY 玩家到承包商都有。整站一页看完，问价直接走 WhatsApp。",
      en: "One-page site for a hardware store in Taman Keramat Permai — electrical and metal hardware, five years in business, serving everyone from weekend DIYers to working contractors. The whole thing reads in one page, and questions go straight to WhatsApp.",
      ms: "Laman satu halaman untuk kedai perkakasan di Taman Keramat Permai — perkakasan elektrik dan logam, lima tahun beroperasi, melayani peminat DIY sehingga kontraktor."
    },
    study: {
      subtitle: {
        zh: "五金店单页官网",
        en: "Hardware store one-page site",
        ms: "Laman satu halaman kedai perkakasan"
      },
      challenge: {
        zh: "街边五金店真正需要的不是一个商城 —— 客人本来就打算到店里拿货，或者一句 WhatsApp 问「有没有」。真正的问题是「网上根本查不到这家店」，以及同名店太多，客人不确定找的是不是同一家。所以这个站要解决的是「被找到」和「认对人」，不是「在线卖货」。",
        en: "What a neighbourhood hardware shop actually needs is not a storefront — customers were always going to walk in, or send one WhatsApp asking whether something is in stock. The real problems are that the shop is invisible online, and that similarly named shops leave customers unsure they have found the right one. So this site had to solve being found and being identified, not selling online.",
        ms: "Yang diperlukan kedai perkakasan kejiranan bukan kedai dalam talian — pelanggan tetap akan datang atau bertanya melalui WhatsApp. Masalah sebenarnya ialah kedai itu tidak dijumpai dalam talian, dan nama yang serupa membuat pelanggan tidak pasti."
      },
      work: {
        zh: "做成单页 —— 导航只留一个「Home」。这家店没有那么多内容要分页，硬撑出五个页面只会让每一页都很空。首屏标题正上方压一枚「THE ONLY BRANCH」的胶囊标，这是客户自己最在意的一句：只此一家，别认错。地点（Taman Keramat Permai）、开店年数、服务对象（DIY 玩家与承包商）全部写进首屏那一段，因为这三样正是客人打电话之前想确认的。问价不做表单，直接一个 WhatsApp 浮标 —— 五金店本来就是这样做生意的，逼客人填表单只会少一个客人。",
        en: "Built it as a single page — the nav has one item, Home. This shop does not have five pages of content, and forcing five would only leave each of them empty. Put a THE ONLY BRANCH pill directly above the headline, because that is the line the client cares about most: one shop, don't confuse us with anyone else. Wrote the location, the years in business and who it serves — DIYers and contractors both — into the opening paragraph, since those are exactly the three things someone checks before calling. No enquiry form; a WhatsApp float instead, because that is already how a hardware shop does business, and a form would only cost it customers.",
        ms: "Dibina sebagai satu halaman sahaja. Meletakkan lencana THE ONLY BRANCH tepat di atas tajuk, menulis lokasi, tahun beroperasi dan pelanggan sasaran dalam perenggan pembuka, dan menggunakan WhatsApp terapung dan bukannya borang pertanyaan."
      },
      result: {
        zh: "⚠ 请填真实成果。这类店可写：Google 上搜店名能找到了、新客人说是网上看到才来的、WhatsApp 询问量变化。没有数字就写客户原话 —— 街边店最真实的成果往往就是一句「现在有人是看了网站才找来的」。",
        en: "⚠ Fill in a real outcome. For a shop like this: the name now comes up in a Google search, new customers say they found it online, or a change in WhatsApp enquiries. No numbers? Quote the owner — for a neighbourhood shop the truest result is often just \"people come in now because they saw the website\".",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: nama kedai kini muncul dalam carian Google, atau pelanggan baharu berkata mereka menjumpainya dalam talian."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "SEO"]
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
      zh: ["保健品代工", "合作方背书", "FAQ 前置"],
      en: ["Supplement OEM", "Partner proof", "FAQ up front"],
      ms: ["OEM suplemen", "Bukti rakan kongsi", "FAQ di hadapan"]
    },
    blurb: {
      zh: "保健品 OEM 代工的 B2B 网站。首屏一句「What You Imagine, We Can Make It Happen」压在生产线实拍上，把「你有想法，我有产线」这件事一句话讲完。",
      en: "B2B site for a health supplement OEM manufacturer. One line over a real production-line photograph — \"What You Imagine, We Can Make It Happen\" — says the whole proposition: you bring the idea, they own the line.",
      ms: "Laman B2B untuk pengeluar OEM suplemen kesihatan, dengan satu baris di atas foto barisan pengeluaran sebenar."
    },
    study: {
      subtitle: {
        zh: "保健品 OEM 代工 B2B 网站",
        en: "Health supplement OEM B2B site",
        ms: "Laman B2B OEM suplemen kesihatan"
      },
      challenge: {
        zh: "找代工厂的人是要把自己的品牌交到你手上 —— 保健品还要吃进消费者肚子里，出事是他背。所以他真正在问的不是价格，是「你靠不靠得住」。同时那几个老问题（能不能做、起订量多少、要多久）不写清楚，每一个询盘都要重新解释一轮，业务一天答十遍。",
        en: "Someone shopping for a contract manufacturer is handing over their own brand — and with supplements it ends up inside a consumer, with the liability landing on them. So what they are really asking is not the price, it is whether you can be trusted. Meanwhile the same few questions — can you make it, what is the MOQ, how long does it take — get re-explained on every single enquiry if the site does not answer them.",
        ms: "Orang yang mencari pengeluar kontrak menyerahkan jenama mereka sendiri, dan untuk suplemen tanggungjawabnya jatuh kepada mereka. Soalan sebenar bukan harga, tetapi sama ada anda boleh dipercayai."
      },
      work: {
        zh: "把「信任」和「效率」拆成两个主导航一级项：Collaboration Partners 放合作过的品牌 —— B2B 里最有力的从来不是自夸，是「还有谁把品牌交给过你」；FAQ 单独一页，把能不能做、起订量、周期这些一天问十遍的问题一次答完，业务不用再重复。首屏两个按钮地位相同：Products 给已经知道要什么的，Contact Us 给还想先聊的。背景用生产线实拍不用素材图 —— 代工厂卖的就是产线本身，用图库照片等于自己承认没有。",
        en: "Split trust and efficiency into two top-level nav items. Collaboration Partners carries the brands already worked with, because in B2B the strongest thing is never self-description, it is who else has handed you their brand. FAQ gets a page of its own, answering can-you-make-it, MOQ and lead time once so sales stops answering them ten times a day. The hero runs two buttons of equal weight: Products for someone who already knows what they want, Contact Us for someone who wants to talk first. The background is a real production line rather than stock imagery — a contract manufacturer is selling the line itself, and a stock photo quietly admits you don't have one.",
        ms: "Memisahkan kepercayaan dan kecekapan kepada dua item navigasi utama: Collaboration Partners untuk jenama yang pernah bekerjasama, dan FAQ tersendiri untuk soalan berulang. Latar hero menggunakan foto barisan pengeluaran sebenar, bukan imej stok."
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
      zh: ["系统而非单品", "工程案例", "导流 Shopee/Lazada"],
      en: ["Systems, not SKUs", "Project reference", "Marketplace handoff"],
      ms: ["Sistem bukan produk tunggal", "Rujukan projek", "Pautan ke marketplace"]
    },
    blurb: {
      zh: "1979 年开到今天的饰面建材供应商官网。主张一句「Master the Art of Finishing」，导航按承包商的买法组织：System（系统做法）、Product（单品）、Projects（工程案例）、Location。零售交给 Shopee 和 Lazada，站内不做购物车。",
      en: "Site for a finishing-materials supplier trading since 1979. One claim — Master the Art of Finishing — and a navigation organised the way contractors actually buy: System, Product, Projects, Location. Retail is handed to Shopee and Lazada; there is no cart on the site itself.",
      ms: "Laman pembekal bahan kemasan yang beroperasi sejak 1979, dengan navigasi mengikut cara kontraktor membeli: Sistem, Produk, Projek, Lokasi. Runcit diserahkan kepada Shopee dan Lazada."
    },
    study: {
      subtitle: {
        zh: "饰面建材供应商官网",
        en: "Finishing materials supplier site",
        ms: "Laman pembekal bahan kemasan"
      },
      challenge: {
        zh: "饰面建材不是按单品卖的，是按「系统」卖的 —— 基层、底涂、面涂一整套配起来才成立，承包商在图纸上指定的也是一整套做法。可是绝大多数建材网站只按产品列 SKU，等于逼承包商自己去拼，拼错了是他赔。另一头，同一批产品又要卖给自己动手的散客，两种买法完全不同。",
        en: "Finishing materials are not sold as single products, they are sold as systems — substrate, primer and topcoat only work as a specified build-up, and a system is what a contractor writes into a drawing. Yet most materials sites list SKUs only, leaving the contractor to assemble the specification themselves and carry the cost when it is wrong. At the other end, the same range also sells to walk-in customers doing their own work, and those two ways of buying have nothing in common.",
        ms: "Bahan kemasan dijual sebagai sistem, bukan produk tunggal — lapisan asas, primer dan lapisan akhir hanya berfungsi sebagai satu sistem. Kebanyakan laman hanya menyenaraikan SKU."
      },
      work: {
        zh: "把 System 和 Product 拆成导航上两个并列的入口，承包商走 System（一整套做法），散客走 Product（单品）—— 一个站同时服务两种买法，不用互相迁就。Projects 单独一页放真实工程，饰面这行「用在哪栋楼上」比任何规格表都有说服力。Location 也提到主导航，因为建材要看实物、要算运费。「Since 1979」直接做进站标里，每一页都跟着出现 —— 这一行开了四十多年本身就是最硬的背书，不该只写在关于我们里。零售不自己做：顶栏直接挂 Shopee 和 Lazada 的入口，付款、物流、售后交给平台，官网专心做规格与信任。",
        en: "Split System and Product into two parallel entry points in the nav: contractors take System, the specified build-up; walk-in customers take Product, the single item. One site serving two ways of buying without either compromising the other. Projects gets its own page of real jobs, because in finishing, which building it went on outsells any spec table. Location sits in the main nav too, since materials get inspected in person and delivery has to be costed. Built \"Since 1979\" into the site mark so it appears on every page — four and a half decades in this trade is the hardest proof available and does not belong buried in About Us. Retail is deliberately not built: Shopee and Lazada entry points sit in the header, leaving payment, logistics and returns to the marketplaces so the site can concentrate on specification and credibility.",
        ms: "Memisahkan System dan Product kepada dua pintu masuk selari, memberikan Projects halaman tersendiri, meletakkan Location dalam navigasi utama, membina \"Since 1979\" ke dalam tanda laman, dan menyerahkan runcit kepada Shopee dan Lazada."
      },
      result: {
        zh: "⚠ 请填真实成果。建材类可写：承包商询盘时已经指名要哪一套系统、业务不用再重复寄规格表 PDF、从官网点去 Shopee/Lazada 的成交量。最后这一项平台后台看得到，值得去翻。",
        en: "⚠ Fill in a real outcome. For materials: contractors now name the system they want when they enquire, sales stops emailing the same spec-sheet PDF, or sales on Shopee and Lazada that arrived from the site. That last one is visible in the marketplace dashboards and is worth digging out.",
        ms: "⚠ Sila isi keputusan sebenar. Contoh: kontraktor sudah menamakan sistem yang dikehendaki, atau jualan Shopee/Lazada yang datang dari laman ini."
      },
      services: ["WEB DESIGN", "DEVELOPMENT", "CONTENT", "MOBILE", "SEO"]
    }
  },
  {
    slug: "furfoo-pos",
    name: "Furfoo POS",
    url: "",                          /* 登录墙后面，没有公开地址。留空 = 卡片标「内部系统」，
                                         详情页不给按钮。这和 MITIC 的 live:false 是两回事：
                                         一个是站没了，一个是本来就不对外。 */
    category: "system",
    mine: true,                       /* 自有产品 */
    reveal: "blueprint",
    year: "2026",
    tags: {
      zh: ["零售 POS", "七渠道对账", "双币种不混算"],
      en: ["Retail POS", "Seven sales channels", "Two currencies, never blended"],
      ms: ["POS runcit", "Tujuh saluran", "Dua mata wang, tidak dicampur"]
    },
    blurb: {
      zh: "自建的零售后台。七个销售渠道、两种币种、一套库存 —— 收银、订单、成本、缺货全部收在同一个台面上。",
      en: "A retail back office built from scratch: seven sales channels, two currencies and one inventory — till, orders, cost and stock all on the same counter.",
      ms: "Pejabat belakang runcit yang dibina sendiri: tujuh saluran jualan, dua mata wang dan satu inventori."
    },
    study: {
      subtitle: {
        zh: "多渠道 · 双币种零售 POS 与库存系统",
        en: "Multi-channel, dual-currency retail POS",
        ms: "POS runcit berbilang saluran dan dua mata wang"
      },
      challenge: {
        zh: "同一批货在七个地方卖：实体工作室、线下市集、Shopee 马来西亚、Shopee 新加坡、Lazada、TikTok、还有 WhatsApp 直接来的单。每个平台一个后台、一种导出格式、一套自己的口径，月底靠 Excel 手拼，数字永远对不上。\n\n更麻烦的是新币。Shopee SG 收的是 SGD，大部分系统会按当天汇率折成马币加总 —— 报表好看，但那是个假数字：汇率一天一个样，同一笔生意这个月和下个月看是两个结果。",
        en: "The same stock sells in seven places: the studio, offline markets, Shopee Malaysia, Shopee Singapore, Lazada, TikTok, and orders that arrive straight through WhatsApp. Each platform has its own back office, its own export format and its own definitions, so month end becomes a spreadsheet assembled by hand where the numbers never quite agree.\n\nThe Singapore dollar makes it worse. Shopee SG takes SGD, and most systems convert it into ringgit at the day's rate and add the two together. The report looks tidy and the figure is fictional: the rate moves daily, so the same trade reads as two different results in two different months.",
        ms: "Stok yang sama dijual di tujuh tempat: studio, pasar luar, Shopee Malaysia, Shopee Singapura, Lazada, TikTok dan pesanan terus melalui WhatsApp. Setiap platform mempunyai pejabat belakang dan definisi sendiri.\n\nDolar Singapura menjadikannya lebih rumit — kebanyakan sistem menukarnya kepada ringgit pada kadar hari itu dan menjumlahkannya, menghasilkan angka yang kelihatan kemas tetapi tidak benar."
      },
      work: {
        zh: "七个渠道收进同一套账，每一笔销售记在它发生的渠道和币种上。\n\n最重要的一条规矩：币种从不换算、从不相加。MYR 和 SGD 永远分开显示，「Per currency, never blended」直接印在指标下面，提醒每一个看报表的人。宁可两个数字，不要一个假的。\n\n每张指标卡下面都写清楚口径 —— 订单是「已完成且已付款，取消和退款不算」，毛利是「售价减去已记录的成本」。口径不写出来，同一个数字三个人会读成三个意思。批发也按「实际收到的钱」算，不按开出的发票算；分期付款的发票仍然只算一张订单。\n\nAction Centre 把「20 个缺货 / 22 个没填成本价 / 5 个库存偏低」做成今天要处理的事，不是埋在报表里等人去翻。系统知道自己的数据有洞，会主动说出来 —— 没有成本价，毛利就是错的，与其算一个错的，不如先告诉你缺哪 22 个。\n\n界面中英混排，不做语言切换。「确认扣库存并收款」「当前待结账购物车」—— 店员本来就这样讲话，硬统一成一种语言反而慢。收银台靠结构化 SKU（FF-HB-BUG-SHIELD-25）加扫码，配 Ctrl+K 命令面板，手不用离开键盘。",
        en: "Seven channels feed one ledger, and every sale is recorded against the channel and the currency it actually happened in.\n\nThe rule the whole system is built on: currencies are never converted and never added together. Ringgit and Singapore dollars are always shown apart, with \"per currency, never blended\" printed under the figure itself as a reminder to whoever reads the report. Two honest numbers beat one invented one.\n\nEvery metric carries its definition underneath — orders are \"completed and paid; cancelled and refunded excluded\", gross profit is \"sales minus recorded product cost\". Leave the definition off and three people read the same number three ways. Wholesale counts money actually received rather than invoices issued, and an invoice settled in instalments is still one order.\n\nThe Action Centre turns \"20 out of stock, 22 missing a cost price, 5 running low\" into today's decisions rather than something buried in a report. The system knows where its own data has holes and says so — without a cost price the gross profit is wrong, so it names the 22 rather than quietly computing a wrong number.\n\nThe interface mixes English and Chinese instead of offering a language switch, because that is how the staff already speak. The till runs on structured SKUs (FF-HB-BUG-SHIELD-25) with barcode scanning and a Ctrl+K command palette, so hands stay on the keyboard.",
        ms: "Tujuh saluran masuk ke satu lejar, setiap jualan direkod mengikut saluran dan mata wang sebenarnya.\n\nPeraturan utama: mata wang tidak pernah ditukar dan tidak pernah dijumlahkan. Setiap metrik membawa definisinya sendiri di bawahnya. Action Centre menjadikan kehabisan stok dan harga kos yang hilang sebagai keputusan hari ini, bukan laporan yang tertimbus.\n\nAntara muka mencampurkan bahasa Inggeris dan Cina kerana begitulah cara pekerja bercakap, dengan SKU berstruktur, pengimbas kod bar dan palet arahan Ctrl+K."
      },
      result: {
        zh: "⚠ 请填真实成果。这是你自己的系统，数字你手上就有，不用等谁给。最有说服力的写法是「以前 → 现在」：月底对账以前要几个钟头，现在几分钟？22 个没成本价的补完之后，发现哪几个产品其实是亏的？缺货从发现到补货快了多少？\n           这一条应该是所有作品里最容易填、也最有分量的一条 —— 因为你既是做的人，也是用的人。",
        en: "⚠ Fill in a real outcome. This is your own system, so the numbers are already in your hands. The most convincing shape is before and after: how many hours did month-end reconciliation take, and how long does it take now? Once the 22 missing cost prices were filled in, which products turned out to be losing money? How much faster does a stock-out get noticed and restocked?\n           This should be the easiest and the strongest result of the lot — you are both the person who built it and the person who uses it.",
        ms: "⚠ Sila isi keputusan sebenar. Ini sistem anda sendiri, jadi angkanya ada pada anda. Bentuk paling meyakinkan ialah sebelum dan selepas: berapa lama penyesuaian akhir bulan dahulu berbanding sekarang?"
      },
      services: ["PRODUCT DESIGN", "UI DESIGN", "DEVELOPMENT", "INVENTORY", "MULTI-CURRENCY"]
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
  name: "Rachel",

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

/* ============================================================================
   CLIENT_LOGOS —— 底部客户条（跑马灯）用的客户标志
   ----------------------------------------------------------------------------
   跑马灯里走的是 logo，不是一行大写字母：每个客户一个小标记 + 自己的字标，
   颜色用客户自己的品牌色（从他们官网上取的），所以那一条读起来像
   「合作过的品牌」，而不像网站的目录。

   一个客户一块，key = 上面 PROJECTS 里的 slug：
     color : 品牌主色（标记 + 字标都用它）
     accent: 第二色，只有双色 logo 才需要（例如 OEM4U 的琥珀色「4U」）
     mark  : 标记本体，写在 viewBox="0 0 20 20" 里的 SVG 片段。
             用 currentColor = 主色，用 var(--brand-2) = 第二色。
     word  : 字标。允许一点 HTML：<i> 会变成第二色，<u> 会变成小一号的副标。
             ⚠️ 这一栏是直接当 HTML 插进页面的（因为要双色），
                所以只写你自己的品牌名，不要从外面粘不认识的内容进来。

   没在这里登记的项目会自动退回纯文字样式，不会报错。
   ========================================================================== */

const CLIENT_LOGOS = {
  "luma-club": {
    color: "#8C6A3F",
    /* 月相：LŪMA = 光 */
    mark: '<circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
          '<path d="M10 2.8a7.2 7.2 0 0 0 0 14.4z" fill="currentColor"/>',
    word: 'LŪMA <u>club</u>'
  },

  "exa-energy": {
    color: "#1C1C1C",
    accent: "#F07C1E",
    /* 闪电：能源 */
    mark: '<path d="M11.6 2 4.8 11.4h4L8.2 18 15 8.6h-4z" fill="var(--brand-2)"/>',
    word: 'e<i>X</i>a <u>energy</u>'
  },

  "pnc-lifecare": {
    color: "#3AA0D8",
    accent: "#7FBF4D",
    /* 双色心：蓝绿各一半，对应他们 logo 上那颗渐变的心 */
    mark: '<path d="M10 17.2 3.6 10.8A3.9 3.9 0 0 1 10 6.4V17.2z" fill="currentColor"/>' +
          '<path d="M10 17.2l6.4-6.4A3.9 3.9 0 0 0 10 6.4v10.8z" fill="var(--brand-2)"/>',
    word: 'Pure &amp; Cure <u>lifecarelab</u>'
  },

  "furfoo-pet": {
    color: "#CE1126",
    /* 爪印 */
    mark: '<circle cx="5.6" cy="8.2" r="2" fill="currentColor"/>' +
          '<circle cx="9.9" cy="6.2" r="2.1" fill="currentColor"/>' +
          '<circle cx="14.3" cy="8.2" r="2" fill="currentColor"/>' +
          '<path d="M10 10.4c3 0 4.8 2 4.8 3.9S12.9 17.6 10 17.6 5.2 16.2 5.2 14.3 7 10.4 10 10.4z" fill="currentColor"/>',
    word: 'FURFOO'
  },

  "furfoo-pos": {
    color: "#CE1126",
    accent: "#1F7A63",
    /* 收银机：屏幕 + 出单口 */
    mark: '<rect x="3.2" y="4" width="13.6" height="9.4" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
          '<path d="M6 7.2h8M6 10h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' +
          '<path d="M4.6 16.4h10.8" stroke="var(--brand-2)" stroke-width="1.6" stroke-linecap="round"/>',
    word: 'FURFOO <i>POS</i>'
  },

  "yh-ideal-academy": {
    color: "#4A5AA8",
    /* 摊开的书：历史课堂 */
    mark: '<path d="M10 5.6C8.4 4.3 6.2 3.9 3.6 4.2v10.4c2.6-.3 4.8.1 6.4 1.4 1.6-1.3 3.8-1.7 6.4-1.4V4.2c-2.6-.3-4.8.1-6.4 1.4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
          '<path d="M10 5.6V16" stroke="currentColor" stroke-width="1.4"/>',
    word: '赵老师 <u>历史讲堂</u>'
  },

  "mitic-asian": {
    color: "#9E2B2B",
    accent: "#C9A227",
    /* 地球经纬：中马双边商会 */
    mark: '<circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
          '<path d="M10 2.8c2.6 2 2.6 12.4 0 14.4-2.6-2-2.6-12.4 0-14.4z" fill="none" stroke="var(--brand-2)" stroke-width="1.2"/>' +
          '<path d="M3.2 10h13.6" stroke="var(--brand-2)" stroke-width="1.2"/>',
    word: 'MITIC <u>asian</u>'
  },

  "etaeta": {
    color: "#12233A",
    /* 细线的浪：海盐 / 海洋 */
    mark: '<path d="M2.6 12.4c2-2.4 3.5-2.4 5.5 0s3.5 2.4 5.5 0 3.5-2.4 3.8-1.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' +
          '<path d="M2.6 7.8c2-2.4 3.5-2.4 5.5 0s3.5 2.4 5.5 0 3.5-2.4 3.8-1.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>',
    word: 'ÉTÀ'
  },

  "ec-diy-hardware": {
    color: "#0F5C2E",
    /* 六角螺母：五金 */
    mark: '<path d="M10 2.6l6.4 3.7v7.4L10 17.4 3.6 13.7V6.3z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
          '<circle cx="10" cy="10" r="2.6" fill="currentColor"/>',
    word: 'EC DIY <u>hardware</u>'
  },

  "oem4u2day": {
    color: "#14213D",
    accent: "#F5A623",
    /* 他们 logo 开头那个带点的橙色圆环 */
    mark: '<circle cx="10" cy="10" r="6.6" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
          '<circle cx="10" cy="10" r="2.9" fill="var(--brand-2)"/>',
    word: 'OEM<i>4U</i>'
  },

  "master-materials": {
    color: "#B5714E",
    accent: "#1C1C1C",
    /* 双峰的 M：他们的山形标记 */
    mark: '<path d="M2.4 16.2 6.9 6.4l3.1 5.4 3.1-5.4 4.5 9.8z" fill="currentColor"/>' +
          '<circle cx="10" cy="3.6" r="1.5" fill="currentColor"/>',
    word: 'MASTER <i>MATERIALS</i>'
  }
};
