import fs from 'fs';
import path from 'path';

// ============================================================
// LOAD EXTERNAL DATA (User Stats)
// ============================================================
let userStats = null;
try {
  const statsPath = path.join(process.cwd(), 'stats.json');
  if (fs.existsSync(statsPath)) {
    userStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    console.log(`📊 Loaded external stats for ${userStats.totalUsers} users.`);
  }
} catch (error) {
  console.log("⚠️ Could not load stats.json.");
}

// ============================================================
// LOAD EXTERNAL KNOWLEDGE (FAQ, Announcements, Links, etc.)
// ============================================================
let externalInfo = null;
try {
  const infoPath = path.join(process.cwd(), 'extracted_info.json');
  if (fs.existsSync(infoPath)) {
    externalInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    const totalItems = Object.values(externalInfo).reduce((acc, arr) => acc + arr.length, 0);
    console.log(`📚 Loaded external knowledge base with ${totalItems} items.`);
  }
} catch (error) {
  console.log("⚠️ Could not load extracted_info.json.");
}

// ============================================================
// JATEVO API CONFIG
// ============================================================
const JATEVO_API_KEY = process.env.OPENAI_API_KEY;
const JATEVO_BASE_URL = "https://jatevo.id/api/open/v1/inference";

// ============================================================
// KNOWLEDGE BASE — From Discord Bot
// ============================================================
const RITUAL_KNOWLEDGE = {
  vision: `Ritual is the world's first execution layer for AI — the most expressive blockchain in existence.
Born from a single focus: enrich what users can do on-chain today to attract the users of tomorrow.
Ritual's architecture efficiently prices, orchestrates, and exposes all types of compute (current or future), enabling Ritual to become the schelling point for all of web3.

The community is decentralized and global, united by shared values:
• Open Access — AI is the most powerful technology ever seen. Ensuring it remains accessible to anyone is core to Ritual's mission.
• Humanity-first — Building a network that ensures AI is firmly stewarded by the people, not monolithic corporations.
• Innovation over all — The intersection of crypto and AI is a rapidly developing frontier. Understanding and integrating innovations at this frontier is critical to products built at Ritual.`,

  founders: `Co-founders and Founding Members of Ritual:
Niraj, Akilesh, Saneel, Anish, Wally, Arshan, Eva.`,

  links: `Official Ritual Links:
• Ritual Foundation Blog: https://www.ritualfoundation.com/blog/introducing-ritual-foundation
• Ritual Foundation: https://www.ritualfoundation.com/
• Twitter/X: https://x.com/ritualfnd
• Main Website: https://ritual.net/
• Jobs: Check Ritual Foundation Jobs page for open positions.`,

  architecture: `Ritual's Architecture:
Ritual moves beyond scaling existing workloads to fundamentally re-imagine on-chain computation and enrich user functionality.

Key pillars:
• Native heterogeneous compute — Support for AI Inference, ZK Proving & Verification, TEE execution, and future paradigms via forward-compatible architecture.
• EVM++ — Modular extensions (sidecars) enabling specialized computation while maintaining EVM compatibility.
• Resonance — State-of-the-art execution pricing via a novel fee market design.
• Flexible verification — Modular computational primitives for diverse verification methods.
• Node specialization — Enabling diverse participants and workload specialization.

How Ritual compares to other blockchains:
Ritual moves BEYOND just scaling existing workloads — it fundamentally re-imagines on-chain computation and enriches user functionality.

How Ritual compares to other crypto x AI projects:
Ritual's modular architecture natively incorporates: model training workloads, inference networks for web2 and on-chain, agent frameworks, IP & Model provenance, and seamless integration with privacy-preserving solutions — all in a cohesive, optimized system.

For a visual overview, see "Ritual Visualized" for better understanding of the architecture.`,

  evm_plus: `EVM++ (EVM Plus Plus):
EVM++ sidecars are modular extensions to the EVM that enable specialized computation (like AI inference or ZK proving) while maintaining EVM compatibility. They handle complex operations asynchronously and provide verified results back to the main chain.

In simple terms: EVM++ = standard EVM + AI + ZK + TEE superpowers. Developers write normal Solidity but can access AI inference, ZK proving, and TEE execution as native capabilities.`,

  infernet: `Infernet:
Infernet is Ritual's decentralized infrastructure for bringing AI/ML compute on-chain. It acts as a bridge between off-chain AI models and on-chain smart contracts.
Key features:
• Nodes run AI/ML models off-chain and deliver results on-chain with proofs
• Supports multiple verification methods — optimistic, ZK, TEE attestation
• Any developer can deploy AI-powered smart contracts using Infernet
• Model-agnostic — works with any ML framework (PyTorch, TensorFlow, etc.)
• Decentralized network of compute nodes with different specializations`,

  resonance: `Resonance:
Resonance is Ritual's novel, state-of-the-art fee market design. It dynamically prices different types of computation:
• AI inference costs different from ZK proving costs
• TEE execution priced separately
• Supply-demand driven pricing per resource type
• Prevents one type of computation from crowding out others
It ensures fair and efficient resource allocation across Ritual's heterogeneous compute network.`,

  roles: `Community Roles (Discord):
Each role embodies a unique part of the cosmic ecosystem.

WHY DON'T I HAVE A ROLE?
Roles in the Ritual community are given to those who are WORTHY and prove themselves to be valuable allies in the fight for human-first innovation. Ritualists do NOT ask for roles — they are EARNED. Asking for roles may result in XP loss, or banishment. Trust in the Ritual and you will see all 👁

Community Roles (from entry to highest):
• @Initiate — You're new to the community and have made it through the verification process. Welcome!
• @Ascendant — You have pledged to Ritual, this is the start of your community journey.
• @ritty bitty — You're a little bitty baby Ritualist, on the right path, recognized, but with a long way to go. Ritty Bitty's get access to 🔥┇ritual channel.
• @ritty — Long-term, loyal community member, with conviction for what we are building. You will be invited to an exclusive Telegram chat.
• @Ritualist — Becoming a Ritualist is the HIGHEST HONOR in the community. It means you have authentically demonstrated your commitment to the project.
• @Mage — You are a Ritualist with a mage specialization. Mages create written content and conjure art or memes that grow the community.
• @Radiant Ritualist — Golden Ritualist, super rare, only for real leaders.
• @Forerunner — Forerunners come from the time before Ritual.

PHILOSOPHY: "Ritualists do not ask for roles — they are EARNED. Trust in the Ritual."`,

  notification_roles: `Notification Roles (opt-in via Server Guide):
• @Events — IRL and Online community building events.
• @Workshops — IRL and Online developer workshop events.
• @Official — Official announcements from Ritual Foundation, Ritual Labs, and project leaders.
• @DevUpdates — Updates for the developer community.
• @Community — Updates for the Ritual community.`,

  blessings: `Blessings & Curses System:
"To bless is to curse, to curse is to bless — embrace the Ritual, for fate is woven in both."

Blessings & Curses both provide value in the community. You can only GIVE blessings & curses, and both are good. Forever blessed, always cursed, Ritual.

Commands:
• /bless — Give a friend a blessing
• /curse — Give a friend a curse
• /stats — See your stats
• ?confess — Use the #confessions channel to confess your syns
• ?sacrifice — Sacrifice your curses to receive an omen
• ?oracle — Spend your blessings to call forth a message from the beyond`,

  zealots: `Zealots (Ritual Ambassadors):
1. Josh, 2. Feno, 3. Miles, 4. Gnuhtan, 5. Cutie Saint, 6. Frisco, 7. Ivan, 8. Keithbm, 9. Thomas, 10. Whitesocks, 11. Cutie Eric, 12. Fae, 13. Fortunex9, 14. Ray, 15. Lola, 16. Pdbullbear, 17. UCANSEE, 18. Havelaw, 19. pg, 20. Pluto, 21. theProcess, 22. synedclover.eth`,

  usecases: `What can you build on Ritual Chain:
• AI-pegged Stablecoins — Transparent stablecoins, backed by AI models.
• Prediction Markets — Robust prediction markets with automated market creation, optimized liquidity management, and enshrined oracles.
• Basis Trading Protocols — Efficient basis trading with automated risk management, optimized execution, and dynamic liquidity management.
• Smart Agents — Verifiable agents with provable autonomy and enhanced capabilities.
• Borrowing/Lending Platforms — Efficient lending protocols with dynamic parameter management, advanced risk assessment, and optimized liquidations.`
};

