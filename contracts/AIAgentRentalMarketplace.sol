// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AIAgentRentalMarketplace is ReentrancyGuard {
    
    address public owner;              
    IERC20 public paymentToken;        
    uint256 public platformFeePercent; 
    uint256 public totalAgents;        
    uint256 public totalPlatformFees;  

    struct Agent {
        uint256 id;
        address  provider;
        string metadataURI;    
        string accessInfo;     
        uint256 pricePerPeriod;
        uint256 periodDuration;
        bool isPaused;         
        uint256 totalRatings;  
        uint256 ratingCount;   
    }

    struct Rental {
        address renter;
        uint256 startTime;
        uint256 expiryTime;
        uint256 allowedRatingsCount; 
    }

    mapping(uint256 => Agent) public agents;
    mapping(uint256 => mapping(address => Rental)) public rentals;
    mapping(address => uint256) public earnings;

    event AgentRegistered(uint256 indexed agentId, address indexed provider, uint256 pricePerPeriod, uint256 periodDuration, string metadataURI);
    event AgentRented(uint256 indexed agentId, address indexed renter, uint256 startTime, uint256 expiryTime);
    event AgentUpdated(uint256 indexed agentId, uint256 pricePerPeriod, bool isPaused);
    event ListingStatusToggled(uint256 indexed agentId, bool isPaused);
    event FundsWithdrawn(address indexed user, uint256 amount);
    event AgentRated(uint256 indexed agentId, address indexed renter, uint8 rating);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyProvider(uint256 _agentId) {
        require(msg.sender == agents[_agentId].provider, "Not authorized");
        _;
    }

    modifier onlyProviderOrOwner(uint256 _agentId) {
        require(
            msg.sender == owner || msg.sender == agents[_agentId].provider,
            "Not authorized"
        );
        _;
    }

    constructor(address _paymentToken, uint256 _platformFeePercent) {
        require(_paymentToken != address(0), "Invalid token");
        require(_platformFeePercent <= 100, "Invalid fee");
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
        platformFeePercent = _platformFeePercent;
    }

    function registerAgent(
        string calldata _metadataURI,
        string calldata _accessInfo,
        uint256 _pricePerPeriod,
        uint256 _durationInDays
    ) external {
        require(bytes(_metadataURI).length > 0, "Metadata required");
        require(_pricePerPeriod > 0, "Invalid price");
        require(_durationInDays > 0, "Invalid duration");

        totalAgents++;
        uint256 durationInSeconds = _durationInDays * 1 days;

        agents[totalAgents] = Agent({
            id: totalAgents,
            provider: msg.sender,
            metadataURI: _metadataURI,
            accessInfo: _accessInfo,
            pricePerPeriod: _pricePerPeriod,
            periodDuration: durationInSeconds,
            isPaused: false,
            totalRatings: 0,
            ratingCount: 0
        });

        emit AgentRegistered(totalAgents, msg.sender, _pricePerPeriod, durationInSeconds, _metadataURI);
    }

    function rentAgent(uint256 _agentId) external nonReentrant {
        Agent storage agent = agents[_agentId];
        require(agent.id != 0, "Agent not found");
        require(!agent.isPaused, "Agent paused");
        require(agent.provider != msg.sender, "Provider cannot rent");

        uint256 price = agent.pricePerPeriod;
        
        require(paymentToken.transferFrom(msg.sender, address(this), price), "Payment failed");

        uint256 feeAmount = (price * platformFeePercent) / 100;
        uint256 providerEarnings = price - feeAmount;

        totalPlatformFees += feeAmount;
        earnings[agent.provider] += providerEarnings;

        Rental storage rental = rentals[_agentId][msg.sender];
        
        uint256 start = block.timestamp < rental.expiryTime ? rental.expiryTime : block.timestamp;
        uint256 expiry = start + agent.periodDuration;

        rental.renter = msg.sender;
        rental.startTime = block.timestamp;
        rental.expiryTime = expiry;
        rental.allowedRatingsCount += 1; 

        emit AgentRented(_agentId, msg.sender, start, expiry);
    }

    function getAccessInfo(uint256 _agentId) external view returns (string memory) {
        Rental memory rental = rentals[_agentId][msg.sender];
        require(block.timestamp <= rental.expiryTime, "Expired");

        return agents[_agentId].accessInfo;
    }

    function rateAgent(uint256 _agentId, uint8 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating 1-5");
        Rental storage rental = rentals[_agentId][msg.sender];
        
        require(rental.allowedRatingsCount > 0, "No quota");

        Agent storage agent = agents[_agentId];
        agent.totalRatings += _rating;
        agent.ratingCount++;
        
        rental.allowedRatingsCount -= 1; 

        emit AgentRated(_agentId, msg.sender, _rating);
    }

    function withdraw() external nonReentrant {
        uint256 amount = earnings[msg.sender];
        if (msg.sender == owner) {
            amount += totalPlatformFees;
            totalPlatformFees = 0;
        }
        
        require(amount > 0, "No funds available");
        earnings[msg.sender] = 0;

        require(paymentToken.transfer(msg.sender, amount), "Transfer failed");
        emit FundsWithdrawn(msg.sender, amount);
    }

    function updateAgent(uint256 _agentId, uint256 _newPrice, bool _isPaused) external onlyProvider(_agentId) {
        Agent storage agent = agents[_agentId];
        require(agent.id != 0, "Agent not found");
        require(_newPrice > 0, "Invalid price");

        agent.pricePerPeriod = _newPrice;
        agent.isPaused = _isPaused;

        emit AgentUpdated(_agentId, _newPrice, _isPaused);
    }

    function toggleListingStatus(uint256 _agentId) external onlyProviderOrOwner(_agentId) {
        Agent storage agent = agents[_agentId];
        require(agent.id != 0, "Agent not found");
        
        agent.isPaused = !agent.isPaused;
        
        emit ListingStatusToggled(_agentId, agent.isPaused);
    }

