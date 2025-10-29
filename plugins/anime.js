import { File } from "megajs";
import path from "path";
import fetch from "node-fetch";
import mime from "mime-types";

let handler = async (m, { conn, args }) => {
    try {
        if (!args[0]) 
            return await conn.sendMessage(m.chat, { text: 'Ingresa el id y el capitulo del anime. Ej: dragon-ball-z 10' }, { quoted: m });

        // ⏳ Reacciona apenas el usuario use el comando
        await conn.sendMessage(m.chat, { react: { text: "⏳️", key: m.key } });

        const animeId = args[0];
        const episode = args[1] || 1;
        const apiUrl = `https://animeflvapi.vercel.app/download/anime/${animeId}/${episode}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error al obtener datos de la API");

        const { servers } = await response.json();
        const megaServer = servers.flat().find(s => s.server === "mega");
        if (!megaServer) throw new Error("No se encontró el enlace de MEGA");

        const file = File.fromURL(megaServer.url);
        await file.loadAttributes();

        const fileExtension = path.extname(file.name).slice(1).toLowerCase();
        const mimeType = mime.lookup(fileExtension) || "application/octet-stream";

        // 📌 Caption decorado tipo tu ejemplo de "mega"
        let caption = `
┃ ☠️ *${gt} ${vs}* ☠️
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 🎬 𝘼𝙉𝙄𝙈𝙀 | 𝙄𝘿
┃ ${animeId}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 📺 𝙀𝙋𝙄𝙎𝙊𝘿𝙄𝙊 
┃ ${episode}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 💫 𝙉𝙊𝙈𝘽𝙍𝙀 
┃ ${file.name}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 💪 𝙋𝙀𝙎𝙊 
┃ ${formatBytes(file.size)}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 🚀 𝙏𝙄𝙋𝙊 
┃ ${mimeType}
┃
┃ 🟠 *_𝙉𝙊𝙏𝘼: 𝙀𝙎𝙋𝙀𝙍𝘼 𝘼 𝙌𝙐𝙀 𝙏𝙀𝙍𝙈𝙄𝙉𝙀 𝙋𝘼𝙍𝘼 𝙋𝙀𝘿𝙄𝙍 𝘿𝙀 𝙉𝙐𝙀𝙑𝙊_*
        `.trim();

        // 📩 Muestra primero el caption
        await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

        // 🚫 Validación de peso máximo
        if (file.size >= 1800000000 && !file.directory) {
            await conn.sendMessage(m.chat, { react: { text: "❌️", key: m.key } });
            return await conn.sendMessage(m.chat, { text: "Error: El archivo es muy pesado" }, { quoted: m });
        }

        // 📂 Descarga y envía el archivo
        const data = await file.downloadBuffer();
        await conn.sendFile(m.chat, data, file.name, null, m, null, { mimetype: mimeType, asDocument: true });

        // ✅ Reacción final
        await conn.sendMessage(m.chat, { react: { text: "✅️", key: m.key } });

    } catch (error) {
        // ❌ Error
        await conn.sendMessage(m.chat, { react: { text: "❌️", key: m.key } });
        return await conn.sendMessage(m.chat, { text: `Error: ${error.message}` }, { quoted: m });
    }
};

handler.help = ["animedl <anime-id> <episode-number>"];
handler.tags = ["downloader"];
handler.command = ["animedl", "animeflvdl", "anidl"];
handler.group = true;


export default handler;

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