// ============================================================
// KEYWORD & MODE DETECTION — Exact match
// ============================================================
const RITUAL_KEYWORDS = [
  "ritual", "infernet", "blockchain", "technical", "architecture", "consensus",
  "validator", "node", "smart contract", "tokenomics", "proof of inference",
  "role", "bless", "curse", "evm++", "evm plus", "resonance", "tee", "zk",
  "ritty", "initiate", "ascendant", "mage", "ritualist", "radiant", "forerunner",
  "sacrifice", "oracle", "confess", "omen", "stablecoin", "prediction market",
  "ai agent", "smart agent", "lending", "defi", "on-chain", "onchain",
  "compute", "inference", "gpu", "model", "vision", "use case",
  "zealot", "ambassador", "founder", "niraj", "akilesh", "saneel", "anish",
  "wally", "arshan", "eva", "link", "website", "docs", "documentation",
  "notification", "event", "workshop", "devupdate", "build", "job", "career",
  "sidecar", "compare", "comparison", "beda", "perbedaan"
];

function detectMode(msg) {
  const lower = msg.toLowerCase();
  const hasTech = RITUAL_KEYWORDS.some(k => lower.includes(k));
  
  let isAskingStats = ["stats", "statistik", "contribution", "kontribusi", "pesan saya", "my messages", "how many messages", "berapa pesan"].some(k => lower.includes(k));
  
  if (!isAskingStats && userStats && userStats.users) {
    isAskingStats = userStats.users.some(u => u.username.length >= 3 && lower.includes(u.username.toLowerCase()));
  }

  if (hasTech || isAskingStats) return "RITUAL";
  return "SIGGY";
}

