import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': 'القائمة - المعلومات',
  'buscador': 'القائمة - البحث',
  'fun': 'القائمة - الألعاب',
  'gacha': 'القائمة - جاكا',
  'serbot': 'القائمة - بوتات فرعية',
  'rpg': 'القائمة - آر بي جي',
  'rg': 'القائمة - التسجيل',
  'xp': 'القائمة - الخبرات',
  'sticker': 'القائمة - الملصقات',
  'anime': 'القائمة - الأنمي',
  'database': 'القائمة - قاعدة البيانات',
  'fix': 'القائمة - إصلاح الرسائل المنتظرة',
  'grupo': 'القائمة - المجموعات',
  'nable': 'القائمة - تشغيل/إيقاف',
  'descargas': 'القائمة - التنزيلات',
  'tools': 'القائمة - الأدوات',
  'info': 'القائمة - المعلومات',
  'owner': 'القائمة - المالك',
  'audio': 'القائمة - الصوتيات',
  'ai': 'القائمة - الذكاء الاصطناعي',
  'transformador': 'القائمة - المحولات',
}

const defaultMenu = {
  before: `قائمة شادو 🌸

*✩‧₊˚ معلومات المستخدم ⋆.ೃ࿔*:･

🌸 العميل » \`\`\`%name\`\`\`
✨ الخبرة » \`\`\`%exp\`\`\`
💴 الين » \`\`\`%yenes\`\`\`
🛡 المستوى » \`\`\`%level\`\`\`
💫 الرتبة » \`\`\`%role\`\`\`

*✩‧₊˚ معلومات البوت ⋆.ೃ࿔*:･

تم تعريبه من طرف » \`\`\`@Shadow X Team\`\`\`
🌸 البوت » \`\`\`%botofc\`\`\`
🌸 التاريخ » \`\`\`%fecha\`\`\`
🌸 النشاط » \`\`\`%muptime\`\`\`
🌸 المستخدمين » \`\`\`%totalreg\`\`\`

\t*قائمة الأوامر* 
`.trimStart(),
    header: '「 %category 」\n',
  body: 'ღ %cmd',
  footer: '',
  after: `> ${dev}`,
}
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, yenes, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        yenes: plugin.yenes,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%isdiamond/g, menu.diamond ? '(ⓓ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
botofc: (conn.user.jid == global.conn.user.jid ? 'Oficial' : 'SubBot'), 
fecha: moment.tz('America/Bogota').format('DD/MM/YY'), 
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
greeting, level, yenes, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

let category = "video"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const rlink = db_.links[category][random]
global.vid = rlink
const response = await fetch(vid)
const gif = await response.buffer()

const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

const pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://i.ibb.co/rQnbMPF/img6.jpg')

//await conn.reply(m.chat, '*Próximamente se remitirá el menú.*', fkontak, { contextInfo:{ forwardingScore: 2022, isForwarded: true, externalAdReply: {title: packname, body: dev, sourceUrl: redeshost, thumbnail: await (await fetch(pp)).buffer() }}})

await m.react('🍁') 

await conn.sendMessage(m.chat, { video: { url: vid }, caption: text.trim(), contextInfo: { mentionedJid: [m.sender], isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363318758721861@newsletter', newsletterName: 'Tҽαɱ Cԋαɳɳҽʅ Iαɳ 🌸', serverMessageId: -1, }, forwardingScore: 999, externalAdReply: { title: 'Aƙαɾι Bσƚ ༊', body: dev, thumbnailUrl: icono, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: false,
}, }, gifPlayback: true, gifAttribution: 0 }, { quoted: fkontak })

//await conn.sendMessage(m.chat, {text: text, contextInfo: { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterName: 'Tҽαɱ Cԋαɳɳҽʅ Iαɳ 🌸', newsletterJid: "120363318758721861@newsletter", }, externalAdReply: { title: 'Aƙαɾι Bσƚ ༊', body: dev, thumbnailUrl: 'https://qu.ax/HHXnW.jpg', sourceUrl: redeshost, mediaType: 1, renderLargerThumbnail: true }}}, {quoted: fkontak})

  } catch (e) {
    await m.react(error)
    conn.reply(m.chat, '「✘」 *حدث خطأ أثناء إرسال القائمة*', m, fake, )
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'مهام', 'اوامر', 'الاوامر', 'قائمة', 'القائمة'];
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
var ase = new Date();
var hour = ase.getHours();

switch(hour) {
  case 0: 
    hour = 'تصبح على خير يا فندم 🌙'; 
    break;
  case 1: 
    hour = 'تصبح على خير يا معلم 💤'; 
    break;
  case 2: 
    hour = 'تصبح على خير يا حبيبي 🦉'; 
    break;
  case 3: 
    hour = 'صباح الخير يا باشا ✨'; 
    break;
  case 4: 
    hour = 'صباح الخير يا قمر 💫'; 
    break;
  case 5: 
    hour = 'صباح الفل يا حبيبي 🌅'; 
    break;
  case 6: 
    hour = 'صباح الجمال يا غالي 🌄'; 
    break;
  case 7: 
    hour = 'صباح الورد يا أحلى ناس 🌅'; 
    break;
  case 8: 
    hour = 'صباح التفاؤل يا ملك 💫'; 
    break;
  case 9: 
    hour = 'صباح النشاط يا بطل ✨'; 
    break;
  case 10: 
    hour = 'صباح الشموس يا أحلى واحد 🌞'; 
    break;
  case 11: 
    hour = 'صباح الفل والورد يا غالي 🌨'; 
    break;
  case 12: 
    hour = 'صباح الخير يا جميل ❄'; 
    break;
  case 13: 
    hour = 'صباح الورد يا معلم 🌤'; 
    break;
  case 14: 
    hour = 'مساء الخير يا حبيبي 🌇'; 
    break;
  case 15: 
    hour = 'مساء الورد يا غالي 🥀'; 
    break;
  case 16: 
    hour = 'مساء الفل يا قمر 🌹'; 
    break;
  case 17: 
    hour = 'مساء الخير يا ملك 🌆'; 
    break;
  case 18: 
    hour = 'تصبح على خير يا جميل 🌙'; 
    break;
  case 19: 
    hour = 'تصبح على خير يا حبيبي 🌃'; 
    break;
  case 20: 
    hour = 'تصبح على خير يا غالي 🌌'; 
    break;
  case 21: 
    hour = 'تصبح على خير يا قمر 🌃'; 
    break;
  case 22: 
    hour = 'تصبح على خير يا معلم 🌙'; 
    break;
  case 23: 
    hour = 'تصبح على خير يا باشا 🌃'; 
    break;
}

var greeting = hour;
