const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

console.log("Initializing TryCatch75 WhatsApp Bot...");

// Use LocalAuth to save the session so you don't have to scan the QR every time
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log("Scan this QR code in your WhatsApp (Linked Devices) to connect:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ TryCatch75 WhatsApp Bot is ready and connected!');
    
    // Example: Schedule a daily message at 6:00 PM
    // Replace '1234567890@c.us' with your actual phone number (country code + number)
    cron.schedule('0 18 * * *', () => {
        console.log("Running scheduled task: Sending Daily Briefing...");
        // client.sendMessage('919876543210@c.us', "📊 *Daily TryCatch75 Briefing*\n\nDon't forget to mark your attendance today! Visit http://localhost:5173");
    });
});

client.on('message', async msg => {
    // Ignore group messages or status updates
    if (msg.isGroupMsg) return;

    // A simple command to request a report
    if (msg.body.toLowerCase() === '!report') {
        console.log(`Received !report command from ${msg.from}`);
        
        // In a full production setup, you would use firebase-admin here to fetch your actual data
        const report = `📊 *TryCatch75 Quick Report*
        
*Overall Attendance:* 78% (Safe zone)
*Current Streak:* 4 🔥

_Note: This is a placeholder. To link this to your live data, add firebase-admin to this script and fetch your user document._`;
        
        await msg.reply(report);
    }
    
    if (msg.body.toLowerCase() === '!ping') {
        await msg.reply('pong! 🏓 I am alive and tracking your attendance.');
    }
});

// Start the bot
client.initialize();
