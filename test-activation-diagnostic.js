// Diagnostic test for license activation issues
console.log('=== LICENSE ACTIVATION DIAGNOSTIC TEST ===\n');

// Test 1: Check if license-codes.json is accessible
async function testLicenseFileAccess() {
  console.log('1. Testing license-codes.json accessibility:');
  
  const urls = [
    'https://valpa.app/license-codes.json',
    'http://localhost:5173/license-codes.json',
    '/license-codes.json'
  ];
  
  for (const url of urls) {
    try {
      console.log(`   Testing: ${url}`);
      const response = await fetch(url);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      console.log(`   CORS Header: ${response.headers.get('access-control-allow-origin')}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success! Found ${data.codigos?.length || 0} codes`);
        console.log(`   First code: ${data.codigos?.[0]?.codigo || 'none'}`);
        console.log(`   Regex in file: ${data.regex_validacion || 'none'}`);
      } else {
        console.log(`   ❌ Failed: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

// Test 2: Check regex matching
function testRegexMatching() {
  console.log('2. Testing regex pattern matching:');
  
  // Regex from the code
  const regexFromCode = /^(saludvalpa-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}|BETA-PRO-[A-Z0-9]{4,6}-[A-Z0-9]{4,6})$/i;
  
  // Regex from the JSON file
  const regexFromJSON = /^saludvalpa-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
  
  const testCodes = [
    'SALUDVALPA-TEST1-00001-00001',
    'saludvalpa-test2-00002-00002',
    'SALUDVALPA-TEST10-00010-00010', // 6-5-5 segments
    'invalid-code'
  ];
  
  testCodes.forEach(code => {
    const matchesCodeRegex = regexFromCode.test(code);
    const matchesJSONRegex = regexFromJSON.test(code);
    console.log(`   Code: "${code}"`);
    console.log(`     Matches code regex (flexible): ${matchesCodeRegex ? '✅' : '❌'}`);
    console.log(`     Matches JSON regex (strict): ${matchesJSONRegex ? '✅' : '❌'}`);
    
    if (matchesCodeRegex !== matchesJSONRegex) {
      console.log(`     ⚠️ MISMATCH: Code regex ${matchesCodeRegex ? 'accepts' : 'rejects'} but JSON regex ${matchesJSONRegex ? 'accepts' : 'rejects'}`);
    }
    console.log('');
  });
}

// Test 3: Check localStorage for used codes
function testLocalStorage() {
  console.log('3. Testing localStorage for used codes:');
  
  try {
    const usedCodesKey = 'valpa_used_license_codes';
    const stored = localStorage.getItem(usedCodesKey);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(`   Found ${parsed.length} used codes in localStorage:`);
      parsed.forEach((code, i) => {
        console.log(`     ${i + 1}. ${code}`);
      });
    } else {
      console.log('   No used codes found in localStorage');
    }
  } catch (error) {
    console.log(`   ❌ Error reading localStorage: ${error.message}`);
  }
}

// Run tests
async function runDiagnostics() {
  await testLicenseFileAccess();
  testRegexMatching();
  testLocalStorage();
  
  console.log('\n=== DIAGNOSTIC SUMMARY ===');
  console.log('Potential issues identified:');
  console.log('1. Regex mismatch between code and JSON file');
  console.log('   - Code uses flexible regex with {4,6} segment lengths');
  console.log('   - JSON file has strict regex with {5} segment lengths');
  console.log('   - This could cause codes to pass format validation but not match JSON regex');
  console.log('\n2. Case sensitivity:');
  console.log('   - JSON regex expects lowercase "saludvalpa-"');
  console.log('   - Actual codes are uppercase "SALUDVALPA-"');
  console.log('   - Code regex uses /i flag (case-insensitive), JSON regex does not');
  console.log('\n3. Recommendation:');
  console.log('   - Update JSON file regex to match actual code patterns');
  console.log('   - Or ensure code validation uses same logic as JSON');
}

// Execute
runDiagnostics().catch(console.error);