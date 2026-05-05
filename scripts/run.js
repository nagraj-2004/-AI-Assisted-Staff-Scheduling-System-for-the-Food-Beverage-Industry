// require('dotenv').config();
// const { execSync } = require('child_process');

// console.log("🚀 Starting Full Scheduler System...\n");

// const scripts = [
//     { name: "Setup", file: "scripts/setup.js" },
//     { name: "Assign Shifts", file: "scripts/assignShifts.js" },
//     { name: "Detect Risks", file: "scripts/detectRisk.js" },
//     { name: "Notifications", file: "scripts/notify.js" }
// ];

// scripts.forEach((script, index) => {
//     console.log(`[${index + 1}/4] Running ${script.name}...`);
//     execSync(`node ${script.file}`, { stdio: 'inherit' });
//     console.log(`[${index + 1}/4] ✅ ${script.name} done!\n`);
// });

// console.log("🎉 Full system run complete!");

require('dotenv').config();
const { execSync } = require('child_process');

console.log("🚀 Starting Full Scheduler System...\n");

const scripts = [
    { name: "Setup", file: "scripts/setup.js" },
    { name: "Assign Shifts", file: "scripts/assignShifts.js" },
    { name: "Detect Risks", file: "scripts/detectRisk.js" },
    { name: "Notify Staff", file: "scripts/notify.js" },
    { name: "Telegram Notify", file: "scripts/telegramNotify.js" }
];

scripts.forEach((script, index) => {
    console.log(`[${index + 1}/5] Running ${script.name}...`);
    execSync(`node ${script.file}`, { stdio: 'inherit' });
    console.log(`[${index + 1}/5] ✅ ${script.name} done!\n`);
});

console.log("🎉 Full system run complete!");