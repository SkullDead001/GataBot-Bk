let handler = async (m, { conn, usedPrefix, text, command }) => {
    let number;

    if (isNaN(text) && !text.match(/@/g)) {
        // No hacemos nada, número inválido
    } else if (isNaN(text)) {
        number = text.split`@`[1];
    } else if (!isNaN(text)) {
        number = text;
    }

    // Validaciones
    if (!text && !m.quoted) {
        return await conn.sendButton(
            m.chat,
            wm,
            lenguajeGB['smsMalused3']() + `\n*${usedPrefix + command} @${global.owner[0][0]}*`,
            null,
            [[lenguajeGB.smsConMenu(), `${usedPrefix}menu`]],
            fkontak,
            m
        );
    }

    if (number?.length > 13 || (number?.length < 11 && number?.length > 0)) {
        return await conn.sendButton(
            m.chat,
            wm,
            lenguajeGB['smsDemott']() + `\n*${usedPrefix + command} @${global.owner[0][0]}*`,
            null,
            [[lenguajeGB.smsConMenu(), `${usedPrefix}menu`]],
            fkontak,
            m
        );
    }

    try {
        var user;
        if (text) {
            user = number + '@s.whatsapp.net';
        } else if (m.quoted?.sender) {
            user = m.quoted.sender;
        } else if (m.mentionedJid?.[0]) {
            user = number + '@s.whatsapp.net';
        }
    } catch (e) {
        console.error(e);
        return;
    } finally {
        if (user) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
            await conn.sendMessage(
                m.chat,
                { text: lenguajeGB['smsAvisoEG']() + lenguajeGB['smsDemott3']() },
                { quoted: m }
            );
        }
    }
};

handler.command = /^(demote|quitarpoder|quitaradmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;