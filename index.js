const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Webhook error:', err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const text = event.message.text.toLowerCase();
  let replyText = '';

  // 關鍵字自動回覆
  if (text.includes('簽證')) {
    replyText = `✈️【越南簽證服務】

🔹電子簽：$1800／7工作天（不含假日）
🔹落地簽：$2800／15工作天（含快速通關）
🔹五年多次簽：$1500／20-30工作天

📌 請備妥護照影本、電子檔照片與出入境日期，並來電洽詢門市辦理方式。`;
  } else if (text.includes('護照')) {
    replyText = `📘【護照辦理說明】

🔹成人護照（10年效期）：$1800／15工作天
🔹兒童護照（5年效期）：$1600／15工作天
🔹急件加價：$1100

📌 準備資料：
- 2吋大頭照x2（近6個月）
- 身分證正本 或 戶口名簿正本
- 舊護照（如有）

⚠️ 請本人親至門市辦理，現場確認身份資料與文件。`;
  } else if (text.includes('台胞證')) {
    replyText = `📗【台胞證辦理說明】

🔹成人／兒童（5年效期）：$1700／10工作天
🔹遺失補發：$3000／8工作天
🔹急件加價：$1000

📌 準備資料：
- 2吋白底照片x1（不得戴眼鏡）
- 護照正本
- 身分證正本影本
- 戶籍謄本（未滿16歲需附監護人）

⚠️ 初次辦理須本人至門市進行身份核對。`;
  } else {
    replyText = `您好，請輸入「簽證」、「護照」或「台胞證」等關鍵字，我們將為您提供對應服務資訊。`;
  }

  const echo = { type: 'text', text: replyText };
  return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE Bot webhook is running on port ${port}`);
});
