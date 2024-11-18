import fetch from 'node-fetch'

var handler = async (m, { text,  usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `🌸 *ادخل نص للتعرف عليه*\n\nمثل, ${usedPrefix + command} كيف حالك`, m, rcanal)
try {
await m.react('🕒')
var apii = await fetch(`https://aemt.me/bard?text=${text}`)
var res = await apii.json()
await conn.reply(m.chat, res.result, m, rcanal)
await m.react('✅️')
} catch (error) {
await m.react('✖️')
console.error(error)
return conn.reply(m.chat, '🌸 *حدث خطأ غير متوقع*', m, rcanal)
}}

handler.command = ['بارد']
handler.help = ['bard']
handler.tags = ['ai']
handler.premium = false
export default handler