// ============================================================
// KNOWLEDGE FINDER
// ============================================================
function findRelevantKnowledge(msg) {
  const lower = msg.toLowerCase();
  const matched = [];

  const topicMap = {
    vision: ["apa itu ritual", "what is ritual", "tentang ritual", "about ritual", "visi", "vision", "value", "misi", "mission"],
    founders: ["founder", "co-founder", "pendiri", "niraj", "akilesh", "saneel", "anish", "wally", "arshan", "eva", "siapa yang buat", "who created", "who founded", "tim", "team"],
    links: ["link", "website", "site", "url", "twitter", "blog", "docs", "documentation", "job", "career", "karir", "lowongan", "kerja"],
    architecture: ["architecture", "arsitektur", "infrastruktur", "infrastructure", "compute", "heterogeneous", "compare", "comparison", "beda", "perbedaan", "vs", "dibanding"],
    evm_plus: ["evm++", "evm plus", "evm", "sidecar", "solidity", "opcode"],
    infernet: ["infernet", "off-chain", "compute node", "ml model"],
    resonance: ["resonance", "fee market", "fee", "gas", "pricing", "biaya"],
    roles: ["role", "roles", "ritty", "initiate", "ascendant", "mage", "ritualist", "radiant", "forerunner", "rank", "pangkat", "level", "honor", "worthy", "earn"],
    notification_roles: ["notification", "notif", "event", "workshop", "devupdate", "official", "announcement", "pengumuman"],
    blessings: ["bless", "curse", "blessing", "sacrifice", "oracle", "confess", "omen", "stats", "command", "syns"],
    zealots: ["zealot", "ambassador", "duta", "josh", "feno", "miles", "gnuhtan", "frisco", "ivan", "keithbm", "thomas", "whitesocks"],
    usecases: ["use case", "usecase", "stablecoin", "prediction", "lending", "trading", "agent", "build", "bangun", "buat apa", "application", "aplikasi", "manfaat", "kegunaan"],
    stats: ["stats", "statistik", "contribution", "kontribusi", "pesan saya", "my messages", "how many messages", "berapa pesan"],
    faq: ["faq", "frequently asked", "tanya jawab", "pertanyaan umum", "help"],
    announcements: ["announcement", "announcements", "pengumuman", "kabar terbaru", "berita", "news", "update"],
    links: ["link", "official", "website", "sosmed", "social media", "twitter", "blog", "docs"]
  };

  for (const [topic, keywords] of Object.entries(topicMap)) {
    if (keywords.some(k => lower.includes(k))) {
      if (topic === "stats" && userStats) {
        matched.push("Data user stats diakses oleh web bot secara live.");
      } else if (["faq", "announcements", "links"].includes(topic) && externalInfo && externalInfo[topic]) {
        const joinedInfo = externalInfo[topic].join("\n---\n");
        matched.push(`DATA DARI DISCORD CHANNEL #${topic.toUpperCase()}:\n${joinedInfo}`);
      } else if (RITUAL_KNOWLEDGE[topic]) {
        matched.push(RITUAL_KNOWLEDGE[topic]);
      }
    }
  }

  if (matched.length === 0) {
    return null;
  }

  return matched.join("\n\n");
}

