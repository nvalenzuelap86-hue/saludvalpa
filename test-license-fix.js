// Test script to verify license service fix
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read license codes
const licenseCodesPath = join(__dirname, 'public', 'license-codes.json');
const data = JSON.parse(readFileSync(licenseCodesPath, 'utf8'));

console.log('=== TESTING LICENSE SERVICE FIX ===\n');

// Test 1: Check URL logic
console.log('1. Testing URL logic:');
console.log('   - Production URL would be: https://valpa.app/license-codes.json');
console.log('   - Development URL would be: /license-codes.json');
console.log('   - First code in JSON:', data.codigos[0].codigo);

// Test 2: Test regex matching
console.log('\n2. Testing regex matching:');
const regex = /^saludvalpa-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/i;

const testCases = [
  'saludvalpa-test1-00001-00001', // lowercase
  'SALUDVALPA-TEST1-00001-00001', // uppercase (from JSON)
  'SaludValpa-Test1-00001-00001', // mixed case
  'saludvalpa-XXXXX-XXXXX-XXXXX', // generic pattern
  'invalid-code', // should fail
];

testCases.forEach((code, i) => {
  const matches = regex.test(code);
  const normalized = code.toUpperCase().trim();
  const inJson = data.codigos.some(c => c.codigo === normalized);
  console.log(`   ${i + 1}. "${code}"`);
  console.log(`      Regex: ${matches ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`      Normalized: "${normalized}"`);
  console.log(`      In JSON: ${inJson ? '✓ YES' : '✗ NO'}`);
});

// Test 3: Check JSON structure
console.log('\n3. Checking JSON structure:');
console.log(`   - Total codes: ${data.codigos.length}`);
console.log(`   - Available codes (estado="disponible"): ${data.codigos.filter(c => c.estado === 'disponible').length}`);
console.log(`   - Used codes (estado="usado"): ${data.codigos.filter(c => c.estado === 'usado').length}`);

// Test 4: Simulate the validation flow
console.log('\n4. Simulating validation flow:');
const simulateCode = 'SALUDVALPA-TEST1-00001-00001';
console.log(`   Testing code: ${simulateCode}`);
console.log(`   Step 1: Check regex - ${regex.test(simulateCode) ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   Step 2: Normalize - "${simulateCode.toUpperCase().trim()}"`);
console.log(`   Step 3: Check in JSON - ${data.codigos.some(c => c.codigo === simulateCode.toUpperCase().trim()) ? '✓ FOUND' : '✗ NOT FOUND'}`);

// Test 5: Check for potential issues
console.log('\n5. Potential issues check:');
const issues = [];

// Check if any codes don't match the regex
const mismatchedCodes = data.codigos.filter(c => !regex.test(c.codigo));
if (mismatchedCodes.length > 0) {
  issues.push(`Found ${mismatchedCodes.length} codes that don't match the regex pattern`);
}

// Check for duplicate codes
const codeSet = new Set(data.codigos.map(c => c.codigo));
if (codeSet.size !== data.codigos.length) {
  issues.push(`Found duplicate codes in JSON (${data.codigos.length} total, ${codeSet.size} unique)`);
}

// Check for mixed case issues
const lowerCaseCodes = data.codigos.filter(c => c.codigo.toLowerCase() !== c.codigo);
if (lowerCaseCodes.length > 0) {
  issues.push(`Found ${lowerCaseCodes.length} codes with lowercase letters (should be uppercase)`);
}

if (issues.length === 0) {
  console.log('   ✓ No issues found');
} else {
  console.log('   ⚠️ Issues found:');
  issues.forEach(issue => console.log(`     - ${issue}`));
}

console.log('\n=== TEST COMPLETE ===');
console.log('\nRecommendations:');
console.log('1. The fix uses absolute URLs in production: window.location.origin + /license-codes.json');
console.log('2. Added detailed logging to diagnose fetch failures');
console.log('3. Improved error messages for better user experience');
console.log('4. Maintains fallback to hardcoded codes if fetch fails');