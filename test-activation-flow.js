// Test the complete activation flow
console.log('=== ACTIVATION FLOW TEST ===\n');

// Simulate the validation logic from licenseService.ts
const regexValpa = /^(saludvalpa-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}|BETA-PRO-[A-Z0-9]{4,6}-[A-Z0-9]{4,6})$/i;

const testCodes = [
  'SALUDVALPA-TEST1-00001-00001',
  'saludvalpa-test2-00002-00002',
  'SALUDVALPA-TEST10-00010-00010',
  'BETA-PRO-2024-ABCDE',
  'invalid-code',
  'SALUDVALPA-123-456-789'
];

console.log('1. Testing regex validation:');
testCodes.forEach(code => {
  const normalized = code.toUpperCase().trim();
  const matchesRegex = regexValpa.test(code);
  console.log(`   Code: "${code}"`);
  console.log(`     Normalized: "${normalized}"`);
  console.log(`     Matches regex: ${matchesRegex ? '✅' : '❌'}`);
  
  if (matchesRegex) {
    // Check if it would match the JSON file format
    const jsonRegex = /^saludvalpa-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
    const matchesJSON = jsonRegex.test(code);
    console.log(`     Matches JSON regex: ${matchesJSON ? '✅' : '❌'}`);
    
    if (!matchesJSON) {
      console.log(`     ⚠️ Would fail JSON regex validation`);
    }
  }
  console.log('');
});

// Test URL resolution
console.log('2. Testing URL resolution logic:');
const testCases = [
  { isProd: true, origin: 'https://valpa.app', expected: 'https://valpa.app/license-codes.json' },
  { isProd: false, origin: 'http://localhost:5173', expected: '/license-codes.json' }
];

testCases.forEach(test => {
  const url = test.isProd 
    ? `${test.origin}/license-codes.json`
    : '/license-codes.json';
  console.log(`   ${test.isProd ? 'Production' : 'Development'}: ${url}`);
});

console.log('\n3. Testing actual fetch to license-codes.json:');
async function testFetch() {
  try {
    // Try local first
    const response = await fetch('/license-codes.json');
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Local fetch successful`);
      console.log(`   Total codes: ${data.codigos.length}`);
      console.log(`   Available codes: ${data.codigos.filter(c => c.estado === 'disponible').length}`);
      
      // Check first few codes
      const availableCodes = data.codigos.filter(c => c.estado === 'disponible').slice(0, 3);
      availableCodes.forEach((code, i) => {
        console.log(`   ${i + 1}. ${code.codigo} - ${code.descripcion}`);
        console.log(`      Regex test: ${regexValpa.test(code.codigo) ? '✅ Passes' : '❌ Fails'}`);
      });
    } else {
      console.log(`   ❌ Local fetch failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Fetch error: ${error.message}`);
  }
}

// Run fetch test
testFetch().then(() => {
  console.log('\n=== DIAGNOSIS ===');
  console.log('Based on the tests, here are the most likely issues:');
  console.log('\n1. PRIMARY ISSUE: Case sensitivity mismatch');
  console.log('   - JSON file regex is case-sensitive (lowercase "saludvalpa-")');
  console.log('   - Actual codes are uppercase ("SALUDVALPA-")');
  console.log('   - Code uses /i flag (case-insensitive) which should work');
  console.log('\n2. SECONDARY ISSUE: Cache invalidation');
  console.log('   - license-codes.json has 1-hour cache (max-age=3600)');
  console.log('   - Updates to the file may not be immediately visible');
  console.log('\n3. POTENTIAL ISSUE: Used codes tracking');
  console.log('   - localStorage tracks used codes');
  console.log('   - If a code is marked as used, it won\'t validate even if in JSON');
  console.log('\nRECOMMENDATIONS:');
  console.log('1. Update JSON file regex to be case-insensitive or match actual codes');
  console.log('2. Add cache-busting query parameter to license-codes.json requests');
  console.log('3. Add more detailed error logging to identify exact failure point');
  console.log('4. Test with a fresh browser (no localStorage) to rule out used codes issue');
});