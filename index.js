const { Telegraf } = require("telegraf");
require("dotenv").config();

const { BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN);

const api = "https://russianwarship.rip/api/v2/statistics/latest";

let dataFromServer = [];
let kindOfStatistic = "stats";

function getDataFromServer(forceFetch) {
  if (forceFetch) {
    console.log("Get data from Server");
    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        dataFromServer = data.data;
      });
  }
}

bot.start((ctx) => {
  ctx.replyWithHTML("Hello there", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Resource", url: "https://russianwarship.rip" }],
        [{ text: "Статистика за день", callback_data: "getDataByDay" }],
        [{ text: "Вся статистика", callback_data: "getAllData" }],
      ],
    },
  });
});

bot.action("getDataByDay", (ctx) => {
  kindOfStatistic = "increase";
  ctx.reply("Статистика за день");
});

bot.action("getAllData", (ctx) => {
  kindOfStatistic = "stats";
  ctx.reply("Вся статистика");
});

bot.hears(/^Hi$/i, (ctx) => {
  ctx.reply("Hi");
});

bot.hears(/[A-Z]+/i, async (ctx) => {
  const key = ctx.message.text;
  await getDataFromServer(dataFromServer.length == 0);
  ctx.reply(
    dataFromServer[kindOfStatistic][key] === undefined
      ? "Incorrect data"
      : `Amount of anihilated ${key}: ${dataFromServer[kindOfStatistic][key]}`
  );
});

bot.launch();
