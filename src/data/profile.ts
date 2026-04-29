/**
 * profile.ts — 所有个人信息集中管理
 * 修改这里的数据即可更新网站内容
 */

export const siteConfig = {
  title: "Yuhe Wu",
  description: "Personal homepage of Yuhe Wu",
  url: "https://kzczc.github.io",
};

export const personalInfo = {
  name: "Yuhe Wu",
  nameCN: "吴宇赫",
  email: "yuhewu@hkust-gz.edu.cn",
  github: "Kzczc",
  linkedin: "Yuhe Wu",
  location: "Dalian → Hong Kong",
  avatar: "/images/my_picture.png",
  /** 打字机轮播文案 — 展示个人标签 */
  typewriterTexts: [
    "explore cognitive boundaries of LLM agents",
    "build AI systems for financial decision-making",
    "bridge the gap between NLP and social science",
  ],
  /** 一段有个人风格的 greeting */
  greeting:
    "Fueled by late-night beats and early-morning papers! If you're into LLMs, finance, or just wanna talk hip-hop, drop me a line. Let's cook something cool together 🔥",
};

/** Hero 区域的 Current Research */
export const currentResearch = [
  {
    icon: "/images/llminfinance_logo.png",
    title: "LLM in Finance",
    subtitle: "Fintech Thrust @ HKUST(GZ)",
    desc: "LLM evaluation, LLM self-evolution, and agent cognition for financial decision-making",
  },
  {
    icon: "/images/fintech_logo.png",
    title: "Fintech",
    subtitle: "Fintech Lab @ DUFE",
    desc: "Applied AI, time-series forecasting, and explainable models for financial systems",
  },
];

/** Hero 区域的 Education */
export const education = [
  {
    icon: "/images/hkust_logo.png",
    title: "Ph.D. in Fintech (Incoming)",
    subtitle: "HKUST(GZ) · 2026.09 ~",
    desc: "Supervised by Prof. Guang Zhang",
  },
  {
    icon: "/images/dufe_logo.png",
    title: "B.S. in Economic Statistics",
    subtitle: "DUFE · 2022 – 2026",
    desc: "Supervised by Prof. Zhuang Liu and Prof. Xu Qiang",
  },
];

/** Hero 区域右侧的吉祥物 / 角色 */
export const mascots = [
  {
    image: "/images/hiphop_boy.png",
    name: "Kiso",
    icon: "/images/code.png",
    role: "RIGOROUS CODER",
    roleColor: "#06b6d4",       // cyan
    roleColorDark: "#22d3ee",
    bio: "A serious-looking but secretly warm-hearted engineer who writes elegant code with the precision of a Swiss watch and the style of a streetwear drop.",
  },
  {
    image: "/images/comic_girl.png",
    name: "Sui",
    icon: "/images/paint.png",
    role: "IMAGINATIVE ARTIST",
    roleColor: "#a855f7",       // purple
    roleColorDark: "#c084fc",
    bio: "The creative soul behind every paper figure. She turns messy experimental results into gallery-worthy visualizations, because science deserves to look good.",
  },
];

/** Brief Introduction */
export const briefIntro = `I am an undergraduate student in Economic Statistics at Dongbei University of Finance and Economics (DUFE), supervised by [**Prof. Zhuang Liu**](https://sft.dufe.edu.cn/content_26950.html). I will be joining the **Hong Kong University of Science and Technology (Guangzhou)** as a **Ph.D. student in Fall 2026**, supervised by [**Prof. Guang Zhang**](https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page/ZHANG-Guang/guangzhang).

My research focuses on **Large Language Models(LLMs) in Finance and Social Sciences**, spanning LLM evaluation, LLM self-evolution, and agent cognition. I have published papers at venues including **ACL 2026**, **KDD 2025**, and **Annals of Operations Research**, with additional manuscripts under review at **KDD 2026**, **INFORMS Journal on Computing**, and **Management Science**. I also serve as a reviewer for leading venues such as **ACL**, **KDD**, and **IJOC**.`;

/** 导航链接 */
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Publications", href: "#publications" },
  { label: "Experience", href: "#journey" },
  { label: "Awards", href: "#awards" },
];

/** 社交链接 */
export const socialLinks = [
  {
    label: "Email",
    href: "mailto:yuhewu@hkust-gz.edu.cn",
    icon: "Mail",
  },
  {
    label: "GitHub",
    href: "https://github.com/Kzczc",
    icon: "Github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yuhe-wu-a4165b370/",
    icon: "Linkedin",
  },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=vm72Sj4AAAAJ&hl=en",
    icon: "GraduationCap",
  },
];

