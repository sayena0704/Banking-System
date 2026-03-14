# Fraud Detection Bank Service

Lightweight Koa service for evaluating transaction events and flagging
potential fraud. Incoming transactions are received over HTTP, passed
through a simple rule engine and persisted to PostgreSQL. Kafka is used
as the transport layer for both incoming events and evaluation results.

---

## Quick start

1. copy `.env.example` ➜ `.env` and fill in DB/Kafka settings
2. install deps: npm install
3. bring up Kafka & ZooKeeper:
   `ash
   docker-compose up -d
   `
4. create topics (once only):
   `ash
   docker exec -it fraud-detection-bank-service-kafka-1 \
     kafka-topics --create --bootstrap-server localhost:9092 \
     --topic transactions.incoming --partitions 1 --replication-factor 1

   docker exec -it fraud-detection-bank-service-kafka-1 \
     kafka-topics --create --bootstrap-server localhost:9092 \
     --topic transactions.result --partitions 1 --replication-factor 1
   `
5. ensure the Postgres schema exists (see schema.sql or run manual DDL)
6. start service: npm run dev

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | /health | liveness check |
| POST   | /fraud/detect | submit transaction event |
| GET    | /fraud/alerts | fetch alerts (?accountId=) |
| GET    | /fraud/risk-logs | query risk logs with filters |

### Sample transaction

```bash
curl -i -X POST http://localhost:3000/fraud/detect \
  -H 'Content-Type: application/json' \
  -d '{
    "transactionId":"tx-1",
    "accountId":"acct-1",
    "amount":60000,
    "location":"ATM-001",
    "country":"US",
    "ipAddress":"1.1.1.1",
    "deviceId":"dev-0",
    "timestamp":1700000000000,
    "status":"PENDING"
  }'
```

## Detection rules

Rules are evaluated sequentially and accumulate a risk score. A result is
marked fraud if **any rule matches** or the score reaches **60**.

1. **High value** > 50,000 (40 pts)
2. **Impossible travel** (different country < 30 min, 30 pts)
3. **Velocity count** (>= 5 tx in 60 s, 20 pts)
4. **Sudden IP change** (15 pts)
5. **Blacklisted device/IP** (50/60 pts)
6. **5-min spending** > 100,000 total (35 pts)

### Fetching results

```bash
curl -G http://localhost:3000/fraud/alerts \
  --data-urlencode "accountId=acct-1"

curl -G http://localhost:3000/fraud/risk-logs \
  --data-urlencode "accountId=acct-1" \
  --data-urlencode "status=PENDING" \
  --data-urlencode "isFraud=true" \
  --data-urlencode "minScore=0.5"
```

---

### Notes

* accountId is an arbitrary identifier; no user service is needed.
* Recent transactions are held in memory for geo/velocity checks; restart
  clears them.
* Kafka auto-topic creation is enabled for development but topics are
  explicitly created above for clarity.

Feel free to extend rules, add more topics, or swap the in-memory state
for Redis/multi-node support.
