const fs = require('fs');

const staffData = JSON.parse(fs.readFileSync('./data/staff.json'));
const shiftData = JSON.parse(fs.readFileSync('./data/shifts.json'));

const roster = [];

shiftData.shifts.forEach(shift => {
    const assigned = {};

    for (const [role, count] of Object.entries(shift.requirements)) {
        const eligible = staffData.staff.filter(s =>
            s.role === role &&
            s.available === true &&
            (s.currentHours + shift.hours) <= s.maxHours
        );

        assigned[role] = eligible.slice(0, count).map(s => {
            s.currentHours += shift.hours;
            return s.name;
        });
    }

    roster.push({
        shiftId: shift.id,
        day: shift.day,
        session: shift.session,
        startTime: shift.startTime,
        endTime: shift.endTime,
        assigned: assigned
    });
});

fs.writeFileSync('./data/roster.json', JSON.stringify({ roster }, null, 2));
console.log("✅ Roster generated!\n");
console.log(JSON.stringify({ roster }, null, 2));