/** Recent Updates — 仿终端条目
 *  linkIcons[i].type: "paper" | "github" | "site"
 *  linkIcons[i].url:  外链地址
 *  Editorial principle: 仅展示 accepted 论文 / 获奖 / 宣传报道 / 重要里程碑
 */
export const recentUpdates = [
  {
    date: "May 2026",
    type: "RELEASE" as const,
    hex: "0x0000",
    status: "upcoming",
    venue: "BizSage",
    title: "Upcoming · First self-evolving multi-agent framework for automated financial research",
    linkIcons: [] as { type: string; url: string }[],
  },
  {
    date: "Apr 2026",
    type: "MEDIA" as const,
    hex: "0x0001",
    status: "released",
    venue: "DUFE Official Press",
    title: "Featured by DUFE official press for ACL 2026 acceptances",
    linkIcons: [
      { type: "site", url: "https://mp.weixin.qq.com/s/2gYUXPEPJzg9GZHIjEF8DQ" },
    ] as { type: string; url: string }[],
  },
  {
    date: "Apr 2026",
    type: "PUBLICATION" as const,
    hex: "0x0002",
    status: "accepted",
    venue: "ACL 2026 Main",
    title: "PRISM: Probing Reasoning, Instruction, and Source Memory in LLM Hallucinations",
    linkIcons: [
      { type: "paper", url: "https://arxiv.org/abs/2604.16909" },
    ] as { type: string; url: string }[],
  },
  {
    date: "Apr 2026",
    type: "PUBLICATION" as const,
    hex: "0x0003",
    status: "accepted",
    venue: "ACL 2026 Findings",
    title: "BizCompass: Benchmarking the Reasoning Capabilities of LLMs in Business Knowledge",
    linkIcons: [
      { type: "paper", url: "https://arxiv.org/abs/2604.17305" },
    ] as { type: string; url: string }[],
  },
  {
    date: "Dec 2025",
    type: "EXPERIENCE" as const,
    hex: "0x0004",
    status: "offered",
    venue: "HKUST(GZ) Fintech Thrust",
    title: "Received Ph.D. offer w/ Prof. Guang Zhang",
    linkIcons: [
      { type: "site", url: "https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page/ZHANG-Guang/guangzhang" },
    ] as { type: string; url: string }[],
  },
  {
    date: "Dec 2025",
    type: "PUBLICATION" as const,
    hex: "0x0005",
    status: "accepted",
    venue: "Annals of Operations Research",
    title: "Enhancing Financial Decision-Making under Cyber Threats: A Dual-Branch Framework",
    linkIcons: [
      { type: "paper", url: "https://link.springer.com/article/10.1007/s10479-025-06973-2" },
    ] as { type: string; url: string }[],
  },
  {
    date: "May 2025",
    type: "PUBLICATION" as const,
    hex: "0x0006",
    status: "accepted",
    venue: "KDD-UMC 2025",
    title: "PolluVCCT accepted · ACM SIGKDD 2025 Undergraduate Consortium Scholarship",
    linkIcons: [
      { type: "paper", url: "https://kdd2025.kdd.org/wp-content/uploads/2025/07/CameraReady-25.pdf" },
    ] as { type: string; url: string }[],
  },
  {
    date: "Aug 2024",
    type: "EXPERIENCE" as const,
    hex: "0x0007",
    status: "joined",
    venue: "Fintech Lab, DUFE",
    title: "Became Research Group Leader of Fintech Lab",
    linkIcons: [] as { type: string; url: string }[],
  },
  {
    date: "Jul 2024",
    type: "AWARD" as const,
    hex: "0x0008",
    status: "granted",
    venue: "National",
    title: "Bronze Award · China International College Students 'Internet+' Innovation Competition",
    linkIcons: [] as { type: string; url: string }[],
  },
  {
    date: "Mar 2023",
    type: "AWARD" as const,
    hex: "0x0009",
    status: "granted",
    venue: "DUFE",
    title: "Ranked #1 in School of Business → transferred to Economic Statistics",
    linkIcons: [] as { type: string; url: string }[],
  },
];

