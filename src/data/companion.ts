export const companionPoses = [
  "wave",
  "bear",
  "thumb",
  "peace",
  "heart",
  "cheer",
  "point",
  "think",
  "hand",
] as const;
export type CompanionPose = (typeof companionPoses)[number];
export const poseSource = (pose: CompanionPose) =>
  `/images/companion/${pose}.webp`;

export const companionSections: Record<
  string,
  { pose: CompanionPose; text: string }
> = {
  home: {
    pose: "wave",
    text: "你好呀 ✨ 论文和小熊都准备好了，今天也一起逛逛吧～",
  },
  updates: {
    pose: "thumb",
    text: "有新进展啦 🌱 每一小步，都值得被认真记住。",
  },
  publications: {
    pose: "think",
    text: "别急着被漂亮答案说服 🔎 我们一起找找证据。",
  },
  journey: {
    pose: "point",
    text: "从统计学出发，再走向 LLM 🌱 每一步都有新发现。",
  },
  awards: {
    pose: "cheer",
    text: "为每一点进步撒花 🎉 成果和过程都值得被记住。",
  },
};

export const companionLines = {
  hello: "我在呀 ✨ 陪你一起找找灵感，也陪你抱着小熊慢慢放空 🧸",
  returning: "回来啦 🌷 小熊替你留好了位置，接着慢慢看吧～",
  papers: "一起看看论文 📖 点图片能放大，摘要里还有更多细节。",
  pat: [
    "摸摸收到啦 💗 今天也要对自己温柔一点哦～",
    "嘿嘿，心情充满电了 🌸 这份好心情也分你一半。",
    "小熊说它也要摸摸 🧸 好啦，今天的温柔人人有份。",
  ],
  coffee: [
    "咖啡到账 ☕️ 灵感还在排队，我先陪你充充电～",
    "再来一杯，精神加倍 ✨ 不过也要记得喝点水呀。",
    "咖啡库存已经满啦 🫖 这次换杯温水，慢慢来就好。",
  ],
  ideas: [
    "灵感任务 💡 找一句很有说服力的话，再试着找出反例。",
    "换个角度想想 🔎 如果答案相同，推理过程也一定相同吗？",
    "今天的小问题 🌱 一个会承认不知道的模型，会更可靠吗？",
    "灵感也需要留白 ☁️ 暂时放下问题，说不定它会自己冒出来。",
  ],
  night: "夜深啦 🌙 我抱着小熊陪你，眼睛累了也记得休息哦。",
};
