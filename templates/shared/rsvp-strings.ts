import type { Locale } from "@/config/locales";

export const RSVP_STRINGS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    name: string;
    phone: string;
    status: string;
    attending: string;
    notAttending: string;
    maybe: string;
    guestCount: string;
    message: string;
    submit: string;
    success: string;
    error: string;
  }
> = {
  uz: {
    title: "Ishtirok etishingizni tasdiqlang",
    subtitle: "To‘yga kelasizmi? Javobingizni yuboring.",
    name: "Ismingiz",
    phone: "Telefon (ixtiyoriy)",
    status: "Javobingiz",
    attending: "Kelaman",
    notAttending: "Kela olmayman",
    maybe: "Aniq emas",
    guestCount: "Nechta kishi (siz bilan)",
    message: "Xabar (ixtiyoriy)",
    submit: "Yuborish",
    success: "Rahmat! Javobingiz qabul qilindi.",
    error: "Xatolik yuz berdi. Qayta urinib ko‘ring.",
  },
  ru: {
    title: "Подтвердите участие",
    subtitle: "Сможете ли вы прийти на свадьбу?",
    name: "Ваше имя",
    phone: "Телефон (необязательно)",
    status: "Ваш ответ",
    attending: "Приду",
    notAttending: "Не смогу",
    maybe: "Не уверен(а)",
    guestCount: "Сколько человек (с вами)",
    message: "Сообщение (необязательно)",
    submit: "Отправить",
    success: "Спасибо! Ваш ответ принят.",
    error: "Ошибка. Попробуйте ещё раз.",
  },
  en: {
    title: "RSVP",
    subtitle: "Will you be joining us?",
    name: "Your name",
    phone: "Phone (optional)",
    status: "Your response",
    attending: "I'll attend",
    notAttending: "Can't attend",
    maybe: "Not sure yet",
    guestCount: "Number of guests (including you)",
    message: "Message (optional)",
    submit: "Submit",
    success: "Thank you! Your response has been received.",
    error: "Something went wrong. Please try again.",
  },
  "uz-Cyrl": {
    title: "Иштирок этишингизни tasdiqlang",
    subtitle: "Тўйга kelasizmi? Javobingizni yuboring.",
    name: "Ismingiz",
    phone: "Telefon (ixtiyoriy)",
    status: "Javobingiz",
    attending: "Kelaman",
    notAttending: "Kela olmayman",
    maybe: "Aniq emas",
    guestCount: "Nechta kishi (siz bilan)",
    message: "Xabar (ixtiyoriy)",
    submit: "Yuborish",
    success: "Rahmat! Javobingiz qabul qilindi.",
    error: "Xatolik yuz berdi. Qayta urinib ko‘ring.",
  },
};
