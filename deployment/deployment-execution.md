# 🚀 FREEAI Token 메인넷 배포 실행 가이드

## 📋 배포 전 최종 체크

### ✅ 필수 확인사항
- [ ] 메타마스크에 BNB 0.1개 이상 보유
- [ ] BSC 메인넷 네트워크 설정 완료
- [ ] .env 파일에 PRIVATE_KEY와 DEV_WALLET 설정
- [ ] npm test 21/21 통과 확인
- [ ] 인터넷 연결 안정적

### 💰 예상 비용
```
가스비 예상 (실시간 변동):
- 스마트 컨트랙트 배포: ~$2-4
- 컨트랙트 검증: ~$0.5
- 총 예상 비용: $2.5-4.5
```

---

## 🏃‍♂️ Step 1: 배포 실행

### 1.1 터미널 열기
```bash
# 프로젝트 폴더로 이동
cd C:\Develop\workspace\black
```

### 1.2 마지막 테스트
```bash
# 모든 테스트 실행 (21/21 통과 확인)
npm test
```

**예상 출력**:
```
FREEAI Token
  ✅ Deployment (5 passing)
  ✅ Trading Control (4 passing)  
  ✅ Fees (3 passing)
  ✅ Airdrop Functions (3 passing)
  ✅ Anti-whale Limits (2 passing)
  ✅ Token Burning (1 passing)
  ✅ Utility Functions (1 passing)
  ✅ Admin Functions (2 passing)

21 passing (2s)
```

### 1.3 메인넷 배포 실행
```bash
npm run deploy:mainnet
```

**실행 중 출력 예시**:
```
🚀 Deploying FREEAI Token...
📍 Deployer address: 0x742d35Cc6654Fd8Fb4B6B26F6B4B8b9B7b8B4B6F
💰 Account balance: 100000000000000000 (0.1 BNB)
🔧 Dev wallet: 0x742d35Cc6654Fd8Fb4B6B26F6B4B8b9B7b8B4B6F

⏳ Deploying contract... (30-60초 대기)
📝 Transaction hash: 0xabc123def456789...

✅ FREEAI Token deployed to: 0x1234567890ABCDEF1234567890ABCDEF12345678
📊 Token Details:
   - Name: Free AI Token
   - Symbol: FREEAI
   - Decimals: 18
   - Total Supply: 1000000000.0

📋 Contract Verification Info:
Contract Address: 0x1234567890ABCDEF1234567890ABCDEF12345678
Network: BSC Mainnet
Constructor Args: 0x742d35Cc6654Fd8Fb4B6B26F6B4B8b9B7b8B4B6F

💾 Deployment completed!
```

### 1.4 중요 정보 저장
배포 완료 후 다음 정보를 안전하게 저장하세요:

```
📋 FREEAI Token 배포 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━

🪙 컨트랙트 주소: 0x1234567890ABCDEF1234567890ABCDEF12345678
🌐 네트워크: BSC 메인넷 (Chain ID: 56)
📝 트랜잭션: 0xabc123def456789...
👨‍💼 배포자: 0x742d35Cc6654Fd8Fb4B6B26F6B4B8b9B7b8B4B6F
📅 배포일시: 2025-08-31 XX:XX:XX
```

---

## 🔍 Step 2: 배포 확인

### 2.1 BSCScan에서 확인
1. **BSCScan 방문**: https://bscscan.com
2. **컨트랙트 주소 검색**: `0x1234567890ABCDEF1234567890ABCDEF12345678`
3. **확인 사항**:
   - ✅ Contract Created (컨트랙트 생성 완료)
   - ✅ Total Supply: 1,000,000,000 FREEAI
   - ✅ Holders: 2 (Owner + Dev Wallet)

### 2.2 메타마스크에서 토큰 추가
```
메타마스크에서:
1. "Import tokens" 클릭
2. "Custom token" 탭
3. Token contract address: 0x1234567890ABCDEF1234567890ABCDEF12345678
4. Token symbol: FREEAI (자동 입력됨)
5. Token decimal: 18 (자동 입력됨)
6. "Add Custom Token" 클릭
7. 잔액 확인: 950,000,000 FREEAI (95%)
```

### 2.3 토큰 분배 확인
```
예상 분배 (BSCScan에서 확인):
👤 Owner (본인): 950,000,000 FREEAI (95%)
   - 에어드롭용: 700,000,000 (70%)
   - 유동성용: 200,000,000 (20%) 
   - 마케팅용: 50,000,000 (5%)

👨‍💼 Dev Wallet: 50,000,000 FREEAI (5%)
   - 1년 락업 (자동)
```

---

## 🔒 Step 3: 컨트랙트 검증

