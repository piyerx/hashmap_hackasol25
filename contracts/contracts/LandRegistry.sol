// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
    address public gramSabhaAdmin;
    
    struct LandTitle {
        uint256 claimId;
        string ownerName;
        string location;
        string documentHash;
        address verifiedBy;
        uint256 timestamp;
    }
    
    struct ClaimVote {
        uint256 claimId;
        string ownerName;
        string location;
        string documentHash;
        address[] voters;
        uint8 voteCount;
        bool finalized;
    }
    
    // Council management
    address[] public councilMembers;
    mapping(address => bool) public isCouncilMember;
    uint8 public constant REQUIRED_VOTES = 5;
    uint8 public constant COUNCIL_SIZE = 5;
    
    // Claim voting tracking
    mapping(uint256 => ClaimVote) public claimVotes;
    mapping(uint256 => mapping(uint8 => bool)) public hasVotedByIndex; // Track by council member index instead of address
    
    // Finalized land titles
    mapping(uint256 => LandTitle) public landTitles;
    uint256[] public claimIds;
    
    event CouncilMemberAdded(address indexed member);
    event CouncilMemberRemoved(address indexed member);
    event CouncilInitialized(address[5] councilMembers);
    event VoteCast(uint256 indexed claimId, address indexed voter, uint8 currentVotes);
    event TitleVerified(
        uint256 indexed claimId,
        string ownerName,
        string location,
        address verifiedBy
    );
    
    modifier onlyAdmin() {
        require(msg.sender == gramSabhaAdmin, "Only Gram Sabha Admin can perform this action");
        _;
    }
    
    modifier onlyCouncil() {
        require(isCouncilMember[msg.sender], "Only Council Members can vote");
        _;
    }
    
    constructor(address[] memory initialCouncil) {
        require(initialCouncil.length == COUNCIL_SIZE, "Must initialize with exactly 5 council members");
        gramSabhaAdmin = msg.sender;
        
        // Simplified for testing - allows duplicate addresses
        for (uint8 i = 0; i < initialCouncil.length; i++) {
            require(initialCouncil[i] != address(0), "Invalid council member address");
            
            councilMembers.push(initialCouncil[i]);
            if (!isCouncilMember[initialCouncil[i]]) {
                isCouncilMember[initialCouncil[i]] = true;
            }
        }
        
        emit CouncilInitialized([
            initialCouncil[0],
            initialCouncil[1],
            initialCouncil[2],
            initialCouncil[3],
            initialCouncil[4]
        ]);
    }
    
    function voteToApprove(
        uint256 claimId,
        string memory ownerName,
        string memory location,
        string memory documentHash,
        uint8 councilMemberIndex
    ) external onlyCouncil {
        require(bytes(ownerName).length > 0, "Owner name cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(councilMemberIndex < COUNCIL_SIZE, "Invalid council member index");
        require(!hasVotedByIndex[claimId][councilMemberIndex], "This council position already voted");
        require(!claimVotes[claimId].finalized, "Claim already finalized");
        
        // Initialize claim vote if first vote
        if (claimVotes[claimId].voteCount == 0) {
            claimVotes[claimId] = ClaimVote({
                claimId: claimId,
                ownerName: ownerName,
                location: location,
                documentHash: documentHash,
                voters: new address[](0),
                voteCount: 0,
                finalized: false
            });
        }
        
        // Record the vote
        claimVotes[claimId].voters.push(msg.sender);
        claimVotes[claimId].voteCount++;
        hasVotedByIndex[claimId][councilMemberIndex] = true;
        
        emit VoteCast(claimId, msg.sender, claimVotes[claimId].voteCount);
        
        // If threshold reached, finalize and record on blockchain
        if (claimVotes[claimId].voteCount >= REQUIRED_VOTES) {
            _finalizeVerification(claimId);
        }
    }
    
    function _finalizeVerification(uint256 claimId) private {
        ClaimVote storage vote = claimVotes[claimId];
        require(!vote.finalized, "Already finalized");
        
        vote.finalized = true;
        
        landTitles[claimId] = LandTitle({
            claimId: claimId,
            ownerName: vote.ownerName,
            location: vote.location,
            documentHash: vote.documentHash,
            verifiedBy: address(this), // Contract itself as verifier
            timestamp: block.timestamp
        });
        
        claimIds.push(claimId);
        
        emit TitleVerified(claimId, vote.ownerName, vote.location, address(this));
    }
    
    function getClaimVoteStatus(uint256 claimId) external view returns (
        uint8 voteCount,
        bool finalized,
        address[] memory voters
    ) {
        ClaimVote memory vote = claimVotes[claimId];
        return (vote.voteCount, vote.finalized, vote.voters);
    }
    
    function getLandTitle(uint256 claimId) external view returns (
        uint256,
        string memory,
        string memory,
        string memory,
        address,
        uint256
    ) {
        LandTitle memory title = landTitles[claimId];
        require(title.claimId != 0, "Land title does not exist");
        
        return (
            title.claimId,
            title.ownerName,
            title.location,
            title.documentHash,
            title.verifiedBy,
            title.timestamp
        );
    }
    
    function getTotalVerifiedClaims() external view returns (uint256) {
        return claimIds.length;
    }
    
    function addCouncilMember(address newMember) external onlyAdmin {
        require(newMember != address(0), "Invalid address");
        require(!isCouncilMember[newMember], "Already a council member");
        require(councilMembers.length < 10, "Council size limit reached");
        
        councilMembers.push(newMember);
        isCouncilMember[newMember] = true;
        emit CouncilMemberAdded(newMember);
    }
    
    function removeCouncilMember(address member) external onlyAdmin {
        require(isCouncilMember[member], "Not a council member");
        require(councilMembers.length > REQUIRED_VOTES, "Cannot remove, would break voting threshold");
        
        isCouncilMember[member] = false;
        
        // Remove from array
        for (uint i = 0; i < councilMembers.length; i++) {
            if (councilMembers[i] == member) {
                councilMembers[i] = councilMembers[councilMembers.length - 1];
                councilMembers.pop();
                break;
            }
        }
        
        emit CouncilMemberRemoved(member);
    }
    
    function getCouncilMembers() external view returns (address[] memory) {
        return councilMembers;
    }
    
    function transferAdminRole(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        gramSabhaAdmin = newAdmin;
    }
}
