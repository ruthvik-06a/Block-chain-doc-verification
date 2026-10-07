import crypto from 'crypto';

/**
 * Calculates SHA-256 hash of a string, Buffer, or ArrayBuffer
 */
export function calculateSHA256(data: string | Buffer | ArrayBuffer): string {
  const hash = crypto.createHash('sha256');
  if (typeof data === 'string') {
    hash.update(data, 'utf8');
  } else if (Buffer.isBuffer(data)) {
    hash.update(data);
  } else {
    hash.update(Buffer.from(data));
  }
  return hash.digest('hex').toUpperCase();
}

/**
 * Generates SHA-256 hash for an audit log event
 */
export function generateAuditEventHash(eventData: {
  eventId: string;
  action: string;
  actorId: string;
  certificateId?: string;
  version?: number;
  timestamp: string;
  description: string;
}): string {
  const payload = `${eventData.eventId}:${eventData.action}:${eventData.actorId}:${eventData.certificateId || ''}:${eventData.version || 0}:${eventData.timestamp}:${eventData.description}`;
  return calculateSHA256(payload);
}

/**
 * Validates whether two SHA-256 hashes match exactly
 */
export function compareHashes(hashA: string, hashB: string): boolean {
  if (!hashA || !hashB) return false;
  return hashA.trim().toUpperCase() === hashB.trim().toUpperCase();
}
