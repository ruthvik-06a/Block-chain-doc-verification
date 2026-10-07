# VeriChain — Blockchain-Based Tamper-Proof Record Verification

> **“GitHub for Trusted Documents — Issue, Version, Verify and Audit Official Records.”**

VeriChain is a modern, production-grade document verification platform built for universities, colleges, hospitals, corporations, and government institutions. It empowers organizations to issue digital records/certificates, maintain version histories, detect document tampering using SHA-256 cryptographic hashes, revoke invalid records, and enable the public to verify authenticity via QR codes and EVM smart contract proofs.

---

## 🌟 Key Differentiating Feature: Git-Style Document Version Control

Unlike legacy systems that overwrite files or claim static PDFs are immutable, VeriChain operates like **GitHub for official documents**:
1. **Never Overwrite**: Updating a record creates Version 2, 3, etc.
2. **Linked Hash Chains**: Each version anchors its parent hash (`previousHash`), building a cryptographic parent-child chain (`v2.previousHash === v1.documentHash`).
3. **GitHub-Style Timeline**: Interactive visual activity stream with commit-like nodes, author badges, timestamps, and smart contract transaction receipts.

---

## 🏗️ Core Architecture & Principle

VeriChain NEVER falsely claims that a normal backend database is immutable. Instead, it combines fast backend querying with smart contract proof anchoring:

```
                          ┌───────────────────────────┐
                          │   Authorized Issuer Upload│
                          └─────────────┬─────────────┘
                                        │
                             Calculate SHA-256 Hash
                                        │
                     ┌──────────────────┴──────────────────┐
                     ▼                                     ▼
        ┌─────────────────────────┐           ┌─────────────────────────┐
        │     Backend Database    │           │  EVM Blockchain Network │
        ├─────────────────────────┤           ├─────────────────────────┤
        │ • Document Metadata     │           │ • SHA-256 Document Hash │
        │ • User Permissions      │           │ • Parent Version Hash   │
        │ • Version References    │           │ • Issuer Wallet Address │
        │ • Access-Controlled Logs│           │ • Block Timestamp & Status│
        └─────────────────────────┘           └─────────────────────────┘
                     │                                     │
                     └──────────────────┬──────────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │   Public QR Verification  │
                          └───────────────────────────┘
```

---

## 🚀 Key Features

* **Role-Based Access Control (RBAC)**: `SUPER_ADMIN`, `ISSUER` (e.g. XYZ University), `VERIFIER` (Corporate Recruiter), `PUBLIC_USER`.
* **SHA-256 Document Hashing**: Web Crypto API & Node.js `crypto` for sub-second file fingerprinting.
* **Solidity Smart Contract**: `VeriChainRecord.sol` deployed on EVM (Polygon Amoy Testnet / Local Hardhat).
* **3-Way Verification Engine**:
  1. Search by Certificate ID (`CERT-2027-001024`)
  2. Scan QR Code link (`/verify/[certificateId]`)
  3. Drag & Drop PDF upload for instant SHA-256 match vs. tamper detection.
* **Instant Document Revocation**: On-chain status update to `REVOKED` with audit reason.
* **Suspicious Activity Detection**: Identifies spike in failed verification attempts from single IP addresses.
* **Interactive Hackathon Judge Toolbar**: Built-in 1-click test scenarios to download authentic vs. tampered sample PDFs and run live demos.

---

## 🔑 Demo Credentials (Quick Role Switcher Available in Top Bar)

| Role | Email | Password | Primary Scope |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `admin@verichain.org` | `admin123` | Full System & Governance |
| **ISSUER** | `registrar@xyz.edu` | `issuer123` | XYZ University Record Issuance |
| **VERIFIER** | `hr@globaltech.io` | `verifier123` | Corporate Candidate Screening |
| **PUBLIC_USER** | `guest@public.com` | `guest123` | Public Certificate Lookup |

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
* **Cryptography**: SHA-256 (Node crypto / Web Crypto API), QR Code Generator.
* **Smart Contracts**: Solidity `v0.8.20`, Hardhat, Ethers.js `v6`.
* **PDF Engine**: jsPDF for dynamic authentic & tampered certificate generation.

---

## ⚡ Quick Start & Deployment

### 1. Installation
```bash
git clone https://github.com/verichain/verichain.git
cd verichain
npm install
```

### 2. Smart Contract Compilation
```bash
npx hardhat compile
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Smart Contract Specification (`contracts/VeriChainRecord.sol`)

```solidity
struct DocumentVersion {
    uint256 version;
    bytes32 documentHash;
    bytes32 previousHash;
    address issuer;
    uint256 timestamp;
    string changeDescription;
    string metadataURI;
}

struct Record {
    string recordId;
    uint256 currentVersion;
    RecordStatus status; // ACTIVE, REVOKED, EXPIRED
    address primaryIssuer;
    uint256 createdAt;
    uint256 updatedAt;
}
```

---

## ⚖️ License
MIT License. Built for Google Antigravity Hackathon 2026–2027.
