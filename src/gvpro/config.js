/* Where the engine looks for its own things.
   tpl-engine.js reads these three globals while it is being evaluated, so this module has to
   run before it. engine.js imports config.js first and tpl-engine.js second, and ES modules
   are evaluated in import order — that ordering is the whole reason this file exists.

   GVP_PHOTOBASE: the app carries its own copy of the photo bank in public/media/photo/.
   The engine's own default points at genvidpro.com, and that copy is incomplete — barber/room.jpg
   is 404 there — which is why the old app served its own and why this port does too. */
window.GVP_PHOTOBASE = '/media/photo/';
window.GVP_FONTBASE = '/fonts/';
window.GVP_LANG = window.GVP_LANG || {};
