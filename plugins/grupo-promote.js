let handler = async (m, { conn, usedPrefix, command, text }) => {
    let number;

    if (isNaN(text) && !text.match(/@/g)) {
        // No hacemos nada, número inválido
    } else if (isNaN(text)) {
        number = text.split`@`[1];
    } else if (!isNaN(text)) {
        number = text;
    }

    if (!text && !m.quoted) {
        return await conn.sendMessage(
            m.chat,
            { text: lenguajeGB.smsMalused3() + `\n*${usedPrefix + command} @${global.owner[0][0]}*` },
            { quoted: m }
        );
    }

    if (number?.length > 13 || (number?.length < 11 && number?.length > 0)) {
        return await conn.sendMessage(
            m.chat,
            { text: lenguajeGB.smsDemott() + `\n*${usedPrefix + command} @${global.owner[0][0]}*` },
            { quoted: m }
        );
    }

    try {
        var user;
        if (text) {
            user = number + '@s.whatsapp.net';
        } else if (m.quoted?.sender) {
            user = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {  // ← CORRECCIÓN AQUÍ
            // Para menciones, tomamos el primer usuario mencionado
            user = m.mentionedJid[0];
        }
    } catch (e) {
        console.error(e);
        return;
    } finally {
        if (user) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            await conn.sendMessage(
                m.chat,
                { text: lenguajeGB['smsAvisoEG']() + lenguajeGB['smsDemott2']() },
                { quoted: m }
            );
        }
    }
};

handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;