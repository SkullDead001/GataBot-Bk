import fetch from 'node-fetch'
import axios from 'axios'

const handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return await conn.sendMessage(
      m.chat,
      {
        text: `${lenguajeGB['smsAvisoMG']()}${mid.smsInsta}\n*${usedPrefix + command} https://www.instagram.com/p/CCoI4DQBGVQ/?igshid=YmMyMTA2M2Y=*`
      },
      { quoted: m }
    )
  }

  // Reacción: proceso iniciado
  await conn.sendMessage(m.chat, { react: { text: '⏳️', key: m.key } })

  // Función para enviar archivo y reaccionar con éxito
  const sendFileWithSuccess = async (url, fileName) => {
    await conn.sendFile(m.chat, url, fileName, wm, m)
    await conn.sendMessage(m.chat, { react: { text: '✅️', key: m.key } })
  }

  // Array de APIs de respaldo
  const apisBackup = [
    async () => { // API 1
      const res = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${args[0]}`)
      const data = await res.json()
      const downloadUrl = data.data[0].url
      const fileType = downloadUrl.includes('.webp') ? 'ig.jpg' : 'ig.mp4'
      await sendFileWithSuccess(downloadUrl, fileType)
    },
    async () => { // API 2
      const apiUrl = `${apis}/download/instagram?url=${encodeURIComponent(args[0])}`
      const apiResponse = await fetch(apiUrl)
      const delius = await apiResponse.json()
      if (!delius?.data?.length) throw new Error('No data')
      const downloadUrl = delius.data[0].url
      const fileType = delius.data[0].type === 'image' ? 'ig.jpg' : 'ig.mp4'
      await sendFileWithSuccess(downloadUrl, fileType)
    },
    async () => { // API 3
      const apiUrll = `https://api.betabotz.org/api/download/igdowloader?url=${encodeURIComponent(args[0])}&apikey=bot-secx3`
      const responsel = await axios.get(apiUrll)
      const resultl = responsel.data
      for (const item of resultl.message) {
        const shortUrl = await (await fetch(`https://tinyurl.com/api-create.php?url=${item.thumbnail}`)).text()
        const textMsg = `✨ *ENLACE | URL:* ${shortUrl}\n\n✅️ Archivo enviado`.trim()
        await conn.sendFile(m.chat, item._url, null, textMsg, m)
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    },
    async () => { // API 4: instagram.v1
      const datTa = await instagram.v1(args[0])
      for (const urRRl of datTa) {
        const shortUrl = await (await fetch(`https://tinyurl.com/api-create.php?url=${args[0]}`)).text()
        const textMsg = `✨ *ENLACE | URL:* ${shortUrl}\n\n✅️ Archivo enviado`.trim()
        await conn.sendFile(m.chat, urRRl.url, 'error.mp4', textMsg, m)
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
    },
    async () => { // API 5: instagramGetUrl
      const resultss = await instagramGetUrl(args[0])
      const shortUrl = await (await fetch(`https://tinyurl.com/api-create.php?url=${args[0]}`)).text()
      const textMsg = `✨ *ENLACE | URL:* ${shortUrl}\n\n✅️ Archivo enviado`.trim()
      await conn.sendFile(m.chat, resultss.url_list[0], 'error.mp4', textMsg, m)
    },
    async () => { // API 6: instagramdl
      const resultssss = await instagramdl(args[0])
      const shortUrl = await (await fetch(`https://tinyurl.com/api-create.php?url=${args[0]}`)).text()
      const textMsg = `✨ *ENLACE | URL:* ${shortUrl}\n\n✅️ Archivo enviado`.trim()
      for (const { url } of resultssss) await conn.sendFile(m.chat, url, 'error.mp4', textMsg, m)
    },
    async () => { // API 7: lolhuman
      const human = await fetch(`https://api.lolhuman.xyz/api/instagram?apikey=${lolkeysapi}&url=${args[0]}`)
      const json = await human.json()
      const videoig = json.result
      const shortUrl = await (await fetch(`https://tinyurl.com/api-create.php?url=${args[0]}`)).text()
      const textMsg = `✨ *ENLACE | URL:* ${shortUrl}\n\n✅️ Archivo enviado`.trim()
      await conn.sendFile(m.chat, videoig, 'error.mp4', textMsg, m)
    }
  ]

  // Ejecuta APIs en orden hasta que alguna funcione
  let success = false
  for (const apiFunc of apisBackup) {
    try {
      await apiFunc()
      success = true
      break
    } catch {}
  }

  if (!success) {
    // Reacción de error
    await conn.sendMessage(m.chat, { react: { text: '❌️', key: m.key } })
  }
}

handler.help = ['instagram <link ig>']
handler.tags = ['downloader']
handler.command = /^(instagram|ig(dl)?)$/i
handler.limit = false
handler.register = false

export default handler