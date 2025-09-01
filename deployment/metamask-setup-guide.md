# 🦊 메타마스크 설정 및 BNB 준비 가이드

## 📋 Step 1: 메타마스크 설치 및 설정

### 1.1 메타마스크 설치
1. **Chrome 웹스토어** 방문: https://metamask.io
2. **"Add to Chrome"** 클릭
3. **확장 프로그램 추가** 클릭
4. **메타마스크 아이콘** 클릭 (브라우저 우상단)

### 1.2 지갑 생성
```
새 지갑 생성:
1. "Create a new wallet" 클릭
2. 강력한 비밀번호 설정
3. 시드 구문(12단어) 안전하게 저장 ⚠️ 매우 중요!
4. 시드 구문 확인
5. 지갑 생성 완료
```

**⚠️ 중요**: 시드 구문은 절대 다른 사람과 공유하지 마세요!

### 1.3 BSC 메인넷 추가

#### 방법 1: 자동 추가 (권장)
1. **Chainlist 방문**: https://chainlist.org
2. **"BSC"** 또는 **"Binance Smart Chain"** 검색
3. **"Add to MetaMask"** 클릭
4. 메타마스크에서 **"승인"** 클릭

#### 방법 2: 수동 추가
```
메타마스크 설정:
1. 네트워크 선택 (현재 "Ethereum Mainnet")
2. "Add Network" 클릭
3. "Add a network manually" 클릭

네트워크 정보 입력:
- Network Name: Smart Chain
- New RPC URL: https://bsc-dataseed1.binance.org
- Chain ID: 56
- Currency Symbol: BNB
- Block Explorer URL: https://bscscan.com

4. "Save" 클릭
```

---

## 💰 Step 2: BNB 구매 및 준비

### 2.1 필요한 BNB 양
```
배포 비용 계산:
- 스마트 컨트랙트 배포: ~0.005-0.01 BNB ($2-4)
- 컨트랙트 검증: ~0.001 BNB ($0.5)
- 에어드롭 가스비: ~0.02-0.05 BNB ($8-20)
- 여유분: ~0.01 BNB ($4)

총 필요량: 약 0.05-0.1 BNB ($20-40)
권장 구매량: 0.1 BNB ($40) ✅
```

### 2.2 BNB 구매 방법

#### 🇰🇷 한국 거래소 (권장)
**업비트 (Upbit)**
```
1. 업비트 앱/웹 접속
2. BNB 검색 및 구매 (최소 0.1 BNB)
3. "출금" 클릭
4. 네트워크: BEP20(BSC) 선택 ⚠️ 중요!
5. 주소: 메타마스크 지갑 주소 복사 붙여넣기
6. 수량: 0.1 BNB
7. 출금 수수료: ~0.001 BNB
8. 2단계 인증 후 출금
9. 5-10분 후 메타마스크 확인
```

**빗썸 (Bithumb)**
```
1. 빗썸 앱/웹 접속
2. BNB 구매
3. 출금 시 네트워크 "BSC" 선택 
4. 메타마스크 주소로 출금
```

#### 🌍 글로벌 거래소
**바이낸스 (Binance)**
```
1. 바이낸스 계정 생성/로그인
2. BNB 구매 (카드 결제 또는 P2P)
3. Wallet → Fiat and Spot
4. BNB → Withdraw
5. Address: 메타마스크 주소
6. Network: BEP20 (BSC) ⚠️ 반드시 확인!
7. 출금 처리
```

#### 💳 직접 구매 (수수료 높음)
**메타마스크 내장**
```
1. 메타마스크에서 "Buy" 클릭
2. "Buy BNB" 선택  
3. 카드 정보 입력
4. 구매 (수수료 ~5-10%)
```

### 2.3 구매 후 확인
```
메타마스크 확인:
1. 네트워크가 "Smart Chain"인지 확인
2. BNB 잔액 확인 (0.1 BNB 이상)
3. 주소 복사 (나중에 필요)
```

