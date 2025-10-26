/**
 * GenZ Decentralized Voting System - JavaScript Prototype
 * Author: w2zard
 * 
 * This prototype demonstrates the core functionality of a blockchain-based
 * decentralized voting system with cryptographic verification.
 */

const crypto = require('crypto');

/**
 * Voter Class - Represents a voter with cryptographic identity
 * @author w2zard
 */
class Voter {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    // Generate RSA key pair for digital signatures
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.hasVoted = false;
  }

  /**
   * Sign a vote with the voter's private key
   * @author w2zard
   */
  signVote(voteData) {
    if (this.hasVoted) {
      throw new Error('Voter has already cast a vote');
    }
    
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(voteData));
    sign.end();
    
    const signature = sign.sign(this.privateKey, 'hex');
    this.hasVoted = true;
    
    return {
      voterId: this.id,
      voterPublicKey: this.publicKey,
      voteData: voteData,
      signature: signature,
      timestamp: Date.now()
    };
  }
}

/**
 * Vote Class - Represents a single vote transaction
 * @author w2zard
 */
class Vote {
  constructor(voterId, candidate, signature, publicKey, timestamp) {
    this.voterId = voterId;
    this.candidate = candidate;
    this.signature = signature;
    this.publicKey = publicKey;
    this.timestamp = timestamp;
    this.verified = false;
  }

  /**
   * Verify the vote signature
   * @author w2zard
   */
  verify() {
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(JSON.stringify({ candidate: this.candidate }));
      verify.end();
      
      this.verified = verify.verify(this.publicKey, this.signature, 'hex');
      return this.verified;
    } catch (error) {
      console.error('Vote verification failed:', error.message);
      return false;
    }
  }

  getHash() {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify({
      voterId: this.voterId,
      candidate: this.candidate,
      timestamp: this.timestamp
    }));
    return hash.digest('hex');
  }
}

/**
 * Block Class - Represents a block in the blockchain
 * @author w2zard
 */
class Block {
  constructor(index, votes, previousHash) {
    this.index = index;
    this.votes = votes;
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate block hash
   * @author w2zard
   */
  calculateHash() {
    const hash = crypto.createHash('sha256');
    hash.update(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.votes) +
      this.nonce
    );
    return hash.digest('hex');
  }

  /**
   * Mine block with proof of work
   * @author w2zard
   */
  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

/**
 * VotingBlockchain Class - Manages the entire voting blockchain
 * @author w2zard
 */
class VotingBlockchain {
  constructor(difficulty = 2) {
    this.chain = [this.createGenesisBlock()];
    this.pendingVotes = [];
    this.voters = new Map();
    this.difficulty = difficulty;
  }

  /**
   * Create the genesis block
   * @author w2zard
   */
  createGenesisBlock() {
    return new Block(0, [], '0');
  }

  /**
   * Get the latest block in the chain
   * @author w2zard
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Register a new voter
   * @author w2zard
   */
  registerVoter(voter) {
    if (this.voters.has(voter.id)) {
      throw new Error('Voter already registered');
    }
    this.voters.set(voter.id, voter);
    console.log(`Voter registered: ${voter.name} (ID: ${voter.id})`);
  }

  /**
   * Broadcast a vote to the network
   * @author w2zard
   */
  broadcastVote(signedVote) {
    // Verify voter is registered
    if (!this.voters.has(signedVote.voterId)) {
      throw new Error('Voter not registered');
    }

    // Check if voter has already voted
    const hasVotedBefore = this.chain.some(block => 
      block.votes.some(vote => vote.voterId === signedVote.voterId)
    );
    
    if (hasVotedBefore) {
      throw new Error('Voter has already cast a vote in the blockchain');
    }

    // Create vote object
    const vote = new Vote(
      signedVote.voterId,
      signedVote.voteData.candidate,
      signedVote.signature,
      signedVote.voterPublicKey,
      signedVote.timestamp
    );

    // Verify the vote signature
    if (!vote.verify()) {
      throw new Error('Vote signature verification failed');
    }

    this.pendingVotes.push(vote);
    console.log(`Vote broadcasted and verified: Voter ${signedVote.voterId} -> ${vote.candidate}`);
    return vote;
  }

  /**
   * Mine pending votes into a new block
   * @author w2zard
   */
  minePendingVotes() {
    if (this.pendingVotes.length === 0) {
      console.log('No pending votes to mine');
      return;
    }

    const block = new Block(
      this.chain.length,
      this.pendingVotes,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    this.chain.push(block);

    console.log(`Block #${block.index} added to chain with ${this.pendingVotes.length} vote(s)`);
    this.pendingVotes = [];
  }

  /**
   * Verify the integrity of the blockchain
   * @author w2zard
   */
  verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify block hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.error(`Block ${i} has been tampered with`);
        return false;
      }

