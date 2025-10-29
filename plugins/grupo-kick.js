const handler = async (m, {conn, participants, usedPrefix, command}) => {
  try {
    let texto = `${lenguajeGB['smskick1']()}${usedPrefix + command} @${global.owner[0][0]}*`

    if (!global.db.data.settings[conn.user.jid].restrict) {
      await conn.sendMessage(m.chat, { 
        text: `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsSoloOwner']()}`
      }, { quoted: m });
      return;
    }

    if (!m.mentionedJid[0] && !m.quoted) {
      await conn.sendMessage(m.chat, { 
        text: texto,
        mentions: conn.parseMention(texto)
      }, { quoted: m });
      return;
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    let owr = m.chat.split`-`[0];
    
    if (m.mentionedJid.includes(conn.user.jid)) return;

    let eliminar = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) {
      await conn.sendMessage(m.chat, { 
        text: texto
      }, { quoted: m });
      return;
    }

    if (m.message.extendedTextMessage.contextInfo.participant !== null && 
        m.message.extendedTextMessage.contextInfo.participant != undefined && 
        m.message.extendedTextMessage.contextInfo.participant !== "") {

      var mentioned = m.message.extendedTextMessage.contextInfo.mentionedJid[0] ? 
        m.message.extendedTextMessage.contextInfo.mentionedJid[0] : 
        m.message.extendedTextMessage.contextInfo.participant;

      if (conn.user.jid.includes(mentioned)) {
        await conn.sendMessage(m.chat, { 
          text: `${lenguajeGB['smskick1']()}${usedPrefix + command} @${global.owner[0][0]}*`
        }, { quoted: m });
        return;
      }

      let done = `${lenguajeGB['smsAvisoEG']()}*@${mentioned.split("@")[0]} ${lenguajeGB['smskick2']()}*`;
      let err1 = `${lenguajeGB['smsAvisoFG']()}*@${mentioned.split("@")[0]} ${lenguajeGB['smskick3']()}*`;
      let err2 = `${lenguajeGB['smsAvisoAG']()}*@${mentioned.split("@")[0]} ${lenguajeGB['smskick4']()}*`;

      if (eliminar[0].status === "200") {
        await conn.sendMessage(m.chat, { 
          text: done,
          mentions: conn.parseMention(done)
        }, { quoted: m });
      } else if (eliminar[0].status === "406") {
        await conn.sendMessage(m.chat, { 
          text: err1,
          mentions: conn.parseMention(err1)
        }, { quoted: m });
      } else if (eliminar[0].status === "404") {
        await conn.sendMessage(m.chat, { 
          text: err2,
          mentions: conn.parseMention(err2)
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { 
          text: `\n${wm}\n${lenguajeGB['smsMalError3']()}#report ${usedPrefix + command}`
        }, { quoted: m });
      }
    } else if (m.message.extendedTextMessage.contextInfo.mentionedJid != null && 
               m.message.extendedTextMessage.contextInfo.mentionedJid != undefined) {
      return;
    }
  } catch (e) {
    await conn.sendMessage(m.chat, { 
      text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`
    }, { quoted: m });
    
    console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
    console.log(e);
  }
}

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = /^(kick|echar|hechar|sacar|ban|snusnu)$/i;
handler.admin = handler.group = handler.botAdmin = true;
export default handler;
