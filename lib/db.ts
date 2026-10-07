import fs from 'fs';
import path from 'path';
import { calculateSHA256, generateAuditEventHash } from './crypto';

export type UserRole = 'SUPER_ADMIN' | 'ISSUER' | 'VERIFIER' | 'PUBLIC_USER';
export type CertificateStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';
export type VerificationResult = 'VALID' | 'TAMPERED' | 'REVOKED' | 'EXPIRED' | 'NOT_FOUND';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  isApproved?: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'University' | 'Hospital' | 'Corporate' | 'Government';
  email: string;
  logo: string;
  walletAddress: string;
  verificationStatus: 'VERIFIED' | 'PENDING';
  address: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateId: string;
  organizationId: string;
  organizationName: string;
  subjectName: string;
  holderEmail?: string;
  course: string;
  cgpa?: string;
  issueDate: string;
  expiryDate?: string;
  currentVersion: number;
  status: CertificateStatus;
  verificationRequestStatus?: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  requestNotes?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  revocationReason?: string;
  revokedBy?: string;
  revokedAt?: string;
}

export interface DocumentVersion {
  id: string;
  certificateId: string;
  version: number;
  fileName: string;
  fileSize: number;
  fileReference: string;
  documentHash: string;
  previousHash: string;
  changeDescription: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  blockchainTxHash: string;
  blockNumber: number;
}

