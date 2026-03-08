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

My research focuses on **Large Language Models(LLMs) in Finance and Social Sciences**, spanning LLM evaluation, LLM self-evolution, and agent cognition. I have published papers at venues including **KDD 2025** and **Annals of Operations Research**, with additional manuscripts under review at **ACL Rolling Review**, **INFORMS Journal on Computing**, and **Management Science**. I also serve as a reviewer for leading venues such as **ACL**, **KDD**, and **IJOC**.`;

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
    href: "https://www.linkedin.com/in/yuhe-wu",
    icon: "Linkedin",
  },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=vm72Sj4AAAAJ&hl=en",
    icon: "GraduationCap",
  },
];

/** Recent Updates — 仿终端条目
 *  linkIcons: "paper" | "github" | "site"
 */
export const recentUpdates = [
  {
    date: "Jun 2025",
    type: "EXPERIENCE" as const,
    hex: "0x0000",
    status: "joined",
    venue: "HKUST(GZ) Fintech Thrust",
    title: "Research Assistant w/ Prof. Guang Zhang",
    linkIcons: ["site"] as string[],
  },
  {
    date: "May 2025",
    type: "PUBLICATION" as const,
    hex: "0x0001",
    status: "under_review",
    venue: "Management Science",
    title: "The Cognitive Boundary of Generative Agents: Economic Coherence under Structural Complexity",
    linkIcons: ["paper", "github"] as string[],
  },
  {
    date: "May 2025",
    type: "PUBLICATION" as const,
    hex: "0x0002",
    status: "under_review",
    venue: "ACL Rolling Review",
    title: "PRISM: Probing Reasoning, Instruction, and Source Memory in LLM Hallucinations",
    linkIcons: ["paper", "github"] as string[],
  },
  {
    date: "May 2025",
    type: "PUBLICATION" as const,
    hex: "0x0003",
    status: "under_review",
    venue: "KDD 2026",
    title: "Quantifying Public Value Orientations: A Distribution-Aware Framework",
    linkIcons: ["paper", "github"] as string[],
  },
  {
    date: "Apr 2025",
    type: "AWARD" as const,
    hex: "0x0004",
    status: "granted",
    venue: "KDD 2025",
    title: "KDD-25 Undergraduate Scholarship (TOP 1%)",
    linkIcons: ["site"] as string[],
  },
  {
    date: "Jan 2025",
    type: "PUBLICATION" as const,
    hex: "0x0005",
    status: "accepted",
    venue: "Annals of Operations Research",
    title: "Enhancing financial decision-making under cyber threats: a dual-branch framework integrating bayesian deep learning and explainable AI",
    linkIcons: ["paper", "github"] as string[],
  },
  {
    date: "Jan 2025",
    type: "PUBLICATION" as const,
    hex: "0x0006",
    status: "accepted",
    venue: "KDD-UMC 2025",
    title: "PolluVCCT: Multi-Scale Hybrid Learning for Robust Air-Pollution Forecasting",
    linkIcons: ["paper", "github"] as string[],
  },
  {
    date: "May 2025",
    type: "PUBLICATION" as const,
    hex: "0x0007",
    status: "under_review",
    venue: "ACL Rolling Review",
    title: "BizCompass: Benchmarking the Reasoning Capabilities of LLMs in Business Knowledge",
    linkIcons: ["paper", "github"] as string[],
  },
  {
    date: "May 2025",
    type: "PUBLICATION" as const,
    hex: "0x0008",
    status: "under_review",
    venue: "INFORMS Journal on Computing",
    title: "HarmoniBERT: A Cross-Cultural Ensemble Learning Framework for ESG Text Annotation",
    linkIcons: ["paper", "github"] as string[],
  },
];

/** Selected Publications — 首页展示 5 篇 */
export const selectedPublications = [
  {
    id: "kdd-quantifying",
    venue: "KDD 2026",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "Quantifying Public Value Orientations: A Distribution-Aware Framework for Computational Social Science",
    authors: "Yuhe Wu, Guangyu Wang, Guang Zhang, Zhuang Liu",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "Under Review",
    statusColor: "blue" as const,
    thumbnail: "/images/kdd_quantifying.png",
  },
  {
    id: "prism",
    venue: "ACL Rolling Review",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "PRISM: Probing Reasoning, Instruction, and Source Memory in LLM Hallucinations",
    authors: "Yuhe Wu, Guangyu Wang, Yuran Chen, Jiatong Zhang, Yutong Zhang, Yujie Chen, Jiaming Shang, Guang Zhang, Zhuang Liu",
    badges: ["First Author"],
    extraBadges: ["✓ All Positive Reviews"],
    status: "Under Review",
    statusColor: "blue" as const,
    thumbnail: "/images/prism.png",
  },
  {
    id: "acl-selective",
    venue: "ACL Rolling Review",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "Rethinking Risk Forecasting from Financial News: Distributional Supervision Beyond Point Predictions",
    authors: "Yuhe Wu, Guangyu Wang, Yuanjian Xu, Jianing Hao, Changwei Xu, Guang Zhang",
    badges: ["First Author"],
    extraBadges: [] as string[],
    status: "Under Review",
    statusColor: "blue" as const,
    thumbnail: "/images/acl_selective.png",
  },
  {
    id: "bizcompass",
    venue: "ACL Rolling Review",
    venueType: "conference" as const,
    rating: "CCF A, CORE A*",
    title: "BizCompass: Benchmarking the Reasoning Capabilities of LLMs in Business Knowledge and Applications",
    authors: "Jianing Hao*, Yuhe Wu*, Yuanjian Xu*, Shichang Meng, Shuai Yuan, Wei Zeng, Zixuan Zhang, Guang Zhang",
    badges: ["Equal Contribution"],
    extraBadges: ["✓ All Positive Reviews"],
    status: "Under Review",
    statusColor: "blue" as const,
    thumbnail: "/images/bizcompass.png",
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
    thumbnail: "/images/Polluvcct_framework.png",
  },
];

/** My Journey 时间线 (从最新到最早) */
export const journeyItems = [
  {
    period: "2026 ~ Present",
    org: "HKUST(GZ) · Fintech Thrust",
    title: "Ph.D. Student (Incoming)",
    description:
      "Starting Ph.D. journey in Fintech at Hong Kong University of Science and Technology (Guangzhou), focusing on LLM Agents, evaluation, and finance applications.",
    isCurrent: true,
  },
  {
    period: "2025 ~ Present",
    org: "HKUST(GZ) · Fintech Thrust & Society Hub",
    title: "Research Assistant at Fintech Thrust",
    description:
      "Joined HKUST(GZ) as Research Assistant under Prof. Guang Zhang. Co-submitted to ACL 2026 and received all positive reviews. Upcoming work on multi-agent systems for general business analysis tasks!",
    isCurrent: false,
  },
  {
    period: "2024 ~ Present",
    org: "Fintech Lab, DUFE",
    title: "Research Group Leader",
    description:
      "Led the Fintech Lab research group under Prof. Zhuang Liu. Published first paper in DUFE Journal Catalog A and CCF-A paper, with submissions to ACL 2026, KDD 2026, Management Science, and IJOC.",
    isCurrent: false,
  },
  {
    period: "2022 – 2026",
    org: "Dongbei University of Finance and Economics",
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
