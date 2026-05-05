const fs = require('fs');

console.log("🚀 Setting up project...\n");

// Auto-generate staff.json
const staffData = {
    staff: [
        { id: "S001", name: "Prakash", role: "Waiter", maxHours: 40, currentHours: 0, available: true },
        { id: "S002", name: "Riya", role: "Waiter", maxHours: 40, currentHours: 0, available: true },
        { id: "S003", name: "Arjun", role: "Chef", maxHours: 40, currentHours: 0, available: false },
        { id: "S004", name: "Meena", role: "Chef", maxHours: 40, currentHours: 0, available: true },
        { id: "S005", name: "Kiran", role: "Cashier", maxHours: 40, currentHours: 0, available: true }
    ]
};

// Auto-generate shifts.json
const shiftData = {
    shifts: [
        {
            id: "SH001", day: "Saturday", session: "Lunch",
            startTime: "11:00", endTime: "15:00", hours: 4,
            requirements: { Waiter: 2, Chef: 1, Cashier: 1 }
        },
        {
            id: "SH002", day: "Saturday", session: "Dinner",
            startTime: "18:00", endTime: "23:00", hours: 5,
            requirements: { Waiter: 3, Chef: 2, Cashier: 1 }
        },
        {
            id: "SH003", day: "Sunday", session: "Lunch",
            startTime: "11:00", endTime: "15:00", hours: 4,
            requirements: { Waiter: 2, Chef: 1, Cashier: 1 }
        }
    ]
};

// Empty files
const rosterData = { roster: [] };
const alertData = { alerts: [] };

// Write all files
fs.writeFileSync('data/staff.json', JSON.stringify(staffData, null, 2));
fs.writeFileSync('data/shifts.json', JSON.stringify(shiftData, null, 2));
fs.writeFileSync('data/roster.json', JSON.stringify(rosterData, null, 2));
fs.writeFileSync('alerts/alertLog.json', JSON.stringify(alertData, null, 2));

console.log("✅ data/staff.json created");
console.log("✅ data/shifts.json created");
console.log("✅ data/roster.json created");
console.log("✅ alerts/alertLog.json created");
console.log("\n🎉 Setup complete! All files ready.");