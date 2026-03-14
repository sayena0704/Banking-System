import { FraudDetectionResult } from "../interfaces/fraudDetectionResult";
import { TransactionEvent } from "../interfaces/transactionEvent";


const recentTxMap = new Map<string, TransactionEvent[]>();


const BLACKLISTED_DEVICES = new Set(['device123', 'emulator009']);
const BLACKLISTED_IPS = new Set(['102.55.222.19']);


export class FraudDetector {
    static evaluate(event: TransactionEvent): FraudDetectionResult {
        const reasons: string[] = [];
        let riskScore = 0;


        const recentTx = recentTxMap.get(event.accountId) || [];


        // --- RULE 1: HIGH-VALUE TRANSACTION ---
        if (event.amount > 50000) {
            reasons.push('High value Transaction');
            riskScore += 40;
        }
        // --- RULE 2: GEO-LOCATION ANOMALY ---
        if (recentTx.length > 0) {
            const lastTx = recentTx[recentTx.length - 1];


            if (lastTx) {
                if (lastTx.country !== event.country) {
                    const timeDiffMin = (event.timestamp - lastTx.timestamp) / (60 * 1000);


                    if (timeDiffMin < 30) {
                        reasons.push(
                            `Impossible travel detected: ${lastTx.country} → ${event.country}`
                        );
                        riskScore += 30;
                    }
                }
            }


        }


        // --- RULE 3: MULTIPLE RAPID TRANSACTIONS (Velocity rule) ---
        const txnLast60Sec = recentTx.filter(
            (tx) => event.timestamp - tx.timestamp < 60000
        );


        if (txnLast60Sec.length >= 5) {
            reasons.push('High frequency of transactions');
            riskScore += 20;
        }


        // --- RULE 4: SUDDEN IP CHANGE ---


        if (recentTx.length > 0) {
            const lastTx = recentTx[recentTx.length - 1];
            if (lastTx) {
                if (lastTx.ipAddress !== event.ipAddress) {
                    reasons.push("Sudden IP address change");
                    riskScore += 15;
                }
            }


        }


        // --- RULE 5: BLACKLISTED DEVICE / IP ---
        if (BLACKLISTED_DEVICES.has(event.deviceId)) {
            reasons.push("Transaction from blacklisted device");
            riskScore += 50;
        }


        if (BLACKLISTED_IPS.has(event.ipAddress)) {
            reasons.push("Transaction from blacklisted IP");
            riskScore += 60;
        }


        // --- RULE 6: VELOCITY CHECK (TOTAL AMOUNT LAST 5 MIN) ---
        const txIn5Min = recentTx.filter(
            (tx) => event.timestamp - tx.timestamp < 5 * 60 * 1000
        );


        const totalSpent = txIn5Min.reduce((sum, tx) => sum + tx.amount, 0);


        if (totalSpent + event.amount > 100000) {
            reasons.push("High velocity spending detected (5 min rule)");
            riskScore += 35;
        }


        // Store the transaction
        recentTx.push(event);
        recentTxMap.set(event.accountId, recentTx);


        return {
            isFraud: reasons.length > 0 || riskScore >= 60,
            reasons,
            riskScore: Math.min(riskScore, 100),
        };
    }
}

