import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = args[0]

    if (!url) {
        return await conn.sendMessage(m.chat, { text: `${lenguajeGB['smsAvisoMG']()}${mid.smsFire}` }, { quoted: m })
    }

    if (!/^https?:\/\/(www\.)?mediafire\.com/i.test(url)) {
        return await conn.sendMessage(
            m.chat,
            { text: `${lenguajeGB['smsAvisoMG']()} *Enlace no válido.*\nEjemplo: \`${usedPrefix + command} https://www.mediafire.com/file/ejemplo/file.zip\`` },
            { quoted: m }
        )
    }

    // ⏳ Reacción inicial
    await conn.sendMessage(m.chat, { react: { text: "⏳️", key: m.key } })

    try {
        const api = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(url)}`
        const res = await fetch(api)
        if (!res.ok) throw new Error(`Error de la API: ${res.status} ${res.statusText}`)

        const json = await res.json()
        const data = json?.data || json?.result || json

        const fileUrl   = data?.url || data?.link || data?.download || data?.dl || data?.download_url
        const fileTitle = data?.title || data?.filename || data?.name || 'archivo'
        const fileSize  = data?.size || data?.filesize || 'Desconocido'
        const fileMime  = data?.mime || data?.mimetype || 'application/octet-stream'

        if (!fileUrl) throw new Error('No se pudo obtener el enlace de descarga.')

        // Mensaje de éxito **solo al usar el comando**
        const successCaption = `
╰⊱💚⊱ *ÉXITO | SUCCESS* ⊱💚⊱╮

> ┃ 💫 NOMBRE
> ┃ ${fileTitle}
> ┃ 💪 PESO
> ┃ ${fileSize}
> ┃ 🚀 TIPO
> ┃ ${fileMime}
`.trim()

        await conn.sendMessage(m.chat, { text: successCaption }, { quoted: m })

        // 🔹 Enviar archivo **limpio** SIN caption, SIN m, solo lo mínimo
        await conn.sendMessage(
            m.chat,
            {
                document: { url: fileUrl },
                mimetype: fileMime,
                fileName: fileTitle
            }
        )

        // ✅ Reacción al finalizar
        await conn.sendMessage(m.chat, { react: { text: "✅️", key: m.key } })

    } catch (e) {
        console.error('❌ Error en mediafire:', e)
        await conn.sendMessage(m.chat, { react: { text: "❌️", key: m.key } })
        await conn.sendMessage(
            m.chat,
            { text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${String(e.message || e)}\n\n${wm}` },
            { quoted: m }
        )
    }
}

handler.help = ['mediafire'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(mediafire|mediafiredl|dlmediafire)$/i
handler.register = false
handler.limit = false

export default handler