const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);
const taibaoFlex = {
  type: "flex",
  altText: "台胞證辦理資訊",
  contents: {
    type: "bubble",
    hero: {
      type: "image",
      url: "https://i.imgur.com/jylTNUK.png", // 暫時圖片
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover"
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "📗 台胞證辦理",
          weight: "bold",
          size: "xl",
          wrap: true
        },
        {
          type: "text",
          text: "首次申辦或補辦遺失、換發台胞證皆可協助",
          size: "sm",
          color: "#555555",
          wrap: true
        },
        {
          type: "separator",
          margin: "md"
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "md",
          contents: [
            {
              type: "text",
              text: "📌 準備資料：",
              weight: "bold",
              size: "sm",
              wrap: true
            },
            {
              type: "text",
              text: "1️⃣ 身分證正本\n2️⃣ 戶口名簿正本\n3️⃣ 護照正本\n4️⃣ 2 吋照片 2 張\n5️⃣ 其他特殊資料請另洽",
              size: "sm",
              color: "#333333",
              wrap: true
            },
            {
              type: "text",
              text: "💡 請親至門市提交正本資料，我們將協助送件。",
              size: "sm",
              color: "#ff5551",
              wrap: true,
              margin: "md"
            }
          ]
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#00B900",
          action: {
            type: "message",
            label: "我想辦理台胞證",
            text: "我想辦理台胞證"
          }
        }
      ]
    }
  }
};

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

  const msg = event.message.text.trim();
  let replyText = '';

  if (msg.includes('簽證')) {
    replyText = `✈️【越南簽證服務】

🔷 電子簽：$1800 / 7工作天（不含假日）
🔷 落地簽：$2800 / 15工作天（含快速通關）
🔷 五年多次簽：$1500 / 20–30工作天

📌 準備資料：
✅ 電子簽：
- 2 吋大頭照（電子檔）
- 護照影印本
- 台灣聯絡電話與地址
- 過去一年是否去過越南？日期？
⚠️ 訂位紀錄或機票如被退件，會酌收 $25 美金不退費
⚡ 快速通關加價 $1000

✅ 落地簽：
- 2 吋照片 ×2（近6個月大頭）
- 護照效期需已出國日超過6個月以上
- 台灣聯絡電話與地址

⚠️ 注意事項：
1. 確定入越日期後再送件，無法提前入越（簽證日期後入境）
2. 未滿 20 歲者須附監護人證明文件（3 個月內戶籍謄本）`;
  } else if (msg.includes('護照')) {
    replyText = `📘【護照辦理說明】

🔷 成人護照（10年效期）：$1800 / 15工作天  
🔷 兒童護照（5年效期）：$1600 / 15工作天  
🔷 急件加價：$1100

📌 準備資料：
- 2 吋大頭照 ×2（近6個月）
- 身分證正本 或 戶口名簿正本
- 舊護照（如有）

⚠️ 注意事項：
1. 本人需親自至門市辦理，現場核對資料  
2. 未滿15歲首次申辦，須附戶口名簿與監護人證件  
3. 無法辦理或撤件酌收 $400 手續費`;
} else if (msg.includes('台胞') || msg.includes('台胞證')) {
  const taiBaoText = `📗【台胞證辦理說明】
🔷 成人 / 兒童（5年效期）：$1700 / 10工作天  
🔷 遺失補發：$3000 / 8工作天  
🔷 急件加價：$1000

📌 準備資料：
- 2 吋白底照片 ×1（不可戴眼鏡）
- 護照正本
- 身分證正本影本
- 戶籍謄本（未滿16歲需附監護人）

⚠️ 注意事項：
1. 初次辦理需本人到場核對身分  
2. 台胞卡過期、遺失需附報案證明  
3. 未滿16歲須由監護人陪同辦理`;

  return client.replyMessage(event.replyToken, [
    { type: 'text', text: taiBaoText },
    taibaoFlex
  ]);
} else {
  replyText = `你說的是：${event.message.text}`;
}

return client.replyMessage(event.replyToken, {
  type: 'text',
  text: replyText,
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE Bot webhook is running on port ${port}`);
});
