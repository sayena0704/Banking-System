import { query } from "../db";
import { FraudDetectionResult } from "../interfaces";


export const saveFraudAlert = async (
  accountId: string,
  result: FraudDetectionResult,
  rawTransaction: any
) => {
  const sql = `
    INSERT INTO fraud_alerts
      (account_id, risk_score, reasons, is_fraud, raw_transaction)
    VALUES
      ($1, $2, $3::jsonb, $4, $5::jsonb)
    RETURNING *;
  `;


  const values = [
    accountId,
    result.riskScore,
    JSON.stringify(result.reasons),
    result.isFraud,
    JSON.stringify(rawTransaction)
  ];


  console.log("Saving alert to DB:", accountId, result);
  const res = await query(sql, values);
  console.log("Saved alert:", res.rows[0]);




  return res.rows[0];
};




export const getFraudAlertsByAccountId = async (accountId: string) => {
  const sql = `
    SELECT *
    FROM fraud_alerts
    WHERE account_id = $1
    ORDER BY timestamp DESC;
  `;


  const res = await query(sql, [accountId]);
  return res.rows;
};