/** Selected Publications — 首页展示 */
export const selectedPublications = [
  {
    id: "bizsage",
    venue: "Targeting EMNLP 2026",
    venueType: "conference" as const,
    rating: "CCF B, CORE A*",
    title: "BizSage: A Self-Evolving Multi-Agent Framework for Business Research with Efficient Knowledge Retrieval",
    authors: "Yuhe Wu, Guangyu Wang, Jiaxin Liu, Guang Zhang",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "In Preparation",
    statusColor: "gray" as const,
    thumbnail: "/images/bizsage_logo.png",
    links: {} as { paper?: string; code?: string; project?: string },
    abstract: "From **AI Scientist v2** passing peer review for the first time, to **EvoScientist**'s cross-task memory accumulation, to **PaperOrchestra** turning lab notes directly into submission-ready manuscripts, automated research is moving from proof of concept to usable systems. Yet these advances are almost entirely concentrated in the natural sciences. Economics and business research has a fundamentally different knowledge structure: relevant information is scattered across finance, statistics, management, and other disciplines; different sections of a single paper carry distinct informational value; and paper-level coarse-grained retrieval cannot precisely locate what is needed. At the same time, this field demands unique standards of empirical rigor. **BizSage** addresses these challenges by constructing a cross-paper *Lateral Knowledge Graph* that unifies section-level knowledge from hundreds of thousands of papers, using *Personalized PageRank* for precise fine-grained retrieval. Multiple specialized agents collaborate to complete the full workflow from literature review to research plan design, with a self-evolution mechanism that continuously learns domain-specific quality patterns from historical evaluations.",
  },
  {
    id: "kdd-quantifying",
    venue: "KDD 2026 (August Cycle)",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "Quantifying Public Value Orientations: A Distribution-Aware Framework for Computational Social Science",
    authors: "Yuhe Wu, Guangyu Wang, Guang Zhang, Zhuang Liu",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "Under Review",
    statusColor: "blue" as const,
    thumbnail: "/images/kdd_quantifying.png",
    links: {} as { paper?: string; code?: string; project?: string },
    abstract: "**AI4Science** has produced breakthroughs like AlphaFold and AlphaEvolve in the natural sciences, but in social science, the methodology for using AI as a measurement tool remains far from mature. Quantifying latent social variables such as public value orientations and policy attitudes is a core challenge in computational social science, and text is the richest source of evidence. Yet text is inherently noisy: within the same passage, clear stance expressions coexist with rhetorical concessions, quoted opposing views, and background filler, each carrying vastly different *evidential value*. Existing LLM-based methods either compress an entire text into a single label or split it into segments and apply equal-weight voting, both discretizing continuous probability distributions too early and causing irreversible information loss. When numerous ambiguous segments outnumber a few decisive arguments, the final judgment is dominated by noise. We reformulate text-based measurement as an *uncertainty-aware evidence aggregation* problem: retaining each segment's full probability distribution, using entropy to assess evidence reliability, and aggregating through weighted pooling in log-odds space, so that a small number of high-confidence segments naturally drive the final decision.",
  },
  {
    id: "prosmf",
    venue: "Targeting EMNLP 2026",
    venueType: "conference" as const,
    rating: "CCF B, CORE A*",
    title: "Rethinking Risk Forecasting from Financial News: Distributional Supervision Beyond Point Predictions",
    authors: "Yuhe Wu, Guangyu Wang, Yuanjian Xu, Jianing Hao, Changwei Xu, Guang Zhang",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "In Preparation",
    statusColor: "gray" as const,
    thumbnail: "/images/acl_selective.png",
    links: {} as { paper?: string; code?: string; project?: string },
    abstract: "For over a decade, research on predicting market performance from news has operated under a default assumption: that the impact of news can be captured through changes in the mean of expected returns. But is this really how markets respond? By leveraging pricing information from financial derivatives to reconstruct the market's implied expectation distributions, we analyzed nearly 12,000 paired observations before and after news releases and uncovered a long-overlooked fact: what news truly changes is the *distributional shape* and *tail risk*, while the mean barely moves, with differences ranging from 3 to 85 times. This suggests that mainstream approaches may have been tracking the wrong signal all along. Building on this finding, we propose **Selective Moment Forecasting**: instead of predicting the mean, we predict the risk statistics that news actually changes, and design **ProSMF**, a prototype memory network that automatically matches news types to the appropriate predictors.",
  },
  {
    id: "prism",
    venue: "ACL 2026 Main Conference",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "PRISM: Probing Reasoning, Instruction, and Source Memory in LLM Hallucinations",
    authors: "Yuhe Wu, Guangyu Wang, Yuran Chen, Jiatong Zhang, Yutong Zhang, Yujie Chen, Jiaming Shang, Guang Zhang, Zhuang Liu",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "Accepted",
    statusColor: "green" as const,
    thumbnail: "/images/prism.png",
    links: {
      paper: "https://arxiv.org/abs/2604.16909",
    } as { paper?: string; code?: string; project?: string },
    abstract: "In 2025, 2.6% of CS conference papers were found to contain suspected hallucinated citations, nearly 9 times the rate from the previous year. ICLR 2026 now treats hallucinated references as academic ethics violations, where a single instance can lead to rejection. Whether LLMs are a trustworthy tool for research has become an unavoidable question. But fixing hallucinations requires understanding where they come from. When a model gives a wrong answer, the reasons can be entirely different: it may lack the relevant knowledge altogether, it may have memorized incorrect facts, it may have the right knowledge but fail in reasoning, or it may reason correctly but ignore the user's constraints. These four types of errors originate from distinct stages of the generation pipeline, and each requires a different fix, yet existing evaluations mix all queries together and only score final outputs, making them indistinguishable. More critically, fixing one type often worsens another: strengthening instruction following can hurt reasoning, while injecting knowledge can cause forgetting. **PRISM** decomposes hallucinations along three generation stages into four independently testable dimensions, providing systematic diagnosis across 9,448 instances and 24 LLMs, making both *what to fix* and *how to fix it* actionable.",
  },
  {
    id: "bizcompass",
    venue: "ACL 2026 Findings",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "BizCompass: Benchmarking the Reasoning Capabilities of LLMs in Business Knowledge and Applications",
    authors: "Jianing Hao*, Yuhe Wu*, Yuanjian Xu*, Shichang Meng, Shuai Yuan, Wei Zeng, Zixuan Zhang, Guang Zhang",
    badges: ["Co-First Author"],
    extraBadges: [] as string[],
    status: "Accepted",
    statusColor: "green" as const,
    thumbnail: "/images/bizcompass.png",
    links: {
      paper: "https://arxiv.org/abs/2604.17305",
    } as { paper?: string; code?: string; project?: string },
    abstract: "In discussions with over ten leading financial institutions, a recurring question emerged: LLMs are powerful, but which business scenarios can they reliably support, and what foundational capabilities underpin these applications? Existing benchmarks cannot answer this. They either cover narrow tasks or focus only on surface-level accuracy, consistently lacking a causal chain from foundational capability to business performance. **BizCompass** was built to address this gap: it covers four foundational disciplines at the knowledge level, including finance, economics, statistics, and operations research, and structures tasks around three business roles at the application level, including analyst, trader, and consultant, forming a dual-axis evaluation framework that not only measures *how well* models perform, but diagnoses *why* they fall short.",
  },
  {
    id: "anor",
    venue: "Annals of Operations Research",
    venueType: "journal" as const,
    rating: "ABS 3, JCR Q1",
    title: "Enhancing Financial Decision-Making under Cyber Threats: A Dual-Branch Framework Integrating Bayesian Deep Learning and Explainable AI",
    authors: "Yuhe Wu, Yuran Chen, Zhuang Liu, Wayne Lin",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "Accepted",
    statusColor: "green" as const,
    thumbnail: "/images/anor.png",
    links: {
      paper: "https://link.springer.com/article/10.1007/s10479-025-06973-2",
    } as { paper?: string; code?: string; project?: string },
    abstract: "In financial cybersecurity, the accuracy bar for malware detection is far higher than in general scenarios, because a single misjudgment can disrupt legitimate transactions or cause massive financial losses. Yet even when model accuracy is sufficient, the real-world deployment of AI in financial systems remains challenging. The core reason is that models are opaque and cannot quantify their own uncertainty. No one dares make critical decisions based on a black box that can neither explain itself nor assess its own confidence. This is precisely the motivation behind **BnetX**: Bayesian inference quantifies the uncertainty of every prediction, while an explainable AI module reveals the key factors driving each decision, giving security analysts not a cold label, but a complete alert with confidence scores and visual evidence.",
  },
  {
    id: "polluvcct",
    venue: "KDD-UMC 2025",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "PolluVCCT: Multi-Scale Hybrid Learning for Robust Air Pollution Forecasting Across Diverse Climate Zones",
    authors: "Yuhe Wu, Yuran Chen, Xinyue Su, Zhuang Liu*",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "Accepted",
    statusColor: "green" as const,
    abstract: "This was my first research project, where I quickly learned the full pipeline from problem formulation to experimental validation through time-series forecasting. The core challenge in air pollution prediction is the sheer complexity of atmospheric data: noise, trends, and seasonal fluctuations intertwined, causing models tuned for one city to fail in another climate zone. PolluVCCT takes a \"decompose then fuse\" approach: signal decomposition strips away noise and trend components, and deep learning separately captures local patterns and long-range dependencies. On our cross-regional benchmark spanning seven climate zones, MAPE variance stays below 3%.",
    abstractNote: "Grateful to KDD-UMC 2025 for the acceptance — this recognition gave me the motivation to keep going. Though I've since moved to NLP, this experience laid the foundation for everything. 🌱",
    thumbnail: "/images/Polluvcct_framework.png",
    links: {
      paper: "https://kdd2025.kdd.org/wp-content/uploads/2025/07/CameraReady-25.pdf",
    } as { paper?: string; code?: string; project?: string },
  },
];

