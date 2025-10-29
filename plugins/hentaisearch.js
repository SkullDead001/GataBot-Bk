import axios from 'axios';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: '❌ *_𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙙𝙚𝙡 𝙖𝙣𝙞𝙢𝙚 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖𝙨 𝙗𝙪𝙨𝙘𝙖𝙧._*' },
      { quoted: m }
    );
  }

  try {
    // ⏳ Reaccionar apenas el usuario mande el comando
    await conn.sendMessage(m.chat, { react: { text: "⏳️", key: m.key } });

    const res = await axios.get(`https://animeflvapi.vercel.app/search?text=${encodeURIComponent(text)}`);
    const results = res.data?.results;

    if (!Array.isArray(results) || results.length === 0) {
      // ❌ Si no hay resultados
      await conn.sendMessage(m.chat, { react: { text: "❌️", key: m.key } });
      return conn.sendMessage(
        m.chat,
        { text: '❌ *_𝙉𝙤 𝙨𝙚 𝙚𝙣𝙘𝙤𝙣𝙩𝙧𝙖𝙧𝙤𝙣 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙥𝙖𝙧𝙖 𝙩𝙪 𝙗𝙪𝙨𝙦𝙪𝙚𝙙𝙖._*' },
        { quoted: m }
      );
    }

    const messages = results.slice(0, 10).map(anime => {
      let title = anime.title || 'Sin título';
      let desc = anime.synopsis?.trim() || 'Sin sinopsis disponible.';
      if (desc.length > 400) desc = desc.slice(0, 380) + '...';
      let image = anime.poster || 'https://telegra.ph/file/ec725de5925f6fb4d5647.jpg';

      return [
        `🎌 *${title}*`,
        `📝 *Sinopsis:* ${desc}`,
        image,
        [],
        [[`${usedPrefix}animedl ${anime.id}`]], // botón para descargar episodio
        [],
        []
      ];
    });

    // 🔧 Solución para asegurar que el carrusel funcione con 1 solo resultado
    if (messages.length === 1) {
      messages.push([
        `‎`, // título invisible
        ``,  // descripción vacía
        'https://telegra.ph/Berser-Bot-10-16',
        [],
        [['']], // botón invisible
        [],
        []
      ]);
    }

    await conn.sendCarousel(
      m.chat,
      `🔎 Resultados para: *${text}*`,
      '',
      '📺 Resultados encontrados',
      messages,
      m
    );

    // ✅ Si todo salió bien
    await conn.sendMessage(m.chat, { react: { text: "✅️", key: m.key } });

  } catch (e) {
    console.error(e);
    // ❌ Si hubo error en la API
    await conn.sendMessage(m.chat, { react: { text: "❌️", key: m.key } });
    return conn.sendMessage(
      m.chat,
      { text: '⚠️ Ocurrió un error al buscar el anime. Es posible que la API esté caída o que el formato haya cambiado.' },
      { quoted: m }
    );
  }
};

handler.command = /^\.?animesearch$/i;
export default handler;