---

## 🔐 Step 3: 프라이빗 키 추출

### ⚠️ 보안 주의사항
- 프라이빗 키는 절대 다른 사람과 공유하지 마세요
- 스크린샷 찍지 마세요  
- 안전한 곳에 복사해두세요
- 공공 WiFi에서는 하지 마세요

### 3.1 프라이빗 키 확인 방법
```
메타마스크에서:
1. 계정 아이콘 클릭 (우상단)
2. "Account details" 클릭
3. "Export private key" 클릭
4. 메타마스크 비밀번호 입력
5. 프라이빗 키 복사 (0x로 시작하는 64자리 문자)
6. 안전한 곳에 저장 (메모장 등)
```

**예시**: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

---

## 📁 Step 4: 환경 변수 설정

### 4.1 .env 파일 생성
```bash
# 프로젝트 폴더로 이동
cd C:\Develop\workspace\black

# .env.example을 .env로 복사
copy .env.example .env
```

### 4.2 .env 파일 편집
```bash
# 메모장으로 .env 파일 열기
notepad .env
```

### 4.3 실제 값 입력
```env
# 메타마스크의 프라이빗 키 (0x 제외)
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# 개발자 지갑 주소 (메타마스크 주소)
DEV_WALLET=0xYour_MetaMask_Address_Here

# BSCScan API 키 (선택사항 - 나중에 설정 가능)
BSCSCAN_API_KEY=

# 가스 리포트 (선택사항)
REPORT_GAS=true
```

**예시**:
```env
PRIVATE_KEY=a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890
DEV_WALLET=0x742d35Cc6654Fd8Fb4B6B26F6B4B8b9B7b8B4B6F
BSCSCAN_API_KEY=
REPORT_GAS=true
```

### 4.4 파일 저장
```
Ctrl + S → 저장
파일 닫기
```

---

## ✅ Step 5: 배포 전 최종 확인

### 5.1 체크리스트
```
□ 메타마스크 설치 완료
□ BSC 메인넷 추가 완료  
□ BNB 0.1개 이상 보유
□ 프라이빗 키 확인 완료
□ .env 파일 설정 완료
□ 지갑 주소 복사 완료
```

### 5.2 테스트 실행
```bash
# 프로젝트 폴더에서
cd C:\Develop\workspace\black

# 테스트 실행 (모든 테스트 통과 확인)
npm test

# 컨트랙트 컴파일 (오류 없는지 확인)  
npx hardhat compile
```

**예상 결과**:
```
✅ 21 passing (2s)
✅ Compiled 8 Solidity files successfully
```

---

## 🚀 준비 완료!

모든 준비가 완료되었습니다! 

**다음 단계**: 메인넷 배포 실행
- 예상 소요 시간: 2-3분
- 예상 비용: $2-4 (가스비)
- 실행 명령어: `npm run deploy:mainnet`

**🎯 배포할 준비가 되셨나요?**

---

## 🆘 문제 해결

### 자주 발생하는 문제

**Q: BNB가 메타마스크에 안 보여요**
A: 네트워크가 "Smart Chain"인지 확인하세요. Ethereum 네트워크에서는 BNB가 보이지 않습니다.

**Q: 프라이빗 키가 안 나와요**
A: 메타마스크 비밀번호를 정확히 입력했는지 확인하세요.

**Q: .env 파일이 안 보여요**
A: 숨김 파일일 수 있습니다. 파일 탐색기에서 "보기 → 숨겨진 항목" 체크하세요.

**Q: npm test가 실행 안 돼요**
A: Node.js가 설치되어 있는지, 프로젝트 폴더에 있는지 확인하세요.

---

**⚠️ 마지막 확인**: 메타마스크에 BNB가 0.1개 이상 있고, .env 파일이 올바르게 설정되었다면 배포 준비 완료입니다! 🎉