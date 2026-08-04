require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function testMulticity() {
    try {
        console.log('Testing ANYTRIP 3.0 Multicity Flight Search...');
        const departure1 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const departure2 = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const payload = {
            adults: 1,
            children: 0,
            infants: 0,
            segments: [
                {
                    from: 'DEL',
                    to: 'BOM',
                    departureDate: departure1,
                    travelClass: 'Economy'
                },
                {
                    from: 'BOM',
                    to: 'DXB',
                    departureDate: departure2,
                    travelClass: 'Economy'
                }
            ]
        };

        const res = await AdivahaFlightService.multicityFlightSearch(payload);
        console.log('Success!', JSON.stringify(res, null, 2));
    } catch (e) {
        console.error('Failed with error:', e);
    }
}

testMulticity();
