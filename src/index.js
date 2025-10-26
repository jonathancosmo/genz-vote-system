const crypto = require('crypto');

// GenZ Vote System - Blockchain-inspired voting prototype
class VoteSystem {
  constructor() {
    this.votes = [];
    this.voters = new Set();
  }

  // Generate a unique hash for each vote
  generateVoteHash(voterId, candidate, timestamp) {
    const data = `${voterId}-${candidate}-${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Cast a vote
  castVote(voterId, candidate) {
    if (this.voters.has(voterId)) {
      throw new Error('Voter has already cast a vote');
    }

    const timestamp = Date.now();
    const voteHash = this.generateVoteHash(voterId, candidate, timestamp);
    
    const vote = {
      hash: voteHash,
      candidate,
      timestamp,
      voterId: crypto.createHash('sha256').update(voterId).digest('hex') // Anonymize voter ID
    };

    this.votes.push(vote);
    this.voters.add(voterId);
    
    return vote;
  }

  // Validate vote integrity
  validateVote(vote) {
    const reconstructedHash = this.generateVoteHash(
      vote.voterId,
      vote.candidate,
      vote.timestamp
    );
    return reconstructedHash === vote.hash;
  }

  // Get vote count for each candidate
  getTally() {
    const tally = {};
    this.votes.forEach(vote => {
      tally[vote.candidate] = (tally[vote.candidate] || 0) + 1;
    });
    return tally;
  }

  // Get all votes
  getAllVotes() {
    return this.votes;
  }
}

module.exports = VoteSystem;
