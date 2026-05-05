
// require('dotenv').config();
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const https = require('https');

// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // ── File paths ────────────────────────────────────
// const STAFF_FILE = path.join(__dirname, 'data', 'staff.json');
// const SHIFTS_FILE = path.join(__dirname, 'data', 'shifts.json');
// const ROSTER_FILE = path.join(__dirname, 'data', 'roster.json');
// const ALERTS_FILE = path.join(__dirname, 'alerts', 'alertLog.json');

// const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
// const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// // ── Test route ────────────────────────────────────
// app.get('/api/test', (req, res) => {
//     res.json({ success: true, message: 'Server is working!' });
// });

// // ── GET routes ────────────────────────────────────
// app.get('/api/staff', (req, res) => res.json(read(STAFF_FILE)));
// app.get('/api/shifts', (req, res) => res.json(read(SHIFTS_FILE)));
// app.get('/api/roster', (req, res) => res.json(read(ROSTER_FILE)));
// app.get('/api/alerts', (req, res) => res.json(read(ALERTS_FILE)));

// // ── ADD STAFF ─────────────────────────────────────
// app.post('/api/staff/add', (req, res) => {
//     console.log('📥 POST /api/staff/add called');
//     console.log('Body:', req.body);

//     const { name, role, maxHours } = req.body;
//     if (!name || !role) {
//         return res.status(400).json({ success: false, error: 'Name and role required' });
//     }

//     const data = read(STAFF_FILE);
//     const newStaff = {
//         id: 'S' + Date.now(),
//         name: name.trim(),
//         role: role.trim(),
//         maxHours: parseInt(maxHours) || 40,
//         currentHours: 0,
//         available: true
//     };
//     data.staff.push(newStaff);
//     write(STAFF_FILE, data);
//     console.log('✅ Added:', newStaff.name);
//     res.json({ success: true, staff: newStaff });
// });

// // ── DELETE STAFF ──────────────────────────────────
// app.delete('/api/staff/:id', (req, res) => {
//     console.log('🗑 DELETE /api/staff/' + req.params.id);
//     const data = read(STAFF_FILE);
//     const before = data.staff.length;
//     data.staff = data.staff.filter(s => String(s.id) !== String(req.params.id));
//     console.log(`Removed ${before - data.staff.length} staff`);
//     write(STAFF_FILE, data);
//     res.json({ success: true });
// });

// // ── TOGGLE AVAILABILITY ───────────────────────────
// app.patch('/api/staff/:id/toggle', (req, res) => {
//     console.log('🔄 PATCH toggle:', req.params.id);
//     const data = read(STAFF_FILE);
//     const staff = data.staff.find(s => String(s.id) === String(req.params.id));
//     if (staff) {
//         staff.available = !staff.available;
//         write(STAFF_FILE, data);
//         res.json({ success: true, available: staff.available });
//     } else {
//         res.status(404).json({ success: false, error: 'Staff not found' });
//     }
// });

// // ── ADD SHIFT ─────────────────────────────────────
// app.post('/api/shifts/add', (req, res) => {
//     console.log('📥 POST /api/shifts/add called');
//     console.log('Body:', req.body);

//     const { day, session, startTime, endTime, waiter, chef, cashier } = req.body;
//     if (!day || !session) {
//         return res.status(400).json({ success: false, error: 'Day and session required' });
//     }

//     const data = read(SHIFTS_FILE);
//     const newShift = {
//         id: 'SH' + Date.now(),
//         day, session,
//         startTime: startTime || '09:00',
//         endTime: endTime || '17:00',
//         hours: 4,
//         requirements: {
//             Waiter: parseInt(waiter) || 0,
//             Chef: parseInt(chef) || 0,
//             Cashier: parseInt(cashier) || 0
//         }
//     };
//     data.shifts.push(newShift);
//     write(SHIFTS_FILE, data);
//     console.log('✅ Shift added:', newShift.day, newShift.session);
//     res.json({ success: true, shift: newShift });
// });

// // ── DELETE SHIFT ──────────────────────────────────
// app.delete('/api/shifts/:id', (req, res) => {
//     console.log('🗑 DELETE /api/shifts/' + req.params.id);
//     const data = read(SHIFTS_FILE);
//     data.shifts = data.shifts.filter(s => String(s.id) !== String(req.params.id));
//     write(SHIFTS_FILE, data);
//     res.json({ success: true });
// });

// // ── GENERATE ROSTER ───────────────────────────────
// app.post('/api/generate', async (req, res) => {
//     console.log('⚡ Generating roster...');
//     const staffData = read(STAFF_FILE);
//     const shiftData = read(SHIFTS_FILE);

//     staffData.staff.forEach(s => s.currentHours = 0);

