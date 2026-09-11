// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SignalRegistry
/// @notice Stores compact, verifiable launch-signal snapshots. No user funds are held.
contract SignalRegistry {
    error NotOwner();
    error NotOperator();
    error InvalidScore();
    error EmptySignalId();
    error AlreadyRecorded();

    struct Signal {
        address token;
        uint64 observedBlock;
        uint16 score;
        bytes32 evidenceHash;
        address reporter;
        uint64 recordedAt;
    }

    address public immutable owner;
    mapping(address => bool) public operators;
    mapping(bytes32 => Signal) private signals;

    event OperatorUpdated(address indexed operator, bool enabled);
    event SignalRecorded(bytes32 indexed signalId, address indexed token, uint16 score, bytes32 evidenceHash, uint64 observedBlock);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyOperator() {
        if (!operators[msg.sender]) revert NotOperator();
        _;
    }

    constructor() {
        owner = msg.sender;
        operators[msg.sender] = true;
        emit OperatorUpdated(msg.sender, true);
    }

    function setOperator(address operator, bool enabled) external onlyOwner {
        operators[operator] = enabled;
        emit OperatorUpdated(operator, enabled);
    }

    function recordSignal(
        bytes32 signalId,
        address token,
        uint64 observedBlock,
        uint16 score,
        bytes32 evidenceHash
    ) external onlyOperator {
        if (signalId == bytes32(0)) revert EmptySignalId();
        if (score > 100) revert InvalidScore();
        if (signals[signalId].recordedAt != 0) revert AlreadyRecorded();
        signals[signalId] = Signal(token, observedBlock, score, evidenceHash, msg.sender, uint64(block.timestamp));
        emit SignalRecorded(signalId, token, score, evidenceHash, observedBlock);
    }

    function getSignal(bytes32 signalId) external view returns (Signal memory) {
        return signals[signalId];
    }
}