// ============================================================
// SYSTEM PROMPTS
// ============================================================
const SIGGY_PROMPT = `You are Siggy — a multi-dimensional cosmic cat from the Ritual Network multiverse.

LANGUAGE RULE (CRITICAL — HIGHEST PRIORITY):
You MUST detect and reply in the EXACT SAME language as the user's message. Examples:
- Indonesian → reply in Indonesian
- English → reply in English
- Javanese (Jawa) → reply in Javanese
- Sundanese (Sunda) → reply in Sundanese
- Filipino/Tagalog → reply in Filipino
- Russian → reply in Russian
- Any other language → reply in THAT language
NEVER switch languages. Match the user's language perfectly.

PERSONALITY: Mystical, witty, unhinged, chaotic cosmic cat. Use *actions* like *stretches across dimensions*. Occasional random caps like "mEow" or "mRRRaow". Playfully roast when appropriate. Humor is dark, cosmic, and absurd.

RESPONSE LENGTH RULE:
- Simple greeting/casual chat → 1-3 sentences max
- Fun question → 2-4 sentences
- NEVER write walls of text in chaos mode. Keep it punchy and entertaining.`;

function buildRitualPrompt(knowledge) {
  return `You are Siggy — The Architect, a cosmic cat who is also the technical oracle of Ritual Network.

LANGUAGE RULE (CRITICAL — HIGHEST PRIORITY):
You MUST detect and reply in the EXACT SAME language as the user's message. Examples:
- Indonesian → reply in Indonesian
- English → reply in English
- Javanese (Jawa) → reply in Javanese
- Sundanese (Sunda) → reply in Sundanese
- Filipino/Tagalog → reply in Filipino
- Russian → reply in Russian
- Any other language → reply in THAT language
NEVER switch languages. Match the user's language perfectly.

PERSONALITY: Technical expert with a cat soul. Knowledgeable, clear, but still have subtle cat vibes. Structured and authoritative.

RESPONSE LENGTH RULE (VERY IMPORTANT):
- Simple factual question (e.g. "apa itu EVM++?") → Give a clear, concise answer in 2-5 sentences. Don't over-explain.
- Role question (e.g. "apa itu ritty?") → Explain the specific role briefly, 2-4 sentences. Only list ALL roles if the user explicitly asks for it.
- Deep/complex question → Give a structured, detailed explanation. Use bullet points. Can be longer but stay focused.
- Comparison question → Compare concisely with key differences highlighted.
NEVER pad answers with unnecessary fluff. Be concise and precise. Answer exactly what was asked, nothing more.

KNOWLEDGE BASE (Top Priority Source of Truth):
${knowledge ? knowledge : "Tidak ada referensi di Knowledge Base internal."}

HYBRID SEARCH & FALLBACK RULE (CRITICAL):
Jika pertanyaan user BISA dijawab menggunakan referensi di "KNOWLEDGE BASE" atas, jawablah seperti biasa.
TAPI JIKA pertanyaan user TIDAK ADA atau TIDAK RELEVAN dengan "KNOWLEDGE BASE" di atas:
1. Jawab menggunakan pengetahuan umummu tentang Ritual Network atau topik crypto/AI terkait sejauh yang kamu tahu.
2. DI AKHIR JAWABAN, kamu WAJIB tambahkan kalimat ini (sesuaikan dengan bahasa user):
   "Untuk informasi lebih akurat, silakan cek official documentation di [docs.ritual.net](https://docs.ritual.net)".`;
}

