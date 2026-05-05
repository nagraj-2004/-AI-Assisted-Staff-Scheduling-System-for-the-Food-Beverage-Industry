const fs = require('fs');

const rosterData = JSON.parse(fs.readFileSync('./data/roster.json'));
const alertLog = JSON.parse(fs.readFileSync('./alerts/alertLog.json'));

console.log("📢 Sending Staff Notifications...\n");
console.log("─────────────────────────────────────");

// Send shift message to each staff
rosterData.roster.forEach(shift => {
    for (const [role, names] of Object.entries(shift.assigned)) {
        names.forEach(name => {
            console.log(`📱 Message to : ${name}`);
            console.log(`   Day        : ${shift.day}`);
            console.log(`   Session    : ${shift.session}`);
            console.log(`   Time       : ${shift.startTime} - ${shift.endTime}`);
            console.log(`   Role       : ${role}`);
            console.log("─────────────────────────────────────");
        });
    }
});

// Send alerts to manager
console.log("\n🔔 Manager Alert Summary:\n");

if (alertLog.alerts.length > 0) {
    alertLog.alerts.forEach(alert => {
        console.log(`⚠️  ${alert.day} ${alert.session} — ${alert.role}`);
        console.log(`   Status     : ${alert.status}`);
        console.log(`   Required   : ${alert.required}`);
        console.log(`   Assigned   : ${alert.assigned}`);
        console.log(`   Suggestion : ${alert.suggestions[0]}`);
        console.log("─────────────────────────────────────");
    });
} else {
    console.log("✅ No issues! All shifts fully covered.");
}

console.log("\n✅ All notifications sent successfully!");