### 3.1 BSCScan API 키 발급 (선택사항)
1. **BSCScan 방문**: https://bscscan.com
2. **계정 생성/로그인**
3. **API-KEYs 메뉴** 클릭
4. **"Add" 클릭** → API 키 생성
5. **API 키 복사** (나중에 사용)

### 3.2 컨트랙트 검증 실행
```bash
# API 키가 있는 경우
npx hardhat verify --network bsc 0x1234567890ABCDEF1234567890ABCDEF12345678 0x742d35Cc6654Fd8Fb4B6B26F6B4B8b9B7b8B4B6F

# API 키가 없는 경우 (수동 검증)
# BSCScan에서 수동으로 소스코드 업로드 필요
```

**성공 시 출력**:
```
✅ Successfully verified contract FreeAIToken on Etherscan.
https://bscscan.com/address/0x1234567890ABCDEF1234567890ABCDEF12345678#code
```

---

## 📢 Step 4: 공지 및 업데이트

### 4.1 웹사이트 업데이트
```javascript
// website/index.html 수정
document.getElementById('contractAddress').textContent = '0x1234567890ABCDEF1234567890ABCDEF12345678';
```

### 4.2 README 업데이트
```markdown
# README.md에 추가
## 📋 배포 정보
- 컨트랙트 주소: `0x1234567890ABCDEF1234567890ABCDEF12345678`
- BSCScan: https://bscscan.com/token/0x1234567890ABCDEF1234567890ABCDEF12345678
- 배포일: 2025-08-31
```

### 4.3 Git 커밋
```bash
git add .
git commit -m "🚀 FREEAI Token 메인넷 배포 완료!

✅ Contract: 0x1234567890ABCDEF1234567890ABCDEF12345678
✅ BSCScan 검증 완료
✅ 웹사이트 업데이트
✅ 에어드롭 준비 완료

🤖 Generated with Claude Code"
git push origin main
```

---

## 🎉 Step 5: 배포 완료 축하!

### 🎯 배포 성공 체크리스트
- [x] ✅ 스마트 컨트랙트 성공적으로 배포
- [x] ✅ BSCScan에서 확인 가능
- [x] ✅ 메타마스크에서 토큰 확인 가능
- [x] ✅ 토큰 분배 정상 완료
- [x] ✅ GitHub 업데이트 완료

### 📊 현재 상태
```
🪙 FREEAI Token 생성 완료!
📍 컨트랙트: 0x1234567890ABCDEF1234567890ABCDEF12345678
🔗 BSCScan: https://bscscan.com/token/0x...
💎 총 공급량: 1,000,000,000 FREEAI
🎁 에어드롭 준비: 700,000,000 FREEAI (70%)
```

---

## 🚀 다음 단계

### 🎁 즉시 가능한 작업들
1. **에어드롭 신청 접수 시작**
   ```bash
   node airdrop/airdrop-manager.js stats
   ```

2. **텔레그램 그룹 개설**
   - 그룹명: FREEAI Token Official 🤖
   - 컨트랙트 주소 공지

3. **트위터 계정 생성**
   - Handle: @FREEAIToken
   - 배포 완료 트윗

4. **웹사이트 GitHub Pages 배포**
   - Settings → Pages → main/website

### 📈 1주일 내 목표
- 🎯 에어드롭 신청 1,000명 달성
- 🎯 텔레그램 그룹 500명 달성
- 🎯 트위터 팔로워 100명 달성

### 💧 1개월 내 목표
- 🎯 에어드롭 실행 (10,000명)
- 🎯 PancakeSwap 상장
- 🎯 CoinGecko 등록

---

## 🆘 문제 해결

### 자주 발생하는 오류

**❌ "insufficient funds for gas"**
```
해결책:
- BNB 잔액 확인 (최소 0.05 BNB 필요)
- 네트워크가 BSC 메인넷인지 확인
- 가스 가격이 높은 시간대 피하기
```

**❌ "nonce too high"**
```
해결책:
- 메타마스크 → Settings → Advanced → Reset Account
- 다시 배포 실행
```

**❌ "execution reverted"**
```
해결책:
- .env 파일의 PRIVATE_KEY와 DEV_WALLET 확인
- 네트워크 설정 재확인
- npm test 실행하여 코드 오류 확인
```

**❌ "network connection error"**
```
해결책:
- 인터넷 연결 확인
- VPN 사용 중이면 해제
- 잠시 후 다시 시도
```

---

## 🎊 축하합니다!

**🎉 FREEAI Token이 성공적으로 배포되었습니다!**

이제 실제 블록체인에서 동작하는 암호화폐를 만들어낸 것입니다. 다음 단계는 커뮤니티 구축과 에어드롭 진행입니다.

**🚀 여정은 이제 시작입니다!**

---

**⚠️ 중요**: 컨트랙트 주소와 트랜잭션 해시를 안전하게 보관하세요. 이는 토큰의 공식 증명입니다!