const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const echo = { type: 'text', text: `你說的是：${event.message.text}` };
  return client.replyMessage(event.replyToken, echo);
}

const client = new line.Client(config);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE Bot webhook is running on port ${port}`);
});