      // Verify chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`Block ${i} is not linked to previous block`);
        return false;
      }

      // Verify all votes in the block
      for (const vote of currentBlock.votes) {
        if (!vote.verify()) {
          console.error(`Invalid vote found in block ${i}`);
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Get voting results
   * @author w2zard
   */
  getResults() {
    const results = {};
    
    for (const block of this.chain) {
      for (const vote of block.votes) {
        if (vote.verified) {
          results[vote.candidate] = (results[vote.candidate] || 0) + 1;
        }
      }
    }

    return results;
  }

  /**
   * Display the blockchain
   * @author w2zard
   */
  displayChain() {
    console.log('\n=== Voting Blockchain ===');
    this.chain.forEach(block => {
      console.log(`\nBlock #${block.index}`);
      console.log(`Timestamp: ${new Date(block.timestamp).toISOString()}`);
      console.log(`Previous Hash: ${block.previousHash}`);
      console.log(`Hash: ${block.hash}`);
      console.log(`Votes: ${block.votes.length}`);
      block.votes.forEach((vote, idx) => {
        console.log(`  Vote ${idx + 1}: ${vote.candidate} (Verified: ${vote.verified})`);
      });
    });
  }
}

// ============================================================================
// DEMONSTRATION - Example Usage
// @author w2zard
// ============================================================================

console.log('\n🗳️  GenZ Decentralized Voting System - Prototype Demo');
console.log('=' .repeat(60));

// Step 1: Initialize the voting blockchain
console.log('\n[Step 1] Initializing blockchain...');
const votingSystem = new VotingBlockchain(2);

// Step 2: Create and register voters
console.log('\n[Step 2] Creating and registering voters...');
const alice = new Voter('V001', 'Alice');
const bob = new Voter('V002', 'Bob');
const charlie = new Voter('V003', 'Charlie');
const diana = new Voter('V004', 'Diana');

votingSystem.registerVoter(alice);
votingSystem.registerVoter(bob);
votingSystem.registerVoter(charlie);
votingSystem.registerVoter(diana);

// Step 3: Voters create and sign their votes
console.log('\n[Step 3] Voters signing their votes...');
const aliceVote = alice.signVote({ candidate: 'Candidate A' });
const bobVote = bob.signVote({ candidate: 'Candidate B' });
const charlieVote = charlie.signVote({ candidate: 'Candidate A' });
const dianaVote = diana.signVote({ candidate: 'Candidate C' });

// Step 4: Broadcast votes to the network
console.log('\n[Step 4] Broadcasting votes to the network...');
votingSystem.broadcastVote(aliceVote);
votingSystem.broadcastVote(bobVote);
votingSystem.broadcastVote(charlieVote);
votingSystem.broadcastVote(dianaVote);

// Step 5: Mine the pending votes into a block
console.log('\n[Step 5] Mining pending votes into a block...');
votingSystem.minePendingVotes();

// Step 6: Verify the blockchain integrity
console.log('\n[Step 6] Verifying blockchain integrity...');
const isValid = votingSystem.verifyChain();
console.log(`Blockchain valid: ${isValid}`);

// Step 7: Display results
console.log('\n[Step 7] Vote tallying...');
const results = votingSystem.getResults();
console.log('\n📊 Voting Results:');
Object.entries(results).forEach(([candidate, votes]) => {
  console.log(`  ${candidate}: ${votes} vote(s)`);
});

// Step 8: Display the complete blockchain
votingSystem.displayChain();

// Step 9: Demonstrate double-vote prevention
console.log('\n[Step 9] Testing double-vote prevention...');
try {
  const aliceSecondVote = alice.signVote({ candidate: 'Candidate B' });
} catch (error) {
  console.log(`✓ Double vote prevented: ${error.message}`);
}

console.log('\n' + '='.repeat(60));
console.log('✅ Demo completed successfully!');
console.log('\nKey Features Demonstrated:');
console.log('  ✓ Voter registration with cryptographic keys');
console.log('  ✓ Vote signing with digital signatures');
console.log('  ✓ Vote broadcasting and verification');
console.log('  ✓ Blockchain mining with proof of work');
console.log('  ✓ Chain integrity verification');
console.log('  ✓ Double-vote prevention');
console.log('  ✓ Transparent vote tallying');
console.log('\n--- w2zard ---\n');

// Export for use as a module
module.exports = {
  Voter,
  Vote,
  Block,
  VotingBlockchain
};
