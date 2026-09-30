/* GVPro template engine — ported verbatim from app.genvidpro.com (public/tpl-engine.js,
   commit ce4005e, 29.09.2026). Five niches x twelve styles = sixty pages, every one of them
   rendered into an iframe srcdoc exactly as today. Nothing inside the IIFE was touched: the
   only change is the ES export added under it, so React can import what used to be a global.
   Re-porting = copy the file again and re-apply that tail. */
/* eslint-disable */
(function(){
// Пять категорий, заполненных до конца. Раньше в списке стояло двенадцать, а
// содержимое было одно - барбершопное: человек выбирал «стоматологию» и получал
// сайт с фейдами и горячим полотенцем. Лучше пять настоящих, чем двенадцать
// подписей. Каждая категория несёт свой прайс, свои карточки, свои фотографии,
// свои часы и свой текст кнопок; шаблон - только одежда поверх этого.
//
// Ключи, которые читает page():
//   name/tag/city   - что подставляется в конструкторе по умолчанию
//   trade           - как называется дело в служебных строках
//   book*/ask       - надписи кнопок и текст письма в WhatsApp
//   services        - шесть строк прайса: [название, цена, срок, одна строка]
//   cells           - четыре плитки для макета grid: [заголовок, строка, № услуги]
//   ph/phCap        - фотографии и подписи под ними
//   show            - витрина внизу страницы: заголовок, подписи, кнопка
//   looks           - кадры витрины: [файл, что это, чем отличается]
var CATS=[["barber","Barbershop"],["clinic","Dental clinic"],["bakery","Bakery"],["yoga","Yoga studio"],["garage","Car garage"]];
var CAT={
 barber:{
  name:"Barber Shop", tag:"Fades, beards and hot towels in Florentin", city:"14 Vital St, Tel Aviv",
  trade:"barbershop", kicker:"barber &amp; grooming", small:"gentlemen’s barber",
  seal:"EST. 2019 &middot; CUTS &middot; SHAVES &middot; BEARDS &middot; ",
  book:"Book a haircut", bookNow:"Book a haircut now", appt:"Make an appointment", bookShort:"Book",
  ask:"I would like to book a haircut. What do you have open?", askOne:"I would like to book",
  priceLink:"see the price list", listTitle:"The list",
  open:"Open Sun&ndash;Fri &middot; walk in or book", late:"open till 22:00 &middot; last cut 21:30",
  hours:"Sun&ndash;Thu 09:00&ndash;20:00<br>Fri 09:00&ndash;14:00",
  hoursLine:"sun&ndash;thu 09&ndash;20 &nbsp;&middot;&nbsp; fri 09&ndash;14",
  hoursFull:"Sun&ndash;Thu 09:00&ndash;20:00<br>Fri 09:00&ndash;14:00<br>Sat closed",
  walkTitle:"Walk in or book", walkNote:"Before noon you usually walk straight in, no waiting.",
  facts:["2 barbers","since 2019"], slot:"next free slot today &middot; 14:30", freeSlot:"Free slot today",
  marquee:"FADES &nbsp;&middot;&nbsp; BEARDS &nbsp;&middot;&nbsp; HOT TOWEL",
  strip:" WALK IN &nbsp;&middot;&nbsp; SIT DOWN &nbsp;&middot;&nbsp; LOOK SHARP &nbsp;&middot;&nbsp; ",
  three:"fades &middot; beards &middot; hot towel", zineKick:"cuts",
  story:"One room, two barbers, no music you have to shout over. Clippers on since 2019. Come before noon and you usually walk straight in. Everything else is on the list, and the list has not moved much in five years.",
  call:"Call the shop", msg:"Message the shop",
  titles:{fade:"What we do",pole:"On the board",salon:"The services",neon:"On tonight",poster:"Four things",zine:"Cut out and keep",mag:"The regulars",kiosk:"Pick one and go",bands:"Four bands, four cuts",gold:"The four we are known for",grid:"What we do",mono:"The four we are known for"},
  services:[
   ["Haircut","&#8362;70","30 min","Wash, cut, style. The everyday one."],
   ["Skin fade","&#8362;90","45 min","Skin, taper or drop, blended by hand."],
   ["Beard trim","&#8362;50","20 min","Shaped, lined, oiled."],
   ["Hot towel shave","&#8362;110","40 min","Straight razor, hot towel, balm."],
   ["Kids’ cut","&#8362;60","25 min","Up to age 12. Sticker after."],
   ["Head shave","&#8362;80","30 min","Clean skin, cooled and oiled."]],
  cells:[["Fades","Skin, taper, drop. Clipper work all day, every day.",1],
         ["Beards","Shaped, lined, oiled. Straight razor if you want it.",2],
         ["Hot towel","Twenty minutes. Nobody makes you talk.",3],
         ["Kids","The little seat with the truck on it. Sticker after.",4]],
  ph:{hero:"clippers",room:"shop-window",night:"night",detail:"razor",tool:"scissors",door:"storefront"},
  clips:{"shop-window":"barber"},
  phCap:{hero:"Clippers on a skin fade",room:"The room, wide",night:"The room at night",detail:"Straight razor on a beard",tool:"Scissors and comb",door:"The door, so people find you"},
  show:{title:"Try it on",unit:"looks",note:"one barbershop &mdash; running on a loop",
   lead:"Every one of these walked out of our shop. Point at the one you want and we will cut it.",
   tags:"fades &middot; beards &middot; colour &middot; hot towel", cta:"I want this one",
   want:"I want the {a} with {b}. When do you have a slot?",
   foot:"Send us your photo on WhatsApp and we send back three previews of you with that cut the same day."},
  looks:[["look-01","Skin fade","Full black beard"],["look-02","Pompadour","Ginger beard"],["look-03","Buzz cut","Long grey beard"],
         ["look-04","Curly top","Shaped goatee"],["look-05","Slick back","Salt and pepper"],["look-06","Man bun","Big bushy beard"],
         ["look-07","French crop","Blond stubble"],["look-08","Afro","Full beard"],["look-09","Undercut","Braided beard"]]
 },

 clinic:{
  name:"Dental Studio", tag:"Quiet dentistry, five minutes from Rothschild", city:"9 Ahad Ha’Am St, Tel Aviv"  /* real apostrophe: name, tag and city go through esc(), so an HTML entity here prints as literal ’ */,
  trade:"dental clinic", kicker:"dental &amp; hygiene", small:"family dentistry",
  seal:"EST. 2016 &middot; CARE &middot; HYGIENE &middot; SMILES &middot; ",
  book:"Book a check-up", bookNow:"Book a check-up now", appt:"Make an appointment", bookShort:"Book",
  ask:"I would like to book a check-up. What do you have open?", askOne:"I would like to book",
  priceLink:"see the price list", listTitle:"What it costs",
  open:"Open Sun&ndash;Thu &middot; same-week appointments", late:"open till 20:00 &middot; last patient 19:30",
  hours:"Sun&ndash;Thu 08:00&ndash;20:00<br>Fri 08:00&ndash;13:00",
  hoursLine:"sun&ndash;thu 08&ndash;20 &nbsp;&middot;&nbsp; fri 08&ndash;13",
  hoursFull:"Sun&ndash;Thu 08:00&ndash;20:00<br>Fri 08:00&ndash;13:00<br>Sat closed",
  walkTitle:"Nervous about it", walkNote:"Tell us before you come and we take it slowly. Nobody is rushed in that chair.",
  facts:["3 dentists","since 2016"], slot:"next free chair today &middot; 15:10", freeSlot:"Chair free today",
  marquee:"CHECK-UPS &nbsp;&middot;&nbsp; HYGIENE &nbsp;&middot;&nbsp; WHITENING",
  strip:" WALK IN &nbsp;&middot;&nbsp; SIT BACK &nbsp;&middot;&nbsp; BREATHE &nbsp;&middot;&nbsp; ",
  three:"check-ups &middot; hygiene &middot; whitening", zineKick:"teeth",
  story:"Two chairs, three dentists, and a waiting room nobody dreads. Digital x-ray, so you see what we see before anything happens. Prices are on the wall and on this page, and they do not change when you sit down.",
  call:"Call the clinic", msg:"Message the clinic",
  titles:{fade:"What we do",pole:"On the board",salon:"The treatments",neon:"Open this evening",poster:"Four things",zine:"Cut out and keep",mag:"The regulars",kiosk:"Pick one and book",bands:"Four treatments",gold:"The four we are known for",grid:"What we do",mono:"The four we are known for"},
  services:[
   ["Check-up","&#8362;250","30 min","Full look, digital x-ray, a plan you can read."],
   ["Hygiene and polish","&#8362;450","45 min","Scale, polish, fluoride. Twice a year is plenty."],
   ["White filling","&#8362;550","40 min","Matched to the tooth, done in one visit."],
   ["Whitening","&#8362;1,600","60 min","In the chair, six shades, no sensitivity kit needed."],
   ["Kids’ visit","&#8362;220","25 min","Counting teeth, no drilling. Sticker after."],
   ["Implant consult","free","20 min","Scan, options and a written price. No pressure."]],
  cells:[["Check-ups","Digital x-ray and a plan you can actually read.",0],
         ["Hygiene","Scale, polish, fluoride. Twice a year is plenty.",1],
         ["Whitening","Six shades in an hour, done in the chair.",3],
         ["Kids","Counting teeth, no drilling, sticker after.",4]],
  ph:{hero:"chair",room:"room",night:"night",detail:"tools",tool:"scan",door:"storefront"},
  clips:{chair:"clinic"},
  phCap:{hero:"The chair, light on",room:"The room, wide",night:"Reception in the evening",detail:"Instruments laid out",tool:"The scan on screen",door:"The door, so people find you"},
  show:{title:"The smiles",unit:"people",note:"one clinic &mdash; running on a loop",
   lead:"Every one of these was done in this room. Point at the one that looks like your problem and we will tell you what it takes.",
   tags:"whitening &middot; fillings &middot; alignment &middot; hygiene", cta:"This is my case",
   want:"My case looks like the {a} one, {b}. What would that take?",
   foot:"Send a photo of your smile on WhatsApp and we send back an honest answer the same day."},
  looks:[["case-01","Whitening","six shades lighter"],["case-02","Front filling","chipped edge rebuilt"],["case-03","Hygiene","after a long gap"],
         ["case-04","Alignment","eight months of aligners"],["case-05","Crown","a molar back in service"],["case-06","Gap closed","two front teeth"],
         ["case-07","Implant","one tooth, one screw"],["case-08","A child’s first visit","no drilling"],["case-09","Full clean","coffee and years off"]]
 },

 bakery:{
  name:"Corner Bakery", tag:"Bread out of the oven at half past six, and again at four", city:"22 Levinsky St, Tel Aviv",
  trade:"bakery", kicker:"bread &amp; pastry", small:"baked here every morning",
  seal:"EST. 2017 &middot; BREAD &middot; PASTRY &middot; CAKES &middot; ",
  book:"Order for tomorrow", bookNow:"Order for tomorrow", appt:"Order a cake", bookShort:"Order",
  ask:"I would like to order for tomorrow. What do you have?", askOne:"I would like to order",
  priceLink:"see the whole list", listTitle:"Out of the oven",
  open:"Open Sun&ndash;Fri &middot; first trays at 06:30", late:"open till 19:00 &middot; last bake out at 16:00",
  hours:"Sun&ndash;Thu 06:30&ndash;19:00<br>Fri 06:00&ndash;15:00",
  hoursLine:"sun&ndash;thu 06:30&ndash;19 &nbsp;&middot;&nbsp; fri 06&ndash;15",
  hoursFull:"Sun&ndash;Thu 06:30&ndash;19:00<br>Fri 06:00&ndash;15:00<br>Sat closed",
  walkTitle:"Come before nine", walkNote:"The first trays go out at half past six and the sourdough is usually gone by ten. Call in the morning and we keep one back for you.",
  facts:["two bakes a day","since 2017"], slot:"challah for Friday &middot; order by Thursday", freeSlot:"Fresh out at 16:00",
  marquee:"BREAD &nbsp;&middot;&nbsp; PASTRY &nbsp;&middot;&nbsp; CAKES",
  strip:" WALK IN &nbsp;&middot;&nbsp; SMELL IT &nbsp;&middot;&nbsp; TAKE IT WARM &nbsp;&middot;&nbsp; ",
  three:"bread &middot; pastry &middot; cakes", zineKick:"the oven",
  story:"One oven and two bakes a day. The dough is mixed the evening before and left to rise overnight, so the first trays come out at half past six and the second lot at four in the afternoon. Nothing is frozen and nothing arrives ready made. Whatever is left at closing goes round the corner rather than in the bin.",
  call:"Call the bakery", msg:"Message the bakery",
  titles:{fade:"Out of the oven",pole:"On the board",salon:"The counter",neon:"Open this evening",poster:"Four things",zine:"Cut out and keep",mag:"The regulars",kiosk:"Pick one and collect",bands:"Four trays",gold:"The four we are known for",grid:"Out of the oven",mono:"The four we are known for"},
  services:[
   ["Sourdough loaf","&#8362;32","out at 06:30","Two days of rising, thick crust, one kilo."],
   ["Challah","&#8362;24","Fridays","Braided in the morning. Order by Thursday."],
   ["Butter croissant","&#8362;14","07:00 and 16:00","Folded by hand, butter and nothing else."],
   ["Cheese bureka","&#8362;16","all day","Salty cheese, sesame on top, still warm."],
   ["Cinnamon babka","&#8362;52","out at 16:00","A whole loaf, cinnamon and dark chocolate."],
   ["Cake to order","&#8362;190","2 days","Pick the size and the filling, we write the name on it."]],
  cells:[["Bread","Mixed the night before, baked twice a day.",0],["Challah","Braided on Friday morning, order by Thursday.",1],["Pastry","Croissants and burekas, out at seven and at four.",2],["Cakes","Whole cakes to order, two days ahead.",5]],
  ph:{hero:"counter",room:"shop",night:"night",detail:"crust",tool:"oven",door:"storefront"},
  phCap:{hero:"The counter in the morning",room:"The shop, wide",night:"The window after dark",detail:"Crust, close up",tool:"The oven at work",door:"The door, so people find you"},
  show:{title:"Out of the oven",unit:"bakes",note:"one oven &mdash; running on a loop",lead:"All of it came out of this oven this morning. Point at what you want and we will keep it behind the counter.",tags:"bread &middot; challah &middot; pastry &middot; cakes",cta:"Keep this one for me",want:"Can you keep the {a}, {b}, for me today?",foot:"Tell us on WhatsApp what you need and by when, and we answer the same morning."},
  looks:[["bake-01","Sourdough loaf","dark crust, one kilo"],["bake-02","Challah","braided, six strands"],["bake-03","Butter croissant","out at seven"],["bake-04","Cheese bureka","sesame on top"],["bake-05","Cinnamon babka","a whole loaf"],["bake-06","Rye with seeds","dense, keeps a week"],["bake-07","Chocolate rugelach","a tray at a time"],["bake-08","Focaccia","olive oil and salt"],["bake-09","Cake to order","two days ahead"]]
 },

 yoga:{
  name:"Yoga Studio", tag:"Six classes a day, twelve mats, one quiet room", city:"5 Nahalat Binyamin, Tel Aviv",
  trade:"yoga studio", kicker:"yoga &amp; breath", small:"a room to breathe in",
  seal:"EST. 2018 &middot; VINYASA &middot; YIN &middot; BREATH &middot; ",
  book:"Book a mat", bookNow:"Book a mat now", appt:"Reserve a place", bookShort:"Book",
  ask:"I would like to book a mat. Which classes are open this week?", askOne:"I would like a place in",
  priceLink:"see the timetable", listTitle:"The timetable",
  open:"Open every day &middot; first class free", late:"last class 20:30 &middot; doors close 20:25",
  hours:"Mon&ndash;Fri 07:00&ndash;21:00<br>Sat&ndash;Sun 08:00&ndash;18:00",
  hoursLine:"mon&ndash;fri 07&ndash;21 &nbsp;&middot;&nbsp; sat&ndash;sun 08&ndash;18",
  hoursFull:"Mon&ndash;Fri 07:00&ndash;21:00<br>Sat&ndash;Sun 08:00&ndash;18:00<br>First class free",
  walkTitle:"Never done it before", walkNote:"Come to the beginners’ hour. Mats, blocks and straps are here, bring nothing but yourself.",
  facts:["12 mats","since 2018"], slot:"next class today &middot; 18:15", freeSlot:"Mat free tonight",
  marquee:"VINYASA &nbsp;&middot;&nbsp; YIN &nbsp;&middot;&nbsp; BREATHWORK",
  strip:" WALK IN &nbsp;&middot;&nbsp; ROLL OUT &nbsp;&middot;&nbsp; BREATHE &nbsp;&middot;&nbsp; ",
  three:"vinyasa &middot; yin &middot; breathwork", zineKick:"mats",
  story:"One room, wooden floor, twelve mats and no mirrors. Six classes a day from seven in the morning. Nobody is corrected in front of the room, and nobody is asked how far they can fold.",
  call:"Call the studio", msg:"Message the studio",
  titles:{fade:"The classes",pole:"On the board",salon:"The classes",neon:"Tonight",poster:"Four things",zine:"Cut out and keep",mag:"The regulars",kiosk:"Pick a class",bands:"Four classes",gold:"The four we are known for",grid:"The classes",mono:"The four we are known for"},
  services:[
   ["Drop-in class","&#8362;70","60 min","Any class on the board. Mat waiting for you."],
   ["Ten-class card","&#8362;600","3 months","Share it with whoever you like."],
   ["Monthly unlimited","&#8362;420","per month","Every class, every day, cancel any month."],
   ["Private session","&#8362;280","60 min","One teacher, one mat, your pace."],
   ["Beginners course","&#8362;540","4 weeks","Four evenings, from nothing to a full class."],
   ["Prenatal class","&#8362;80","60 min","Small group, teacher trained for it."]],
  cells:[["Vinyasa","Warm, moving, one breath to one shape.",0],
         ["Yin","Long holds, blocks under everything, quiet.",1],
         ["Breathwork","Thirty minutes lying down. Harder than it sounds.",3],
         ["Beginners","Four evenings, from nothing to a full class.",4]],
  ph:{hero:"room",room:"wide",night:"night",detail:"mats",tool:"props",door:"storefront"},
  clips:{room:"yoga"},
  phCap:{hero:"The room before class",room:"The room, wide",night:"Evening class, low light",detail:"Mats rolled out",tool:"Blocks and straps",door:"The door, so people find you"},
  show:{title:"The classes",unit:"classes",note:"one room &mdash; running on a loop",
   lead:"This is what a week looks like here. Point at the one that sounds like you and we will keep a mat.",
   tags:"vinyasa &middot; yin &middot; breath &middot; beginners", cta:"Keep me a mat",
   want:"Keep me a mat in {a}, {b}. Which day is open?",
   foot:"Tell us on WhatsApp what you have done before and we will tell you which class to start with."},
  looks:[["class-01","Morning vinyasa","07:00, warm"],["class-02","Yin","long holds, quiet"],["class-03","Breathwork","lying down, 30 min"],
         ["class-04","Beginners","the first four evenings"],["class-05","Power hour","18:15, strong"],["class-06","Prenatal","small group"],
         ["class-07","Restorative","bolsters and blankets"],["class-08","Sunday slow","08:00, no rush"],["class-09","Private","one teacher, one mat"]]
 },

 garage:{
  name:"Corner Garage", tag:"Service, brakes and the annual test, with the price said first", city:"48 Hamasger St, Tel Aviv",
  trade:"garage", kicker:"service &amp; repair", small:"two lifts, no surprises",
  seal:"EST. 2012 &middot; SERVICE &middot; BRAKES &middot; TEST &middot; ",
  book:"Book the car in", bookNow:"Book the car in now", appt:"Book a slot", bookShort:"Book",
  ask:"I would like to book the car in. What do you have open?", askOne:"I would like to book",
  priceLink:"see the whole list", listTitle:"What it costs",
  open:"Open Sun&ndash;Fri &middot; leave it in the morning", late:"open till 18:00 &middot; last car taken in at 16:30",
  hours:"Sun&ndash;Thu 08:00&ndash;18:00<br>Fri 08:00&ndash;13:00",
  hoursLine:"sun&ndash;thu 08&ndash;18 &nbsp;&middot;&nbsp; fri 08&ndash;13",
  hoursFull:"Sun&ndash;Thu 08:00&ndash;18:00<br>Fri 08:00&ndash;13:00<br>Sat closed",
  walkTitle:"A noise you cannot name", walkNote:"Drive it in and we listen to it with you, up on the lift. Fifteen minutes, no charge, and you hear the answer before anything is opened.",
  facts:["2 lifts","since 2012"], slot:"next slot today &middot; 11:00", freeSlot:"Lift free today",
  marquee:"SERVICE &nbsp;&middot;&nbsp; BRAKES &nbsp;&middot;&nbsp; ANNUAL TEST",
  strip:" DRIVE IN &nbsp;&middot;&nbsp; HEAR THE PRICE &nbsp;&middot;&nbsp; DRIVE OUT &nbsp;&middot;&nbsp; ",
  three:"service &middot; brakes &middot; annual test", zineKick:"the lift",
  story:"Two lifts, three mechanics and a rule we have kept since 2012: nothing is opened before you have heard what it will cost. If we find something else while the car is up, the phone rings first. Every part comes with its invoice, and the old one goes home with you in a bag if you want it.",
  call:"Call the garage", msg:"Message the garage",
  titles:{fade:"What we do",pole:"On the board",salon:"The work",neon:"Open this evening",poster:"Four things",zine:"Cut out and keep",mag:"The regulars",kiosk:"Pick one and book",bands:"Four jobs",gold:"The four we are known for",grid:"What we do",mono:"The four we are known for"},
  services:[
   ["Full service","&#8362;690","2 hours","Oil, four filters, forty checks, written report."],
   ["Front brake pads","&#8362;780","90 min","Pads and discs skimmed, road tested before you pay."],
   ["Annual test, prepared and taken","&#8362;450","half a day","We put it right, take it in and bring it back."],
   ["Air conditioning","&#8362;390","60 min","Regassed, leak checked, filter changed."],
   ["Computer diagnosis","&#8362;180","30 min","Codes read and explained, free if we do the repair."],
   ["Listen to a noise","free","15 min","Up on the lift with you, before anything is opened."]],
  cells:[["Service","Oil, four filters, forty checks, on paper.",0],["Brakes","Pads, discs and a road test before you pay.",1],["Annual test","We put it right, take it in and bring it back.",2],["Diagnosis","Codes read and explained, free if we do the work.",4]],
  ph:{hero:"lift",room:"workshop",night:"night",detail:"brakes",tool:"tools",door:"storefront"},
  phCap:{hero:"A car on the lift",room:"The workshop, wide",night:"The forecourt after dark",detail:"Brakes, close up",tool:"The tools on the wall",door:"The door, so people find you"},
  show:{title:"The work",unit:"jobs",note:"one workshop &mdash; running on a loop",lead:"Every one of these went out of this workshop. Point at the one that sounds like your car and we will tell you what it costs.",tags:"service &middot; brakes &middot; test &middot; diagnosis",cta:"This is my car",want:"My car needs {a}, {b}. What would that cost and when can you take it?",foot:"Send us the make, the year and the mileage on WhatsApp and we come back with a price the same day."},
  looks:[["job-01","Full service","oil and four filters"],["job-02","Front brakes","pads and discs"],["job-03","Annual test","taken in and brought back"],["job-04","Air conditioning","cold again by noon"],["job-05","Computer diagnosis","codes read and explained"],["job-06","Timing belt","at a hundred thousand"],["job-07","Battery","tested, changed, ten minutes"],["job-08","Tyres and geometry","four wheels, straight again"],["job-09","Clutch","the long job, done in a day"]]
 }
};
var SWATCH=["#C93A16","#1F6F4A","#1D4ED8","#B08333","#8A2B4B","#101010"];
var FONTS=[
 /* GVPro, 15.09.2026: every template wears its own display family. With three
    pairs for twelve templates the previews read as one site recoloured. Heebo sits
    in every stack, so a name typed in Hebrew is set in a real Hebrew face. dw is
    the weight the family actually has, so the browser never fakes a bold. */
 {id:"bebas",n:"Bebas Neue / Archivo",d:"'Bebas Neue','Heebo',Impact,sans-serif",b:"'Archivo','Heebo',system-ui,sans-serif",t:"Loud and square",dw:400},
 {id:"play", n:"Playfair / Lora",     d:"'Playfair Display','Heebo',Georgia,serif", b:"'Lora','Heebo',Georgia,serif",t:"Old shop, warm",dw:700},
 {id:"syne", n:"Syne / Manrope",      d:"'Syne','Heebo',system-ui,sans-serif", b:"'Manrope','Heebo',system-ui,sans-serif",t:"New and clean",dw:800},
 {id:"tilt", n:"Tilt Neon / Manrope", d:"'Tilt Neon','Heebo',system-ui,sans-serif", b:"'Manrope','Heebo',system-ui,sans-serif",t:"Glass tubes",dw:400},
 {id:"jet",  n:"JetBrains Mono",      d:"'JetBrains Mono','Heebo',ui-monospace,monospace", b:"'JetBrains Mono','Heebo',ui-monospace,monospace",t:"Typed",dw:600},
 {id:"anton",n:"Anton / Archivo",     d:"'Anton','Heebo',Impact,sans-serif", b:"'Archivo','Heebo',system-ui,sans-serif",t:"Tall and tight",dw:400},
 {id:"black",n:"Archivo Black",       d:"'Archivo Black','Heebo',system-ui,sans-serif", b:"'Archivo','Heebo',system-ui,sans-serif",t:"Heavy poster",dw:400},
 {id:"shoulders",n:"Big Shoulders / Inter", d:"'Big Shoulders Display','Heebo',Impact,sans-serif", b:"'Inter','Heebo',system-ui,sans-serif",t:"Painted sign",dw:800},
 {id:"cinzel",n:"Cinzel / Lora",      d:"'Cinzel','Heebo',Georgia,serif", b:"'Lora','Heebo',Georgia,serif",t:"Carved in stone",dw:800},
 {id:"manrope",n:"Manrope / Inter",   d:"'Manrope','Heebo',system-ui,sans-serif", b:"'Inter','Heebo',system-ui,sans-serif",t:"Shop counter",dw:800},
 {id:"elite",n:"Special Elite / Inter", d:"'Special Elite','Heebo','Courier New',monospace", b:"'Inter','Heebo',system-ui,sans-serif",t:"Typewriter",dw:400},
 {id:"instr",n:"Instrument Serif / Lora", d:"'Instrument Serif','Heebo',Georgia,serif", b:"'Lora','Heebo',Georgia,serif",t:"Magazine",dw:400}
,
 {id:"neonder",n:"Neonderthaw / Manrope", d:"'Neonderthaw','Heebo',cursive", b:"'Manrope','Heebo',system-ui,sans-serif",t:"Neon tubes",dw:400},
 {id:"bungee",n:"Bungee / Inter", d:"'Bungee','Heebo',Impact,sans-serif", b:"'Inter','Heebo',system-ui,sans-serif",t:"Shop sign",dw:400}
];
// У каждого шаблона своя одежда: шрифт, пара цветов и способ развести имя на две
// половины. Двенадцать одинаково-оранжевых тёмных плиток выглядели как один и тот
// же сайт двенадцать раз. Человек всё это потом меняет под себя, look - только
// стартовая точка, но именно она продаёт разнообразие.
//   font - пара шрифтов (bebas / play / syne)
//   acc  - главный цвет, acc2 - цвет второй половины имени
//   logo - как разведены половины: tone (цвет), type (шрифт), both (и то и то)
var TPL=[
 {id:"fade", n:"Chrome Fade",  note:"split hero",
  look:{font:"bebas",acc:"#E0301E",acc2:"#F4EFEA",mode:"dark", logo:"tone"}},
 {id:"pole", n:"Signboard",    note:"ticket price list",
  look:{font:"shoulders",acc:"#FF2D55",acc2:"#FFFFFF",mode:"dark", logo:"tone"}},
 {id:"salon",n:"Marble",       note:"quiet, serif",
  look:{font:"play", acc:"#B76E79",acc2:"#8A5A44",mode:"light",logo:"both"}},
 {id:"grid", n:"Corner Shop",  note:"card grid",
  look:{font:"bungee", acc:"#84CC16",acc2:"#F4EFEA",mode:"dark", logo:"tone"}},
 {id:"neon", n:"Night Shift",  note:"sign + ticker",
  look:{font:"tilt",acc:"#A855F7",acc2:"#22D3EE",mode:"dark", logo:"tone"}},
 {id:"poster",n:"Poster",      note:"name fills the page",
  /* GVPro, 15.09.2026: the second word was red screened over yellow and nearly vanished;
     now ink on yellow, the way a printed poster reads from across the street */
  look:{font:"black",acc:"#E8B027",acc2:"#14100E",mode:"dark", logo:"tone"}},
 {id:"zine", n:"Zine",         note:"photocopy, taped",
  look:{font:"elite",acc:"#FF2E88",acc2:"#101010",mode:"light",logo:"tone"}},
 {id:"mag",  n:"The Column",   note:"magazine index",
  look:{font:"instr", acc:"#8A2B4B",acc2:"#14100E",mode:"light",logo:"type"}},
 {id:"kiosk",n:"Walk-In",      note:"booking first",
  look:{font:"syne", acc:"#2563EB",acc2:"#F4EFEA",mode:"dark", logo:"tone"}},
 {id:"bands",n:"Bands",        note:"colour stripes",
  look:{font:"anton", acc:"#F97316",acc2:"#DB2777",mode:"dark", logo:"tone"}},
 {id:"mono", n:"Terminal",     note:"all monospace",
  look:{font:"jet", acc:"#2BD97C",acc2:"#F4EFEA",mode:"dark", logo:"tone"}},
 {id:"gold", n:"Old Sign",     note:"gold, framed",
  look:{font:"cinzel", acc:"#C9A227",acc2:"#F4EFEA",mode:"dark", logo:"both"}}
];
// Одежда шаблона поверх состояния. Нужна и конструктору, и плиткам на главной,
// поэтому живёт здесь, а не в разметке.
function dress(state, tplId){
 var t=TPL.filter(function(x){return x.id===tplId})[0];
 var out=Object.assign({}, state, {tpl:tplId});
 if(t&&t.look) Object.assign(out, t.look);
 return out;
}
var S={cat:"barber",tpl:"fade",name:"Barber Shop",tag:"Fades, beards and hot towels in Florentin",city:"14 Vital St, Tel Aviv",wa:"972500000000",acc:"#C93A16",acc2:"#C93A16",font:"bebas",mode:"dark",logo:"tone",toy:true};
var LOGOS=[{id:"solo",n:"One colour"},{id:"tone",n:"Two colours"},{id:"type",n:"Two fonts"},{id:"out",n:"Outline"},{id:"both",n:"Font + colour"}];
var PAIR={bebas:"'Playfair Display',Georgia,serif",play:"'Bebas Neue',Impact,sans-serif",syne:"'Playfair Display',Georgia,serif",tilt:"'Instrument Serif',Georgia,serif",jet:"'Instrument Serif',Georgia,serif",anton:"'Playfair Display',Georgia,serif",black:"'Instrument Serif',Georgia,serif",shoulders:"'Playfair Display',Georgia,serif",cinzel:"'Playfair Display',Georgia,serif",manrope:"'Instrument Serif',Georgia,serif",elite:"'Playfair Display',Georgia,serif",instr:"'Playfair Display',Georgia,serif",neonder:"'Instrument Serif',Georgia,serif",bungee:"'Instrument Serif',Georgia,serif"};
// Фотобанк студии. Адрес абсолютный: скачанную страницу человек открывает у себя
// на диске или на своём домене, и относительный путь там бы не нашёлся.
// Версия в адресе. /media/* отдаётся с кешем на неделю (см. _headers), и без
// неё обновлённые фотографии неделю не доходили бы до людей.
var PHOTOV="?v=14";
// Short silent loops for the photo block, one per category as they are made.
// Same rules as the stills: absolute address, versioned, a light copy for phones.
var VIDEO="https://genvidpro.com/videos/tpl/";
var VIDEOV="?v=1";
/* GVPro, 15.09.2026: the app serves its own copy of the photo bank (window.GVP_PHOTOBASE), so a fixed
   photograph reaches the app without waiting for a deploy of genvidpro.com */
var PHOTO=(typeof window!=="undefined"&&window.GVP_PHOTOBASE)||"https://genvidpro.com/media/photo/";
// Витрина «Try it on»: десять образов, разные стрижки, разные бороды, разные цвета.
// Крутится сама по кругу — это показ возможности, а не рабочая примерочная.
/* LOOKS, SERVICES and every line of copy come from CAT now, per category. */
// Числительное считается от длины списка, иначе подпись отстаёт от содержимого.
var NWORD={6:"six",7:"seven",8:"eight",9:"nine",10:"ten",11:"eleven",12:"twelve"};

var SERVICES=CAT.barber.services; /* export only; page() uses the chosen category */

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function hex2rgb(h){h=h.replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function mix(h,w){var c=hex2rgb(h);return "rgb("+c.map(function(v){return Math.round(v+(255-v)*w)}).join(",")+")";}
function shade(h,w){var c=hex2rgb(h);return "rgb("+c.map(function(v){return Math.round(v*(1-w))}).join(",")+")";}
var NOISE="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuNTUiLz48L3N2Zz4=";
function rgba(h,a){
 /* mix() and shade() hand back "rgb(r,g,b)", not a hex. Passing one of those in
    used to give rgba(NaN,...) - the browser threw the whole gradient away and the
    glow simply was not there. Now both forms are accepted. */
 var c;
 var m=String(h).match(/^rgba?\(([^)]+)\)$/);
 if(m){c=m[1].split(",").slice(0,3).map(function(v){return parseInt(v,10)||0});}
 else{c=hex2rgb(h);}
 return "rgba("+c[0]+","+c[1]+","+c[2]+","+a+")";}

// Our own font files, no request to Google. Only the faces a page actually names are
// declared, and the Hebrew and Cyrillic cuts carry a unicode-range, so a phone
// downloads them only when the name is typed in that script.
var FONTBASE=(typeof window!=="undefined"&&window.GVP_FONTBASE)||"/fonts/";
var RANGE={latin:"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
 cyrillic:"U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
 hebrew:"U+0307-0308,U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F",
 arabic:"U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC"};
var FACES={
 "Heebo":[["heebo-hebrew-400-normal",400,"normal","hebrew"],["heebo-hebrew-700-normal",700,"normal","hebrew"],["heebo-hebrew-800-normal",800,"normal","hebrew"]],
 "Inter":[["inter-latin-400-normal",400,"normal","latin"],["inter-cyrillic-400-normal",400,"normal","cyrillic"],["inter-latin-600-normal",600,"normal","latin"],["inter-cyrillic-600-normal",600,"normal","cyrillic"]],
 "Tilt Neon":[["tilt-neon-latin-400-normal",400,"normal","latin"]],
 "JetBrains Mono":[["jetbrains-mono-latin-400-normal",400,"normal","latin"],["jetbrains-mono-cyrillic-400-normal",400,"normal","cyrillic"],["jetbrains-mono-latin-600-normal",600,"normal","latin"],["jetbrains-mono-cyrillic-600-normal",600,"normal","cyrillic"]],
 "Anton":[["anton-latin-400-normal",400,"normal","latin"]],
 "Bebas Neue":[["bebas-neue-latin-400-normal",400,"normal","latin"]],
 "Big Shoulders Display":[["big-shoulders-display-latin-800-normal",800,"normal","latin"]],
 "Archivo Black":[["archivo-black-latin-400-normal",400,"normal","latin"]],
 "Syne":[["syne-latin-700-normal",700,"normal","latin"],["syne-latin-800-normal",800,"normal","latin"]],
 "Manrope":[["manrope-latin-400-normal",400,"normal","latin"],["manrope-cyrillic-400-normal",400,"normal","cyrillic"],["manrope-latin-600-normal",600,"normal","latin"],["manrope-cyrillic-600-normal",600,"normal","cyrillic"],["manrope-latin-800-normal",800,"normal","latin"]],
 "Special Elite":[["special-elite-latin-400-normal",400,"normal","latin"]],
 "Instrument Serif":[["instrument-serif-latin-400-normal",400,"normal","latin"],["instrument-serif-latin-400-italic",400,"italic","latin"]],
 "Playfair Display":[["playfair-display-latin-500-normal",500,"normal","latin"],["playfair-display-latin-700-normal",700,"normal","latin"],["playfair-display-latin-500-italic",500,"italic","latin"],["playfair-display-cyrillic-700-normal",700,"normal","cyrillic"]],
 "Cinzel":[["cinzel-latin-600-normal",600,"normal","latin"],["cinzel-latin-800-normal",800,"normal","latin"]],
 "Lora":[["lora-latin-400-normal",400,"normal","latin"],["lora-cyrillic-400-normal",400,"normal","cyrillic"],["lora-latin-600-normal",600,"normal","latin"]],
 "Neonderthaw":[["neonderthaw-latin-400-normal",400,"normal","latin"]],
 "Bungee":[["bungee-latin-400-normal",400,"normal","latin"]],
 "Archivo":[["archivo-latin-400-normal",400,"normal","latin"],["archivo-latin-500-normal",500,"normal","latin"],["archivo-latin-700-normal",700,"normal","latin"]],
 /* GVPro, 15.09.2026: display faces for the other three scripts. Each file carries only its
    script's unicode-range and answers every weight, so a Latin display family keeps the
    Latin letters and a Hebrew, Arabic or Cyrillic word is set in a face made for it. */
 "Karantina":[["karantina-hebrew-700-normal","100 900","normal","hebrew"]],
 "Frank Ruhl Libre":[["frank-ruhl-libre-hebrew-500-normal","100 900","normal","hebrew"]],
 "Rubik Medium":[["rubik-hebrew-500-normal","100 900","normal","hebrew"]],
 "Rubik Bold":[["rubik-hebrew-700-normal","100 900","normal","hebrew"]],
 "Rubik Black":[["rubik-hebrew-900-normal","100 900","normal","hebrew"]],
 "Bellefair":[["bellefair-hebrew-400-normal","100 900","normal","hebrew"]],
 "Suez One":[["suez-one-hebrew-400-normal","100 900","normal","hebrew"]],
 "Amatic SC":[["amatic-sc-hebrew-700-normal","100 900","normal","hebrew"]],
 "Secular One":[["secular-one-hebrew-400-normal","100 900","normal","hebrew"]],
 "Lalezar":[["lalezar-arabic-400-normal","100 900","normal","arabic"]],
 "Amiri":[["amiri-arabic-400-normal","100 500","normal","arabic"],["amiri-arabic-700-normal","600 900","normal","arabic"]],
 "Changa":[["changa-arabic-700-normal","100 900","normal","arabic"]],
 "Reem Kufi":[["reem-kufi-arabic-500-normal","100 900","normal","arabic"]],
 "Cairo":[["cairo-arabic-400-normal","100 500","normal","arabic"],["cairo-arabic-700-normal","600 900","normal","arabic"]],
 "El Messiri":[["el-messiri-arabic-600-normal","100 900","normal","arabic"]],
 "Rakkas":[["rakkas-arabic-400-normal","100 900","normal","arabic"]],
 "Oswald":[["oswald-cyrillic-600-normal","100 900","normal","cyrillic"]],
 "Unbounded":[["unbounded-cyrillic-700-normal","100 900","normal","cyrillic"]],
 "Russo One":[["russo-one-cyrillic-400-normal","100 900","normal","cyrillic"]],
 "PT Mono":[["pt-mono-cyrillic-400-normal","100 900","normal","cyrillic"]],
 "Marck Script":[["marck-script-cyrillic-400-normal","100 900","normal","cyrillic"]],
 /* Playfair's Cyrillic cut answers every weight under its own name: under "Playfair Display" a 400
    heading matched the Latin-only 500 face and the Russian letters fell to Georgia */
 "Playfair Cyr":[["playfair-display-cyrillic-700-normal","100 900","normal","cyrillic"]]
};
function fontFaces(stacks){
 var want={}, css="";
 stacks.join(",").replace(/'([^']+)'/g,function(m,n){if(FACES[n])want[n]=1;return m;});
 want["Heebo"]=1; want["JetBrains Mono"]=1;
 for(var n in want){FACES[n].forEach(function(x){
  css+="@font-face{font-family:'"+n+"';src:url("+FONTBASE+x[0]+".woff2) format('woff2');font-weight:"+x[1]+";font-style:"+x[2]+";font-display:swap;unicode-range:"+RANGE[x[3]]+"}";
 });}
 return css;
}
// GVPro: which photograph each template shows. Six take the category's own six shots,
// six take its first six looks, so no picture repeats inside the first twelve.
/* GVPro, 15.09.2026: the face each display family hands a Hebrew, Arabic or Cyrillic word to,
   chosen to keep the template's character: condensed stays condensed, script stays script. */
var SCRIPT={bebas:{he:"Karantina",ar:"Lalezar",ru:"Oswald"},play:{he:"Frank Ruhl Libre",ar:"Amiri",ru:"Playfair Cyr"},
 syne:{he:"Rubik Bold",ar:"Changa",ru:"Unbounded"},tilt:{he:"Rubik Medium",ar:"Reem Kufi",ru:"Manrope"},
 jet:{he:"Rubik Medium",ar:"Cairo",ru:"JetBrains Mono"},anton:{he:"Karantina",ar:"Lalezar",ru:"Oswald"},
 black:{he:"Rubik Black",ar:"Lalezar",ru:"Russo One"},shoulders:{he:"Karantina",ar:"Changa",ru:"Oswald"},
 cinzel:{he:"Bellefair",ar:"Amiri",ru:"Playfair Cyr"},manrope:{he:"Rubik Bold",ar:"Cairo",ru:"Manrope"},
 elite:{he:"Suez One",ar:"El Messiri",ru:"PT Mono"},instr:{he:"Frank Ruhl Libre",ar:"Amiri",ru:"Playfair Cyr"},
 neonder:{he:"Amatic SC",ar:"Reem Kufi",ru:"Marck Script"},bungee:{he:"Secular One",ar:"Rakkas",ru:"Russo One"}};
/* Every word the templates print that is not the business's own copy. The copy itself is in
   CAT; a language pack (window.GVP_LANG[lang] = {ui, cat}) overrides both, key by key. */
var UI_EN={book:"Book",onWa:"on WhatsApp",whatWeDo:"What we do",tapCard:"tap a card to book that one",fullList:"the full price list",
 hoursAddr:"hours and address",hours:"Hours",findUs:"Find us",openMaps:"Open in maps",msgWa:"Message us on WhatsApp",
 live:"live preview",seeList:"see the price list",allN:"all {n}",count:"{n} {unit}, {note}",photo:"photo",videoLoop:"video loop",
 loopNote:"runs on a loop, no sound",where:"Where",directions:"Get directions",priceList:"price list",pay:"cash &middot; bit &middot; card",
 walkIns:"walk<br>ins<br>welcome",theServices:"the services",sunFri:"sun&ndash;fri",walkIn:"walk in",costs:"what it costs",
 issue:"issue 01 &middot; {city} &middot; free",index:"index",takeIt:"Take it",eachBooks:"each one books straight to us",
 hi:"Hi {name}, ",whatOpen:"What do you have open?",withWord:"with",free:"free",currency:"ILS"};
function packFor(l){var W=(typeof window!=="undefined"&&window.GVP_LANG)||{};return (l&&l!=="en"&&W[l])||null;}
/* the category's copy in a language: a missing key falls back to English, file names, prices
   and card indexes always come from the English source */
function textFor(cat,l){
 var key=CAT[cat]?cat:"barber", base=CAT[key], P=packFor(l), C2=P&&P.cat&&P.cat[key];
 if(!C2) return base;
 var o={},k;
 for(k in base) o[k]=base[k];
 for(k in C2){var b=base[k],v=C2[k];o[k]=(b&&v&&typeof b==="object"&&!Array.isArray(b)&&typeof v==="object"&&!Array.isArray(v))?Object.assign({},b,v):v;}
 o.looks=base.looks.map(function(L,i){var t=(C2.looks||[])[i]||L;return [L[0],t[1]||L[1],t[2]||L[2]];});
 o.services=base.services.map(function(r,i){var t=(C2.services||[])[i]||r;return [t[0]||r[0],/&#8362;/.test(r[1])?r[1]:(t[1]||r[1]),t[2]||r[2],t[3]||r[3]];});
 o.cells=base.cells.map(function(c,i){var t=(C2.cells||[])[i]||c;return [t[0]||c[0],t[1]||c[1],c[2]];});
 o.ph=base.ph; o.clips=base.clips;
 return o;
}
/* a handle or a terminal file name from any script; the old a-z filter printed "@" alone for a Hebrew name */
function slug(x,sep){
 var t=String(x).replace(/&[#a-z0-9]+;/gi," ").toLowerCase();
 try{t=t.replace(new RegExp("[^\\p{L}\\p{N}]+","gu"),sep);}catch(e){t=t.replace(/[^a-z0-9\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF]+/g,sep);}
 if(sep) t=t.replace(/^-+|-+$/g,"");
 return t||"site";
}
function jsStr(x){return JSON.stringify(x).replace(/</g,"\\u003c");}
var PHOTO_OF={mono:"tool",neon:"night",poster:"hero",kiosk:"door",gold:"detail",fade:"room",bands:"look:0",grid:"look:1",pole:"look:2",zine:"look:3",mag:"look:4",salon:"look:5"};
function page(tpl,s,lite){
 /* Everything the page says comes from here. The template is the clothes, the
    category is the person wearing them. An unknown category falls back to the
    barbershop, the one that has always been complete. */
 var LANG=(s.lang==="he"||s.lang==="ru"||s.lang==="ar")?s.lang:"en", RTL=(LANG==="he"||LANG==="ar");
 var PACK=packFor(LANG), K=textFor(s.cat,LANG), U=Object.assign({},UI_EN,(PACK&&PACK.ui)||{});
 var ARR=RTL?"&larr;":"&rarr;";
 function fill(t,o){return String(t).replace(/\{(\w+)\}/g,function(m,k){return o[k]!=null?o[k]:m;});}
 /* the price as the language writes it: ₪70 in English, 70 ₪ in Hebrew, Russian and Arabic */
 function money(p){p=String(p);if(p.indexOf("&#8362;")<0)return p;var n=p.replace("&#8362;","");return LANG==="en"?p:(n+"&nbsp;&#8362;");}
 function moneyTxt(p){p=String(p);if(p.indexOf("&#8362;")<0)return p;var n=p.replace("&#8362;","");return LANG==="en"?("ILS "+n):(n+" \u20AA");}
 var SERVICES=K.services, LOOKS=K.looks, LOOKN=(LANG==="en"&&NWORD[LOOKS.length])||String(LOOKS.length);
 /* GVPro, 15.09.2026: the small previews (lite) take 420 px copies of the photographs from
    window.GVP_THUMBS when the page offers them; the full site keeps the originals. Three
    full photos made up 325 KB of the first load of the app. */
 var PBASE=(lite&&typeof window!=="undefined"&&window.GVP_THUMBS)?window.GVP_THUMBS:PHOTO;
 var PDIR=PBASE+(CAT[s.cat]?s.cat:"barber")+"/";
 var f=FONTS.filter(function(x){return x.id===s.font})[0]||FONTS[0];
 var SF=SCRIPT[f.id]||{}, TXT=[s.name,s.tag,s.city].join(" ");
 var NEED={he:LANG==="he"||/[\u0590-\u05FF]/.test(TXT),ar:LANG==="ar"||/[\u0600-\u06FF]/.test(TXT),ru:LANG==="ru"||/[\u0400-\u04FF]/.test(TXT)};
 function scriptStack(st,body){
  var add=(NEED.he&&!body&&SF.he?"'"+SF.he+"',":"")+"'Heebo'"
   +(NEED.ar?",'"+(body?"Cairo":(SF.ar||"Cairo"))+"'":"")
   +(NEED.ru?",'"+(body?"Inter":(SF.ru||"Inter"))+"'":"");
  return st.replace("'Heebo'",add);
 }
 var FD=scriptStack(f.d,false), FB=scriptStack(f.b,true), FM="'JetBrains Mono',"+scriptStack("'Heebo'",true)+",ui-monospace,monospace";
 var dark=s.mode==="dark";
 var BG=dark?"#08070A":"#F7F3EE", TX=dark?"#F4EFEA":"#14100E", MUT=dark?"#948A85":"#6B605A",
     CARD=dark?"#100E11":"#FFFFFF", LINE=dark?rgba(TX,.14):rgba(TX,.12);
 var A=s.acc, AD=shade(A,.45), AL=mix(A,.35);
 var A2=s.acc2||TX;   /* used inside kit below; it used to be assigned only after it */
 var GLOW="0 0 1px "+rgba("#ffffff",.9)+",0 0 12px "+rgba(A,.85)+",0 0 42px "+rgba(A,.55)+",0 0 90px "+rgba(A,.3);
 var WA=String(s.wa||"").replace(/[^0-9]/g,"");
 // Без телефона запасной адрес — только #visit: эта секция есть в каждом
 // шаблоне. Раньше здесь стоял "#book", а секции с таким id нет нигде, и стоило
 // человеку стереть номер, как все кнопки сайта превращались в пустышки.
 var BOOK=WA?("https://wa.me/"+WA+"?text="+encodeURIComponent(fill(U.hi,{name:s.name})+K.ask)):"#visit";
 function waLink(msg){return WA?("https://wa.me/"+WA+"?text="+encodeURIComponent(msg)):"#visit";}
 function bookSvc(name,price){
  return waLink(fill(U.hi,{name:s.name})+K.askOne+" "+String(name).replace("&rsquo;","'")
   +" ("+moneyTxt(price)+"). "+U.whatOpen);
 }
 var MAPS='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(String(s.city||''));
 var list=SERVICES.map(function(r,i){
  return '<li style="--d:'+(.15*i+.3).toFixed(2)+'s"><a href="'+bookSvc(r[0],r[1])+'" target="_blank" rel="noopener"><span class="nm">'+r[0]+'</span><span class="dt">'+r[2]+' &middot; '+r[3]+'</span><b>'+money(r[1])+'</b><i class="go">'+U.book+'</i></a></li>';
 }).join("");
 var head='<style>'+fontFaces([FD,FB,FM,PAIR[f.id]||""])+'</style>';

 var kit='*{box-sizing:border-box}'
 +'html{background:'+BG+'}'
 +'body{margin:0;background:transparent;color:'+TX+';font-family:'+FB+';line-height:1.55;overflow-x:hidden;position:relative;-webkit-font-smoothing:antialiased}'
 +'body::before{content:"";position:fixed;inset:-25%;pointer-events:none;z-index:0;background:'
   +'radial-gradient(42% 38% at 16% 10%,'+rgba(A,dark?.34:.20)+' 0%,transparent 62%),'
   +'radial-gradient(38% 34% at 86% 26%,'+rgba(AL,dark?.24:.14)+' 0%,transparent 60%),'
   +'radial-gradient(52% 44% at 62% 94%,'+rgba(AD,dark?.30:.16)+' 0%,transparent 66%);'
   +'filter:blur(72px);animation:bgdrift 28s ease-in-out infinite alternate}'
 +'@keyframes bgdrift{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(-4%,3%,0) scale(1.14)}}'
 // Всё содержимое встаёт над подложкой, иначе она перекрыла бы текст.
 +'body>*{position:relative;z-index:1}'
 +'body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:90;background-image:url('+NOISE+');background-size:140px;opacity:'+(dark?".055":".04")+';mix-blend-mode:'+(dark?"screen":"multiply")+'}'
 +'h1,h2,h3,.d{font-family:'+FD+';font-weight:'+(f.dw||700)+';font-synthesis:none;line-height:.95;margin:0;text-wrap:balance;letter-spacing:'+(f.id==="bebas"?".012em":"-.01em")+'}'+'h2{text-shadow:'+(dark?"0 0 3px "+rgba("#ffffff",.5)+",0 0 22px "+rgba("#ffffff",.22):"none")+'}'
 +'p{margin:0}a{color:inherit}'
 +'.mono{font-family:'+FM+';font-size:11px;letter-spacing:.2em;text-transform:uppercase}'
 +'.split>div,.two>div,.wrapx{min-width:0}.wrapx{max-width:1280px;margin:0 auto}.pad{padding:60px 44px}.rel{position:relative;z-index:2}'
 +'.aura{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:drift 18s ease-in-out infinite alternate}'
 +'@keyframes drift{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(26px,-22px,0) scale(1.14)}}'
 +'.rv{opacity:1;transform:none;animation:rvin 1s cubic-bezier(.16,.84,.28,1) backwards;animation-delay:var(--d,0s)}'
 +'@keyframes rv{to{opacity:1;transform:none}}@keyframes rvin{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}'
 +'.neon{color:'+(dark?"#fff":TX)+';text-shadow:'+(dark?GLOW:"0 0 24px "+rgba(A,.35))+'}'
 +'.cta{position:relative;display:inline-block;overflow:hidden;isolation:isolate;background:'+A+';color:#fff;text-decoration:none;padding:15px 28px;font-family:'+FM+';font-size:12px;letter-spacing:.1em;text-transform:uppercase;border:0;border-radius:999px;box-shadow:0 0 0 1px '+rgba(A,.5)+',0 14px 34px '+rgba(A,.28)+';transition:transform .25s cubic-bezier(.16,.84,.28,1),box-shadow .25s}'
 +'.cta::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(90deg,transparent,'+rgba("#ffffff",.5)+',transparent);transform:skewX(-22deg);animation:sweep 5s ease-in-out infinite}'
 +'@keyframes sweep{0%,55%{left:-70%}100%{left:130%}}'
 +'.cta:hover{transform:translateY(-3px);box-shadow:0 0 0 1px '+rgba(A,.8)+',0 20px 44px '+rgba(A,.45)+'}'
 +'.cta.ghost{background:transparent;color:'+TX+';box-shadow:inset 0 0 0 1px '+rgba(TX,.35)+'}'
 +'ul.svc{list-style:none;padding:0;margin:0}'+'.und{display:inline-block;margin-inline-start:14px;font-family:'+FM+';font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:'+MUT+';text-decoration:none;border-bottom:1px solid '+LINE+';padding-bottom:2px;transition:.25s}'+'.und:hover{color:'+A+';border-color:'+A+'}'+'#list{scroll-margin-top:20px}#visit{scroll-margin-top:20px}'
 +'ul.svc li{border-bottom:1px solid '+LINE+';position:relative}' +'ul.svc li a{display:grid;grid-template-columns:1fr auto auto;align-items:baseline;gap:6px 16px;padding:14px 0;text-decoration:none;color:inherit;font-variant-numeric:tabular-nums;transition:padding .3s cubic-bezier(.16,.84,.28,1),color .3s}' +'ul.svc li .nm{grid-column:1;font-size:16px}' +'ul.svc li .dt{grid-column:1;grid-row:2;color:'+MUT+';font-size:12.5px}' +'ul.svc li b{grid-column:2;grid-row:1/3;align-self:center;font-weight:600;letter-spacing:.02em}' +'ul.svc li .go{grid-column:3;grid-row:1/3;align-self:center;font-family:'+FM+';font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:'+A+';opacity:0;transform:translateX('+(RTL?"6px":"-6px")+');transition:.3s;font-style:normal}' +'ul.svc li a:hover{padding-inline-start:14px;color:'+A+'}ul.svc li a:hover .go{opacity:1;transform:none}' +'@media(hover:none){ul.svc li .go{opacity:1;transform:none}}'



 +'.ph{position:relative;overflow:hidden;background:'
   +'radial-gradient(120% 90% at 22% 12%,'+rgba(A,.55)+' 0%,transparent 55%),'
   +'radial-gradient(90% 70% at 88% 88%,'+rgba(AL,.35)+' 0%,transparent 60%),'
   +'linear-gradient(155deg,'+shade(A,.55)+' 0%,#0b0a0c 62%,#000 100%)}'
 +'.ph::before{content:"";position:absolute;inset:0;background-image:url('+NOISE+');background-size:140px;opacity:.16;mix-blend-mode:overlay;z-index:3}' +'.ph .kb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:inherit;transform-origin:62% 42%;animation:kb 17s ease-in-out infinite alternate}' +'@keyframes kb{from{transform:scale(1.03)}to{transform:scale(1.18) translate(-2%,-2.5%)}}' +'.ph .badge{position:absolute;inset-inline-start:16px;top:14px;z-index:4;display:flex;align-items:center;gap:7px;color:'+rgba("#ffffff",.9)+';background:rgba(0,0,0,.42);padding:5px 9px;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}' +'.ph .badge em{width:7px;height:7px;border-radius:50%;background:'+A+';box-shadow:0 0 10px '+A+';animation:blip 1.8s ease-in-out infinite}' +'@keyframes blip{0%,100%{opacity:1}50%{opacity:.25}}' +'.ph .tc{position:absolute;inset-inline-end:16px;top:14px;z-index:4;color:'+rgba("#ffffff",.7)+';font-variant-numeric:tabular-nums}' +'.ph .bar{position:absolute;inset-inline-start:0;bottom:0;height:2px;background:'+A+';box-shadow:0 0 12px '+A+';width:0;z-index:4;animation:play 8s linear infinite}' +'@keyframes play{to{width:100%}}'
 +'.ph::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(0,0,0,.65)}'
 +'.ph video.pv{opacity:0;transition:opacity .5s;z-index:2;animation:none}.ph.on video.pv{opacity:1}'
 +'.ph .vidc{opacity:0;transition:opacity .4s}.ph.on .vidc{opacity:1}'
 +'.ph .badge.still{transition:opacity .4s}.ph.on .badge.still{opacity:0}'
 +'.ph .bar{animation:none}.ph.on .bar{animation:play 8s linear infinite}'
 +'.ph>span.cap{position:absolute;inset-inline-start:16px;inset-inline-end:16px;bottom:16px;z-index:4;color:'+rgba("#ffffff",.78)+'}'
 +'.mq{overflow:hidden;white-space:nowrap;display:flex}' +'.tick{overflow:hidden;white-space:nowrap;display:flex;width:100%;min-width:0;max-width:100%;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}' +'.tick .mono{display:inline-block;flex:none;color:'+A+';padding:2px 0;animation:mv 46s linear infinite;letter-spacing:.28em}'
 +'.mq div{display:inline-block;padding:12px 0;animation:mv 26s linear infinite;flex:none}'
 +'@keyframes mv{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
 +'footer{border-top:1px solid '+LINE+';padding:28px 44px;color:'+MUT+';font-size:13px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;position:relative;z-index:2}'
 // Карточки услуг. Требование: в каждом шаблоне не меньше четырёх, и в каждой
 // название, одна строка описания, цена и время. Четыре вида оформления на
 // двенадцать шаблонов — чтобы карточки не выбивались из своей вёрстки.
 +'#services{scroll-margin-top:20px}'
 +'.svcards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}'
 +'@media(max-width:980px){.svcards{grid-template-columns:repeat(2,1fr)}}'
 +'@media(max-width:560px){.svcards{grid-template-columns:1fr}}'
 +'.svc-card{display:flex;flex-direction:column;gap:8px;text-decoration:none;color:inherit;padding:20px;background:'+CARD+';border:1px solid '+LINE+';transition:transform .3s cubic-bezier(.16,.84,.28,1),border-color .3s,box-shadow .3s}'
 +'.svc-card:hover{transform:translateY(-5px);border-color:'+rgba(A,.65)+';box-shadow:0 20px 46px '+rgba(A,.16)+'}'
 +'.svc-card .cn{font-family:'+FD+';font-size:22px;line-height:1.05}'
 +'.svc-card .cl{color:'+MUT+';font-size:14px;line-height:1.5;flex:1}'
 +'.svc-card .cf{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding-top:10px;border-top:1px solid '+LINE+'}'
 +'.svc-card .cp{font-weight:600;font-variant-numeric:tabular-nums}'
 +'.svc-card .cd{font-family:'+FM+';font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:'+MUT+'}'
 +'.svc-card .cb{font-family:'+FM+';font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:'+A+'}'
 +'.sv-rule .svc-card{background:transparent;border:0;border-top:1px solid '+LINE+';padding:18px 0 14px}'
 +'.sv-rule .svc-card:hover{transform:none;box-shadow:none;border-top-color:'+A+'}'
 +'.sv-neon .svc-card{background:'+rgba(A,.06)+';border-color:'+rgba(A,.35)+'}'
 +'.sv-neon .svc-card:hover{box-shadow:0 0 0 1px '+rgba(A,.8)+',0 18px 46px '+rgba(A,.3)+'}'
 +'.sv-term .svc-card{background:transparent;border:1px dashed '+LINE+';padding:14px 16px;font-family:'+FM+'}'
 +'.sv-term .svc-card .cn{font-family:'+FM+';font-size:15px;color:'+A+'}'
 +'.sv-term .svc-card .cl{font-size:12.5px}'
 +'.sv-term .svc-card:hover{transform:none;box-shadow:none;border-style:solid;border-color:'+A+'}'

 // ---- характер шаблона: форма кнопок, рамки, бегущие полосы ------------------
 // Цвет и шрифт у каждого макета уже свои, но пока кнопки оставались одинаковыми
 // пилюлями, все двенадцать читались как один сайт. Здесь каждому даётся своя
 // форма кнопки, свой разделитель и свой световой приём — по духу главной
 // страницы студии: неон, светящиеся рамки, бегущие огни.
 +'.t-pole .cta{border-radius:0;padding:16px 30px;font-weight:600;box-shadow:0 0 0 2px '+rgba(A,.35)+'}'
 +'.t-pole .cta.ghost{box-shadow:inset 0 0 0 2px '+rgba(TX,.4)+'}'
 +'.t-salon .cta{border-radius:0;background:transparent;color:'+A+';box-shadow:inset 0 0 0 1px '+A+';letter-spacing:.24em;padding:16px 34px}'
 +'.t-grid .cta{border-radius:8px;padding:16px 26px}'
 +'.t-poster .cta{border-radius:0;padding:18px 34px;font-weight:700;letter-spacing:.18em}'
 +'.t-zine .cta{border-radius:0;transform:rotate(-1.4deg);box-shadow:6px 6px 0 '+TX+'}'
 +'.t-zine .cta:hover{transform:rotate(-1.4deg) translateY(-3px)}'
 +'.t-mag .cta{border-radius:0;background:transparent;color:'+TX+';box-shadow:none;border-bottom:2px solid '+A+';padding:10px 2px;font-family:'+FD+';font-size:17px;letter-spacing:.02em;text-transform:none}'
 +'.t-kiosk .cta{border-radius:18px;padding:20px 30px;font-size:14px}'
 +'.t-bands .cta{border-radius:0;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);padding:16px 34px}'
 +'.t-mono .cta{border-radius:2px;background:transparent;color:'+A+';box-shadow:inset 0 0 0 1px '+A+';font-family:'+FM+'}'
 +'.t-gold .cta{border-radius:0;box-shadow:inset 0 0 0 1px '+A+',0 0 0 4px '+rgba(A,.22)+';background:transparent;color:'+A+'}'
 +'.t-salon .cta::after,.t-mag .cta::after,.t-mono .cta::after,.t-gold .cta::after{display:none}'

 // Светящаяся рамка, которая обходит блок по кругу. Приём с главной страницы
 // студии: тонкая линия, а внимание держит.
 +'@property --gvpa{syntax:"<angle>";initial-value:0deg;inherits:false}'
 +'@keyframes spinborder{to{--gvpa:360deg}}'
 +'.t-neon .svc-card,.t-kiosk .svc-card{position:relative;border-color:transparent;background-clip:padding-box}'
 +'.t-neon .svc-card::before,.t-kiosk .svc-card::before{content:"";position:absolute;inset:-1px;z-index:-1;border-radius:inherit;'
   +'background:conic-gradient(from var(--gvpa),transparent 0deg,'+A+' 40deg,transparent 120deg,transparent 240deg,'+rgba(A,.6)+' 300deg,transparent 360deg);'
   +'animation:spinborder 6s linear infinite}'

 // Огненная полоса под шапкой: медленно переливается, как неон на витрине.
 +'@keyframes emberflow{to{background-position:220% 0}}'
 +'.t-poster .mq,.t-bands .mq{background:linear-gradient(90deg,'+A+','+A2+','+A+');background-size:220% 100%;animation:emberflow 9s linear infinite}'
 +'.t-neon .tick .mono,.t-kiosk .tick .mono{text-shadow:0 0 6px '+rgba(A,.9)+',0 0 20px '+rgba(A,.5)+'}'
 +'.t-gold h1,.t-neon h1,.t-poster h1{filter:drop-shadow(0 0 18px '+rgba(A,.45)+')}'
 // GVPro, 15.09.2026: on the poster and the bands the hero stands on the accent colour
 // itself, so the ticker (accent) and the price-list link (muted) vanished into it.
 +'.t-poster .tick .mono,.t-bands .tick .mono{color:'+rgba("#ffffff",.88)+';text-shadow:0 1px 8px rgba(0,0,0,.25)}'
 +'.t-poster .und,.t-bands .und{color:'+rgba("#ffffff",.9)+';border-color:'+rgba("#ffffff",.45)+'}'

 // Карточки услуг не должны быть одинаковыми коробками во всех макетах.
 +'.t-pole .svc-card,.t-poster .svc-card,.t-zine .svc-card,.t-gold .svc-card{border-radius:0}'
 +'.t-grid .svc-card,.t-kiosk .svc-card{border-radius:12px}'
 +'.t-zine .svc-card{border-style:dashed}'
 +'.t-bands .svc-card{border:0;border-inline-start:3px solid '+A+'}'
 +'.t-mag .svc-card,.t-salon .svc-card{border:0;border-top:1px solid '+LINE+'}'

 // И разделители в прайсе: волосок, жирная полоса или пунктир.
 +'.t-poster ul.svc li,.t-bands ul.svc li{border-bottom-width:2px}'
 +'.t-zine ul.svc li{border-bottom-style:dashed}'
 +'.t-salon ul.svc li,.t-mag ul.svc li{border-bottom-color:'+rgba(A,.3)+'}'
 +'@media(max-width:560px){.cta{display:block;width:100%;text-align:center}.und{display:block;margin:12px 0 0;text-align:center}ul.svc li .dt{max-width:none}}'
 +'@media(max-width:760px){.pad{padding:38px 20px}.split{grid-template-columns:1fr!important}.two{grid-template-columns:1fr!important}}'
 +'@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}}';
 /* right to left: marquees run the other way, the hover nudge mirrors; Arabic letters join, so
    no tracking at all; Hebrew keeps a little; taller line-height for the scripts with marks */
 if(RTL) kit+='@keyframes mvr{from{transform:translateX(0)}to{transform:translateX(100%)}}.mq div,.tick .mono{animation-name:mvr}[dir=ltr] .tick .mono{animation-name:mv}.bx:hover .go{transform:translateX(-3px)}';
 if(LANG==="ar") kit+='body *{letter-spacing:0!important}.mono,.und,.cta,.svc-card .cd,.svc-card .cb,ul.svc li .go{font-size:12.5px}h1,h2,h3,.d{line-height:1.3}p{line-height:1.7}';
 if(LANG==="he") kit+='.mono,.und,.cta,.svc-card .cd,.svc-card .cb,ul.svc li .go,.tick .mono{letter-spacing:.05em}h1,h2,h3,.d{line-height:1.05}';
 if(LANG==="ru") kit+='h1,h2,h3,.d{line-height:1.02}';
 kit+='h1,h2,h3{overflow-wrap:break-word}';
 /* the small preview of the Signboard fits a whole photograph under the sign */
 if(lite&&tpl==="pole") kit+='.t-pole section.pad:first-of-type{padding-top:20px!important}.t-pole h1{margin:10px 0 6px!important}.t-pole .und{margin-top:6px!important}';
 /* the small preview of Night Shift keeps its cards close under the strip */
 if(lite&&tpl==="neon") kit+='.t-neon #services{padding-top:22px;padding-bottom:16px}.t-neon #services h2{font-size:24px!important}.t-neon #services .rv{margin-bottom:10px!important}';
 if(lite) kit+='*{transition:none!important}.rv{animation:none!important;opacity:1!important;transform:none!important}body::before,.aura,.ph .kb,.cta::after,.t-kiosk .svc-card::before{animation:none!important}';

 function aura(x,y,sz,col,op){return '<span class="aura" style="left:'+x+';top:'+y+';width:'+sz+'px;height:'+sz+'px;background:'+col+';opacity:'+op+'"></span>';}
  function cards(title, mod, note){
  // Четыре первые услуги: название, одна строка, цена, время. Каждая карточка —
  // ссылка в WhatsApp именно на эту услугу, а не общая «напишите нам».
  var box=SERVICES.slice(0,4).map(function(r,i){
   return '<a class="svc-card rv" style="--d:'+(.08*i+.12).toFixed(2)+'s" href="'+bookSvc(r[0],r[1])+'" target="_blank" rel="noopener">'
    +'<span class="cn">'+r[0]+'</span><span class="cl">'+r[3]+'</span>'
    +'<span class="cf"><span class="cp">'+money(r[1])+'</span><span class="cd">'+r[2]+'</span></span>'
    +'<span class="cb">'+K.bookShort+' '+U.onWa+' '+ARR+'</span></a>';
  }).join("");
  return '<section class="pad rel" id="services"><div class="wrapx">'
   +'<div class="rv" style="display:flex;align-items:baseline;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:18px">'
   +'<h2 style="font-size:32px">'+(title||U.whatWeDo)+'</h2>'
   +'<span class="mono" style="color:'+MUT+'">'+(note||U.tapCard)+'</span></div>'
   +'<div class="svcards '+(mod||"")+'">'+box+'</div>'
   +'<p style="margin-top:18px"><a class="und" href="#list" style="margin-inline-start:0">'+U.fullList+'</a>'
   +'<a class="und" href="#visit">'+U.hoursAddr+'</a></p>'
   +'</div></section>';
 }
  function info(){
  return '<section class="pad rel" id="visit"><div class="wrapx info">'
   +'<div><div class="mono" style="color:'+A+'">'+U.hours+'</div><p style="margin-top:8px">'+K.hoursFull+'</p></div>'
   +'<div><div class="mono" style="color:'+A+'">'+U.findUs+'</div><p style="margin-top:8px">'+C+'</p>'
   +'<p style="margin-top:6px"><a href="'+MAPS+'" target="_blank" rel="noopener" style="color:'+A+'">'+U.openMaps+'</a></p></div>'
   +'<div><div class="mono" style="color:'+A+'">'+K.walkTitle+'</div><p style="margin-top:8px;color:'+MUT+'">'+K.walkNote+'</p>'
   +'<p style="margin-top:8px"><a href="'+BOOK+'" target="_blank" rel="noopener" style="color:'+A+'">'+U.msgWa+'</a></p></div>'
   +'</div></section>'
   +'<style>.info{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}.info p{font-size:14.5px;line-height:1.6}@media(max-width:760px){.info{grid-template-columns:1fr}}</style>';
 }
 // Витрина образов. Раньше здесь была примерочная: человек грузил своё фото, а
 // сверху ложился нарисованный контур причёски. Она требовала внимания и почти
 // никто до неё не доходил. Теперь блок сам показывает, что умеет барбер:
 // десять готовых образов сменяют друг друга по кругу — разные стрижки, разные
 // бороды, разные цвета волос.
 //
 // Смена кадров сделана на CSS: она идёт даже если скрипт не выполнится, и
 // страница не окажется с одной застывшей картинкой. Скрипт нужен только чтобы
 // подпись и адрес кнопки шли в ногу с картинкой.
 function toy(){
  /* The showcase is nothing but photographs. Until a category has its own set,
     it stays off: an empty stage reads as a broken page, a missing section does not. */
  if(!s.toy||K.photos===false) return "";
  var per=2.6, total=(LOOKS.length*per).toFixed(1)+"s";
  /* Which frame is on screen is a class now, not a moment inside a CSS animation.
     It used to be animation only, and any browser that paused animations - a tab in
     the background, an iframe scrolled out of sight, reduced motion, the lite render
     used for the twelve tiles - left every slide at opacity 0. The photographs had
     loaded perfectly; the showcase still looked like an empty grey box. */
  var slides=LOOKS.map(function(L,i){
   return '<img class="lk'+(i?'':' on')+'" src="'+PDIR+L[0]+'.jpg'+PHOTOV+'" alt="'+esc(L[1]+" "+U.withWord+" "+L[2])+'" onerror="gvpRetry(this)">';
  }).join("");
  var dots=LOOKS.map(function(L,i){
   return '<i class="dt'+(i?'':' on')+'"></i>';
  }).join("");
  var first=LOOKS[0];
  /* one sentence per category, with the frame written into it */
  function want(L){return K.show.want.replace("{a}",String(L[1]).replace("&rsquo;","'")).replace("{b}",String(L[2]).replace("&rsquo;","'"));}
  return '<section class="pad rel" id="tryon"><div class="wrapx">'
   +'<div class="rv" style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px">'
   +'<h2 style="font-size:34px">'+K.show.title+'</h2>'
   +'<span class="mono" style="color:'+MUT+'">'+fill(U.count,{n:LOOKN,unit:K.show.unit,note:K.show.note})+'</span></div>'
   +'<div class="toywrap rv" style="--d:.12s">'
   +'<div class="stage">'+slides
   +'<span class="mono badge"><em></em>'+U.live+'</span>'
   +'<span class="mono tag" id="ttag">'+first[1]+' &middot; '+first[2]+'</span></div>'
   +'<div class="ctl">'
   +'<p style="font-size:19px;max-width:34ch;margin-bottom:14px">'+K.show.lead+'</p>'
   +'<div class="dots">'+dots+'</div>'
   +'<p class="mono" style="color:'+MUT+';margin:16px 0 20px">'
   +K.show.tags+'</p>'
   +'<a class="cta" id="tsend" href="'+waLink(fill(U.hi,{name:s.name})+want(first))+'" target="_blank" rel="noopener">'+K.show.cta+'</a>'
   +'<a class="und" href="#list">'+U.seeList+'</a>'
   +'<p class="mono" style="color:'+MUT+';margin-top:16px">'+K.show.foot+'</p>'
   +'</div>'
   +'<div class="allten"><div class="mono lbl">'+fill(U.allN,{n:LOOKN})+'</div><div class="grid10">'
   + LOOKS.map(function(L,i){
      return '<a class="th" href="'+waLink(fill(U.hi,{name:s.name})+want(L))+'" target="_blank" rel="noopener" title="'+esc(L[1]+" / "+L[2])+'">'
       +'<img src="'+PDIR+L[0]+'.jpg'+PHOTOV+'" alt="'+esc(L[1]+" "+U.withWord+" "+L[2])+'" onerror="gvpRetry(this)">'
       +'<span class="mono">'+L[1]+'</span></a>';
     }).join("")
   +'</div></div>'
   +'</div></div></section>'
   +'<style>'
   +'.toywrap{display:grid;grid-template-columns:minmax(0,330px) minmax(0,1fr) minmax(0,280px);gap:26px;align-items:start}'
   +'#tryon .allten .lbl{color:'+MUT+';margin-bottom:10px}'
   +'#tryon .grid10{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:8px}'
   +'#tryon .th{position:relative;display:block;aspect-ratio:3/4;overflow:hidden;border:1px solid '+LINE+';text-decoration:none;transition:border-color .25s,transform .25s}'
   +'#tryon .th img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(.35)}'
   +'#tryon .th span{position:absolute;left:0;right:0;bottom:0;padding:4px 5px;font-size:8.5px;letter-spacing:.06em;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.85));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
   +'#tryon .th:hover{border-color:'+A+';transform:translateY(-3px)}#tryon .th:hover img{filter:none}'
   +'@media(max-width:1100px){.toywrap{grid-template-columns:minmax(0,320px) minmax(0,1fr)}#tryon .allten{grid-column:1/-1}}'
   +'#tryon .stage{position:relative;aspect-ratio:3/4;overflow:hidden;border:1px solid '+LINE+';background:'+(dark?"#141114":"#EDE7E1")+'}'
   +'#tryon .lk{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .55s ease}'
   +'#tryon .lk.on{opacity:1}'
   +'#tryon .badge{position:absolute;inset-inline-start:12px;top:12px;z-index:4;display:flex;align-items:center;gap:7px;color:'+rgba("#ffffff",.9)+';background:rgba(0,0,0,.45);padding:5px 9px;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}'
   +'#tryon .badge em{width:7px;height:7px;border-radius:50%;background:'+A+';box-shadow:0 0 10px '+A+';animation:blip 1.8s ease-in-out infinite}'
   +'#tryon .tag{position:absolute;inset-inline-start:12px;bottom:12px;z-index:3;background:rgba(0,0,0,.5);color:#fff;padding:6px 12px;border-radius:999px;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}'
   +'#tryon .dots{display:flex;gap:7px;flex-wrap:wrap}'
   +'#tryon .dt{width:26px;height:3px;border-radius:2px;background:'+LINE+';position:relative;overflow:hidden}'
   +'#tryon .dt::after{content:"";position:absolute;inset:0;background:'+A+';transform:scaleX(0);transform-origin:'+(RTL?"right":"left")+';transition:transform .45s ease}'
   +'#tryon .dt.on::after{transform:scaleX(1)}'
   +'@media(max-width:760px){.toywrap{grid-template-columns:1fr}}'
   +'</style>'
   +(lite?"":'<script>(function(){var L='+jsStr(LOOKS)+',i=1,per='+(per*1000)+';'
    +'var tag=document.getElementById("ttag"),send=document.getElementById("tsend");'
    +'var pics=document.querySelectorAll("#tryon .lk"),dots=document.querySelectorAll("#tryon .dt");'
    +'var base="'+(WA?("https://wa.me/"+WA+"?text="):"")+'";'
    +'function step(){var x=L[i];tag.innerHTML=x[1]+" &middot; "+x[2];'
    +'for(var k=0;k<pics.length;k++)pics[k].className="lk"+(k===i?" on":"");'
    +'for(var k2=0;k2<dots.length;k2++)dots[k2].className="dt"+(k2===i?" on":"");'
    +'if(base)send.href=base+encodeURIComponent('+jsStr(fill(U.hi,{name:s.name}))+'+'+jsStr(K.show.want)+'.replace("{a}",x[1]).replace("{b}",x[2]));'
    +'i=(i+1)%L.length;}'
    /* Начинаем со второго образа: первый уже нарисован в разметке, а CSS
       переключает картинку ровно на первом такте. Ноль здесь дал бы
       подпись, отставшую от кадра на целый круг. */
    +'setTimeout(function(){step();setInterval(step,per);},per);'
    +'})();<\/script>');
 }
 // Раньше здесь была серая плашка с надписью «your video here». Теперь настоящий
 // кадр, а бейдж «video loop», таймкод и полоса воспроизведения остались сверху —
 // рамка та же, содержимое живое. Если файла не будет, под картинкой остаётся
 // прежний градиент, и блок не разваливается.
 //
 // Адрес абсолютный, на genvidpro.com: страницу человек скачивает одним файлом и
 // открывает у себя, относительный путь у него бы не нашёлся.
 function ph(h,label,key,extra){
  var src=key?(PDIR+key+".jpg"+PHOTOV):"";
  /* This block used to say "video loop", "00:08" and "runs on a loop, no sound"
     over a still photograph, whatever was in it. Now a photograph is labelled a
     photograph, and the video words appear only once a real clip is playing.
     The clip comes in over the still, muted and without an audio track, so the
     site's Sound-on rule has nothing to switch on here. The twelve small tiles
     (lite) never get the clip: twelve decoders for twelve thumbnails is waste. */
  var clip=(!lite&&K.clips&&key&&K.clips[key])?(VIDEO+K.clips[key]):"";
  var im=(src?'<img class="kb" src="'+src+'" alt="'+esc(label)+'" onerror="gvpRetry(this)">':'<i class="kb"></i>');
  if(!clip){
   return '<div class="ph" style="'+(extra||"")+'height:'+h+'">'+im
    +'<span class="mono badge">'+U.photo+'</span>'
    +'<span class="mono cap">'+label+'</span></div>';
  }
  return '<div class="ph" style="'+(extra||"")+'height:'+h+'">'+im
   +'<video class="kb pv" muted loop playsinline preload="none" data-src="'+clip+'.mp4'+VIDEOV+'" data-src-m="'+clip+'-m.mp4'+VIDEOV+'" aria-label="'+esc(label)+'"></video>'
   +'<span class="mono badge still">'+U.photo+'</span>'
   +'<span class="vidc"><span class="mono badge"><em></em>'+U.videoLoop+'</span><span class="mono tc">00:00</span></span>'
   +'<span class="mono cap">'+label+'<span class="vidc"> &mdash; '+U.loopNote+'</span></span><b class="bar"></b></div>';
 }
 var N=esc(s.name), T=esc(s.tag), C=esc(s.city);
 var PSLOT=PHOTO_OF[tpl]||"hero", PKEY, PLAB;
 if(PSLOT.indexOf("look:")===0){var LI=LOOKS[+PSLOT.slice(5)]||LOOKS[0];PKEY=LI[0];PLAB=LI[1];}
 else{PKEY=K.ph[PSLOT];PLAB=K.phCap[PSLOT];}
 var LOGO=(function(){
  var raw=String(s.name).trim(); if(!raw) return "";
  var i=raw.indexOf(" ");
  if(i<0){var m=raw.match(/^(.+?[a-z0-9])([A-Z][a-z0-9]+)$/); if(m&&m[1].length>1){i=m[1].length}else{return esc(raw)}}
  var a=esc(raw.slice(0,i)), b=esc(raw.slice(i).replace(/^\s+/,"")), k=s.logo||"solo", st="";
  var glowA=dark?("text-shadow:0 0 4px "+rgba("#ffffff",.95)+",0 0 16px "+rgba("#ffffff",.5)+",0 0 40px "+rgba("#ffffff",.25)):("text-shadow:0 0 22px "+rgba(TX,.2));
  var head='<span style="'+glowA+'">'+a+"</span>";
  if(k==="solo") return head+" "+b;
  if(k==="tone") st="color:"+A2+";text-shadow:0 0 4px "+rgba(A2,.95)+",0 0 16px "+rgba(A2,.6)+",0 0 42px "+rgba(A2,.32);
  if(k==="type") st="font-family:"+(PAIR[f.id]||"'Playfair Display',Georgia,serif")+";font-weight:500;font-style:italic";
  if(k==="out")  st="color:transparent;-webkit-text-stroke:1.6px "+A2+";text-stroke:1.6px "+A2+";filter:drop-shadow(0 0 10px "+rgba(A2,.6)+")";
  if(k==="both") st="color:"+A2+";font-family:"+(PAIR[f.id]||"'Playfair Display',Georgia,serif")+";font-weight:500;font-style:italic;text-shadow:0 0 4px "+rgba(A2,.9)+",0 0 18px "+rgba(A2,.5)+",0 0 44px "+rgba(A2,.3);
  return head+' <span style="'+st+'">'+b+"</span>";
 })();
 var SRV=SERVICES.map(function(r){return r[0]}).join(" &nbsp;&middot;&nbsp; ");
 function ticker(style){
  var inner='<div class="mono">'+SRV+' &nbsp;&middot;&nbsp; '+SRV+' &nbsp;&middot;&nbsp; </div>';
  return '<div class="tick rv" style="--d:.24s;'+(style||"")+'">'+inner+inner+'</div>';
 }
 /* Chrome does not decode an image that sits below the first screen of a srcdoc
    frame: it downloads it, lays it out at the right size, and paints nothing. The
    builder shows every preview in a srcdoc frame, so the whole photo showcase came
    out blank on files that had loaded perfectly - which is what Roma kept seeing
    while every counter I wrote said the pictures were fine. Asking for the decode
    outright settles it, in the preview and in a page someone downloads.

    One retry before giving up. A cancelled load - the builder replacing a preview
    while the picture was still on the way - used to hide the photograph for good,
    and the block stayed an empty grey box even though the file was fine. */
 /* the seal ring: the trades are set at a fixed spacing, so a longer line ran past
    the end of the circle and a shorter one left a gap. Measured on the rendered text
    and the leftover taken out of the spacing, the ring closes whatever it says. */
 /* 16.09.2026, Roma: in Hebrew and Arabic the ring came up empty. The fitter only ever
    changed the spacing, so a line longer than the circle was given a large negative one and
    the letters folded into each other until nothing was left (Arabic, whose letters join,
    vanished outright). Now the line is first CUT to what the circle holds, at a separator so
    it still reads, and only then is the spacing opened to close the ring; the spacing can
    never go below -1, whatever the language. */
 var fitRing='function gvpFitRings(){var ts=document.querySelectorAll("svg text[data-fit]");'
  +'for(var i=0;i<ts.length;i++){var t=ts[i],tp=t.querySelector("textPath")||t;'
  +'if(t.getAttribute("data-full")===null)t.setAttribute("data-full",tp.textContent||"");'
  +'var full=t.getAttribute("data-full")||"";if(full.length<2)continue;'
  +'var L=parseFloat(t.getAttribute("data-fit")),txt=full,have=0;'
  +'tp.textContent=txt;t.style.letterSpacing="";'
  +'for(var g=0;g<24;g++){try{have=t.getComputedTextLength();}catch(e){have=0;}'
  +'if(!have||have<=L)break;'
  +'var k=Math.max(3,Math.floor(txt.length*Math.min(.94,L/have)));txt=txt.slice(0,k);'
  +'var q=Math.max(txt.lastIndexOf("·"),txt.lastIndexOf(" "));if(q>3)txt=txt.slice(0,q+1);'
  +'tp.textContent=txt;}'
  +'var n=txt.length||1;'
  +'for(var p=0;p<3;p++){have=0;try{have=t.getComputedTextLength();}catch(e){}if(!have)break;'
  +'var cur=parseFloat(getComputedStyle(t).letterSpacing)||0,nx=cur+(L-have)/n;'
  +'if(nx<-1)nx=-1;t.style.letterSpacing=nx.toFixed(3)+"px";}}}'
  +'if(document.readyState!=="loading")gvpFitRings();else document.addEventListener("DOMContentLoaded",gvpFitRings);'
  +'if(document.fonts&&document.fonts.ready)document.fonts.ready.then(gvpFitRings);setTimeout(gvpFitRings,900);';
 var retry='<script>'+fitRing+'function gvpRetry(im){if(im.dataset.gvpTried){im.style.display="none";return;}im.dataset.gvpTried=1;'
  +'var u=im.getAttribute("src");setTimeout(function(){im.src=u+(u.indexOf("?")<0?"?":"&")+"r=1";},400);}'
  +'function gvpClips(){var vs=document.querySelectorAll(".ph video.pv");if(!vs.length)return;'
  +'var m=matchMedia("(max-width:900px)").matches;'
  +'function arm(v){if(v.dataset.on)return;v.dataset.on=1;var ph=v.parentNode;'
  +'v.addEventListener("loadedmetadata",function(){var d=Math.round(v.duration||0),t=ph.querySelector(".tc");if(t&&d)t.textContent=(d<600?"0":"")+Math.floor(d/60)+":"+("0"+(d%60)).slice(-2);});'
  +'v.addEventListener("playing",function(){ph.classList.add("on");});'
  +'v.addEventListener("error",function(){v.remove();},{once:true});'
  +'v.src=m?v.dataset.srcM:v.dataset.src;v.load();var p=v.play();if(p&&p.catch)p.catch(function(){});}'
  +'if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){arm(e.target);io.unobserve(e.target);}});},{rootMargin:"200px"});'
  +'for(var i=0;i<vs.length;i++)io.observe(vs[i]);}'
  +'/* the observer is the polite path; this one does not wait for it: anything within a screen and a half is armed on load and on scroll */'
  +'function near(){var H=innerHeight||800;for(var k=0;k<vs.length;k++){var r=vs[k].getBoundingClientRect();if(r.bottom>-H*0.5&&r.top<H*1.5)arm(vs[k]);}}'
  +'near();addEventListener("scroll",function(){if(near.t)return;near.t=setTimeout(function(){near.t=0;near();},250);},{passive:true});'
  +'/* a browser that refused the muted autoplay lets it through after the first touch or click */'
  +'function nudge(){for(var q=0;q<vs.length;q++){var v=vs[q];if(v.dataset.on&&v.paused&&v.src){var p=v.play();if(p&&p.catch)p.catch(function(){});}}}'
  +'addEventListener("pointerdown",nudge,{passive:true});addEventListener("keydown",nudge);document.addEventListener("visibilitychange",function(){if(!document.hidden)nudge();});}'
  +'if(document.readyState!=="loading")gvpClips();else document.addEventListener("DOMContentLoaded",gvpClips);'
  +'function gvpDecode(){var a=document.images,i=0;for(;i<a.length;i++){try{a[i].decoding="sync";'
  +'if(a[i].decode)a[i].decode().catch(function(){});}catch(e){}}}'
  +'if(document.readyState!=="loading")gvpDecode();else document.addEventListener("DOMContentLoaded",gvpDecode);'
  +'addEventListener("load",gvpDecode);setTimeout(gvpDecode,900);<\/script>';
 var body="";

 if(tpl==="fade"){
  body='<section class="split" style="display:grid;grid-template-columns:1.06fr .94fr;min-height:78vh;position:relative;overflow:hidden">'
   +aura("-8%","-14%",520,A,dark?".5":".28")+aura("38%","62%",380,AD,dark?".45":".22")
   +'<div class="pad rel" style="display:flex;flex-direction:column;justify-content:center;gap:20px">'
   +'<div class="mono rv" style="color:'+A+'">'+K.open+'</div>'
   +'<h1 class="rv neon" style="--d:.08s;font-size:clamp(48px,7.4vw,96px)">'+LOGO+'</h1>'+ticker()+''
   +'<p class="rv" style="--d:.18s;color:'+MUT+';font-size:19px;max-width:33ch">'+T+'</p>'
   +'<div class="rv" style="--d:.28s"><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div>'
   +'<div class="rv mono" style="--d:.38s;color:'+MUT+';display:flex;gap:18px;flex-wrap:wrap"><span>'+K.facts[0]+'</span><span>'+K.facts[1]+'</span><span>'+C+'</span></div></div>'
   +'<div class="rel" style="--d:.1s">'+ph("100%",PLAB,PKEY)+'</div></section>'
   +'<div class="mq" style="background:'+A+';color:#fff;border-top:1px solid '+rgba("#fff",.2)+'"><div class="mono">'+Array(9).join(N.toUpperCase()+" &nbsp;&middot;&nbsp; "+K.marquee+" &nbsp;&middot;&nbsp; ")+'</div><div class="mono">'+Array(9).join(N.toUpperCase()+" &nbsp;&middot;&nbsp; "+K.marquee+" &nbsp;&middot;&nbsp; ")+'</div></div>'
   +'<section class="pad rel"><div class="wrapx two" style="display:grid;grid-template-columns:1.1fr .9fr;gap:52px">'
   +'<div><h2 class="rv" style="font-size:34px;margin-bottom:14px">'+K.listTitle+'</h2><ul id="list" class="svc rv">'+list+'</ul></div>'
   +'<div class="rv" style="--d:.2s"><h2 style="font-size:34px;margin-bottom:14px">'+U.where+'</h2>'
   +'<p style="color:'+MUT+';margin-bottom:10px">'+C+'</p><p style="color:'+MUT+'">'+K.hours+'</p>'
   +'<div style="margin-top:22px"><a class="cta ghost" href="'+MAPS+'" target="_blank" rel="noopener">'+U.directions+'</a></div></div></div></section>'
   +cards(K.titles.fade,"",U.tapCard);

 } else if(tpl==="pole"){
  var stripe='repeating-linear-gradient(35deg,'+A+' 0 16px,'+BG+' 16px 32px,'+AD+' 32px 48px,'+BG+' 48px 64px)';
  body='<div style="height:18px;background:'+stripe+';background-size:200% 100%;animation:pole 3.4s linear infinite"></div>'
   +'<style>@keyframes pole{to{background-position:-200% 0}}@keyframes spin{to{transform:rotate(360deg)}}.phwhole .ph .kb{animation:none!important;transform:none!important}'+'@media(max-width:560px){.stamp{inset-inline-end:6px!important;bottom:6px!important;width:74px!important;height:74px!important}}</style>'
   +'<section class="pad rel" style="text-align:center;position:relative;overflow:hidden">'+aura("50%","-30%",620,A,dark?".38":".2")
   +'<div class="mono rv" style="color:'+MUT+'">'+K.facts[1]+' &middot; '+C+'</div>'
   +'<h1 class="rv neon" style="--d:.08s;font-size:clamp(56px,11vw,138px);margin:16px 0 12px">'+LOGO+'</h1>'+ticker()+''
   /* 16.09.2026, Roma: the signboard leads with the picture. The one-line description and the
      button used to stand between the name and the photograph, so the photograph arrived cut
      in half; now it is whole, and the button sits under it where the eye already is. */
   +'<div class="rv phwhole" style="--d:.2s;max-width:'+(lite?'300px':'460px')+';margin:'+(lite?'12px':'22px')+' auto 0">'+ph(lite?"402px":"616px",PLAB,PKEY)+'</div>'
   +'<div class="rv" style="--d:.3s;max-width:'+(lite?'300px':'460px')+';margin:'+(lite?'12px':'20px')+' auto 0">'
   +'<a class="cta" style="display:block;width:100%;text-align:center;padding-inline:0" href="'+BOOK+'" target="_blank" rel="noopener">'+K.book+'</a>'
   +'<a class="und" href="#list" style="margin-inline-start:0">'+K.priceLink+'</a></div></section>'
   +'<section class="pad rel" style="padding-top:0"><div class="wrapx rv" style="--d:.2s;max-width:520px;position:relative;background:'+CARD+';padding:30px 32px;box-shadow:0 30px 70px rgba(0,0,0,'+(dark?".55":".14")+');'
   +'-webkit-mask-image:radial-gradient(circle at 0 24px,transparent 11px,#000 12px),radial-gradient(circle at 100% 24px,transparent 11px,#000 12px);-webkit-mask-composite:source-in;mask-composite:intersect">'
   +'<div class="mono" style="text-align:center;color:'+A+';margin-bottom:6px">'+U.priceList+'</div>'
   +'<div style="height:1px;background:'+LINE+';margin:14px 0 6px"></div><ul id="list" class="svc">'+list+'</ul>'
   +'<p class="mono" style="text-align:center;color:'+MUT+';margin-top:20px">'+U.pay+'</p>'
   +'<div class="stamp" style="position:absolute;inset-inline-end:-14px;bottom:-14px;width:96px;height:96px;border:2px solid '+A+';border-radius:50%;color:'+A+';display:flex;align-items:center;justify-content:center;transform:rotate(-12deg);background:'+CARD+'"><span class="mono" style="font-size:9px;text-align:center;line-height:1.5">'+U.walkIns+'</span></div></div></section>'
   +cards(K.titles.pole,"",U.tapCard)
   +'<div style="height:18px;background:'+stripe+';background-size:200% 100%;animation:pole 3.4s linear infinite reverse"></div>';

 } else if(tpl==="salon"){
  var marble='radial-gradient(140% 100% at 10% 0%,'+rgba(A,.14)+' 0%,transparent 55%),radial-gradient(120% 90% at 90% 100%,'+rgba(A,.1)+' 0%,transparent 60%),'+BG;
  body='<section class="pad rel" style="text-align:center;padding-top:76px;background:'+marble+'">'
   +'<div class="mono rv" style="color:'+A+';letter-spacing:.42em">'+K.kicker+'</div>'
   +'<h1 class="rv" style="--d:.1s;font-size:clamp(46px,7.6vw,92px);font-weight:500;margin:20px 0 16px;font-style:'+(f.id==="play"?"italic":"normal")+'">'+LOGO+'</h1>'+ticker()+''
   +'<div class="rv" style="--d:.16s;width:64px;height:1px;background:'+A+';margin:0 auto 18px"></div>'
   +'<p class="rv" style="--d:.22s;color:'+MUT+';max-width:44ch;margin:0 auto;font-size:18px">'+T+'</p></section>'
   +'<section class="rv" style="--d:.26s;padding:0 36px">'+ph("340px",PLAB,PKEY)+'</section>'
   +'<section class="pad rel"><div class="wrapx" style="max-width:760px">'
   +'<div class="mono" style="text-align:center;color:'+MUT+';margin-bottom:18px">'+U.theServices+'</div><ul id="list" class="svc">'+list+'</ul>'
   +'<div style="text-align:center;margin-top:34px"><a class="cta ghost" href="'+BOOK+'" target="_blank" rel="noopener">'+K.appt+'</a><a class="und" href="#list">'+K.priceLink+'</a></div>'
   +'<p style="text-align:center;color:'+MUT+';margin-top:26px">'+C+'</p></div></section>'
   +cards(K.titles.salon,"sv-rule",U.eachBooks);

 } else if(tpl==="grid"){
  var span=["span 2","span 1","span 1","span 2"],hgt=["210px","210px","170px","170px"];
  var cells=K.cells.map(function(x,i){return [x[0],x[1],span[i],hgt[i],x[2]];});
  var bento=cells.map(function(c,i){
    var sv=SERVICES[c[4]]||SERVICES[0];
    var href=bookSvc(c[0],sv[1]);
    return '<a class="bx rv" href="'+href+'" target="_blank" rel="noopener" style="--d:'+(.1*i+.15)+'s;grid-column:'+c[2]+';min-height:'+c[3]+'">'
    +'<div class="mono" style="color:'+A+'">0'+(i+1)+'</div><h3 style="font-size:26px;margin:10px 0 8px">'+c[0]+'</h3>'
    +'<p style="color:'+MUT+';font-size:14.5px;max-width:34ch">'+c[1]+'</p>'
    +'<div class="bxfoot"><span class="mono">'+money(sv[1])+' &middot; '+sv[2]+'</span><span class="mono go">'+U.book+' '+ARR+'</span></div></a>'}).join("");
  body='<style>.bx{position:relative;display:flex;flex-direction:column;background:'+CARD+';border:1px solid '+LINE+';padding:22px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .35s cubic-bezier(.16,.84,.28,1),border-color .35s,box-shadow .35s}'+'.bxfoot{margin-top:auto;padding-top:14px;display:flex;justify-content:space-between;align-items:baseline;gap:12px;color:'+MUT+'}'+'.bx .go{color:'+A+';opacity:.65;transition:.3s}.bx:hover .go{opacity:1;transform:translateX(3px)}'
   +'.bx::before{content:"";position:absolute;inset:auto -40% -70% -40%;height:150%;background:radial-gradient(closest-side,'+rgba(A,.35)+',transparent);opacity:0;transition:opacity .4s}'
   +'.bx:hover{transform:translateY(-6px);border-color:'+rgba(A,.6)+';box-shadow:0 24px 60px '+rgba(A,.18)+'}.bx:hover::before{opacity:1}</style>'
   +'<header class="pad rel" style="padding-bottom:0;display:flex;justify-content:space-between;align-items:baseline;gap:18px;flex-wrap:wrap">'
   +'<div class="d rv" style="font-size:28px">'+LOGO+'</div><div class="mono rv" style="--d:.1s;color:'+MUT+'">'+C+'</div></header>'
   +'<section class="pad rel" style="overflow:hidden">'+aura("64%","-40%",480,A,dark?".4":".2")
   +'<h1 class="rv" style="font-size:clamp(42px,6.6vw,80px);max-width:16ch">'+T+'</h1>'
   +'<div class="rv" style="--d:.2s;margin-top:26px"><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div>'
   +'<div class="rv" style="--d:.3s;margin-top:30px">'+ph("300px",PLAB,PKEY)+'</div></section>'
   +'<section class="pad" id="services" style="padding-top:0"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">'+bento+'</div></section>'
   +'<section class="pad" style="background:'+(dark?rgba(A,.08):rgba(A,.07))+'"><div class="wrapx" style="max-width:760px"><ul id="list" class="svc">'+list+'</ul></div></section>';

 } else if(tpl==="neon"){
  body='<style>@keyframes flick{0%,92%,100%{opacity:1}93%{opacity:.35}95%{opacity:1}96%{opacity:.5}97%{opacity:1}}'
   +'.sign{animation:flick 7s linear infinite}</style>'
   +'<section class="pad rel" style="background:'+(dark?"#08070A":"#0C0A0D")+';color:#F4EFEA;min-height:'+(lite?'0':'56vh')+';'+(lite?'padding-top:30px;padding-bottom:26px;':'')+'display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;overflow:hidden">'
   +aura("50%","10%",560,A,".42")+aura("12%","70%",300,AL,".3")
   +'<div class="mono rv" style="color:'+rgba("#ffffff",.55)+'">'+K.late+'</div>'
   +'<h1 class="rv sign" style="--d:.1s;font-size:clamp(52px,10vw,124px);margin:20px 0;color:#fff;text-shadow:'+GLOW+'">'+LOGO+'</h1>'+ticker()+''
   +'<div class="rv" style="--d:.14s;height:1px;width:min(560px,70%);background:linear-gradient(90deg,transparent,'+A+',transparent);box-shadow:0 0 18px '+A+'"></div>'
   +'<p class="rv" style="--d:.2s;color:'+rgba("#ffffff",.6)+';max-width:38ch;margin:22px 0 28px">'+T+'</p>'
   +'<div class="rv" style="--d:.3s"><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div>'
   +(lite?'':'<div aria-hidden="true" style="margin-top:18px;transform:scaleY(-1);opacity:.16;-webkit-mask-image:linear-gradient(#000,transparent);mask-image:linear-gradient(#000,transparent)">'
   +'<div class="d" style="font-size:clamp(52px,10vw,124px);color:#fff;text-shadow:'+GLOW+'">'+LOGO+'</div></div>')+'</section>'
   +'<div class="mq" style="background:'+A+';color:#fff"><div class="mono">'+Array(10).join(K.strip)+'</div><div class="mono">'+Array(10).join(K.strip)+'</div></div>'
   /* 15.09.2026, Roma: the running strip and the glowing cards come straight under the sign, so one
      preview shows all three at once: the ticker, the strip and the cards */
   +cards(K.titles.neon,"sv-neon",U.tapCard)
   +'<section class="pad rel"><div class="wrapx two" style="display:grid;grid-template-columns:1fr 1fr;gap:44px">'
   +'<ul id="list" class="svc">'+list+'</ul>'
   +'<div>'+ph("100%",PLAB,PKEY,"min-height:240px;")+'</div></div>'
   +'<p class="mono" style="color:'+MUT+';margin-top:26px">'+C+'</p></section>'
   ;

 } else if(tpl==="poster"){
  body='<section class="rel" style="min-height:92vh;display:flex;flex-direction:column;justify-content:space-between;padding:32px 34px;background:'+A+';color:#fff;overflow:hidden">'
   +aura("74%","8%",460,"#fff",".18")+aura("-6%","70%",420,AD,".55")
   +'<div class="mono rv rel" style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:'+rgba("#ffffff",.85)+'"><span>'+C+'</span><span>'+U.sunFri+'</span><span>'+U.walkIn+'</span></div>'
   +'<h1 class="rv rel" style="--d:.1s;font-size:clamp(66px,16.5vw,220px);margin:26px 0;mix-blend-mode:normal;line-height:.84">'+LOGO+'</h1>'+ticker()+''
   +'<div class="rv rel" style="--d:.2s;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap">'
   +'<p style="max-width:30ch;font-size:19px">'+T+'</p><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener" style="background:'+TX+';color:'+BG+';box-shadow:0 16px 40px rgba(0,0,0,.35)">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div></section>'
   +'<div class="mq" style="background:'+TX+';color:'+BG+'"><div class="mono">'+Array(10).join(" "+N.toUpperCase()+" &nbsp;/&nbsp; ")+'</div><div class="mono">'+Array(10).join(" "+N.toUpperCase()+" &nbsp;/&nbsp; ")+'</div></div>'
   +'<section class="pad rel"><div class="wrapx" style="max-width:980px">'+ph("360px",PLAB,PKEY)+'</div></section>'
   +'<section class="pad rel" style="padding-top:0"><div class="wrapx" style="max-width:760px"><ul id="list" class="svc">'+list+'</ul></div></section>'
   +cards(K.titles.poster,"sv-rule",U.tapCard);

 } else if(tpl==="zine"){
  body='<style>.tape{position:absolute;width:110px;height:26px;background:'+rgba(TX,.14)+';-webkit-backdrop-filter:blur(1px);backdrop-filter:blur(1px);transform:rotate(-6deg)}'
   +'.xerox{filter:contrast(1.25) saturate(.85)}</style>'
   +'<section class="pad rel" style="overflow:hidden">'+aura("80%","-20%",380,A,dark?".35":".18")
   +'<div class="rv xerox" style="position:relative;border:3px solid '+TX+';padding:30px 26px;background:'+CARD+'">'
   +'<span class="tape" style="top:-13px;left:26px"></span><span class="tape" style="bottom:-13px;right:34px;transform:rotate(5deg)"></span>'
   +'<div class="mono" style="display:inline-block;background:'+A+';color:#fff;padding:4px 10px;transform:rotate(-1.6deg)">'+K.zineKick+' / '+C.split(/[,\u060C]/).pop().trim()+'</div>'
   +'<h1 style="font-size:clamp(44px,9vw,104px);text-transform:uppercase;margin:14px 0 12px">'+LOGO+'</h1>'+ticker()+''
   +'<p style="max-width:42ch;color:'+MUT+';margin-bottom:20px">'+T+'</p>'
   +'<a class="cta" href="'+BOOK+'" target="_blank" rel="noopener" style="background:'+TX+';color:'+BG+'">'+K.bookShort+' '+ARR+'</a><a class="und" href="#list">'+K.priceLink+'</a></div></section>'
   +'<section class="pad rel" style="padding-top:0"><div class="wrapx two" style="display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start">'
   +'<div class="rv" style="--d:.15s;transform:rotate(-1.2deg)">'+ph("260px",PLAB,PKEY)+'</div>'
   +'<div class="rv" style="--d:.25s;border:2px dashed '+LINE+';padding:18px 20px"><div class="mono" style="color:'+A+';margin-bottom:10px">'+U.costs+'</div><ul id="list" class="svc">'+list+'</ul></div>'
   +'</div></section>'
   +cards(K.titles.zine,"sv-term",U.tapCard);

 } else if(tpl==="mag"){
  body='<style>.drop::first-letter{float:'+(RTL?"right":"left")+';font-family:'+FD+';font-size:62px;line-height:.8;padding:'+(RTL?"6px 0 0 10px":"6px 10px 0 0")+';color:'+A+'}'
   +'.cols{column-count:2;column-gap:30px;color:'+MUT+'}@media(max-width:760px){.cols{column-count:1}}</style>'
   +'<header class="pad rel" style="padding-bottom:20px;border-bottom:1px solid '+LINE+';text-align:center">'
   +'<div class="mono rv" style="color:'+MUT+'">'+fill(U.issue,{city:C})+'</div>'
   +'<h1 class="rv" style="--d:.08s;font-size:clamp(44px,7vw,86px);margin:12px 0 0">'+LOGO+'</h1>'+ticker()+''
   +'<div class="mono rv" style="--d:.14s;color:'+A+';margin-top:10px">'+K.three+'</div></header>'
   +'<section class="pad rel"><div class="wrapx two" style="display:grid;grid-template-columns:1.4fr 1fr;gap:46px">'
   +'<div class="rv"><p style="font-size:22px;margin-bottom:18px">'+T+'</p>'
   +'<p class="cols drop">'+K.story+'</p>'
   +'<div style="margin-top:24px"><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div>'
   +'<div style="margin-top:26px">'+ph("220px",PLAB,PKEY)+'</div></div>'
   +'<aside class="rv" style="--d:.18s;border-inline-start:1px solid '+LINE+';padding-inline-start:28px">'
   +'<div class="mono" style="color:'+A+';margin-bottom:12px">'+U.index+'</div><ul id="list" class="svc">'+list+'</ul>'
   +'<p class="mono" style="color:'+MUT+';margin-top:20px">'+K.hoursLine.split(" &nbsp;&middot;&nbsp; ").join("<br>")+'</p></aside></div></section>'
   +cards(K.titles.mag,"sv-rule",U.tapCard);

 } else if(tpl==="kiosk"){
  body='<style>@keyframes pulse{0%,100%{box-shadow:0 0 0 0 '+rgba(A,.55)+'}70%{box-shadow:0 0 0 24px '+rgba(A,0)+'}}'
   +'.big{animation:pulse 2.6s ease-out infinite}</style>'
   +'<section class="pad rel" style="text-align:center;padding-top:60px;overflow:hidden">'+aura("50%","-24%",520,A,dark?".4":".2")
   +'<h1 class="rv neon" style="font-size:clamp(42px,6.6vw,74px);margin-bottom:12px">'+LOGO+'</h1>'+ticker()+''
   +'<p class="rv" style="--d:.1s;color:'+MUT+';max-width:34ch;margin:0 auto 12px">'+T+'</p>'
   +'<div class="rv mono" style="--d:.16s;color:'+A+';margin-bottom:24px">'+K.slot+'</div>'
   +'<a class="cta big rv" href="'+BOOK+'" target="_blank" rel="noopener" style="--d:.2s;display:block;max-width:520px;margin:0 auto;font-size:15px;padding:22px">'+K.bookNow+'</a><a class="und" href="#list">'+K.priceLink+'</a>'
   // Раньше здесь был зашитый чужой номер tel:0540000000. Теперь звонок идёт на
   // тот же номер, что человек ввёл в конструкторе; без номера — в WhatsApp.
   +'<a class="cta ghost rv" href="'+(WA?("tel:+"+WA):BOOK)+'"'+(WA?"":' target="_blank" rel="noopener"')+' style="--d:.26s;display:block;max-width:520px;margin:12px auto 0;padding:18px">'+(WA?K.call:K.msg)+'</a></section>'
   +'<section class="pad rel" style="padding-top:10px"><div class="wrapx" style="max-width:560px"><ul id="list" class="svc">'+list+'</ul>'
   +'<div class="rv" style="--d:.2s;margin-top:24px">'+ph("180px",PLAB,PKEY)+'</div>'
   +'<p style="color:'+MUT+';text-align:center;margin-top:18px">'+C+'</p></div></section>'
   +cards(K.titles.kiosk,"sv-neon",U.tapCard);

 } else if(tpl==="bands"){
  body='<style>.bd{position:relative;padding:52px 36px}.bd+.bd{margin-top:-26px;clip-path:polygon(0 26px,100% 0,100% 100%,0 100%)}</style>'
   +'<section class="bd rel" style="background:linear-gradient(120deg,'+A+','+AD+');color:#fff;overflow:hidden">'+aura("82%","-30%",380,"#fff",".2")
   +'<h1 class="rv rel" style="font-size:clamp(44px,7.4vw,88px);margin-bottom:14px">'+LOGO+'</h1>'+ticker()+''
   +'<p class="rv rel" style="--d:.12s;max-width:36ch;font-size:19px">'+T+'</p>'
   +'<div class="rv rel" style="--d:.22s;margin-top:24px"><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener" style="background:#fff;color:'+AD+'">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div>'
   +'<div class="rv rel" style="--d:.3s;margin-top:30px">'+ph("280px",PLAB,PKEY)+'</div></section>'
   +'<section class="bd mono" style="background:'+shade(A,.68)+';color:'+rgba("#ffffff",.86)+';padding-top:60px">'+C+' &nbsp;&middot;&nbsp; '+K.hoursLine+'</section>'
   +'<section class="bd" style="background:'+CARD+';color:'+TX+';padding-top:60px"><div class="wrapx" style="max-width:760px"><ul id="list" class="svc">'+list+'</ul></div></section>'
   +'<section class="bd" style="background:'+TX+';color:'+BG+';padding-top:60px"><div class="wrapx" style="display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap">'
   +'<span class="d" style="font-size:30px">'+K.freeSlot+'</span><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener">'+U.takeIt+'</a><a class="und" href="#list">'+K.priceLink+'</a></div></section>'
   +cards(K.titles.bands,"",U.tapCard);

 } else if(tpl==="mono"){
  var w=Math.max(Array.from(String(s.name)).length,1), wst=Math.round((w+1)/0.36);
  body='<style>@keyframes cur{50%{border-color:transparent}}@keyframes type{0%{width:0}36%,90%{width:'+(w+1)+'ch}100%{width:'+(w+1)+'ch}}'
   +'.term{font-family:'+FM+'}@keyframes mspin{to{transform:rotate(360deg)}}.term bdi{unicode-bidi:isolate}'
   +'.ty{display:inline-block;overflow:hidden;white-space:nowrap;border-inline-end:2px solid '+A+';width:'+(w+1)+'ch;animation:type 4.6s steps('+wst+',end) infinite,cur .8s step-end infinite}</style>'
   +'<section class="pad rel term" style="overflow:hidden">'+aura("88%","-10%",340,A,dark?".3":".16")
   +'<div style="border:1px solid '+LINE+';background:'+CARD+';max-width:1000px;margin:0 auto;box-shadow:0 30px 80px rgba(0,0,0,'+(dark?".6":".12")+')">'
   +'<div style="display:flex;gap:7px;align-items:center;padding:10px 14px;border-bottom:1px solid '+LINE+'">'
   +'<span style="width:9px;height:9px;border-radius:50%;background:'+A+'"></span><span style="width:9px;height:9px;border-radius:50%;background:'+LINE+'"></span><span style="width:9px;height:9px;border-radius:50%;background:'+LINE+'"></span>'
   +'<span class="mono" style="color:'+MUT+';margin-left:8px">'+slug(N,"")+' &mdash; <bdi>'+K.trade+'</bdi>'+'</span></div>'
   +'<div style="padding:26px 24px">'
   +'<p style="color:'+MUT+';font-size:13px"><bdi dir="ltr">$ whoami</bdi></p>'
   +'<h1 class="ty" dir="auto" style="font-family:'+FM+';font-size:clamp(26px,4.4vw,46px);font-weight:600;margin:6px 0 18px;color:'+A+'">'+LOGO+'</h1>'+ticker()+''
   +'<div style="display:flex;align-items:center;gap:14px;margin-bottom:22px">'
   +'<p style="color:'+MUT+';font-size:14px;margin:0;flex:1;min-width:0">'+T+'</p>'
   /* 15.09.2026, Roma: a seal that keeps turning, the brand's name running round it, a prompt in the middle */
   +'<div aria-hidden="true" style="position:relative;flex:0 0 clamp(170px,64%,340px);aspect-ratio:1;container-type:inline-size;transform:translate(-6%,12%);margin-bottom:-8%">'
   +'<svg viewBox="0 0 200 200" style="display:block;width:100%;height:100%;animation:mspin 16s linear infinite;filter:drop-shadow(0 0 6px '+rgba(A,.55)+')">'
   +'<defs><path id="mring" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs>'
   +'<circle cx="100" cy="100" r="92" fill="none" stroke="'+A+'" stroke-width="1.5" stroke-dasharray="3 5"/>'
   +'<circle cx="100" cy="100" r="56" fill="none" stroke="'+rgba(A,.45)+'" stroke-width="1"/>'
   +'<text data-fit="465" style="direction:ltr;unicode-bidi:isolate" fill="'+A+'" font-family="JetBrains Mono,Heebo,Cairo,monospace" font-size="17" font-weight="600" letter-spacing="4">'
   +'<textPath href="#mring">'+esc(String(s.name).toUpperCase())+' &middot; '+K.trade+' &middot; '+esc(String(s.name).toUpperCase())+' &middot; '+K.trade+' &middot; </textPath></text></svg>'
   +'<span style="position:absolute;inset:0;display:grid;place-items:center;color:'+A+';font:600 22cqw '+FM.replace(/'/g,"")+';text-shadow:0 0 10px '+rgba(A,.8)+'">&gt;_</span></div>'
   +'</div>'
   +'<p style="color:'+MUT+';font-size:13px"><bdi dir="ltr">$ cat prices.txt</bdi></p><ul id="list" class="svc" style="font-size:14px;margin-top:8px">'+list+'</ul>'
   +'<p style="color:'+MUT+';font-size:13px;margin-top:20px"><bdi dir="ltr">$ pwd</bdi><br><span style="color:'+TX+'">'+C+'</span></p>'
   +'<p style="color:'+MUT+';font-size:13px;margin-top:20px"><bdi dir="ltr">$ ls services/</bdi></p>'
   +'<div class="svcards sv-term" id="services" style="margin-top:10px">'
   + SERVICES.slice(0,4).map(function(r,i){
      return '<a class="svc-card" href="'+bookSvc(r[0],r[1])+'" target="_blank" rel="noopener">'
       +'<span class="cn">'+slug(r[0],"-")+'</span>'
       +'<span class="cl">'+r[3]+'</span>'
       +'<span class="cf"><span class="cp">'+money(r[1])+'</span><span class="cd">'+r[2]+'</span></span>'
       +'<span class="cb"><bdi dir="ltr">./book &rarr;</bdi></span></a>';
     }).join("")
   +'</div>'
   +'<p style="color:'+MUT+';font-size:13px;margin-top:20px"><bdi dir="ltr">$ open photo.jpg</bdi></p>'
   +'<div style="margin-top:10px">'+ph("240px",PLAB,PKEY)+'</div>'
   +'<p style="color:'+MUT+';font-size:13px;margin-top:20px"><bdi dir="ltr">$ open hours &amp; map</bdi></p>'
   +'<p style="margin-top:6px;font-size:13px"><bdi dir="ltr"><a href="#visit" style="color:'+A+'">./visit</a> &nbsp; <a href="'+MAPS+'" target="_blank" rel="noopener" style="color:'+A+'">./maps</a></bdi></p>'
   +'<div style="margin-top:22px"><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener"><bdi dir="ltr">book --now</bdi></a><a class="und" href="#list">'+K.priceLink+'</a><a class="und" href="#services">'+U.theServices+'</a></div></div></div></section>';

 } else {
  var ring='<svg viewBox="0 0 200 200" width="132" height="132" aria-hidden="true" style="animation:spin 26s linear infinite">'
   +'<defs><path id="cp" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs>'
   +'<circle cx="100" cy="100" r="86" fill="none" stroke="'+A+'" stroke-width="1"/>'
   +'<text data-fit="465" style="direction:ltr;unicode-bidi:isolate" fill="'+A+'" font-family="JetBrains Mono,Heebo,Cairo,monospace" font-size="15" letter-spacing="5.2">'
   +'<textPath href="#cp">'+K.seal+'</textPath></text></svg>';
  body='<style>@keyframes spin{to{transform:rotate(360deg)}}@keyframes shine{to{background-position:220% center}}'
   +'.foil{background:linear-gradient(100deg,'+A+' 20%,'+mix(A,.75)+' 38%,'+A+' 56%);background-size:220% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shine 5.5s linear infinite}</style>'
   +'<section class="pad rel" style="text-align:center;padding:56px 34px;overflow:hidden">'+aura("50%","-30%",560,A,dark?".3":".16")
   +'<div class="rv" style="border:1px solid '+rgba(A,.7)+';outline:4px solid '+rgba(A,.28)+';outline-offset:6px;padding:46px 26px;position:relative;background:'+(dark?rgba("#ffffff",.02):rgba("#000000",.015))+'">'
   +'<div style="position:absolute;top:-66px;left:50%;transform:translateX(-50%)">'+ring+'</div>'
   +'<div class="mono" style="color:'+A+';margin-top:44px">'+K.small+'</div>'
   +'<h1 class="foil" style="font-size:clamp(42px,7vw,88px);margin:16px 0 10px">'+LOGO+'</h1>'+ticker()+''
   +'<div style="height:1px;background:linear-gradient(90deg,transparent,'+A+',transparent);width:200px;margin:16px auto"></div>'
   +'<p style="color:'+MUT+';max-width:38ch;margin:0 auto 26px">'+T+'</p>'
   +'<a class="cta ghost" href="'+BOOK+'" target="_blank" rel="noopener" style="box-shadow:inset 0 0 0 1px '+A+';color:'+A+'">'+K.book+'</a><a class="und" href="#list">'+K.priceLink+'</a></div></section>'
   +'<section class="pad rel" style="padding-top:0"><div class="wrapx" style="max-width:720px">'+ph("300px",PLAB,PKEY)+'<ul id="list" class="svc" style="margin-top:26px">'+list+'</ul>'
   +'<p style="text-align:center;color:'+MUT+';margin-top:24px">'+C+'</p></div></section>'
   +cards(K.titles.gold,"sv-rule",U.tapCard);
 }

 /* This used to print 054 000 0000 on every site anyone downloaded. Now it shows
    the number the person actually typed, and nothing at all when there is none. */
 var handle='@'+slug(N,"");
 var foot='<footer><span>'+N+' &middot; '+C+'</span><span>'+(WA?('<a href="'+BOOK+'" target="_blank" rel="noopener">WhatsApp</a> &middot; '):'')+handle+'</span></footer>';
 return '<!doctype html><html lang="'+LANG+'" dir="'+(RTL?"rtl":"ltr")+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+N+'</title>'+head+'<style>'+kit+'</style></head><body class="t-'+tpl+'">'+retry+body+toy()+info()+foot+'</body></html>';
}


window.GVP={text:textFor,UI:UI_EN,page:page,dress:dress,TPL:TPL,FONTS:FONTS,LOGOS:LOGOS,SWATCH:SWATCH,SERVICES:SERVICES,CATS:CATS,CAT:CAT,DEFAULT:S};
})();

export const GVP = window.GVP;
export default GVP;