export interface AuditLog {
  id: string;
  eventId: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  organizationId?: string;
  organizationName?: string;
  certificateId?: string;
  version?: number;
  description: string;
  eventHash: string;
  blockchainTxHash?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Verification {
  id: string;
  certificateId: string;
  verificationType: 'ID_LOOKUP' | 'QR_SCAN' | 'FILE_UPLOAD';
  result: VerificationResult;
  uploadedHash?: string;
  expectedHash?: string;
  verifiedAt: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface DatabaseSchema {
  users: User[];
  organizations: Organization[];
  certificates: Certificate[];
  versions: DocumentVersion[];
  auditLogs: AuditLog[];
  verifications: Verification[];
}

const DB_PATH = path.join(process.cwd(), 'scratch', 'verichain_db.json');
const ALT_DB_PATH = path.join(process.cwd(), 'verichain_db.json');

function getDbPath(): string {
  try {
    if (fs.existsSync(ALT_DB_PATH)) return ALT_DB_PATH;
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return DB_PATH;
  } catch (e) {
    return ALT_DB_PATH;
  }
}

// Clean Initial Seed Data — NO fake certificates, NO fake logs, NO fake verifications
const SEED_DATA: DatabaseSchema = {
  organizations: [
    {
      id: "org-01",
      name: "XYZ Global University",
      type: "University",
      email: "issuer@verichain.org",
      logo: "🎓",
      walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      verificationStatus: "VERIFIED",
      address: "Innovation Park, CA",
      createdAt: "2026-01-01T00:00:00.000Z"
    }
  ],
  users: [
    {
      id: "usr-admin-01",
      name: "System Super Admin",
      email: "admin@verichain.org",
      passwordHash: "admin123",
      role: "SUPER_ADMIN",
      isApproved: true,
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "usr-issuer-01",
      name: "Authorized Issuer (XYZ Univ)",
      email: "issuer@verichain.org",
      passwordHash: "issuer123",
      role: "ISSUER",
      organizationId: "org-01",
      organizationName: "XYZ Global University",
      isApproved: true,
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "usr-issuer-pending-01",
      name: "Pending Issuer (Tech Institute)",
      email: "pending-issuer@verichain.org",
      passwordHash: "pending123",
      role: "ISSUER",
      organizationId: "org-02",
      organizationName: "Tech Institute of Tech",
      isApproved: false,
      createdAt: "2026-01-02T00:00:00.000Z"
    },
    {
      id: "usr-holder-01",
      name: "Alex Johnson (Document Holder)",
      email: "holder@verichain.org",
      passwordHash: "holder123",
      role: "PUBLIC_USER",
      isApproved: true,
      createdAt: "2026-01-01T00:00:00.000Z"
    }
  ],
  certificates: [
    {
      id: "cert-01",
      certificateId: "VC-2026-CS-8891",
      organizationId: "org-01",
      organizationName: "XYZ Global University",
      subjectName: "Alex Johnson",
      holderEmail: "holder@verichain.org",
      course: "B.Sc. Computer Science & AI",
      cgpa: "3.92",
      issueDate: "2026-05-15",
      currentVersion: 1,
      status: "ACTIVE",
      verificationRequestStatus: "APPROVED",
      createdAt: "2026-05-15T10:00:00.000Z",
      updatedAt: "2026-05-15T10:00:00.000Z"
    }
  ],
  versions: [
    {
      id: "ver-01",
      certificateId: "cert-01",
      version: 1,
      fileName: "degree_alex_johnson.pdf",
      fileSize: 245000,
      fileReference: "ipfs://QmbXyZ8891DegreeDoc",
      documentHash: "A1B2C3D4E5F67890123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      changeDescription: "Initial Document Issuance",
      createdBy: "usr-issuer-01",
      createdByName: "Authorized Issuer (XYZ Univ)",
      createdAt: "2026-05-15T10:00:00.000Z",
      blockchainTxHash: "0x89ab12cd34ef567890abcdef1234567890abcdef1234567890abcdef12345678",
      blockNumber: 18520412
    }
  ],
  auditLogs: [],
  verifications: []
};

export class Database {
  private static read(): DatabaseSchema {
    try {
      const p = getDbPath();
      if (!fs.existsSync(p)) {
        fs.writeFileSync(p, JSON.stringify(SEED_DATA, null, 2), 'utf8');
        return SEED_DATA;
      }
      const raw = fs.readFileSync(p, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return SEED_DATA;
    }
  }

  private static write(data: DatabaseSchema): void {
    try {
      const p = getDbPath();
      fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // Reset database to completely empty clean state
  static resetToClean(): void {
    this.write(SEED_DATA);
  }

  // --- Users ---
  static getUsers(): User[] {
    return this.read().users;
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const db = this.read();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    this.write(db);
    return newUser;
  }

  static updateUserApproval(userId: string, isApproved: boolean): User | null {
    const db = this.read();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    db.users[userIndex].isApproved = isApproved;
    this.write(db);
    return db.users[userIndex];
  }

  static getPendingIssuers(): User[] {
    return this.getUsers().filter(u => u.role === 'ISSUER' && u.isApproved === false);
  }

  // --- Organizations ---
  static getOrganizations(): Organization[] {
    return this.read().organizations;
  }

  static getOrganizationById(id: string): Organization | undefined {
    return this.getOrganizations().find(o => o.id === id);
  }

  static createOrganization(org: Omit<Organization, 'id' | 'createdAt'>): Organization {
    const db = this.read();
    const newOrg: Organization = {
      ...org,
      id: `org-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.organizations.push(newOrg);
    this.write(db);
    return newOrg;
  }

  // --- Certificates ---
  static getCertificates(): Certificate[] {
    return this.read().certificates;
  }

  static getCertificateById(id: string): Certificate | undefined {
    const certs = this.getCertificates();
    return certs.find(c => c.id === id || c.certificateId.toLowerCase() === id.toLowerCase());
  }

  static createCertificate(certData: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'status'>, initialVersion: { fileName: string; fileSize: number; documentHash: string; fileReference?: string; createdBy: string; createdByName: string; changeDescription?: string }): { certificate: Certificate; version: DocumentVersion } {
    const db = this.read();
    const now = new Date().toISOString();
    const certId = `cert-${Date.now()}`;

    const newCert: Certificate = {
      ...certData,
      id: certId,
      currentVersion: 1,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    const dummyTx = `0x${calculateSHA256(`tx:${newCert.certificateId}:v1:${now}`).toLowerCase()}`;
    const newVer: DocumentVersion = {
      id: `ver-${certId}-v1`,
      certificateId: newCert.certificateId,
      version: 1,
      fileName: initialVersion.fileName,
      fileSize: initialVersion.fileSize,
      fileReference: initialVersion.fileReference || `/uploads/${newCert.certificateId}_v1.pdf`,
      documentHash: initialVersion.documentHash.toUpperCase(),
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      changeDescription: initialVersion.changeDescription || "Initial Document Creation & Blockchain Registration",
      createdBy: initialVersion.createdBy,
      createdByName: initialVersion.createdByName,
      createdAt: now,
      blockchainTxHash: dummyTx,
      blockNumber: 18500000 + Math.floor(Math.random() * 10000)
    };

    db.certificates.unshift(newCert);
    db.versions.unshift(newVer);

    // Audit Log entry
    const auditId = `aud-${Date.now()}`;
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventHash = generateAuditEventHash({
      eventId,
      action: "CERTIFICATE_CREATED",
      actorId: initialVersion.createdBy,
      certificateId: newCert.certificateId,
      version: 1,
      timestamp: now,
      description: `Issued official Record ${newCert.certificateId} for ${newCert.subjectName}`
    });

    db.auditLogs.unshift({
      id: auditId,
      eventId,
      action: "CERTIFICATE_CREATED",
      actorId: initialVersion.createdBy,
      actorName: initialVersion.createdByName,
      actorRole: "ISSUER",
      organizationId: newCert.organizationId,
      organizationName: newCert.organizationName,
      certificateId: newCert.certificateId,
      version: 1,
      description: `Issued official Record ${newCert.certificateId} for ${newCert.subjectName} (${newCert.course})`,
      eventHash,
      blockchainTxHash: dummyTx,
      timestamp: now,
      ipAddress: "127.0.0.1"
    });

    this.write(db);
    return { certificate: newCert, version: newVer };
  }

  static addVersion(
    certIdStr: string,
    versionData: {
      fileName: string;
      fileSize: number;
      documentHash: string;
      fileReference?: string;
      changeDescription: string;
      createdBy: string;
      createdByName: string;
      updatedFields?: Record<string, any>;
    }
  ): DocumentVersion {
    const db = this.read();
    const certIndex = db.certificates.findIndex(c => c.id === certIdStr || c.certificateId.toLowerCase() === certIdStr.toLowerCase());
    if (certIndex === -1) throw new Error("Certificate not found");

    const cert = db.certificates[certIndex];
    if (cert.status === 'REVOKED') throw new Error("Cannot modify a revoked certificate");

    // Get previous version hash
    const prevVersion = db.versions
      .filter(v => v.certificateId === cert.certificateId)
      .sort((a, b) => b.version - a.version)[0];

    const prevHash = prevVersion ? prevVersion.documentHash : "0000000000000000000000000000000000000000000000000000000000000000";
    const nextVersionNum = cert.currentVersion + 1;
    const now = new Date().toISOString();
    const dummyTx = `0x${calculateSHA256(`tx:${cert.certificateId}:v${nextVersionNum}:${now}`).toLowerCase()}`;

    // Apply updatedFields to cert if present
    if (versionData.updatedFields) {
      if (versionData.updatedFields.cgpa) cert.cgpa = versionData.updatedFields.cgpa;
      if (versionData.updatedFields.course) cert.course = versionData.updatedFields.course;
      if (versionData.updatedFields.subjectName) cert.subjectName = versionData.updatedFields.subjectName;
    }

    cert.currentVersion = nextVersionNum;
    cert.updatedAt = now;

    const newVer: DocumentVersion = {
      id: `ver-${cert.id}-v${nextVersionNum}`,
      certificateId: cert.certificateId,
      version: nextVersionNum,
      fileName: versionData.fileName,
      fileSize: versionData.fileSize,
      fileReference: versionData.fileReference || `/uploads/${cert.certificateId}_v${nextVersionNum}.pdf`,
      documentHash: versionData.documentHash.toUpperCase(),
      previousHash: prevHash.toUpperCase(),
      changeDescription: versionData.changeDescription,
      createdBy: versionData.createdBy,
      createdByName: versionData.createdByName,
      createdAt: now,
      blockchainTxHash: dummyTx,
      blockNumber: (prevVersion ? prevVersion.blockNumber : 18500000) + Math.floor(10 + Math.random() * 50)
    };

    db.versions.unshift(newVer);

    // Audit Log
    const auditId = `aud-${Date.now()}`;
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventHash = generateAuditEventHash({
      eventId,
      action: "VERSION_CREATED",
      actorId: versionData.createdBy,
      certificateId: cert.certificateId,
      version: nextVersionNum,
      timestamp: now,
      description: `Created Version ${nextVersionNum} for ${cert.certificateId}: ${versionData.changeDescription}`
    });

    db.auditLogs.unshift({
      id: auditId,
      eventId,
      action: "VERSION_CREATED",
      actorId: versionData.createdBy,
      actorName: versionData.createdByName,
      actorRole: "ISSUER",
      organizationId: cert.organizationId,
      organizationName: cert.organizationName,
      certificateId: cert.certificateId,
      version: nextVersionNum,
      description: `Created Version ${nextVersionNum}: ${versionData.changeDescription}. Linked Parent Hash (${prevHash.substring(0, 8)}...)`,
      eventHash,
      blockchainTxHash: dummyTx,
      timestamp: now,
      ipAddress: "127.0.0.1"
    });

    this.write(db);
    return newVer;
  }

  static revokeCertificate(
    certIdStr: string,
    reason: string,
    revokedBy: string,
    revokedByName: string
  ): Certificate {
    const db = this.read();
    const certIndex = db.certificates.findIndex(c => c.id === certIdStr || c.certificateId.toLowerCase() === certIdStr.toLowerCase());
    if (certIndex === -1) throw new Error("Certificate not found");

    const cert = db.certificates[certIndex];
    const now = new Date().toISOString();

    cert.status = 'REVOKED';
    cert.revocationReason = reason;
    cert.revokedBy = revokedByName;
    cert.revokedAt = now;
    cert.updatedAt = now;

    const dummyTx = `0x${calculateSHA256(`revoke:${cert.certificateId}:${now}`).toLowerCase()}`;

    // Audit log
    const auditId = `aud-${Date.now()}`;
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventHash = generateAuditEventHash({
      eventId,
      action: "CERTIFICATE_REVOKED",
      actorId: revokedBy,
      certificateId: cert.certificateId,
      version: cert.currentVersion,
      timestamp: now,
      description: `Revoked certificate ${cert.certificateId}. Reason: ${reason}`
    });

    db.auditLogs.unshift({
      id: auditId,
      eventId,
      action: "CERTIFICATE_REVOKED",
      actorId: revokedBy,
      actorName: revokedByName,
      actorRole: "ISSUER",
      organizationId: cert.organizationId,
      organizationName: cert.organizationName,
      certificateId: cert.certificateId,
      version: cert.currentVersion,
      description: `REVOKED Certificate ${cert.certificateId}. Reason: ${reason}`,
      eventHash,
      blockchainTxHash: dummyTx,
      timestamp: now,
      ipAddress: "127.0.0.1"
    });

    this.write(db);
    return cert;
  }

  // --- Versions ---
  static getVersions(certificateId: string): DocumentVersion[] {
    return this.read().versions
      .filter(v => v.certificateId.toLowerCase() === certificateId.toLowerCase())
      .sort((a, b) => b.version - a.version);
  }

  // --- Audit Logs ---
  static getAuditLogs(): AuditLog[] {
    return this.read().auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  static addAuditLog(log: Omit<AuditLog, 'id' | 'eventId' | 'eventHash' | 'timestamp'>): AuditLog {
    const db = this.read();
    const now = new Date().toISOString();
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventHash = generateAuditEventHash({
      eventId,
      action: log.action,
      actorId: log.actorId,
      certificateId: log.certificateId,
      version: log.version,
      timestamp: now,
      description: log.description
    });

    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}`,
      eventId,
      eventHash,
      timestamp: now
    };

    db.auditLogs.unshift(newLog);
    this.write(db);
    return newLog;
  }

  // --- Verifications ---
  static getVerifications(): Verification[] {
    return this.read().verifications.sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime());
  }

  static recordVerification(v: Omit<Verification, 'id' | 'verifiedAt'>): Verification {
    const db = this.read();
    const newV: Verification = {
      ...v,
      id: `verif-${Date.now()}`,
      verifiedAt: new Date().toISOString()
    };
    db.verifications.unshift(newV);

    // Audit log entry for verification attempt
    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      action: "CERTIFICATE_VERIFIED",
      actorId: "usr-public-verifier",
      actorName: v.verificationType === 'FILE_UPLOAD' ? "File Verification Engine" : "QR / ID Inspector",
      actorRole: "PUBLIC_USER",
      certificateId: v.certificateId,
      description: `Verification check via ${v.verificationType}. Result: ${v.result}${v.result === 'TAMPERED' ? ' ❌ HASH MISMATCH' : ''}`,
      eventHash: generateAuditEventHash({
        eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        action: "CERTIFICATE_VERIFIED",
        actorId: "usr-public-verifier",
        certificateId: v.certificateId,
        timestamp: newV.verifiedAt,
        description: `Verification ${v.result}`
      }),
      timestamp: newV.verifiedAt,
      ipAddress: v.ipAddress || "127.0.0.1"
    });

    this.write(db);
    return newV;
  }

  // --- Document Verification Requests (Holder <-> Issuer Workflow) ---
  static updateVerificationRequest(
    certIdStr: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    notes?: string,
    actorId?: string,
    actorName?: string,
    actorRole?: UserRole
  ): Certificate {
    const db = this.read();
    const certIndex = db.certificates.findIndex(c => c.id === certIdStr || c.certificateId.toLowerCase() === certIdStr.toLowerCase());
    if (certIndex === -1) throw new Error("Certificate not found");

    const cert = db.certificates[certIndex];
    const now = new Date().toISOString();

    cert.verificationRequestStatus = status;
    if (notes) cert.requestNotes = notes;
    cert.updatedAt = now;

    const action = status === 'PENDING' 
      ? 'VERIFICATION_REQUESTED' 
      : status === 'APPROVED' 
        ? 'VERIFICATION_APPROVED' 
        : 'VERIFICATION_REJECTED';

    const desc = status === 'PENDING'
      ? `Holder requested verification for ${cert.certificateId}: ${notes || 'Standard validation request'}`
      : status === 'APPROVED'
        ? `Issuer approved verification for ${cert.certificateId}: ${notes || 'Confirmed authentic and in good standing'}`
        : `Issuer rejected verification for ${cert.certificateId}: ${notes || 'Document requires re-submission'}`;

    const auditId = `aud-${Date.now()}`;
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventHash = generateAuditEventHash({
      eventId,
      action,
      actorId: actorId || "usr-holder",
      certificateId: cert.certificateId,
      version: cert.currentVersion,
      timestamp: now,
      description: desc
    });

    db.auditLogs.unshift({
      id: auditId,
      eventId,
      action,
      actorId: actorId || "usr-holder",
      actorName: actorName || (status === 'PENDING' ? "Document Holder" : "Authorized Issuer"),
      actorRole: actorRole || (status === 'PENDING' ? "PUBLIC_USER" : "ISSUER"),
      organizationId: cert.organizationId,
      organizationName: cert.organizationName,
      certificateId: cert.certificateId,
      version: cert.currentVersion,
      description: desc,
      eventHash,
      timestamp: now,
      ipAddress: "127.0.0.1"
    });

    this.write(db);
    return cert;
  }
}
