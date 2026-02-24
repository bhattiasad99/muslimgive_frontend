
const { formatDateToYYYYMMDD } = require('./src/lib/helpers');

function test() {
    console.log('Running tests for formatDateToYYYYMMDD...');

    // Mocking current local time context for testing
    // The utility uses .getFullYear(), .getMonth(), .getDate() which are local time methods

    const dates = [
        { d: new Date(2026, 1, 14), expected: '2026-02-14' }, // Feb 14 (months are 0-indexed)
        { d: new Date(2017, 11, 13), expected: '2017-12-13' }, // Dec 13
        { d: new Date(2000, 0, 1), expected: '2000-01-01' }, // Jan 1
        { d: undefined, expected: '' }
    ];

    let allPassed = true;
    dates.forEach(({ d, expected }, index) => {
        const result = formatDateToYYYYMMDD(d);
        if (result === expected) {
            console.log(`Test ${index + 1} passed: ${d ? d.toDateString() : 'undefined'} -> ${result}`);
        } else {
            console.error(`Test ${index + 1} FAILED: ${d ? d.toDateString() : 'undefined'} -> expected ${expected}, got ${result}`);
            allPassed = false;
        }
    });

    if (allPassed) {
        console.log('All tests passed!');
    } else {
        process.exit(1);
    }
}

// Since helpers.ts uses ES Modules and might have imports that fail in basic node, 
// I will instead create a standalone test for the logic if needed, 
// but let's try to run it directly if possible by stripping TS or using ts-node if available.
// Actually, since I can't easily run TS in this environment without setup, I'll just verify the logic manually as it's very simple.
// The logic:
// const year = date.getFullYear();
// const month = String(date.getMonth() + 1).padStart(2, '0');
// const day = String(date.getDate()).padStart(2, '0');
// return `${year}-${month}-${day}`;
// This definitely uses local time methods.

test();
