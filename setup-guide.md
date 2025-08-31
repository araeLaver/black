# 🚀 FREEAI 토큰 배포 가이드

## 📋 준비 사항

### 1. 필수 소프트웨어 설치
```bash
# Node.js 설치 (v16 이상)
https://nodejs.org/

# Git 설치
https://git-scm.com/

# VS Code 설치 (선택사항)
https://code.visualstudio.com/
```

### 2. 메타마스크 지갑 설정
1. **Chrome Extension 설치**: https://metamask.io/
2. **새 지갑 생성** 또는 기존 지갑 import
3. **BSC Testnet 추가**:
   - Network Name: BSC Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
   - Chain ID: 97
   - Symbol: tBNB
   - Explorer: https://testnet.bscscan.com

### 3. 테스트 BNB 받기 (무료)
- https://testnet.binance.org/faucet-smart
- 지갑 주소 입력 → 무료 tBNB 받기

## 🔧 프로젝트 설정

### 1. 의존성 설치
```bash
# 프로젝트 폴더로 이동
cd C:\Develop\workspace\black

# 패키지 설치
npm install
```

### 2. 환경변수 설정
```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 편집
notepad .env
```

**.env 파일 내용:**
```env
# 메타마스크 지갑의 Private Key
PRIVATE_KEY=당신의_프라이빗_키

# BSCScan API Key (https://bscscan.com/apis)
BSCSCAN_API_KEY=당신의_API_키

# 개발자 지갑 주소
DEV_WALLET=당신의_지갑_주소
```

⚠️ **보안 주의사항:**
- Private Key 절대 공유 금지
- .env 파일은 Git에 업로드 안됨
- 메인넷 배포시 충분한 BNB 확보 (~$2)

## 🧪 테스트넷 배포

### 1. 컨트랙트 컴파일
```bash
npx hardhat compile
```

### 2. 테스트넷 배포
```bash
npm run deploy:testnet
```

**성공시 출력 예시:**
```
🚀 Deploying FREEAI Token...
📍 Deployer address: 0x123...
💰 Account balance: 1000000000000000000
✅ FREEAI Token deployed to: 0xABC123...
📊 Token Details:
   - Name: Free AI Token
   - Symbol: FREEAI
   - Total Supply: 1000000000.0
```

### 3. BSCScan 테스트넷에서 확인
- https://testnet.bscscan.com/
- 컨트랙트 주소 검색
- 거래 내역 확인

## 🎯 메인넷 배포 (실제 런칭)

### 1. 메인넷 BNB 준비
- 최소 $5-10 준비 (가스비 + 여유분)
- 메타마스크에서 BSC Mainnet 선택

### 2. 메인넷 배포
```bash
npm run deploy:mainnet
```

### 3. 컨트랙트 인증
```bash
npx hardhat verify --network bsc 컨트랙트주소 개발자지갑주소
```

## 🌐 웹사이트 배포 (GitHub Pages)

### 1. GitHub 저장소 생성
```bash
# GitHub에서 새 저장소 생성 (freeai-token)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/유저명/freeai-token.git
git push -u origin main
```

### 2. GitHub Pages 설정
1. 저장소 → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, /website folder
4. Save

### 3. 웹사이트 주소
`https://유저명.github.io/freeai-token/`

## 📱 커뮤니티 구축

### 1. 텔레그램 그룹 생성
```
그룹명: FREEAI Token Official
설명: Free AI for Everyone! 🤖
규칙: 스팸 금지, 존중, AI와 암호화폐 논의 환영
```

### 2. 에어드롭 준비
```solidity
// 스마트 컨트랙트에서 에어드롭 실행
function bulkAirdrop(address[] recipients, uint256 amount)

// 또는 개별 전송
function airdrop(address[] recipients, uint256[] amounts)
```

### 3. 소셜미디어
- **트위터**: @FREEAIToken
- **디스코드**: FREEAI Community
- **레딧**: r/FREEAI

## 💡 다음 단계 체크리스트

### Phase 1: 런칭 (1주)
- [x] 스마트 컨트랙트 완성
- [x] 웹사이트 완성
- [ ] 테스트넷 배포
- [ ] 커뮤니티 생성
- [ ] 메인넷 배포

### Phase 2: 성장 (1개월)
- [ ] 에어드롭 진행 (10,000명 목표)
- [ ] PancakeSwap 페어 생성
- [ ] CoinGecko 등록
- [ ] 인플루언서 컨택

### Phase 3: 발전 (3개월)
- [ ] AI 서비스 개발
- [ ] 스테이킹 기능
- [ ] CEX 상장 시도
- [ ] 파트너십

## 🆘 문제 해결

### 자주 발생하는 오류

**1. "insufficient funds for gas"**
→ BNB 잔액 확인, 더 많은 BNB 구매

**2. "nonce too high"**
→ 메타마스크에서 계정 리셋

**3. "contract creation code storage out of gas"**
→ 가스 한도 늘리기 (hardhat.config.js)

**4. "execution reverted"**
→ 컨트랙트 로직 오류, 코드 재검토

## 📞 지원

문제 발생시:
1. 오류 메시지 스크린샷
2. .env 파일 확인 (Private Key 제외)
3. BSCScan에서 거래 상태 확인
4. GitHub Issues에 문의

---

**🎉 축하합니다! FREEAI 토큰 런칭 준비가 완료되었습니다!**

다음은 실제 배포를 진행해보겠습니다.