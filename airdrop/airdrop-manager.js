// FREEAI 에어드롭 관리 스크립트
const { ethers } = require("hardhat");
const fs = require('fs');

// 에어드롭 설정
const CONFIG = {
    CONTRACT_ADDRESS: "0x...", // 배포 후 업데이트
    AIRDROP_AMOUNT: ethers.utils.parseEther("70000"), // 70,000 FREEAI per person
    BATCH_SIZE: 100, // 한 번에 처리할 주소 수
    GAS_LIMIT: 500000,
    MAX_RECIPIENTS: 10000 // 최대 10,000명
};

class AirdropManager {
    constructor() {
        this.contract = null;
        this.signer = null;
        this.recipients = new Set(); // 중복 방지
    }

    async initialize() {
        console.log("🚀 FREEAI 에어드롭 관리자 초기화 중...");
        
        const [signer] = await ethers.getSigners();
        this.signer = signer;
        
        const FreeAIToken = await ethers.getContractFactory("FreeAIToken");
        this.contract = FreeAIToken.attach(CONFIG.CONTRACT_ADDRESS);
        
        console.log("✅ 초기화 완료");
        console.log("📍 계정:", signer.address);
        console.log("🪙 컨트랙트:", CONFIG.CONTRACT_ADDRESS);
    }

    // 에어드롭 대상자 목록 로드
    loadRecipients(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const addresses = data.split('\n').filter(addr => addr.trim());
            
            addresses.forEach(addr => {
                if (ethers.utils.isAddress(addr.trim())) {
                    this.recipients.add(addr.trim().toLowerCase());
                }
            });
            
            console.log(`📋 ${this.recipients.size}명의 유효한 주소 로드됨`);
            return true;
        } catch (error) {
            console.error("❌ 파일 로드 실패:", error.message);
            return false;
        }
    }

    // 텔레그램/디스코드에서 주소 추가
    addRecipient(address, source = "manual") {
        if (!ethers.utils.isAddress(address)) {
            return { success: false, message: "유효하지 않은 주소입니다" };
        }

        const normalizedAddress = address.toLowerCase();
        
        if (this.recipients.has(normalizedAddress)) {
            return { success: false, message: "이미 등록된 주소입니다" };
        }

        if (this.recipients.size >= CONFIG.MAX_RECIPIENTS) {
            return { success: false, message: "최대 참여자 수에 도달했습니다" };
        }

        this.recipients.add(normalizedAddress);
        
        // 로그 저장
        const logEntry = {
            address: normalizedAddress,
            source: source,
            timestamp: new Date().toISOString()
        };
        
        this.logRecipient(logEntry);
        
        return { 
            success: true, 
            message: `에어드롭 등록 완료! 순번: ${this.recipients.size}`,
            position: this.recipients.size
        };
    }

    // 에어드롭 실행 (배치 처리)
    async executeAirdrop() {
        console.log("🎁 에어드롭 실행 시작...");
        
        const recipients = Array.from(this.recipients);
        const totalBatches = Math.ceil(recipients.length / CONFIG.BATCH_SIZE);
        
        console.log(`📊 총 ${recipients.length}명, ${totalBatches}개 배치로 처리`);
        
        for (let i = 0; i < totalBatches; i++) {
            const start = i * CONFIG.BATCH_SIZE;
            const end = Math.min(start + CONFIG.BATCH_SIZE, recipients.length);
            const batch = recipients.slice(start, end);
            
            console.log(`\n⏳ 배치 ${i + 1}/${totalBatches} 처리 중... (${batch.length}명)`);
            
            try {
                const tx = await this.contract.bulkAirdrop(
                    batch, 
                    CONFIG.AIRDROP_AMOUNT,
                    { gasLimit: CONFIG.GAS_LIMIT }
                );
                
                console.log("📝 트랜잭션 해시:", tx.hash);
                await tx.wait();
                
                console.log("✅ 배치 처리 완료");
                
                // 2초 대기 (가스 가격 안정화)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ 배치 ${i + 1} 실패:`, error.message);
                
                // 실패한 배치 저장
                fs.writeFileSync(
                    `failed_batch_${i + 1}.json`, 
                    JSON.stringify(batch, null, 2)
                );
            }
        }
        
        console.log("\n🎉 에어드롭 완료!");
    }

    // 개별 에어드롭 (긴급용)
    async sendSingleAirdrop(address, amount = null) {
        const sendAmount = amount || CONFIG.AIRDROP_AMOUNT;
        
        try {
            const tx = await this.contract.transfer(address, sendAmount);
            await tx.wait();
            
            console.log(`✅ ${address}에게 ${ethers.utils.formatEther(sendAmount)} FREEAI 전송`);
            return tx.hash;
        } catch (error) {
            console.error(`❌ 전송 실패:`, error.message);
            return null;
        }
    }

    // 에어드롭 현황 확인
    async getAirdropStats() {
        const balance = await this.contract.balanceOf(this.signer.address);
        const totalSupply = await this.contract.totalSupply();
        
        return {
            contractBalance: ethers.utils.formatEther(balance),
            totalRecipients: this.recipients.size,
            estimatedCost: ethers.utils.formatEther(
                CONFIG.AIRDROP_AMOUNT.mul(this.recipients.size)
            ),
            totalSupply: ethers.utils.formatEther(totalSupply)
        };
    }

    // 수신자 로그 저장
    logRecipient(logEntry) {
        const logFile = 'airdrop-recipients.json';
        let logs = [];
        
        try {
            if (fs.existsSync(logFile)) {
                logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
            }
        } catch (error) {
            console.log("새 로그 파일 생성");
        }
        
        logs.push(logEntry);
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    }

    // 중복 주소 제거
    removeDuplicates() {
        const originalSize = this.recipients.size;
        // Set 자체가 중복을 방지하므로 이미 처리됨
        console.log(`✅ 중복 제거 완료: ${originalSize}명`);
    }

    // 에어드롭 주소 내보내기
    exportRecipients(filePath) {
        const addresses = Array.from(this.recipients);
        fs.writeFileSync(filePath, addresses.join('\n'));
        console.log(`📁 ${addresses.length}개 주소를 ${filePath}에 저장`);
    }
}

