import fetch from 'node-fetch'
import yts from 'yt-search'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { ytmp4 } = require('@hiudyy/ytdl')

const LimitVid = 450 * 1024 * 1024 // 450MB

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return await conn.sendMessage(
      m.chat,
      { text: `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*` },
      { quoted: m }
    )
  }

  const yt_play = await search(args.join(' '))
  let youtubeLink = ''
  
  if (args[0].includes('you')) {
    youtubeLink = args[0]
  } else {
    const index = parseInt(args[0]) - 1
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find(item => item.from === m.sender)
        if (matchingItem) {
          if (index < matchingItem.urls.length) youtubeLink = matchingItem.urls[index]
          else throw `${lenguajeGB['smsAvisoFG']()} ${mid.smsYT} ${matchingItem.urls.length}*`
        } else {
          throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
        }
      } else {
        throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
      }
    } else {
      throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)}${usedPrefix}playlist <texto>*`
    }
  }

  await conn.sendMessage(
    m.chat,
    { text: lenguajeGB['smsAvisoEG']() + mid.smsVid },
    { quoted: m }
  )

  const target = youtubeLink || yt_play?.[0]?.url
  if (!target) {
    return await conn.sendMessage(
      m.chat,
      { text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}` },
      { quoted: m }
    )
  }

  try {
    const data = await ytmp4(target)

    const out =
      typeof data === 'string'
        ? data
        : data?.url || data?.result || data?.downloadUrl || data?.dl || data

    const isUrl = typeof out === 'string'
    const size = isUrl ? await getFileSize(out) : 0
    console.log(`  🔗 obtenido: ${isUrl ? out.slice(0, 120) + (out.length > 120 ? '…' : '') : '[Buffer/Stream]'}  |  size≈ ${(size / (1024 * 1024)).toFixed(2)} MB`)

    // Sanitizar nombre de archivo
    const safeTitle = (yt_play?.[0]?.title || 'video').replace(/[\/\\?%*:|"<>]/g, '_')

    const caption = `╭━❰ ${wm} ❱━⬣
┃ 💜 ${mid.smsYT1}
┃ ${yt_play?.[0]?.title || 'video'}
╰━━━━━❰ *𓃠 ${vs}* ❱━━━━⬣`

    const messageOptions = {
      fileName: `${safeTitle}.mp4`,
      caption,
      mimetype: 'video/mp4'
    }

    if (isUrl) {
      if (size > LimitVid) {
        await conn.sendMessage(m.chat, { document: { url: out }, ...messageOptions }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, { video: { url: out }, ...messageOptions }, { quoted: m })
      }
    } else {
      await conn.sendMessage(m.chat, { video: out, ...messageOptions }, { quoted: m })
    }
  } catch (e) {
    console.log(`❌ Error @hiudyy/ytdl: ${e?.message || e}`)
    await conn.sendMessage(
      m.chat,
      { text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}` },
      { quoted: m }
    )
  }
}

handler.command = /^video|fgmp4|dlmp4|getvid|yt(v|mp4)?$/i
handler.register = false
export default handler

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options })
  return search.videos
}

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return parseInt(res.headers.get('content-length') || 0)
  } catch {
    return 0
  }
}