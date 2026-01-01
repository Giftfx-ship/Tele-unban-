require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const state = new Map();

/* =====================
   APPEAL TEMPLATES
===================== */

const TEMP_APPEALS = [
`Hello WhatsApp Support Team,

My WhatsApp account (%PHONE%) was temporarily banned.
I believe this restriction may have been applied in error.

I respectfully request a review of my account.
Thank you for your time.`,

`Dear WhatsApp Support,

My account (%PHONE%) has been temporarily restricted.
I rely on WhatsApp for important communication and always aim to follow your policies.

Kindly review my account.
Thank you.`,

`Hello WhatsApp Team,

My WhatsApp account (%PHONE%) was temporarily blocked.
If any violation occurred, it was unintentional.

I kindly request a review.
Best regards.`,

`Hello Support Team,

My account (%PHONE%) has been temporarily banned.
I respectfully ask for a review, as I value WhatsApp and its guidelines.

Thank you.`,

`Dear WhatsApp Support Team,

My WhatsApp account (%PHONE%) was temporarily banned without prior notice.
I kindly request a review of this action.

Thank you for your assistance.`
];

const PERM_APPEALS = [
`Hello WhatsApp Support Team,

My WhatsApp account (%PHONE%) has been permanently banned.
I believe this may be a misunderstanding, as I have always used WhatsApp responsibly.

I kindly request a careful review.
Thank you.`,

`Dear WhatsApp Support,

I recently discovered that my account (%PHONE%) was permanently disabled.
If any violation occurred, it was not intentional.

I respectfully request a review and reconsideration.
Thank you.`,

`Hello WhatsApp Team,

My account (%PHONE%) has been permanently banned.
I value WhatsApp greatly and would appreciate a full review of my account.

Sincerely.`,

`Hello Support Team,

My WhatsApp account (%PHONE%) was permanently banned.
I rely on this account for essential communication and respectfully request a review.

Thank you.`,

`Dear WhatsApp Support,

I was surprised to learn that my account (%PHONE%) is permanently banned.
I kindly ask for a review, as I believe this may have been an error.

Thank you for your time.`
];

/* =====================
   START COMMAND
===================== */

bot.start((ctx) => {
  state.delete(ctx.from.id);

  ctx.reply(
    `😈 *WHATSAPP UNBAN APPEAL BOT*\n\n` +
    `Restricted. Silenced. Cut off.\n` +
    `Prepare your appeal the right way.\n\n` +
    `Choose your ban type 👇`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("⏳ TEMPORARY BAN", "TEMP"),
          Markup.button.callback("⛔ PERMANENT BAN", "PERM")
        ]
      ])
    }
  );
});

/* =====================
   BAN TYPE HANDLER
===================== */

bot.action(["TEMP", "PERM"], (ctx) => {
  state.set(ctx.from.id, { banType: ctx.callbackQuery.data });

  ctx.reply(
    `📱 *Enter your WhatsApp number*\n` +
    `_Include country code_\n\n` +
    `Example:\n+2348012345678`,
    { parse_mode: "Markdown" }
  );

  ctx.answerCbQuery();
});

/* =====================
   PHONE NUMBER HANDLER
===================== */

bot.on("text", (ctx) => {
  const user = state.get(ctx.from.id);
  if (!user) return;

  const phone = ctx.message.text.trim();
  const appeals =
    user.banType === "TEMP" ? TEMP_APPEALS : PERM_APPEALS;

  const appeal =
    appeals[Math.floor(Math.random() * appeals.length)]
      .replace("%PHONE%", phone);

  state.set(ctx.from.id, {
    banType: user.banType,
    phone
  });

  ctx.reply(
    `🔥 *APPEAL PREPARED SUCCESSFULLY*\n\n` +
    "```\n" +
    appeal +
    "\n```\n\n" +
    `📤 *Next Step*\n` +
    `Submit this appeal using WhatsApp’s official review system.\n\n` +
    `⏳ *What Happens Next*\n` +
    `• WhatsApp reviews your request\n` +
    `• Response usually takes 24–72 hours\n` +
    `• Final decision is made by WhatsApp\n\n` +
    `—\n` +
    `👨‍💻 *Made by Mr Dev*`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.url(
            "📤 Submit Appeal (Official)",
            "https://www.whatsapp.com/contact/"
          )
        ],
        [
          Markup.button.callback("🔁 Generate Another Appeal", "RETRY")
        ]
      ])
    }
  );
});

/* =====================
   RETRY HANDLER
===================== */

bot.action("RETRY", (ctx) => {
  const user = state.get(ctx.from.id);
  if (!user) return ctx.answerCbQuery();

  const appeals =
    user.banType === "TEMP" ? TEMP_APPEALS : PERM_APPEALS;

  const newAppeal =
    appeals[Math.floor(Math.random() * appeals.length)]
      .replace("%PHONE%", user.phone);

  ctx.editMessageText(
    `🔥 *NEW APPEAL PREPARED*\n\n` +
    "```\n" +
    newAppeal +
    "\n```\n\n" +
    `📤 *Next Step*\n` +
    `Submit this appeal using WhatsApp’s official review system.\n\n` +
    `⏳ *Review handled by WhatsApp*\n\n` +
    `—\n` +
    `👨‍💻 *Made by Mr Dev*`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.url(
            "📤 Submit Appeal (Official)",
            "https://www.whatsapp.com/contact/"
          )
        ],
        [
          Markup.button.callback("🔁 Generate Again", "RETRY")
        ]
      ])
    }
  );

  ctx.answerCbQuery();
});

/* =====================
   LAUNCH BOT
===================== */

bot.launch();
console.log("😈 WhatsApp Unban Appeal Bot is running...");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
