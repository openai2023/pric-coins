const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// replace YOUR_TELEGRAM_BOT_TOKEN with your Telegram bot token
const bot = new TelegramBot('6033934443:AAHB0hIVq5PU2HAjqe8zDmH1SuiSFNGBPOU', { polling: true });

// replace YOUR_COINMARKETCAP_API_KEY with your CoinMarketCap API key
const API_KEY = '18b18c99-9f2d-431b-9600-d6fd66e92a9f';

// command to get the price, percent change and volume of a cryptocurrency
bot.onText(/\/p (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const symbol = match[1].toUpperCase();

  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=USD`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY
      }
    });

    const data = response.data.data[symbol].quote.USD;
    const price = data.price;
    const percentChange24h = data.percent_change_24h;
    const volume24h = data.volume_24h;

    bot.sendMessage(chatId, `1 ${symbol} = $${price.toFixed(2)} USDT\n24h change: ${percentChange24h.toFixed(2)}%\n24h volume: $${volume24h.toFixed(2)}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Sorry, an error occurred');
  }
});

// command to get a list of supported cryptocurrencies
bot.onText(/\/list/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=USD', {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY
      }
    });

    const cryptocurrencies = response.data.data.map((currency) => currency.symbol).join(', ');

    bot.sendMessage(chatId, `Supported cryptocurrencies: ${cryptocurrencies}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Sorry, an error occurred');
  }
});