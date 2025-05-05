// ملف موحد لأوامر المجموعات والترفيه - AMADAR-B
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fetch = require('node-fetch');

module.exports = {
  name: 'groupCommands',
  tags: ['groups', 'fun', 'anime', 'tools'],
  description: 'مجموعة أوامر للمجموعات والترفيه والملصقات',
  command: /^(منشن|تسجيل|زواج|طلاق|زرف|تغيير_الاسم|خمن_انمي|خمن_سبيستون|صنع_ملصق|تعديل_حقوق|ملصق_لفيديو)$/,
  owner: false,
  group: true,

  async run(m, { conn, args, text, participants, command }) {
    const mentionAll = () => {
      let text = 'منشن جماعي:\n\n';
      let mentions = [];
      participants.forEach((p, i) => {
        text += `${i + 1}. @${p.id.split('@')[0]}\n`;
        mentions.push(p.id);
      });
      conn.sendMessage(m.chat, { text, mentions });
    };

    const registerMember = () => {
      let [name, age] = text.split('|').map(s => s.trim());
      if (!name || !age) return m.reply('يرجى استخدام: تسجيل الاسم | العمر');
      m.reply(`تم تسجيلك:\nاللقب: ${name}\nالعمر: ${age}`);
    };

    const marry = () => {
      if (!m.quoted) return m.reply('منشن من تريد الزواج به!');
      let user = m.quoted.sender;
      m.reply(`تم زواجك من @${user.split('@')[0]} مبروك!`, null, { mentions: [user] });
    };

    const divorce = () => {
      if (!m.quoted) return m.reply('منشن من تريد الطلاق منه!');
      let user = m.quoted.sender;
      m.reply(`تم الطلاق من @${user.split('@')[0]}`, null, { mentions: [user] });
    };

    const kickAll = async () => {
      if (!m.isGroupAdmin) return m.reply('يجب أن تكون أدمن!');
      for (let user of participants) {
        if (user.id !== conn.user.id) {
          await conn.groupParticipantsUpdate(m.chat, [user.id], 'remove');
        }
      }
      m.reply('تم طرد الجميع!');
    };

    const renameGroup = async () => {
      if (!text) return m.reply('اكتب الاسم الجديد هكذا:\nتغيير_الاسم اسم_القروب_الجديد');
      await conn.groupUpdateSubject(m.chat, text);
      m.reply('تم تغيير اسم المجموعة!');
    };

    const guessAnime = () => {
      let characters = ['ناروتو', 'إيتاتشي', 'لوفي', 'غوكو', 'كونان', 'زورو'];
      let character = characters[Math.floor(Math.random() * characters.length)];
      m.reply(`خمن من هذه الشخصية: ${character[0]}...؟`);
    };

    const guessSpacetoon = () => {
      let cartoons = ['سالي', 'الكابتن ماجد', 'ريمي', 'المحقق كونان', 'عدنان ولينا'];
      let cartoon = cartoons[Math.floor(Math.random() * cartoons.length)];
      m.reply(`خمن كرتون سبيستون: ${cartoon[0]}...؟`);
    };

    const makeSticker = async () => {
      if (!m.quoted) return m.reply('من فضلك قم بالرد على صورة أو فيديو!');
      let media = await downloadContentFromMessage(m.quoted.message, m.quoted.mtype.split('Message')[0]);
      conn.sendMessage(m.chat, { sticker: { stream: media }, mimetype: 'image/webp' }, { quoted: m });
    };

    const editStickerExif = async () => {
      if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return m.reply('الرد على ملصق!');
      m.reply('سيتم تعديل حقوق الملصق (تجريبي فقط)');
    };

    const stickerToVideo = async () => {
      if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return m.reply('الرد على ملصق!');
      m.reply('تحويل الملصق إلى فيديو (تجريبي)');
    };

    switch (command) {
      case 'منشن': return mentionAll();
      case 'تسجيل': return registerMember();
      case 'زواج': return marry();
      case 'طلاق': return divorce();
      case 'زرف': return kickAll();
      case 'تغيير_الاسم': return renameGroup();
      case 'خمن_انمي': return guessAnime();
      case 'خمن_سبيستون': return guessSpacetoon();
      case 'صنع_ملصق': return makeSticker();
      case 'تعديل_حقوق': return editStickerExif();
      case 'ملصق_لفيديو': return stickerToVideo();
      default: return m.reply('لم يتم التعرف على الأمر.');
    }
  }
}; 
