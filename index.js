require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const express = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const state = new Map();

/* =====================
   APPEAL TEMPLATES
===================== */
const TEMP_APPEALS = [
`Hello WhatsApp Support Team,

My WhatsApp account (%PHONE%) was temporarily banned.
I believe this may have been an error.

Kindly review my account.
Thank you.`,

`Dear WhatsApp Support,

My account (%PHONE%) has been temporarily restricted.
I always try to follow WhatsApp policies.

Please review my account.
Thank you.`,

`Hello WhatsApp Team,

My WhatsApp account (%PHONE%) was temporarily blocked.
Any violation was unintentional.

I kindly request a review.`
];

const PERM_APPEALS = [
`Hello WhatsApp Support Team,

My WhatsApp account (%PHONE%) has been permanently banned.
I believe this may be a misunderstanding.

Please review my account.
Thank you.`,

`Dear WhatsApp Support,

My account (%PHONE%) was permanently disabled.
I respectfully request a reconsideration.

Thank you.`,

`Hello WhatsApp Team,

My account (%PHONE%) has been permanently banned.
I value WhatsApp and request a full review.`
];

/* =====================
   TRUTH OR DARE (15 EACH)
===================== */
const TRUTH = [
  "Who is your secret crush right now?",
  "Have you ever lied to someone you love?",
  "What is your biggest fear?",
  "Who was the last person you stalked on social media?",
  "Have you ever cheated in an exam?",
  "What is one thing you regret doing?",
  "Who do you chat with the most on WhatsApp?",
  "Have you ever had a crush on a friend?",
  "What is your biggest insecurity?",
  "Have you ever broken someone’s heart?",
  "What is the most embarrassing thing that happened to you?",
  "Who knows your biggest secret?",
  "Have you ever pretended to like someone?",
  "What bad habit are you trying to stop?",
  "If you could change one thing about your past, what would it be?"
];

const DARE = [
  "Send 😈 emoji to this chat",
  "Type 'I am unstoppable 💪' and send",
  "Change your Telegram name for 1 hour",
  "Send a voice note saying 'I love myself'",
  "Send 🔥🔥🔥 to the chat",
  "Message someone 'You are amazing' right now",
  "Send your mood using only emojis",
  "Post 😂 emoji as your status",
  "Send ❤️ to the group chat",
  "Say 'No fear, only vibes 😎'",
  "Send a funny sticker here",
  "Type 'I believe in miracles' and send",
  "Send 😎 emoji five times",
  "Write one word that describes you",
  "Say 'I accept this dare 😈'"
];

/* =====================
   QUIZ (15)
===================== */
const QUIZ = [
  { q: "WhatsApp is owned by?", a: "Meta" },
  { q: "Country code +234 belongs to?", a: "Nigeria" },
  { q: "Telegram founder?", a: "Pavel Durov" },
  { q: "Capital city of Nigeria?", a: "Abuja" },
  { q: "2 + 2 × 2 = ?", a: "6" },
  { q: "Which planet is known as the Red Planet?", a: "Mars" },
  { q: "HTML stands for?", a: "HyperText Markup Language" },
  { q: "CSS is used for?", a: "Styling" },
  { q: "Largest ocean in the world?", a: "Pacific" },
  { q: "Fastest land animal?", a: "Cheetah" },
  { q: "Who created Facebook?", a: "Mark Zuckerberg" },
  { q: "What year did WhatsApp launch?", a: "2009" },
  { q: "Android is owned by which company?", a: "Google" },
  { q: "Capital of France?", a: "Paris" },
  { q: "Smallest prime number?", a: "2" }
];

/* =====================
   START MENU
===================== */
bot.start((ctx) => {
  state.delete(ctx.from.id);
  ctx.reply(
    `😈 *WHATSAPP UNBAN APPEAL BOT PRO*\n\nChoose an option 👇`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📱 Generate Appeal", "APPEAL")],
        [Markup.button.callback("🎮 Game Center", "GAMES")],
        [Markup.button.callback("🏷️ Tag All (Group)", "TAGALL")],
        [Markup.button.callback("ℹ️ About Bot", "ABOUT")]
      ])
    }
  );
});

/* =====================
   ABOUT
===================== */
bot.action("ABOUT", (ctx) => {
  ctx.editMessageText(
    `🤖 *ABOUT BOT*\n\n• Appeal Generator\n• Games\n• Tag All\n\n👨‍💻 Made by *Mr Dev*`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back", "BACK")]])
    }
  );
  ctx.answerCbQuery();
});

bot.action("BACK", (ctx) => {
  ctx.deleteMessage();
  ctx.telegram.sendMessage(ctx.chat.id, "/start");
  ctx.answerCbQuery();
});