/** My Journey 时间线 (从最新到最早) */
export const journeyItems = [
  {
    period: "2026 ~ Present",
    org: "HKUST(GZ) · Fintech Thrust",
    icon: "/images/hkust_logo.png",
    title: "Ph.D. Student (Incoming)",
    description:
      "Starting Ph.D. journey in Fintech at Hong Kong University of Science and Technology (Guangzhou), focusing on LLM Agents, evaluation, and finance applications.",
    isCurrent: true,
  },
  {
    period: "2025 ~ Present",
    org: "HKUST(GZ) · Fintech Thrust & Society Hub",
    icon: "/images/hkust_logo.png",
    title: "Research Assistant at Fintech Thrust",
    description:
      "Joined HKUST(GZ) as Research Assistant under Prof. Guang Zhang. Co-submitted to ACL 2026 and received all positive reviews. Upcoming work on multi-agent systems for general business analysis tasks!",
    isCurrent: false,
  },
  {
    period: "2024 ~ Present",
    org: "Fintech Lab, DUFE",
    icon: "/images/dufe_logo.png",
    title: "Research Group Leader",
    description:
      "Led the Fintech Lab research group under Prof. Zhuang Liu. Published first paper in DUFE Journal Catalog A and CCF-A paper, with submissions to ACL 2026, KDD 2026, Management Science, and IJOC.",
    isCurrent: false,
  },
  {
    period: "2022 – 2023",
    org: "Dongbei University of Finance and Economics",
    icon: "/images/dufe_logo.png",
    title: "Business Admin → Economic Statistics",
    description:
      "Transferred from Business Administration to Economic Statistics. Started exploring data science, statistical modeling, and quantitative methods.",
    isCurrent: false,
  },
];