//     const roster = [];
//     shiftData.shifts.forEach(shift => {
//         const assigned = {};
//         for (const [role, count] of Object.entries(shift.requirements)) {
//             const eligible = staffData.staff.filter(s =>
//                 s.role === role && s.available === true &&
//                 (s.currentHours + shift.hours) <= s.maxHours
//             );

//             eligible.sort((a, b) => a.currentHours - b.currentHours);

//             assigned[role] = eligible.slice(0, count).map(s => {
//                 s.currentHours += shift.hours;
//                 return s.name;
//             });
//         }
//         roster.push({
//             shiftId: shift.id, day: shift.day,
//             session: shift.session,
//             startTime: shift.startTime,
//             endTime: shift.endTime, assigned
//         });
//     });

//     write(ROSTER_FILE, { roster });
//     write(STAFF_FILE, staffData);

//     const alertLog = { alerts: [] };
//     shiftData.shifts.forEach(shift => {
//         const entry = roster.find(r => r.shiftId === shift.id);
//         for (const [role, required] of Object.entries(shift.requirements)) {
//             const assigned = entry?.assigned[role]?.length || 0;
//             if (assigned < required) {
//                 alertLog.alerts.push({
//                     shiftId: shift.id, day: shift.day,
//                     session: shift.session, role,
//                     required, assigned, status: 'UNDERSTAFFED',
//                     suggestions: [
//                         `Find part-time ${role} for ${shift.session}`,
//                         `Extend available ${role} by extra hours`,
//                         `Reduce capacity to match staff`
//                     ],
//                     timestamp: new Date().toISOString()
//                 });
//             }
//         }
//     });
//     write(ALERTS_FILE, alertLog);

//     // Send Telegram
//     const token = process.env.TELEGRAM_BOT_TOKEN;
//     const chatId = process.env.TELEGRAM_CHAT_ID;

//     if (token && chatId && !token.includes('your_')) {
//         const send = (text) => new Promise((resolve) => {
//             const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' });
//             const req = https.request({
//                 hostname: 'api.telegram.org',
//                 path: `/bot${token}/sendMessage`,
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
//             }, resolve);
//             req.write(body);
//             req.end();
//         });

//         let msg = '🏨 *ROSTER GENERATED*\n─────────────────\n';
//         roster.forEach(s => {
//             msg += `\n📅 *${s.day} - ${s.session}*\n⏰ ${s.startTime}-${s.endTime}\n`;
//             for (const [role, names] of Object.entries(s.assigned)) {
//                 msg += `👤 ${role}: ${names.join(', ') || 'None'}\n`;
//             }
//         });
//         await send(msg);

//         if (alertLog.alerts.length > 0) {
//             let alertMsg = '🚨 *ALERTS*\n─────────────────\n';
//             alertLog.alerts.forEach(a => {
//                 alertMsg += `⚠️ *${a.day} ${a.session} — ${a.role}*\nNeed:${a.required} Got:${a.assigned}\n💡 ${a.suggestions[0]}\n\n`;
//             });
//             await send(alertMsg);
//         } else {
//             await send('✅ All shifts covered!');
//         }
//         console.log('✅ Telegram sent!');
//     }

//     res.json({ success: true, roster, alerts: alertLog.alerts });
// });

// // ── Start ─────────────────────────────────────────
// app.listen(PORT, () => {
//     console.log(`\n🚀 Server running at http://localhost:${PORT}`);
//     console.log('Routes ready:');
//     console.log('  GET  /api/test');
//     console.log('  GET  /api/staff');
//     console.log('  POST /api/staff/add');
//     console.log('  DEL  /api/staff/:id');
//     console.log('  POST /api/shifts/add');
//     console.log('  POST /api/generate\n');
// });





require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── File paths ────────────────────────────────────
const STAFF_FILE = path.join(__dirname, 'data', 'staff.json');
const SHIFTS_FILE = path.join(__dirname, 'data', 'shifts.json');
const ROSTER_FILE = path.join(__dirname, 'data', 'roster.json');
const ALERTS_FILE = path.join(__dirname, 'alerts', 'alertLog.json');

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));


// ✅ NEW: Calculate hours from time
const calculateHours = (start, end) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;

    // handle overnight shifts
    if (endMin <= startMin) {
        endMin += 24 * 60;
    }

    return (endMin - startMin) / 60;
};


// ── Test route ────────────────────────────────────
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
});

// ── GET routes ────────────────────────────────────
app.get('/api/staff', (req, res) => res.json(read(STAFF_FILE)));
app.get('/api/shifts', (req, res) => res.json(read(SHIFTS_FILE)));
app.get('/api/roster', (req, res) => res.json(read(ROSTER_FILE)));
app.get('/api/alerts', (req, res) => res.json(read(ALERTS_FILE)));


