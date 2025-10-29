// plugins/downloader-mediafire.js
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    await conn.sendMessage(m.chat, { 
      text: `${lenguajeGB['smsAvisoMG']()}${mid.smsFire}`
    }, { quoted: m });
    return;
  }

  // Validar URL de MediaFire
  const url = args[0]
  if (!/^https?:\/\/(www\.)?mediafire\.com/i.test(url)) {
    await conn.sendMessage(m.chat, { 
      text: `${lenguajeGB['smsAvisoMG']()} *Enlace no válido.*\n📌 Asegúrate de ingresar una URL de MediaFire válida.\n\nEjemplo: \`${usedPrefix + command} https://www.mediafire.com/file/ejemplo/file.zip\``
    }, { quoted: m });
    return;
  }

  await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

  try {
    const api = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    if (!res.ok) {
      await conn.sendMessage(m.chat, { 
        text: `❌ Error de la API: ${res.status} ${res.statusText}`
      }, { quoted: m });
      return;
    }

    const json = await res.json()

    // Normalizar posibles formatos de respuesta
    const data = json?.data || json?.result || json

    // Campos típicos que puede devolver la API
    const fileUrl   = data?.url || data?.link || data?.download || data?.dl || data?.download_url
    const fileTitle = data?.title || data?.filename || data?.name || 'archivo'
    const fileSize  = data?.size || data?.filesize || 'Desconocido'
    const fileMime  = data?.mime || data?.mimetype || 'application/octet-stream'

    if (!fileUrl) {
      await conn.sendMessage(m.chat, { 
        text: '❌ No se pudo obtener el enlace de descarga.'
      }, { quoted: m });
      return;
    }

    const caption = `${eg}
> ┃ 𓃠 *${gt} ${vs}* 
> ┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
> ┃ 💫 ${mid.name}
> ┃  ${fileTitle}
> ┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
> ┃ 💪 ${mid.smsYT11}
> ┃ ${fileSize}
> ┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
> ┃ 🚀 ${mid.smsYT12}
> ┃  ${fileMime}`.trim()

    // Enviar archivo como documento usando sendMessage
    await conn.sendMessage(
      m.chat,
      {
        document: { url: fileUrl },
        fileName: fileTitle,
        caption: caption,
        mimetype: fileMime
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    
  } catch (e) {
    console.error('❌ Error en mediafire:', e)
    await conn.sendMessage(m.chat, { 
      text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${String(e.message || e)}\n\n${wm}`
    }, { quoted: m });
    
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
}

handler.help = ['mediafire'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(mediafire|mediafiredl|dlmediafire)$/i
handler.register = false
handler.limit = false

export default handler