/** Awards & Honors */
export const awards = [
  { title: "KDD-25 Undergraduate Scholarship", org: "KDD 2025", date: "2025", category: "GRANT" },
  { title: "Dashang Group Academic Research Scholarship (TOP 1%)", org: "DUFE", date: "2025", category: "SCHOLARSHIP" },
  { title: "Excellent Innovation & Entrepreneurship Team Scholarship (TOP 1%)", org: "DUFE", date: "2025", category: "SCHOLARSHIP" },
  { title: "Advanced Individual in Academic Competitions (TOP 1%)", org: "DUFE", date: "2025", category: "HONOR" },
  { title: "National 2nd Prize, 9th Financial Innovation & Entrepreneurship Competition", org: "National", date: "2024", category: "COMPETITION" },
  { title: "Bronze Award, China International Innovation Competition", org: "National", date: "2024", category: "COMPETITION" },
  { title: "National 3rd Prize, 10th Student Statistical Modeling Competition", org: "National", date: "2024", category: "COMPETITION" },
  { title: "Top 100, ICBC Cup National Fintech Innovation Competition", org: "National", date: "2025", category: "COMPETITION" },
  { title: "First-Class Scholarship (TOP 2%)", org: "DUFE", date: "2023 & 2024", category: "SCHOLARSHIP" },
  { title: "Merit Student (University Level)", org: "DUFE", date: "2023 & 2024", category: "HONOR" },
  { title: "Excellent Communist Youth League Member", org: "DUFE", date: "2023", category: "HONOR" },
];

/** Reviewer 服务 */
export const reviewerService = [
  "INFORMS Journal on Computing (UTD24)",
  "IEEE Transactions on Neural Networks and Learning Systems (Q1)",
  "Journal of Business Research (ABS3, Q1)",
  "Data Mining and Knowledge Discovery (Q2)",
  "ACL 2025 (CCF A)",
  "KDD 2025 (CCF A)",
  "ICDE 2025 (CCF A)",
];