// 메인 실행 함수
async function main() {
    const airdropManager = new AirdropManager();
    await airdropManager.initialize();
    
    // 커맨드 라인 인자 처리
    const command = process.argv[2];
    
    switch (command) {
        case 'load':
            const filePath = process.argv[3] || 'recipients.txt';
            airdropManager.loadRecipients(filePath);
            break;
            
        case 'add':
            const address = process.argv[3];
            if (address) {
                const result = airdropManager.addRecipient(address, 'manual');
                console.log(result.message);
            }
            break;
            
        case 'execute':
            await airdropManager.executeAirdrop();
            break;
            
        case 'stats':
            const stats = await airdropManager.getAirdropStats();
            console.log("📊 에어드롭 현황:");
            console.log(`   잔액: ${stats.contractBalance} FREEAI`);
            console.log(`   대상자: ${stats.totalRecipients}명`);
            console.log(`   예상 소요: ${stats.estimatedCost} FREEAI`);
            break;
            
        case 'export':
            const exportPath = process.argv[3] || 'recipients_export.txt';
            airdropManager.exportRecipients(exportPath);
            break;
            
        default:
            console.log(`
🎁 FREEAI 에어드롭 관리자

사용법:
  node airdrop-manager.js load [파일경로]     # 주소 목록 로드
  node airdrop-manager.js add [주소]          # 개별 주소 추가
  node airdrop-manager.js execute            # 에어드롭 실행
  node airdrop-manager.js stats              # 현황 확인
  node airdrop-manager.js export [파일경로]   # 주소 목록 내보내기

예시:
  node airdrop-manager.js load recipients.txt
  node airdrop-manager.js add 0x123...
  node airdrop-manager.js execute
            `);
    }
}

// 에러 핸들링
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ 에러 발생:", error);
            process.exit(1);
        });
}

module.exports = AirdropManager;