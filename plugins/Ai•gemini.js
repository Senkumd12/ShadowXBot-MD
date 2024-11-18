import fetch from 'node-fetch'
var handler = async (m, { text,  usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `『🪐』ادخل نص لاستخدام الأمر.\n\n• مثال:\n${usedPrefix + command} مرحبا`, m, rcanal)
try {
await m.react(rwait)
conn.sendPresenceUpdate('composing', m.chat)
var apii = await fetch(`https://aemt.me/gemini?text=${text}`)
var res = await apii.json()
await m.reply(res.result)
} catch {
await m.react(error)
await conn.reply(m.chat, `『📣』حدث خطأ غير متوقع.`, m, rcanal)
}}
handler.command = ['جيم']
handler.help = ['gemini']
handler.tags = ['ai']

export default handler
