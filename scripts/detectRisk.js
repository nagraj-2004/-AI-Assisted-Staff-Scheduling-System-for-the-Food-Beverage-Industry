const fs = require('fs');

const shiftData = JSON.parse(fs.readFileSync('./data/shifts.json'));
const rosterData = JSON.parse(fs.readFileSync('./data/roster.json'));
const alertLog = JSON.parse(fs.readFileSync('./alerts/alertLog.json'));

console.log("⚠️  Running Risk Detection...\n");

shiftData.shifts.forEach(shift => {
    const rosterEntry = rosterData.roster.find(r => r.shiftId === shift.id);

    for (const [role, required] of Object.entries(shift.requirements)) {
        const assigned = rosterEntry?.assigned[role]?.length || 0;

        if (assigned < required) {
            const alert = {
                shiftId: shift.id,
                day: shift.day,
                session: shift.session,
                role: role,
                required: required,
                assigned: assigned,
                status: "UNDERSTAFFED",
                suggestions: [
                    `Find part-time ${role} for ${shift.session}`,
                    `Extend available ${role} shift by extra hours`,
                    `Reduce capacity to match available staff`
                ],
                timestamp: new Date().toISOString()
            };

            alertLog.alerts.push(alert);

            console.log(`🚨 ALERT: ${shift.day} ${shift.session}`);
            console.log(`   Role     : ${role}`);
            console.log(`   Required : ${required}`);
            console.log(`   Assigned : ${assigned}`);
            console.log(`   Fix      : ${alert.suggestions[0]}\n`);

        } else {
            console.log(`✅ ${shift.day} ${shift.session} — ${role}: OK (${assigned}/${required})`);
        }
    }
});

fs.writeFileSync('./alerts/alertLog.json', JSON.stringify(alertLog, null, 2));
console.log("\n📋 Alert log saved to alerts/alertLog.json");