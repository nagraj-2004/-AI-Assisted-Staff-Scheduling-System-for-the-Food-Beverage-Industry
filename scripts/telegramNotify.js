require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token);

const rosterData = JSON.parse(fs.readFileSync('./data/roster.json'));
const alertLog = JSON.parse(fs.readFileSync('./alerts/alertLog.json'));

async function sendNotifications() {
    console.log("📱 Sending Telegram Notifications...\n");

    let rosterMsg = "🏨 *SHIFT ROSTER SUMMARY*\n";
    rosterMsg += "─────────────────────\n";

    rosterData.roster.forEach(shift => {
        rosterMsg += `\n📅 *${shift.day} - ${shift.session}*\n`;
        rosterMsg += `⏰ ${shift.startTime} - ${shift.endTime}\n`;
        for (const [role, names] of Object.entries(shift.assigned)) {
            rosterMsg += `👤 ${role}: ${names.join(', ')}\n`;
        }
        rosterMsg += "─────────────────────\n";
    });

    await bot.sendMessage(chatId, rosterMsg, { parse_mode: 'Markdown' });
    console.log("✅ Roster sent!");

    if (alertLog.alerts.length > 0) {
        let alertMsg = "🚨 *UNDERSTAFFING ALERTS*\n";
        alertMsg += "─────────────────────\n";

        alertLog.alerts.forEach(alert => {
            alertMsg += `\n⚠️ *${alert.day} ${alert.session}*\n`;
            alertMsg += `Role: ${alert.role}\n`;
            alertMsg += `Need: ${alert.required} | Got: ${alert.assigned}\n`;
            alertMsg += `💡 Fix: ${alert.suggestions[0]}\n`;
            alertMsg += "─────────────────────\n";
        });

        await bot.sendMessage(chatId, alertMsg, { parse_mode: 'Markdown' });
        console.log("✅ Alerts sent!");
    }

    console.log("\n🎉 All Telegram notifications sent!");
}

sendNotifications().catch(console.error);