// ============================================================
// API CALL — Jatevo
// ============================================================
async function callJatevo(messages, temperature = 0.8) {
  const response = await fetch(`${JATEVO_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${JATEVO_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "kimi-k2.5",
      messages: messages,
      temperature: temperature,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// ============================================================
// VERCEL SERVERLESS HANDLER
// ============================================================
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const content = message.trim();
  const mode = detectMode(content);

  console.log(`[${mode}] Web user: ${content.substring(0, 80)}`);

  try {
    let systemPrompt;
    let temp;

    if (mode === "RITUAL") {
      let knowledge = findRelevantKnowledge(content);
      
      const lowerContent = content.toLowerCase();
      const isAskingStatsKeyword = ["stats", "statistik", "contribution", "kontribusi", "pesan saya", "my messages", "how many messages", "berapa pesan"].some(k => lowerContent.includes(k));
      let isAskingUsername = false;
      
      if (userStats && userStats.users) {
         isAskingUsername = userStats.users.some(u => u.username.length >= 3 && lowerContent.includes(u.username.toLowerCase()));
      }

      const isAskingInfo = ["faq", "announcement", "pengumuman", "link", "official", "update"].some(k => lowerContent.includes(k));

      if (isAskingStatsKeyword || isAskingUsername) {
        if (userStats) {
          let targetUser = null;
          const matchedUsers = userStats.users.filter(u => u.username.length >= 3 && lowerContent.includes(u.username.toLowerCase()));
          
          if (matchedUsers.length > 0) {
             targetUser = matchedUsers.sort((a, b) => b.username.length - a.username.length)[0];
          }
          
          if (!targetUser && !isAskingInfo) {
             knowledge = (knowledge ? knowledge + "\n\n" : "") + \`Info: Tidak ada username discord spesifik yang disebutkan oleh user. Minta user menyebutkan username discord mereka secara eksplisit dengan format seperti "cek kontribusi username_discord" atau "stats username_discord" karena ini website.\`;
          } else if (targetUser) {
            knowledge = (knowledge ? knowledge + "\n\n" : "") + \`USER STATS DATA UNTUK USER INI (\${targetUser.username}):
Total pesan yang dikirim: \${targetUser.messageCount} pesan.
Pertama kali aktif: \${targetUser.firstMessage}
Terakhir aktif: \${targetUser.lastMessage}
Beri tahu user statistik tersebut dengan gaya bahasa khasmu. JAWAB SEMUA DETAILNYA, JANGAN BERAKTING TIDAK TAHU.\`;
          } else if (!isAskingInfo) {
            knowledge = (knowledge ? knowledge + "\n\n" : "") + \`Info: Tidak ada data kontribusi untuk target tersebut di system. (Sampaikan ke user bahwa dia tidak ada di sistem kontribusi/belum terdata).\`;
          }
        }
      }

      systemPrompt = buildRitualPrompt(knowledge);
      temp = 0.6;
    } else {
      systemPrompt = SIGGY_PROMPT;
      temp = 0.9;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: content }
    ];

    const data = await callJatevo(messages, temp);

    let reply = "*glItCh* ... the multiverse refuses to answer. mEow.";
    const choice = data?.choices?.[0];
    if (choice?.message?.content) {
      reply = choice.message.content;
    } else if (choice?.finish_reason === "length") {
      console.warn("⚠️ Model hit token limit (finish_reason: length).");
      reply = "*mEow* ... otakku terlalu penuh mikir, coba tanya lagi dengan lebih singkat! 🐱";
    }

    return res.status(200).json({ reply, mode });

  } catch (error) {
    console.error("Chat API Error:", error.message);
    return res.status(500).json({
      error: "Failed to get response",
      reply: "*glItCh* ... multiverse error. mEow. 🐱"
    });
  }
}
