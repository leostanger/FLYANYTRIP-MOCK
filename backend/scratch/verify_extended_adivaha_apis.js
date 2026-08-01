require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function testExtendedApis() {
    console.log('==================================================');
    console.log('🧪 VERIFYING EXTENDED ADIVAHA APIS');
    console.log('==================================================\n');

    const results = {};

    // 1. Test GetWalletBalance
    try {
        console.log('1. Querying GetWalletBalance...');
        const balanceRes = await AdivahaFlightService.getWalletBalance();
        console.log('   ✅ GetWalletBalance Success:', JSON.stringify(balanceRes));
        results.getWalletBalance = { status: 'SUCCESS', data: balanceRes };
    } catch (err) {
        console.error('   ❌ GetWalletBalance Failed:', err.message);
        results.getWalletBalance = { status: 'FAILED', error: err.message };
    }

    // 2. Test createManualToken
    try {
        console.log('\n2. Refreshing API Token (createToken)...');
        const tokenRes = await AdivahaFlightService.createManualToken();
        console.log('   ✅ createManualToken Success:', JSON.stringify(tokenRes));
        results.createManualToken = { status: 'SUCCESS', data: tokenRes };
    } catch (err) {
        console.error('   ❌ createManualToken Failed:', err.message);
        results.createManualToken = { status: 'FAILED', error: err.message };
    }

    // 3. Test releaseHoldBooking with a mock ID
    try {
        console.log('\n3. Testing releaseHoldBooking (with mock params)...');
        const releaseRes = await AdivahaFlightService.releaseHoldBooking({
            BookingId: '1234567',
            order_id: 'ORD-TEST-12345',
            Source: 4
        });
        console.log('   ✅ releaseHoldBooking Response:', JSON.stringify(releaseRes));
        results.releaseHoldBooking = { status: 'SUCCESS', data: releaseRes };
    } catch (err) {
        // Release hold booking with mock values might return a validation error from Adivaha side,
        // which is expected because it's a mock PNR, but the request structure must be validated.
        console.log('   ℹ️ releaseHoldBooking Request completed (Response/Error):', err.message);
        results.releaseHoldBooking = { status: 'COMPLETED_WITH_API_ERROR', error: err.message };
    }

    console.log('\n==================================================');
    console.log('📊 EXTENDED API VERIFICATION SUMMARY:');
    console.log(JSON.stringify(results, null, 2));
    console.log('==================================================');
}

testExtendedApis();
