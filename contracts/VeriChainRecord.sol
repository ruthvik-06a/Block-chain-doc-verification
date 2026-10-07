// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VeriChainRecord
 * @notice Smart contract for anchor-based tamper-proof record verification and audit logging.
 * Does NOT store complete PDFs on-chain. Stores SHA-256 cryptographic hashes, parent hashes,
 * version sequences, issuer addresses, timestamps, and revocation states.
 */
contract VeriChainRecord {
    
    enum RecordStatus { ACTIVE, REVOKED, EXPIRED }

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
        RecordStatus status;
        address primaryIssuer;
        uint256 createdAt;
        uint256 updatedAt;
        string revocationReason;
        address revokedBy;
        uint256 revokedAt;
    }

    // recordId => Record
    mapping(string => Record) private records;
    
    // recordId => versionNumber => DocumentVersion
    mapping(string => mapping(uint256 => DocumentVersion)) private documentVersions;

    // Organization Verification Mapping
    mapping(address => bool) public verifiedIssuers;
    address public contractOwner;

    // Events
    event RecordCreated(
        string indexed recordId,
        bytes32 indexed documentHash,
        address indexed issuer,
        uint256 timestamp
    );

    event VersionCreated(
        string indexed recordId,
        uint256 indexed version,
        bytes32 documentHash,
        bytes32 previousHash,
        address issuer,
        uint256 timestamp
    );

    event RecordRevoked(
        string indexed recordId,
        address indexed revokedBy,
        string reason,
        uint256 timestamp
    );

    event AuditEventRecorded(
        string indexed eventId,
        string action,
        bytes32 indexed eventHash,
        address indexed actor,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only owner can execute");
        _;
    }

    modifier onlyVerifiedIssuer() {
        require(verifiedIssuers[msg.sender] || msg.sender == contractOwner, "Issuer not authorized");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
        verifiedIssuers[msg.sender] = true;
    }

    function setIssuerStatus(address issuer, bool status) external onlyOwner {
        verifiedIssuers[issuer] = status;
    }

    /**
     * @notice Registers a brand new official record (Version 1)
     */
    function registerRecord(
        string memory recordId,
        bytes32 documentHash,
        string memory metadataURI
    ) external onlyVerifiedIssuer {
        require(bytes(recordId).length > 0, "Record ID required");
        require(documentHash != bytes32(0), "Invalid document hash");
        require(records[recordId].createdAt == 0, "Record ID already exists");

        Record storage newRecord = records[recordId];
        newRecord.recordId = recordId;
        newRecord.currentVersion = 1;
        newRecord.status = RecordStatus.ACTIVE;
        newRecord.primaryIssuer = msg.sender;
        newRecord.createdAt = block.timestamp;
        newRecord.updatedAt = block.timestamp;

        DocumentVersion storage v1 = documentVersions[recordId][1];
        v1.version = 1;
        v1.documentHash = documentHash;
        v1.previousHash = bytes32(0);
        v1.issuer = msg.sender;
        v1.timestamp = block.timestamp;
        v1.changeDescription = "Initial Document Issue (Version 1)";
        v1.metadataURI = metadataURI;

        emit RecordCreated(recordId, documentHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Appends a new version to an existing record
     */
    function createVersion(
        string memory recordId,
        bytes32 newDocumentHash,
        bytes32 expectedPreviousHash,
        string memory changeDescription,
        string memory metadataURI
    ) external onlyVerifiedIssuer {
        Record storage rec = records[recordId];
        require(rec.createdAt > 0, "Record does not exist");
        require(rec.status == RecordStatus.ACTIVE, "Record is revoked or expired");

        uint256 latestVersion = rec.currentVersion;
        DocumentVersion memory prevVer = documentVersions[recordId][latestVersion];
        require(prevVer.documentHash == expectedPreviousHash, "Previous hash mismatch / broken chain");

        uint256 nextVersion = latestVersion + 1;
        rec.currentVersion = nextVersion;
        rec.updatedAt = block.timestamp;

        DocumentVersion storage newVer = documentVersions[recordId][nextVersion];
        newVer.version = nextVersion;
        newVer.documentHash = newDocumentHash;
        newVer.previousHash = expectedPreviousHash;
        newVer.issuer = msg.sender;
        newVer.timestamp = block.timestamp;
        newVer.changeDescription = changeDescription;
        newVer.metadataURI = metadataURI;

        emit VersionCreated(recordId, nextVersion, newDocumentHash, expectedPreviousHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Revokes a record permanently with reason
     */
    function revokeRecord(string memory recordId, string memory reason) external onlyVerifiedIssuer {
        Record storage rec = records[recordId];
        require(rec.createdAt > 0, "Record does not exist");
        require(rec.status != RecordStatus.REVOKED, "Record already revoked");

        rec.status = RecordStatus.REVOKED;
        rec.revocationReason = reason;
        rec.revokedBy = msg.sender;
        rec.revokedAt = block.timestamp;
        rec.updatedAt = block.timestamp;

        emit RecordRevoked(recordId, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Records an audit event hash on-chain for tamper-proof logging
     */
    function recordAuditEvent(
        string memory eventId,
        string memory action,
        bytes32 eventHash
    ) external {
        emit AuditEventRecorded(eventId, action, eventHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Verifies an uploaded document hash against record history
     */
    function verifyRecord(string memory recordId, bytes32 inputHash)
        external
        view
        returns (
            bool isValid,
            uint256 version,
            RecordStatus status,
            address issuer,
            uint256 timestamp,
            bool isLatestVersion
        )
    {
        Record memory rec = records[recordId];
        if (rec.createdAt == 0) {
            return (false, 0, RecordStatus.ACTIVE, address(0), 0, false);
        }

        // Search through version history for matching hash
        for (uint256 v = rec.currentVersion; v >= 1; v--) {
            DocumentVersion memory ver = documentVersions[recordId][v];
            if (ver.documentHash == inputHash) {
                bool matchLatest = (v == rec.currentVersion);
                bool active = (rec.status == RecordStatus.ACTIVE);
                return (active, ver.version, rec.status, ver.issuer, ver.timestamp, matchLatest);
            }
        }

        // Hash did not match any version
        return (false, 0, rec.status, rec.primaryIssuer, rec.updatedAt, false);
    }

    /**
     * @notice Get metadata for specific version
     */
    function getVersion(string memory recordId, uint256 version)
        external
        view
        returns (
            uint256 ver,
            bytes32 documentHash,
            bytes32 previousHash,
            address issuer,
            uint256 timestamp,
            string memory changeDescription
        )
    {
        DocumentVersion memory dv = documentVersions[recordId][version];
        return (dv.version, dv.documentHash, dv.previousHash, dv.issuer, dv.timestamp, dv.changeDescription);
    }

    /**
     * @notice Get main record details
     */
    function getRecord(string memory recordId)
        external
        view
        returns (
            string memory id,
            uint256 currentVersion,
            RecordStatus status,
            address primaryIssuer,
            uint256 createdAt,
            uint256 updatedAt,
            string memory revocationReason
        )
    {
        Record memory r = records[recordId];
        return (
            r.recordId,
            r.currentVersion,
            r.status,
            r.primaryIssuer,
            r.createdAt,
            r.updatedAt,
            r.revocationReason
        );
    }
}
