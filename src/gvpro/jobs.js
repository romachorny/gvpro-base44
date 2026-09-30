/* The five jobs a small Israeli business actually hires an app for, and the demo data behind
   each one. Everything here is invented and lives in memory: the demo saves nothing, sends
   nothing and reaches nothing. Prices are in shekels because the customer is here.

   Every name carries all four languages side by side rather than sitting in ui.js, because a
   croissant and a haircut belong to the demo, not to the interface, and keeping them together
   is what stops one of them being translated and the others forgotten. */

export const JOBS = ['booking', 'orders', 'menu', 'catalogue', 'team'];

/* pick(x, lang) — one string out of the four. */
export function pick(x, lang) {
  if (!x) return '';
  return x[lang] || x.en || x.he || '';
}

const svc = (id, price, mins, he, en, ru, ar) => ({ id, price, mins, name: { he, en, ru, ar } });
const prod = (id, price, he, en, ru, ar, note) => ({ id, price, name: { he, en, ru, ar }, note });

export const DEMO = {
  /* salon, barber, clinic, trainer */
  booking: {
    items: [
      svc('cut', 70, 30, 'תספורת', 'Haircut', 'Стрижка', 'قصّة شعر'),
      svc('fade', 90, 45, 'סקין פייד', 'Skin fade', 'Фейд', 'تدريج'),
      svc('beard', 50, 20, 'סידור זקן', 'Beard trim', 'Борода', 'تهذيب اللحية'),
      svc('color', 180, 90, 'צבע', 'Colour', 'Окрашивание', 'صبغة'),
      svc('kids', 60, 25, 'תספורת ילדים', 'Kids’ cut', 'Детская стрижка', 'قصّة أطفال'),
    ],
    slots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'],
    /* a book with nothing in it looks broken, and one with nothing free looks shut */
    taken: { '0|10:30': 1, '0|15:00': 1, '1|12:00': 1, '2|18:00': 1 },
  },

  /* restaurant, cafe, shop */
  orders: {
    items: [
      prod('sabich', 34, 'סביח בפיתה', 'Sabich in pita', 'Сабих в пите', 'صابيح في خبز'),
      prod('hummus', 38, 'חומוס עם פול', 'Hummus with ful', 'Хумус с фулем', 'حمّص مع فول'),
      prod('shakshuka', 46, 'שקשוקה', 'Shakshuka', 'Шакшука', 'شكشوكة'),
      prod('salad', 32, 'סלט הבית', 'House salad', 'Салат дня', 'سلطة البيت'),
      prod('lemonade', 14, 'לימונדה', 'Lemonade', 'Лимонад', 'ليموناضة'),
      prod('baklava', 18, 'בקלווה', 'Baklava', 'Пахлава', 'بقلاوة'),
    ],
  },

  /* a menu is read, not ordered from: sections, dishes, a line about each */
  menu: {
    sections: [
      {
        id: 'start',
        title: { he: 'ראשונות', en: 'To start', ru: 'Начало', ar: 'المقبلات' },
        items: [
          prod('pita', 12, 'פיתה מהטאבון', 'Taboon pita', 'Пита из тандыра', 'خبز طابون',
            { he: 'נאפית כל שעה', en: 'Baked every hour', ru: 'Печём каждый час', ar: 'تُخبز كل ساعة' }),
          prod('labaneh', 26, 'לבנה עם זעתר', 'Labaneh and za’atar', 'Лабне с заатаром', 'لبنة وزعتر',
            { he: 'שמן זית מהגליל', en: 'Galilee olive oil', ru: 'Оливковое масло из Галилеи', ar: 'زيت زيتون جليلي' }),
          prod('eggplant', 34, 'חציל בגריל', 'Grilled aubergine', 'Баклажан на гриле', 'باذنجان مشوي',
            { he: 'טחינה גולמית', en: 'Raw tahini', ru: 'Сырая тхина', ar: 'طحينة خام' }),
        ],
      },
      {
        id: 'main',
        title: { he: 'עיקריות', en: 'Mains', ru: 'Основные', ar: 'الأطباق الرئيسية' },
        items: [
          prod('fish', 92, 'דג היום', 'Fish of the day', 'Рыба дня', 'سمك اليوم',
            { he: 'מה שהגיע מהנמל', en: 'Whatever came in from the port', ru: 'Что привезли из порта', ar: 'ما وصل من الميناء' }),
          prod('kebab', 68, 'קבב על האש', 'Kebab over coals', 'Кебаб на углях', 'كباب على الفحم',
            { he: 'כבש ובקר', en: 'Lamb and beef', ru: 'Баранина и говядина', ar: 'لحم غنم وبقر' }),
          prod('mejadra', 48, 'מג׳דרה', 'Mejadra', 'Меджадра', 'مجدرة',
            { he: 'עדשים, אורז, בצל מטוגן', en: 'Lentils, rice, fried onion', ru: 'Чечевица, рис, жареный лук', ar: 'عدس وأرز وبصل' }),
        ],
      },
    ],
  },

  /* a catalogue is browsed and asked about */
  catalogue: {
    items: [
      prod('chair', 890, 'כיסא עץ', 'Wooden chair', 'Деревянный стул', 'كرسي خشب'),
      prod('lamp', 420, 'מנורת שולחן', 'Table lamp', 'Настольная лампа', 'مصباح طاولة'),
      prod('rug', 1250, 'שטיח', 'Rug', 'Ковёр', 'سجادة'),
      prod('shelf', 640, 'מדף קיר', 'Wall shelf', 'Полка', 'رف حائط'),
      prod('mirror', 560, 'מראה', 'Mirror', 'Зеркало', 'مرآة'),
      prod('table', 1980, 'שולחן אוכל', 'Dining table', 'Обеденный стол', 'طاولة طعام'),
    ],
    /* which of them is in the shop right now */
    out: ['rug'],
  },

  /* team and shifts */
  team: {
    staff: [
      { id: 'noa', name: { he: 'נועה', en: 'Noa', ru: 'Ноа', ar: 'نوعا' } },
      { id: 'amir', name: { he: 'אמיר', en: 'Amir', ru: 'Амир', ar: 'أمير' } },
      { id: 'dana', name: { he: 'דנה', en: 'Dana', ru: 'Дана', ar: 'دانا' } },
      { id: 'yossi', name: { he: 'יוסי', en: 'Yossi', ru: 'Йоси', ar: 'يوسي' } },
    ],
    /* who is already on which day, by shift. The rest are open and can be taken in the demo. */
    roster: { '0|am': 'noa', '0|pm': 'amir', '1|am': 'dana', '2|pm': 'yossi', '3|am': 'amir' },
  },
};

/* What the owner's dashboard shows for each job: the word for the day's count, and the
   invented numbers behind it. Kept here so the dashboard and the demo agree with each other. */
export const OWNER = {
  booking: { count: 9, revenue: 1240, nextIn: 25 },
  orders: { count: 23, revenue: 1870, nextIn: 6 },
  menu: { count: 31, revenue: 2140, nextIn: 9 },
  catalogue: { count: 7, revenue: 3260, nextIn: 40 },
  team: { count: 6, revenue: 980, nextIn: 15 },
};

/* The tab in the middle of the bar is the job itself; these are the ids, not the words. */
export const JOB_TAB = {
  booking: 'book', orders: 'order', menu: 'menu', catalogue: 'catalogue', team: 'shifts',
};
