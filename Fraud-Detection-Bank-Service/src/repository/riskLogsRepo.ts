import { query } from "../db";
import { FraudDetectionResult, TransactionEvent } from "../interfaces";


export const saveRiskLogs = async (
    event: TransactionEvent,
    status: string
) => {
    const sql = `
    INSERT INTO risk_logs
      (transaction_id, account_id, risk_score, reasons, is_fraud, raw_event, status)
    VALUES
      ($1, $2, NULL, '[]'::jsonb, NULL, $3::jsonb, $4)
    RETURNING *;
  `;


    const values = [
        event.transactionId,
        event.accountId,
        JSON.stringify(event),
        status
    ];


    const res = await query(sql, values);
    return res.rows[0];
};




export const updateRiskLogStatus = async (
    transactionId: string,
    status: string,
    result: FraudDetectionResult
) => {
    const sql = `
    UPDATE risk_logs
    SET
      status = $1,
      risk_score = $2,
      reasons = $3::jsonb,
      is_fraud = $4,
      updated_at = NOW()
    WHERE transaction_id = $5
    RETURNING *;
  `;


    const values = [
        status,
        result.riskScore,
        JSON.stringify(result.reasons),
        result.isFraud,
        transactionId
    ];


    const res = await query(sql, values);
    return res.rows[0];
};


export const geFilteredtRiskLogs = async (accountId: string, filters: any) => {
    const conditions = [`account_id = $1`];
    const values: any[] = [accountId];
    let paramIndex = 2;


    if (filters.status) {
        conditions.push(`status = $${paramIndex++}`);
        values.push(filters.status);
    }
    if (filters.isFraud) {
        conditions.push(`is_fraud = $${paramIndex++}`);
        values.push(filters.isFraud === "true");
    }


    if (filters.transactionId) {
        conditions.push(`transaction_id = $${paramIndex++}`);
        values.push(filters.transactionId);
    }


    if (filters.minScore) {
        conditions.push(`risk_score >= $${paramIndex++}`);
        values.push(Number(filters.minScore));
    }


    if (filters.maxScore) {
        conditions.push(`risk_score <= $${paramIndex++}`);
        values.push(Number(filters.maxScore));
    }


    const limit = filters.limit || 10;
    const offset = (filters.page - 1) * limit;
    const sql = `
    SELECT *
    FROM risk_logs
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset};
    `;
    const res = await query(sql, values);
    return res.rows;
}