/* =====================
   APPEAL FLOW
===================== */
bot.action("APPEAL", (ctx) => {
  state.set(ctx.from.id, {});
  ctx.reply(
    `🚫 *Select Ban Type*`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("⏳ Temporary", "TEMP"),
          Markup.button.callback("⛔ Permanent", "PERM")
        ]
      ])
    }
  );
  ctx.answerCbQuery();
});

bot.action(["TEMP", "PERM"], (ctx) => {
  state.set(ctx.from.id, { banType: ctx.callbackQuery.data });
  ctx.reply(`📱 Enter WhatsApp number\nExample: +2348012345678`);
  ctx.answerCbQuery();
});

/* =====================
   GAME CENTER
===================== */
bot.action("GAMES", (ctx) => {
  ctx.editMessageText(
    `🎮 *GAME CENTER*`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("😈 Truth or Dare", "TOD")],
        [Markup.button.callback("🎯 Lucky Guess", "GUESS")],
        [Markup.button.callback("✊ Rock Paper Scissors", "RPS")],
        [Markup.button.callback("🧠 Quiz", "QUIZ")],
        [Markup.button.callback("⬅️ Back", "BACK")]
      ])
    }
  );
  ctx.answerCbQuery();
});

/* =====================
   TRUTH OR DARE
===================== */
bot.action("TOD", (ctx) => {
  ctx.reply(
    `😈 *Truth or Dare*`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("🧠 Truth", "TRUTH"),
          Markup.button.callback("🔥 Dare", "DARE")
        ]
      ])
    }
  );
  ctx.answerCbQuery();
});

bot.action("TRUTH", (ctx) => {
  ctx.reply(`🧠 *Truth*\n\n${TRUTH[Math.floor(Math.random() * TRUTH.length)]}`, { parse_mode: "Markdown" });
  ctx.answerCbQuery();
});

bot.action("DARE", (ctx) => {
  ctx.reply(`🔥 *Dare*\n\n${DARE[Math.floor(Math.random() * DARE.length)]}`, { parse_mode: "Markdown" });
  ctx.answerCbQuery();
});

/* =====================
   LUCKY GUESS
===================== */
bot.action("GUESS", (ctx) => {
  state.set(ctx.from.id, { guess: Math.floor(Math.random() * 5) + 1 });
  ctx.reply("🎯 Guess a number from 1 to 5");
  ctx.answerCbQuery();
});

/* =====================
   QUIZ
===================== */
bot.action("QUIZ", (ctx) => {
  const q = QUIZ[Math.floor(Math.random() * QUIZ.length)];
  state.set(ctx.from.id, { quiz: q.a });
  ctx.reply(`🧠 *Quiz*\n\n${q.q}`, { parse_mode: "Markdown" });
  ctx.answerCbQuery();
});

/* =====================
   TAG ALL
===================== */
bot.action("TAGALL", async (ctx) => {
  if (ctx.chat.type === "private") return ctx.reply("❌ Group only");
  const admins = await ctx.getChatAdministrators();
  if (!admins.some(a => a.user.id === ctx.from.id)) return ctx.reply("❌ Admin only");

  const mentions = admins.map(a => `[${a.user.first_name}](tg://user?id=${a.user.id})`).join(" ");
  ctx.reply(`📢 *TAG ALL*\n\n${mentions}`, { parse_mode: "Markdown" });
});

/* =====================
   TEXT HANDLER
===================== */
bot.on("text", (ctx) => {
  const user = state.get(ctx.from.id);
  if (!user) return;

  if (user.guess) {
    ctx.reply(ctx.message.text == user.guess ? "🎉 Correct!" : `❌ Wrong! It was ${user.guess}`);
    state.delete(ctx.from.id);
    return;
  }

  if (user.quiz) {
    ctx.reply(ctx.message.text.toLowerCase() === user.quiz.toLowerCase()
      ? "✅ Correct!"
      : `❌ Wrong! Answer: ${user.quiz}`);
    state.delete(ctx.from.id);
    return;
  }

  if (user.banType) {
    const phone = ctx.message.text.trim();
    const list = user.banType === "TEMP" ? TEMP_APPEALS : PERM_APPEALS;
    const appeal = list[Math.floor(Math.random() * list.length)].replace("%PHONE%", phone);
    ctx.reply(`🔥 *APPEAL GENERATED*\n\n\`\`\`\n${appeal}\n\`\`\``, { parse_mode: "Markdown" });
    state.delete(ctx.from.id);
  }
});

/* =====================
   WEBHOOK (HARDCODED)
===================== */
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = "https://mrdev-teleunban-bot.onrender.com";

app.use(express.json());
app.use(bot.webhookCallback("/bot"));

bot.launch({
  webhook: {
    domain: WEBHOOK_URL,
    port: PORT,
    hookPath: "/bot"
  }
})
.then(() => console.log("🔥 Bot running (Webhook mode)"))
.catch(err => console.error("❌ Webhook error:", err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
