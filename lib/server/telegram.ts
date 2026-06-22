import { Bot, InlineKeyboard } from "grammy";
import type { Update } from "grammy/types";
import { prisma } from "./db";
import { createOrder } from "./orders";

/**
 * Telegram order flow (webhook-based, no polling). The Route Handler at
 * app/api/telegram/webhook/route.ts is a thin wrapper around `handleUpdate`.
 */

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

let botInstance: Bot | null = null;

export function getBot(): Bot {
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }
  if (botInstance) return botInstance;

  const bot = new Bot(token);

  // /start tpl_<slug>  -> create an order for that template
  bot.command("start", async (ctx) => {
    const payload = ctx.match?.trim();
    const chatId = String(ctx.chat.id);
    const username = ctx.from?.username;

    if (payload?.startsWith("tpl_")) {
      const slug = payload.slice("tpl_".length);
      const template = await prisma.template.findUnique({ where: { slug } });

      if (!template) {
        await ctx.reply(
          "Kechirasiz, bu shablon topilmadi. Iltimos, saytdan qaytadan tanlang.",
        );
        return;
      }

      const order = await createOrder({
        templateId: template.id,
        telegramChatId: chatId,
        telegramUsername: username,
      });

      await ctx.reply(
        `Tabriklaymiz! Siz "${template.name}" shablonini tanladingiz. ✨\n\n` +
          `Buyurtmangiz qabul qilindi. Tez orada operatorimiz bog‘lanadi.\n` +
          `Iltimos, telefon raqamingizni yuboring (ixtiyoriy).`,
        {
          reply_markup: {
            keyboard: [[{ text: "📱 Raqamni yuborish", request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        },
      );

      await notifyAdmin(order.id, template.name, username, chatId);
      return;
    }

    if (payload === "order") {
      await ctx.reply(
        "Assalomu alaykum! 🌸\n\nTaklifnoma shablonini tanlash uchun saytimizdagi katalogga o‘ting. " +
          "Yoqtirgan shabloningizdagi «Buyurtma» tugmasini bosing — buyurtma avtomatik yaratiladi.\n\n" +
          siteUrl,
      );
      return;
    }

    await ctx.reply(
      "Assalomu alaykum! 🌸\n\nTaklifnoma shablonini tanlash uchun saytimizga tashrif buyuring:\n" +
        siteUrl,
    );
  });

  // When the customer shares their contact, attach the phone to the latest order.
  bot.on("message:contact", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const phone = ctx.message.contact.phone_number;
    const latest = await prisma.order.findFirst({
      where: { telegramChatId: chatId },
      orderBy: { createdAt: "desc" },
    });
    if (latest) {
      await prisma.order.update({
        where: { id: latest.id },
        data: { contactPhone: phone },
      });
    }
    await ctx.reply("Rahmat! Raqamingiz saqlandi. ☎️", {
      reply_markup: { remove_keyboard: true },
    });
  });

  botInstance = bot;
  return bot;
}

async function notifyAdmin(
  orderId: string,
  templateName: string,
  username: string | undefined,
  chatId: string,
) {
  if (!adminChatId) return;
  const bot = getBot();
  const keyboard = new InlineKeyboard().url(
    "🛠 Open in Admin Panel",
    `${siteUrl}/admin/orders/${orderId}`,
  );
  await bot.api.sendMessage(
    adminChatId,
    `🆕 Yangi buyurtma!\n\n` +
      `Shablon: ${templateName}\n` +
      `Mijoz: ${username ? "@" + username : "—"} (chat ${chatId})\n` +
      `Order ID: ${orderId}`,
    { reply_markup: keyboard },
  );
}

/** Send the customer their final published invitation link. */
export async function notifyCustomerPublished(
  chatId: string,
  url: string,
  names: string,
) {
  if (!token) return;
  const bot = getBot();
  await bot.api.sendMessage(
    chatId,
    `🎉 Taklifnomangiz tayyor!\n\n${names}\n\nHavola: ${url}`,
  );
}

/** Process one Telegram update (called from the webhook route). */
export async function handleUpdate(update: Update): Promise<void> {
  const bot = getBot();
  // grammy needs to know its bot info before handling updates in webhook mode.
  if (!bot.isInited()) {
    await bot.init();
  }
  await bot.handleUpdate(update);
}