// ── ADD STAFF ─────────────────────────────────────
app.post('/api/staff/add', (req, res) => {
    const { name, role, maxHours } = req.body;

    if (!name || !role) {
        return res.status(400).json({ success: false, error: 'Name and role required' });
    }

    const data = read(STAFF_FILE);

    const newStaff = {
        id: 'S' + Date.now(),
        name: name.trim(),
        role: role.trim(),
        maxHours: parseInt(maxHours) || 40,
        currentHours: 0,
        available: true
    };

    data.staff.push(newStaff);
    write(STAFF_FILE, data);

    res.json({ success: true, staff: newStaff });
});


// ── DELETE STAFF ──────────────────────────────────
app.delete('/api/staff/:id', (req, res) => {
    const data = read(STAFF_FILE);
    data.staff = data.staff.filter(s => String(s.id) !== String(req.params.id));
    write(STAFF_FILE, data);
    res.json({ success: true });
});


// ── TOGGLE AVAILABILITY ───────────────────────────
app.patch('/api/staff/:id/toggle', (req, res) => {
    const data = read(STAFF_FILE);
    const staff = data.staff.find(s => String(s.id) === String(req.params.id));

    if (staff) {
        staff.available = !staff.available;
        write(STAFF_FILE, data);
        res.json({ success: true, available: staff.available });
    } else {
        res.status(404).json({ success: false, error: 'Staff not found' });
    }
});


// ── ADD SHIFT (UPDATED) ───────────────────────────
app.post('/api/shifts/add', (req, res) => {
    const { day, session, startTime, endTime, waiter, chef, cashier } = req.body;

    if (!day || !session) {
        return res.status(400).json({ success: false, error: 'Day and session required' });
    }

    const data = read(SHIFTS_FILE);

    // ✅ calculate hours dynamically
    const hours = calculateHours(startTime || '09:00', endTime || '17:00');

    const newShift = {
        id: 'SH' + Date.now(),
        day,
        session,
        startTime: startTime || '09:00',
        endTime: endTime || '17:00',
        hours, // ✅ fixed
        requirements: {
            Waiter: parseInt(waiter) || 0,
            Chef: parseInt(chef) || 0,
            Cashier: parseInt(cashier) || 0
        }
    };

    data.shifts.push(newShift);
    write(SHIFTS_FILE, data);

    res.json({ success: true, shift: newShift });
});


// ── DELETE SHIFT ──────────────────────────────────
app.delete('/api/shifts/:id', (req, res) => {
    const data = read(SHIFTS_FILE);
    data.shifts = data.shifts.filter(s => String(s.id) !== String(req.params.id));
    write(SHIFTS_FILE, data);
    res.json({ success: true });
});


// ── GENERATE ROSTER (UPDATED) ─────────────────────
app.post('/api/generate', async (req, res) => {

    const staffData = read(STAFF_FILE);
    const shiftData = read(SHIFTS_FILE);

    // reset hours
    staffData.staff.forEach(s => s.currentHours = 0);

    const roster = [];

    shiftData.shifts.forEach(shift => {

        // ✅ recalculate hours for safety
        shift.hours = calculateHours(shift.startTime, shift.endTime);

        const assigned = {};

        for (const [role, count] of Object.entries(shift.requirements)) {

            const eligible = staffData.staff.filter(s =>
                s.role === role &&
                s.available === true &&
                (s.currentHours + shift.hours) <= s.maxHours
            );

            // ✅ fair distribution
            eligible.sort((a, b) => a.currentHours - b.currentHours);

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
            assigned
        });
    });

    write(ROSTER_FILE, { roster });
    write(STAFF_FILE, staffData);


    // ── ALERT DETECTION ───────────────────────────
    const alertLog = { alerts: [] };

    shiftData.shifts.forEach(shift => {
        const entry = roster.find(r => r.shiftId === shift.id);

        for (const [role, required] of Object.entries(shift.requirements)) {
            const assigned = entry?.assigned[role]?.length || 0;

            if (assigned < required) {
                alertLog.alerts.push({
                    shiftId: shift.id,
                    day: shift.day,
                    session: shift.session,
                    role,
                    required,
                    assigned,
                    status: 'UNDERSTAFFED',
                    suggestions: [
                        `Find part-time ${role}`,
                        `Extend ${role} hours`,
                        `Reduce workload`
                    ],
                    timestamp: new Date().toISOString()
                });
            }
        }
    });

    write(ALERTS_FILE, alertLog);


    // ── TELEGRAM ──────────────────────────────────
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId && !token.includes('your_')) {

        const send = (text) => new Promise((resolve) => {
            const body = JSON.stringify({ chat_id: chatId, text });

            const req = https.request({
                hostname: 'api.telegram.org',
                path: `/bot${token}/sendMessage`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, resolve);

            req.write(body);
            req.end();
        });

        await send('✅ Roster generated successfully!');
    }

    res.json({ success: true, roster, alerts: alertLog.alerts });
});


// ── START SERVER ──────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});