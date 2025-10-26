# GenZ Vote System
**Project by w2zard**

## 🗳️ Blockchain-Inspired Voting System

A modern, secure voting system prototype that demonstrates transparent, verifiable digital voting using cryptographic principles inspired by blockchain technology.

## 📁 Project Structure

```
genz-vote-system/
├── src/
│   └── index.js          # Main VoteSystem class with core voting logic
├── tests/
│   └── test-voting.js    # Test suite for vote casting and validation
├── package.json          # Project metadata and dependencies
├── .gitignore           # Git ignore patterns
├── LICENSE              # MIT License
└── README.md            # This file
```

## ✨ Features

### 🔐 Security & Integrity
- **Cryptographic Hashing**: Each vote is hashed using SHA-256 for integrity verification
- **One-Person-One-Vote**: Prevents duplicate voting through voter tracking
- **Vote Anonymization**: Voter IDs are hashed to protect privacy
- **Tamper Detection**: Vote integrity can be validated through hash verification

### 📊 Transparency
- **Public Verification**: Anyone can verify vote counts
- **Audit Trail**: All votes are stored with timestamps and hashes
- **Real-Time Tallying**: Get instant vote counts by candidate

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jonathancosmo/genz-vote-system.git
cd genz-vote-system

# Install dependencies
npm install
```

### Running Tests

```bash
# Run the test suite
npm test
```

Expected output:
```
=== GenZ Vote System Tests ===

Test 1: Cast Vote
✓ Vote cast successfully
  Vote hash: [SHA-256 hash]
  Candidate: Candidate A
  Timestamp: [ISO timestamp]

Test 2: Prevent Duplicate Vote
✓ First vote cast successfully
✓ Duplicate vote prevented: Voter has already cast a vote

...
```

## 💻 Usage

### Basic Example

```javascript
const VoteSystem = require('./src/index');

// Create a new voting system
const voteSystem = new VoteSystem();

// Cast votes
try {
  const vote1 = voteSystem.castVote('voter123', 'Candidate A');
  console.log('Vote cast:', vote1);
  
  const vote2 = voteSystem.castVote('voter456', 'Candidate B');
  const vote3 = voteSystem.castVote('voter789', 'Candidate A');
  
  // Get vote tally
  const results = voteSystem.getTally();
  console.log('Results:', results);
  // Output: { 'Candidate A': 2, 'Candidate B': 1 }
  
  // Get all votes
  const allVotes = voteSystem.getAllVotes();
  console.log('Total votes:', allVotes.length);
} catch (error) {
  console.error('Error:', error.message);
}
```

### API Reference

#### `VoteSystem`

Main class for managing votes.

**Methods:**

- `castVote(voterId, candidate)` - Cast a vote for a candidate
  - **Parameters:**
    - `voterId` (string): Unique identifier for the voter
    - `candidate` (string): Name of the candidate
  - **Returns:** Vote object with hash, candidate, timestamp, and anonymized voter ID
  - **Throws:** Error if voter has already cast a vote

- `validateVote(vote)` - Validate vote integrity
  - **Parameters:**
    - `vote` (object): Vote object to validate
  - **Returns:** Boolean indicating if vote is valid

- `getTally()` - Get vote count for each candidate
  - **Returns:** Object with candidate names as keys and vote counts as values

- `getAllVotes()` - Get all cast votes
  - **Returns:** Array of all vote objects

## 🧪 Testing

The test suite (`tests/test-voting.js`) includes:

1. **Vote Casting Test** - Verifies successful vote submission
2. **Duplicate Prevention Test** - Ensures voters can only vote once
3. **Vote Validation Test** - Checks vote integrity verification
4. **Vote Tally Test** - Tests result aggregation
5. **Vote Retrieval Test** - Validates vote history access

## 🔧 Technical Details

### Cryptographic Implementation

- **Hashing Algorithm**: SHA-256 (via Node.js crypto module)
- **Vote Hash**: Generated from `voterId-candidate-timestamp`
- **Voter Anonymization**: Voter IDs are hashed before storage

### Vote Object Structure

```javascript
{
  hash: 'SHA-256 hash of vote',
  candidate: 'Candidate name',
  timestamp: 1234567890123,
  voterId: 'SHA-256 hash of original voter ID'
}
```

## 🛣️ Roadmap

- [ ] Add blockchain integration with actual distributed ledger
- [ ] Implement multi-signature validation
- [ ] Add voter authentication with zero-knowledge proofs
- [ ] Create web interface for voting
- [ ] Add real-time result visualization
- [ ] Implement vote encryption for enhanced privacy
- [ ] Add support for multiple concurrent elections

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**w2zard**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: This is a prototype system for educational purposes. For production use, additional security measures, legal compliance, and thorough auditing would be required.
