// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
    address public gramSabha;
    
    struct LandTitle {
        uint256 claimId;
        string ownerName;
        string location;
        string documentHash;
        address verifiedBy;
        uint256 timestamp;
    }
    
    mapping(uint256 => LandTitle) public landTitles;
    uint256[] public claimIds;
    
    event TitleVerified(
        uint256 indexed claimId,
        string ownerName,
        string location,
        address verifiedBy
    );
    
    modifier onlyGramSabha() {
        require(msg.sender == gramSabha, "Only Gram Sabha can perform this action");
        _;
    }
    
    constructor() {
        gramSabha = msg.sender;
    }
    
    function recordVerifiedTitle(
        uint256 claimId,
        string memory ownerName,
        string memory location,
        string memory documentHash
    ) external onlyGramSabha {
        require(bytes(ownerName).length > 0, "Owner name cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(landTitles[claimId].claimId == 0, "Claim ID already exists");
        
        landTitles[claimId] = LandTitle({
            claimId: claimId,
            ownerName: ownerName,
            location: location,
            documentHash: documentHash,
            verifiedBy: msg.sender,
            timestamp: block.timestamp
        });
        
        claimIds.push(claimId);
        
        emit TitleVerified(claimId, ownerName, location, msg.sender);
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
    
    function transferGramSabhaRole(address newGramSabha) external onlyGramSabha {
        require(newGramSabha != address(0), "Invalid address");
        gramSabha = newGramSabha;
    }
}
