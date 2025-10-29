import fg from 'api-dylux';
import fetch from 'node-fetch';
import { facebookdl } from '../lib/facebookscraper.js';
import axios from 'axios';

const handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = global.db.data.users[m.sender];

    // Validación de argumentos
    if (!args[0]) 
        return await conn.sendMessage(m.chat, { 
            text: `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊!\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊: *${usedPrefix + command} https://www.facebook.com/watch?v=636541475139*` 
        }, { quoted: m });

    if (!args[0].match(/www.facebook.com|fb.watch/g)) 
        return await conn.sendMessage(m.chat, { 
            text: `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 UN ENLACE DE FACEBOOK VÁLIDO\nEjemplo: *${usedPrefix + command} https://fb.watch/dcXq_0CaHi/*` 
        }, { quoted: m });

    let contenido = `✅ 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆\n${wm}`;

    // Reacción inicial
    await conn.sendMessage(m.chat, { react: { text: '⏳️', key: m.key } });

    try {
        const apiUrl = `https://api.dorratz.com/fbvideo?url=${args}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Filtrar solo elementos con url válidas
        const videosConUrl = data.filter(v => typeof v.url === 'string' && v.url.startsWith('http'));

        const prioridades = ['1080p', '720p (HD)'];
        let videoSeleccionado = null;

        for (const resolucion of prioridades) {
            videoSeleccionado = videosConUrl.find(v => v.resolution === resolucion);
            if (videoSeleccionado) break;
        }

        if (!videoSeleccionado) videoSeleccionado = videosConUrl[0];
        const downloadUrl = videoSeleccionado.url;
        const info = `Resolución: ${videoSeleccionado.resolution}`;

        await conn.sendFile(m.chat, downloadUrl, 'video.mp4', info, m);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch {
        try {
            const api = await fetch(`https://api.agatz.xyz/api/facebook?url=${args}`);
            const data = await api.json();
            const videoUrl = data.data.hd || data.data.sd;
            const imageUrl = data.data.thumbnail;

            if (videoUrl && videoUrl.endsWith('.mp4')) {
                await conn.sendFile(m.chat, videoUrl, 'video.mp4', `${gt}`, m, null, fake);
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            } else if (imageUrl && (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png'))) {
                await conn.sendFile(m.chat, imageUrl, 'thumbnail.jpg', contenido, m, null, fake);
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            }
        } catch {
            try {
                const api = await fetch(`${global.APIs.neoxr.url}/fb?url=${args}&apikey=${global.APIs.neoxr.key}`);
                const response = await api.json();
                const videoHD = response.data.find(video => video.quality === "HD")?.url;
                const videoSD = response.data.find(video => video.quality === "SD")?.url;
                const videoUrl = videoHD || videoSD;

                await conn.sendFile(m.chat, videoUrl, 'video.mp4', contenido, m, null, fake);
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            } catch {
                try {
                    const apiUrl = `${apis}/download/facebook?url=${args}`;
                    const apiResponse = await fetch(apiUrl);
                    const delius = await apiResponse.json();
                    if (!delius || !delius.urls || delius.urls.length === 0) return await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    const downloadUrl = delius.urls[0].hd || delius.urls[0].sd;
                    if (!downloadUrl) return await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    await conn.sendFile(m.chat, downloadUrl, 'error.mp4', contenido, m);
                } catch {
                    try {
                        const ress = await fg.fbdl(args[0]);
                        const urll = await ress.data[0].url;
                        await conn.sendFile(m.chat, urll, 'error.mp4', contenido, m);
                        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                    } catch {
                        try {
                            const result = await facebookdl(args[0]);
                            const { thumbnail, duration, video } = result;
                            let url = '', quality = '';

                            for (const data of [...video]) {
                                if (quality === '360p (SD)') {
                                    url = await data.download();
                                    quality = data.quality;
                                } else if (quality === '720p (HD)') {
                                    quality = data.quality;
                                    url = await data.download();
                                } else {
                                    quality = data.quality;
                                    url = await data.download();
                                }
                            }

                            await conn.sendFile(m.chat, url, quality || '', contenido, m);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    }
};

handler.command = /^(facebook|fb|facebookdl|fbdl|facebook1|fb1|facebookdl1|fbdl1|facebook2|fb2|facebookdl2|fbdl2)$/i;
handler.limit = false;

export default handler;

// Función auxiliar para Instagram
async function igeh(url_media) {
    return new Promise(async (resolve, reject) => {
        const BASE_URL = 'https://instasupersave.com/';
        try {
            const resp = await axios(BASE_URL);
            const cookie = resp.headers['set-cookie'];
            const session = cookie[0].split(';')[0].replace('XSRF-TOKEN=', '').replace('%3D', '');
            const config = {
                method: 'post',
                url: `${BASE_URL}api/convert`,
                headers: {
                    'origin': 'https://instasupersave.com',
                    'referer': 'https://instasupersave.com/pt/',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.52',
                    'x-xsrf-token': session,
                    'Content-Type': 'application/json',
                    'Cookie': `XSRF-TOKEN=${session}; instasupersave_session=${session}`
                },
                data: { url: url_media }
            };
            axios(config).then(response => {
                const ig = [];
                if (Array.isArray(response.data)) {
                    response.data.forEach(post => {
                        ig.push(post.sd === undefined ? post.thumb : post.sd.url);
                    });
                } else {
                    ig.push(response.data.url[0].url);
                }
                resolve({ results_number: ig.length, url_list: ig });
            }).catch(error => reject(error.message));
        } catch (e) {
            reject(e.message);
        }
    });
}
