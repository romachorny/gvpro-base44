/* Every word of GVPro, in the four languages it speaks. Hebrew first, because the customer is
   in Israel and the app opens in Hebrew unless the link or the browser says otherwise.
   The demo's own nouns — services, dishes, products, staff — live in jobs.js beside the data
   they belong to, not here. */

export const LANGS = ['he', 'en', 'ru', 'ar'];
export const RTL_LANGS = ['he', 'ar'];
export const LANG_LABEL = { he: 'עברית', en: 'English', ru: 'Русский', ar: 'العربية' };

export function isRTL(lang) { return RTL_LANGS.indexOf(lang) >= 0; }
export function dirOf(lang) { return isRTL(lang) ? 'rtl' : 'ltr'; }

export const UI = {
  he: {
    brand: 'GVPro',
    tagline: 'האפליקציה של העסק שלך, בדקה',
    q1: 'מה העסק שלך צריך?',
    nameLabel: 'איך קוראים לעסק?',
    namePh: 'למשל: המספרה של משה',
    next: 'ממשיכים', back: 'חזרה', close: 'סגירה', lang: 'שפה',
    share: 'שיתוף', copied: 'הקישור הועתק', copyFail: 'לא הצלחנו להעתיק את הקישור',

    job_booking: 'תורים', job_booking_eg: 'מספרה, סלון, מרפאה, מאמן',
    job_orders: 'הזמנות', job_orders_eg: 'מסעדה, בית קפה, חנות',
    job_menu: 'תפריט', job_menu_eg: 'מסעדה, בר, קייטרינג',
    job_catalogue: 'קטלוג', job_catalogue_eg: 'חנות, סטודיו, יבואן',
    job_team: 'צוות ומשמרות', job_team_eg: 'צוות של כמה אנשים',

    colourTitle: 'צבע',
    cta: 'אני רוצה את האפליקציה הזאת',
    gift: 'מתנה: האפליקציה שלך עובדת גם כאתר במחשב, בלפטופ ובטאבלט.',

    tabHome: 'בית', tabOwner: 'ניהול',
    tab_book: 'תור', tab_order: 'הזמנה', tab_menu: 'תפריט', tab_catalogue: 'קטלוג', tab_shifts: 'משמרות',

    demoNote: 'הדגמה. שום דבר לא נשמר ולא נשלח.',
    demoEmpty: 'עדיין אין כאן כלום.',
    total: 'סה״כ', confirm: 'אישור',

    pickService: 'מה תרצו?', pickTime: 'מתי?',
    minutes: '{n} דק׳', slotTaken: 'תפוס',
    bookedTitle: 'התור נקבע', bookedLine: '{what} · {when}',
    today: 'היום',
    days: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],

    addToCart: 'הוספה', cart: 'העגלה', checkout: 'לתשלום',
    orderedTitle: 'ההזמנה נקלטה', pickup: 'איסוף עצמי', delivery: 'משלוח',

    menuNote: 'לחצו על מנה כדי לקרוא עליה',
    inStock: 'במלאי', outOfStock: 'אזל', askAbout: 'שאלו עליו', asked: 'השאלה נשלחה',

    amShift: 'בוקר', pmShift: 'ערב', openShift: 'פנוי', take: 'לקחת', taken: 'המשמרת שלכם',

    ownerToday: 'היום', ownerRevenue: 'הכנסה', ownerNext: 'הלקוח הבא',
    ownerNextIn: 'בעוד {n} דק׳',
    ownerCount_booking: 'תורים', ownerCount_orders: 'הזמנות', ownerCount_menu: 'צפיות בתפריט',
    ownerCount_catalogue: 'פניות', ownerCount_team: 'משמרות',

    openNow: 'פתוח עכשיו', hoursLabel: 'שעות', whereLabel: 'איפה',
    hoursLine: 'א׳–ה׳ 09:00–19:00 · ו׳ 09:00–14:00',
    addressLine: 'רחוב לוינסקי 22, תל אביב',
    callBtn: 'חיוג', waBtn: 'וואטסאפ',

    pkgTitle: 'שלוש דרכים להתחיל',
    pkgStart: 'סטארט', pkgStartLine: 'עבודה אחת, אפליקציה מוכנה, מתקינה בטלפון.',
    pkgBusiness: 'ביזנס', pkgBusinessLine: 'בנוסף מסך ניהול, התראות בוואטסאפ ועיצוב משלכם.',
    pkgPro: 'פרו', pkgProLine: 'תשלומים, יותר מסניף אחד, וכל מה שהעסק באמת צריך.',
    pkgFrom: 'מ־', pkgPicked: 'נבחר',
    ownBase44: 'בנוי על Base44 — חשבון האפליקציה שייך לכם.',
    pkgGo: 'להשאיר פרטים',

    formTitle: 'האפליקציה שלכם',
    formNote: 'השאירו פרטים ונחזור אליכם בוואטסאפ.',
    fName: 'השם שלכם', fBiz: 'שם העסק', fWa: 'מספר וואטסאפ', fMsg: 'משהו להוסיף? (לא חובה)',
    fWaPh: '050-123-4567',
    send: 'שליחה', sending: 'שולח…',
    errName: 'כתבו את השם שלכם.', errBiz: 'כתבו את שם העסק.',
    errWa: 'זה לא נראה כמו מספר טלפון.', errSave: 'זה לא נשלח. נסו שוב.',
    thanks: 'קיבלנו.',
    thanksNote: 'הפרטים אצלנו. פתחו וואטסאפ ונמשיך שם — זו הדרך הכי מהירה.',
    openWa: 'ממשיכים בוואטסאפ',
    waOpener: 'היי! אני רוצה אפליקציה לעסק',

    by: 'מבית GenVidPro', builtOn: 'נבנה על Base44',

    admin: 'לידים', adminOnly: 'הדף הזה לסטודיו.', empty: 'אין לידים עדיין.',
    thWhen: 'מתי', thName: 'שם', thBiz: 'עסק', thWa: 'וואטסאפ', thJob: 'עבודה',
    thColour: 'צבע', thPkg: 'חבילה', thLang: 'שפה', thNote: 'הערה', thStatus: 'סטטוס',
    stNew: 'חדש', stContacted: 'יצרנו קשר', stWon: 'נסגר', stLost: 'לא יצא',
  },

  en: {
    brand: 'GVPro',
    tagline: 'your business app, in a minute',
    q1: 'What does your business need?',
    nameLabel: 'Your business name',
    namePh: "e.g. Moshe's Barbershop",
    next: 'Continue', back: 'Back', close: 'Close', lang: 'Language',
    share: 'Share', copied: 'Link copied', copyFail: 'Could not copy the link',

    job_booking: 'Booking', job_booking_eg: 'salon, barber, clinic, trainer',
    job_orders: 'Orders', job_orders_eg: 'restaurant, cafe, shop',
    job_menu: 'Menu', job_menu_eg: 'restaurant, bar, catering',
    job_catalogue: 'Catalogue', job_catalogue_eg: 'shop, studio, importer',
    job_team: 'Team and shifts', job_team_eg: 'a few people on a rota',

    colourTitle: 'Colour',
    cta: 'I want this app',
    gift: 'Gift: your app also works as a website on computer, laptop and tablet.',

    tabHome: 'Home', tabOwner: 'Owner',
    tab_book: 'Book', tab_order: 'Order', tab_menu: 'Menu', tab_catalogue: 'Catalogue', tab_shifts: 'Shifts',

    demoNote: 'A demo. Nothing is saved and nothing is sent.',
    demoEmpty: 'Nothing here yet.',
    total: 'Total', confirm: 'Confirm',

    pickService: 'What would you like?', pickTime: 'When?',
    minutes: '{n} min', slotTaken: 'taken',
    bookedTitle: 'Booked', bookedLine: '{what} · {when}',
    today: 'Today',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    addToCart: 'Add', cart: 'Cart', checkout: 'Checkout',
    orderedTitle: 'Order received', pickup: 'Pick up', delivery: 'Delivery',

    menuNote: 'Tap a dish to read about it',
    inStock: 'In stock', outOfStock: 'Out of stock', askAbout: 'Ask about it', asked: 'Question sent',

    amShift: 'Morning', pmShift: 'Evening', openShift: 'Open', take: 'Take it', taken: 'Yours',

    ownerToday: 'Today', ownerRevenue: 'Revenue', ownerNext: 'Next customer',
    ownerNextIn: 'in {n} min',
    ownerCount_booking: 'bookings', ownerCount_orders: 'orders', ownerCount_menu: 'menu views',
    ownerCount_catalogue: 'enquiries', ownerCount_team: 'shifts',

    openNow: 'Open now', hoursLabel: 'Hours', whereLabel: 'Where',
    hoursLine: 'Sun–Thu 09:00–19:00 · Fri 09:00–14:00',
    addressLine: '22 Levinsky St, Tel Aviv',
    callBtn: 'Call', waBtn: 'WhatsApp',

    pkgTitle: 'Three ways in',
    pkgStart: 'Start', pkgStartLine: 'One job, a finished app, installs on the phone.',
    pkgBusiness: 'Business', pkgBusinessLine: 'Plus the owner screen, WhatsApp notices and your own look.',
    pkgPro: 'Pro', pkgProLine: 'Payments, more than one branch, and whatever else the business really needs.',
    pkgFrom: 'from', pkgPicked: 'Chosen',
    ownBase44: 'Built on Base44 — the app account belongs to you.',
    pkgGo: 'Leave my details',

    formTitle: 'Your app',
    formNote: 'Leave your details and we answer on WhatsApp.',
    fName: 'Your name', fBiz: 'Business name', fWa: 'WhatsApp number', fMsg: 'Anything to add? (optional)',
    fWaPh: '+972 50 123 4567',
    send: 'Send', sending: 'Sending…',
    errName: 'Please write your name.', errBiz: 'Please write the name of the business.',
    errWa: 'That does not look like a phone number.', errSave: 'It did not go through. Try again.',
    thanks: 'Got it.',
    thanksNote: 'We have your details. Open WhatsApp and we carry on there — it is the fastest way.',
    openWa: 'Continue on WhatsApp',
    waOpener: 'Hi! I want an app for my business',

    by: 'by GenVidPro', builtOn: 'Built on Base44',

    admin: 'Leads', adminOnly: 'This page is for the studio.', empty: 'No leads yet.',
    thWhen: 'When', thName: 'Name', thBiz: 'Business', thWa: 'WhatsApp', thJob: 'Job',
    thColour: 'Colour', thPkg: 'Package', thLang: 'Lang', thNote: 'Note', thStatus: 'Status',
    stNew: 'new', stContacted: 'contacted', stWon: 'won', stLost: 'lost',
  },

  ru: {
    brand: 'GVPro',
    tagline: 'приложение вашего дела, за минуту',
    q1: 'Что нужно вашему делу?',
    nameLabel: 'Как называется бизнес?',
    namePh: 'Например: Барбершоп Моше',
    next: 'Дальше', back: 'Назад', close: 'Закрыть', lang: 'Язык',
    share: 'Поделиться', copied: 'Ссылка скопирована', copyFail: 'Не удалось скопировать ссылку',

    job_booking: 'Запись', job_booking_eg: 'салон, барбер, клиника, тренер',
    job_orders: 'Заказы', job_orders_eg: 'ресторан, кафе, магазин',
    job_menu: 'Меню', job_menu_eg: 'ресторан, бар, кейтеринг',
    job_catalogue: 'Каталог', job_catalogue_eg: 'магазин, студия, импортёр',
    job_team: 'Команда и смены', job_team_eg: 'несколько человек в графике',

    colourTitle: 'Цвет',
    cta: 'Хочу это приложение',
    gift: 'Подарок: ваше приложение работает и как сайт — на компьютере, ноутбуке и планшете.',

    tabHome: 'Главная', tabOwner: 'Владельцу',
    tab_book: 'Запись', tab_order: 'Заказ', tab_menu: 'Меню', tab_catalogue: 'Каталог', tab_shifts: 'Смены',

    demoNote: 'Это демо. Ничего не сохраняется и никуда не уходит.',
    demoEmpty: 'Здесь пока пусто.',
    total: 'Итого', confirm: 'Подтвердить',

    pickService: 'Что вам нужно?', pickTime: 'Когда?',
    minutes: '{n} мин', slotTaken: 'занято',
    bookedTitle: 'Записали', bookedLine: '{what} · {when}',
    today: 'Сегодня',
    days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],

    addToCart: 'Добавить', cart: 'Корзина', checkout: 'Оформить',
    orderedTitle: 'Заказ принят', pickup: 'Самовывоз', delivery: 'Доставка',

    menuNote: 'Нажмите на блюдо, чтобы прочитать о нём',
    inStock: 'В наличии', outOfStock: 'Нет в наличии', askAbout: 'Спросить о нём', asked: 'Вопрос отправлен',

    amShift: 'Утро', pmShift: 'Вечер', openShift: 'Свободно', take: 'Взять', taken: 'Ваша смена',

    ownerToday: 'Сегодня', ownerRevenue: 'Выручка', ownerNext: 'Следующий клиент',
    ownerNextIn: 'через {n} мин',
    ownerCount_booking: 'записей', ownerCount_orders: 'заказов', ownerCount_menu: 'просмотров меню',
    ownerCount_catalogue: 'обращений', ownerCount_team: 'смен',

    openNow: 'Сейчас открыто', hoursLabel: 'Часы', whereLabel: 'Адрес',
    hoursLine: 'Вс–Чт 09:00–19:00 · Пт 09:00–14:00',
    addressLine: 'ул. Левински 22, Тель-Авив',
    callBtn: 'Позвонить', waBtn: 'WhatsApp',

    pkgTitle: 'Три способа начать',
    pkgStart: 'Start', pkgStartLine: 'Одна задача, готовое приложение, ставится на телефон.',
    pkgBusiness: 'Business', pkgBusinessLine: 'Плюс экран владельца, уведомления в WhatsApp и свой вид.',
    pkgPro: 'Pro', pkgProLine: 'Оплаты, несколько точек и всё остальное, что делу правда нужно.',
    pkgFrom: 'от', pkgPicked: 'Выбрано',
    ownBase44: 'Сделано на Base44 — аккаунт приложения принадлежит вам.',
    pkgGo: 'Оставить контакты',

    formTitle: 'Ваше приложение',
    formNote: 'Оставьте контакты — ответим в WhatsApp.',
    fName: 'Ваше имя', fBiz: 'Название бизнеса', fWa: 'Номер WhatsApp', fMsg: 'Что-то добавить? (необязательно)',
    fWaPh: '+972 50 123 4567',
    send: 'Отправить', sending: 'Отправляем…',
    errName: 'Напишите ваше имя.', errBiz: 'Напишите название бизнеса.',
    errWa: 'Это не похоже на номер телефона.', errSave: 'Не отправилось. Попробуйте ещё раз.',
    thanks: 'Получили.',
    thanksNote: 'Контакты у нас. Откройте WhatsApp — там продолжим, так быстрее всего.',
    openWa: 'Продолжить в WhatsApp',
    waOpener: 'Здравствуйте! Хочу приложение для бизнеса',

    by: 'от GenVidPro', builtOn: 'Сделано на Base44',

    admin: 'Лиды', adminOnly: 'Эта страница — для студии.', empty: 'Лидов пока нет.',
    thWhen: 'Когда', thName: 'Имя', thBiz: 'Бизнес', thWa: 'WhatsApp', thJob: 'Задача',
    thColour: 'Цвет', thPkg: 'Пакет', thLang: 'Язык', thNote: 'Заметка', thStatus: 'Статус',
    stNew: 'новый', stContacted: 'связались', stWon: 'выиграли', stLost: 'не вышло',
  },

  ar: {
    brand: 'GVPro',
    tagline: 'تطبيق عملك، خلال دقيقة',
    q1: 'ماذا يحتاج عملك؟',
    nameLabel: 'ما اسم نشاطك؟',
    namePh: 'مثلاً: صالون موسى',
    next: 'متابعة', back: 'رجوع', close: 'إغلاق', lang: 'اللغة',
    share: 'مشاركة', copied: 'تم نسخ الرابط', copyFail: 'تعذّر نسخ الرابط',

    job_booking: 'حجوزات', job_booking_eg: 'صالون، حلاقة، عيادة، مدرب',
    job_orders: 'طلبات', job_orders_eg: 'مطعم، مقهى، متجر',
    job_menu: 'قائمة طعام', job_menu_eg: 'مطعم، بار، تموين',
    job_catalogue: 'كتالوج', job_catalogue_eg: 'متجر، استوديو، مستورد',
    job_team: 'الفريق والورديات', job_team_eg: 'عدة أشخاص في جدول',

    colourTitle: 'اللون',
    cta: 'أريد هذا التطبيق',
    gift: 'هدية: تطبيقك يعمل أيضاً كموقع على الحاسوب واللابتوب والجهاز اللوحي.',

    tabHome: 'الرئيسية', tabOwner: 'الإدارة',
    tab_book: 'حجز', tab_order: 'طلب', tab_menu: 'القائمة', tab_catalogue: 'الكتالوج', tab_shifts: 'الورديات',

    demoNote: 'عرض تجريبي. لا شيء يُحفظ ولا يُرسل.',
    demoEmpty: 'لا شيء هنا بعد.',
    total: 'المجموع', confirm: 'تأكيد',

    pickService: 'ماذا تريد؟', pickTime: 'متى؟',
    minutes: '{n} د',
    slotTaken: 'محجوز',
    bookedTitle: 'تم الحجز', bookedLine: '{what} · {when}',
    today: 'اليوم',
    days: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],

    addToCart: 'إضافة', cart: 'السلة', checkout: 'إتمام الطلب',
    orderedTitle: 'تم استلام الطلب', pickup: 'استلام', delivery: 'توصيل',

    menuNote: 'اضغط على طبق لتقرأ عنه',
    inStock: 'متوفر', outOfStock: 'غير متوفر', askAbout: 'اسأل عنه', asked: 'أُرسل السؤال',

    amShift: 'صباح', pmShift: 'مساء', openShift: 'متاح', take: 'خذها', taken: 'ورديتك',

    ownerToday: 'اليوم', ownerRevenue: 'الإيراد', ownerNext: 'الزبون التالي',
    ownerNextIn: 'خلال {n} د',
    ownerCount_booking: 'حجوزات', ownerCount_orders: 'طلبات', ownerCount_menu: 'مشاهدات للقائمة',
    ownerCount_catalogue: 'استفسارات', ownerCount_team: 'ورديات',

    openNow: 'مفتوح الآن', hoursLabel: 'الساعات', whereLabel: 'العنوان',
    hoursLine: 'أحد–خميس 09:00–19:00 · جمعة 09:00–14:00',
    addressLine: 'شارع ليفينسكي 22، تل أبيب',
    callBtn: 'اتصال', waBtn: 'واتساب',

    pkgTitle: 'ثلاث طرق للبدء',
    pkgStart: 'Start', pkgStartLine: 'مهمة واحدة، تطبيق جاهز، يُثبَّت على الهاتف.',
    pkgBusiness: 'Business', pkgBusinessLine: 'إضافةً إلى شاشة الإدارة وإشعارات واتساب ومظهر خاص بك.',
    pkgPro: 'Pro', pkgProLine: 'مدفوعات، أكثر من فرع، وكل ما يحتاجه العمل فعلاً.',
    pkgFrom: 'من', pkgPicked: 'مختار',
    ownBase44: 'مبني على Base44 — حساب التطبيق ملكك.',
    pkgGo: 'أترك بياناتي',

    formTitle: 'تطبيقك',
    formNote: 'اترك بياناتك ونرد عليك في واتساب.',
    fName: 'اسمك', fBiz: 'اسم النشاط', fWa: 'رقم واتساب', fMsg: 'شيء تضيفه؟ (اختياري)',
    fWaPh: '050-123-4567',
    send: 'إرسال', sending: 'جارٍ الإرسال…',
    errName: 'اكتب اسمك من فضلك.', errBiz: 'اكتب اسم النشاط من فضلك.',
    errWa: 'هذا لا يبدو رقم هاتف.', errSave: 'لم يُرسل. حاول مرة أخرى.',
    thanks: 'وصلنا.',
    thanksNote: 'بياناتك عندنا. افتح واتساب ونكمل هناك — إنها أسرع طريقة.',
    openWa: 'نكمل في واتساب',
    waOpener: 'مرحباً! أريد تطبيقاً لعملي',

    by: 'من GenVidPro', builtOn: 'مبني على Base44',

    admin: 'العملاء', adminOnly: 'هذه الصفحة للاستوديو.', empty: 'لا يوجد عملاء بعد.',
    thWhen: 'متى', thName: 'الاسم', thBiz: 'النشاط', thWa: 'واتساب', thJob: 'المهمة',
    thColour: 'اللون', thPkg: 'الباقة', thLang: 'اللغة', thNote: 'ملاحظة', thStatus: 'الحالة',
    stNew: 'جديد', stContacted: 'تواصلنا', stWon: 'تم', stLost: 'لم ينجح',
  },
};

/* tr(lang, key, vars) — the word, with {n}-style holes filled. Falls back to Hebrew, which is
   the language this app is written in, not to English. */
export function tr(lang, key, vars) {
  const pack = UI[lang] || UI.he;
  let out = pack[key] != null ? pack[key] : UI.he[key];
  if (out == null) return key;
  if (vars && typeof out === 'string') {
    Object.keys(vars).forEach((k) => { out = out.split('{' + k + '}').join(String(vars[k])); });
  }
  return out;
}

/* An empty field still shows a real app: an example name in the language on screen. */
export const SAMPLE_NAME = {
  he: 'המספרה של משה', en: "Moshe's Barbershop", ru: 'Барбершоп Моше', ar: 'صالون موسى',
};
