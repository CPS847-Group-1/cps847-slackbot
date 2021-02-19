const { SocketModeClient } = require('@slack/socket-mode');
const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv');

dotenv.config(); // load .env

const appToken = process.env.SLACK_APP_TOKEN;
const botToken = process.env.BOT_TOKEN;

const client = new SocketModeClient({appToken});
const webClient = new WebClient(botToken);

client.on("message", async ({event, body, ack}) => {
	try {
		// send acknowledgement back to slack over the socketMode websocket connection
		// this is so slack knows you have received the event and are processing it
		await ack();
		if (event.bot_id)
			return; // do not process bot messages (bot_id property will exist)
		console.log("received event: ", event);
		await webClient.chat.postMessage({
			text: event.text,
			channel: event.channel
		});
	} catch (e) {
		console.log(e);
	}
});

(async () => {
	// connect to Slack
	await client.start();
	console.log("Bot is running!");
})();