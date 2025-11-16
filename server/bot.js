// This file is: server/bot.js

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE_URL = 'http://localhost:5000';

const runBot = () => {
    if (!token) {
        console.warn('⚠️  Telegram Bot Token not found. Bot is not running.');
        return;
    }

    const bot = new TelegramBot(token.replace(/"/g, ''), { polling: true });
    console.log('✅ Telegram bot is running and listening for commands...');

    // Listen for the /verify <hash> command
    bot.onText(/\/verify (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const txHash = match[1].trim();

        // Validate transaction hash format
        if (!txHash.startsWith('0x') || txHash.length !== 66) {
            bot.sendMessage(chatId, '❌ Invalid transaction hash format!\n\nPlease provide a valid Ethereum transaction hash (66 characters starting with 0x).');
            return;
        }

        bot.sendMessage(chatId, '🔍 Verifying claim on blockchain... Please wait.');

        try {
            // Call the verify API endpoint
            const response = await axios.get(`${API_BASE_URL}/api/verify/transaction/${txHash}`);
            const data = response.data;

            if (data.valid && data.isLandClaim && data.claimData) {
                const { ownerName, location, claimId, verifiedBy, timestamp, blockNumber } = data.claimData;
                
                const reply = `✅ *Valid Land Claim Found!*

*Owner:* ${ownerName}
*Location (GPS):* ${location}
*Claim ID:* \`${claimId}\`
*Verified By:* \`${verifiedBy.substring(0, 10)}...${verifiedBy.substring(verifiedBy.length - 8)}\`
*Block Number:* ${blockNumber}
*Verified On:* ${new Date(timestamp).toLocaleString('en-IN')}

🔗 [View on Etherscan](https://sepolia.etherscan.io/tx/${txHash})

This claim has been permanently recorded on the Sepolia blockchain and verified by the Gram Sabha Council.`;

                bot.sendMessage(chatId, reply, { parse_mode: 'Markdown', disable_web_page_preview: true });
            } else if (data.valid && !data.isLandClaim) {
                const reply = `ℹ️ *Transaction Found*

This is a valid blockchain transaction, but it's not a land claim verification.

*Transaction Hash:* \`${txHash}\`
*Block Number:* ${data.blockNumber}

🔗 [View on Etherscan](https://sepolia.etherscan.io/tx/${txHash})`;

                bot.sendMessage(chatId, reply, { parse_mode: 'Markdown', disable_web_page_preview: true });
            } else {
                throw new Error('Claim not found');
            }
        } catch (error) {
            console.error('Verification error:', error.message);
            
            const reply = `❌ *Claim Not Found*

We could not find a verified land claim for this transaction hash.

*Possible reasons:*
• Transaction hash is incorrect
• Claim is still pending (not yet verified by 5 council members)
• Transaction is not a land claim verification

*What you can do:*
• Check the transaction hash for typos
• Verify the claim has been approved by the Gram Sabha Council
• Visit our website to check claim status

Need help? Contact your local Gram Sabha administrator.`;

            bot.sendMessage(chatId, reply, { parse_mode: 'Markdown' });
        }
    });

    // Listen for /start command
    bot.onText(/\/start/, (msg) => {
        const welcomeMessage = `🌿 *Welcome to Adhikar Land Registry Bot!*

This bot helps you verify tribal land ownership claims recorded on the blockchain.

*How to use:*
Send me a transaction hash like this:
\`/verify 0xYourTransactionHashHere\`

*Example:*
\`/verify 0x6f4453c3bf7eda75a3933226b11e7ff3a620d48869cc73e0f25dc177d4564f7f\`

*Features:*
✓ Instant blockchain verification
✓ View owner details
✓ Check GPS location
✓ See verification timestamp
✓ Direct Etherscan link

🔒 All data is fetched directly from the Sepolia blockchain - transparent and immutable!`;

        bot.sendMessage(msg.chat.id, welcomeMessage, { parse_mode: 'Markdown' });
    });

    // Listen for /help command
    bot.onText(/\/help/, (msg) => {
        const helpMessage = `📚 *Adhikar Bot Help*

*Available Commands:*

\`/start\` - Show welcome message
\`/verify <hash>\` - Verify a land claim by transaction hash
\`/help\` - Show this help message

*How to get a transaction hash:*
1. Submit a land claim on our website
2. Wait for 5 council members to vote
3. Once verified, you'll receive a transaction hash
4. Use that hash with /verify command

*Example:*
\`/verify 0x6f4453c3bf7eda75a3933226b11e7ff3a620d48869cc73e0f25dc177d4564f7f\`

*About Adhikar:*
Adhikar is a decentralized land registry system for tribal communities. We use blockchain technology to create permanent, tamper-proof records of land ownership verified by the Gram Sabha Council.

🌐 Website: http://localhost:3000
📧 Support: Contact your local Gram Sabha`;

        bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' });
    });

    // Handle any text that's not a command
    bot.on('message', (msg) => {
        const text = msg.text;
        
        // Skip if it's a command
        if (text && text.startsWith('/')) return;
        
        // Check if the message looks like a transaction hash
        if (text && text.startsWith('0x') && text.length === 66) {
            bot.sendMessage(msg.chat.id, `I see you sent a transaction hash! Use the /verify command:\n\n\`/verify ${text}\``, { parse_mode: 'Markdown' });
        } else if (text && !text.startsWith('/')) {
            bot.sendMessage(msg.chat.id, 'Please use /start to see available commands or /verify <hash> to verify a land claim.');
        }
    });

    // Handle errors
    bot.on('polling_error', (error) => {
        console.error('❌ Telegram bot polling error:', error.message);
    });
};

module.exports = { runBot };
