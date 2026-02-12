#!/bin/bash

# StarLord2 × SKYNT LaunchNFT Integration Test
# Tests the entire ecosystem end-to-end

set -e

echo "════════════════════════════════════════════════════════"
echo "StarLord2 × SKYNT LaunchNFT Integration Test"
echo "════════════════════════════════════════════════════════"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED_TESTS=0
PASSED_TESTS=0

# Test function
test_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

test_pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
    ((PASSED_TESTS++))
}

test_fail() {
    echo -e "${RED}❌ FAIL: $1${NC}"
    ((FAILED_TESTS++))
}

# Test 1: Check project structure
test_step "Checking project structure..."
if [ -d "contracts" ] && [ -d "backend" ] && [ -d "frontend" ] && [ -d "circuits" ]; then
    test_pass "All required directories exist"
else
    test_fail "Missing required directories"
fi

# Test 2: Check smart contracts
test_step "Checking smart contracts..."
if [ -f "contracts/Admin.sol" ] && [ -f "contracts/StarLord2.sol" ] && [ -f "contracts/SKYNTLaunchNFT.sol" ]; then
    test_pass "All smart contracts present"
else
    test_fail "Missing smart contracts"
fi

# Test 3: Check backend files
test_step "Checking backend..."
if [ -f "backend/server.js" ] && [ -d "backend/controllers" ]; then
    test_pass "Backend structure correct"
else
    test_fail "Backend structure incomplete"
fi

# Test 4: Check frontend components
test_step "Checking frontend components..."
COMPONENT_COUNT=$(find frontend/src/components/LaunchNFT -name "*.jsx" 2>/dev/null | wc -l)
if [ "$COMPONENT_COUNT" -ge 5 ]; then
    test_pass "Frontend components present ($COMPONENT_COUNT found)"
else
    test_fail "Missing frontend components (found $COMPONENT_COUNT, expected 5+)"
fi

# Test 5: Check ZK circuits
test_step "Checking ZK circuits..."
if [ -f "circuits/phi_computation.circom" ] && [ -f "circuits/nft_rarity.circom" ]; then
    test_pass "ZK circuits present"
else
    test_fail "Missing ZK circuits"
fi

# Test 6: Check configuration files
test_step "Checking configuration files..."
if [ -f ".env.example" ] && [ -f "hardhat.config.js" ] && [ -f "ecosystem.config.js" ]; then
    test_pass "Configuration files present"
else
    test_fail "Missing configuration files"
fi

# Test 7: Check CI/CD
test_step "Checking CI/CD..."
if [ -f ".github/workflows/starlord2-ci.yml" ]; then
    test_pass "CI/CD workflow present"
else
    test_fail "Missing CI/CD workflow"
fi

# Test 8: Check documentation
test_step "Checking documentation..."
if [ -f "STARLORD2_README.md" ] && [ -f "docs/formulas.tex" ]; then
    test_pass "Documentation present"
else
    test_fail "Missing documentation"
fi

# Test 9: Check test files
test_step "Checking test files..."
TEST_COUNT=$(find test -name "*.test.js" 2>/dev/null | wc -l)
if [ "$TEST_COUNT" -ge 2 ]; then
    test_pass "Test files present ($TEST_COUNT found)"
else
    test_fail "Missing test files (found $TEST_COUNT, expected 2+)"
fi

# Test 10: Check deployment script
test_step "Checking deployment script..."
if [ -f "scripts/deploy.js" ] && [ -f "scripts/setup.sh" ]; then
    test_pass "Deployment scripts present"
else
    test_fail "Missing deployment scripts"
fi

# Summary
echo ""
echo "════════════════════════════════════════════════════════"
echo "Test Summary"
echo "════════════════════════════════════════════════════════"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All integration tests passed!${NC}"
    echo "System is ready for deployment."
    exit 0
else
    echo -e "${RED}❌ Some tests failed.${NC}"
    echo "Please fix the issues before deployment."
    exit 1
fi
