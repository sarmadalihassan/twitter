// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
contract Twitter {
   mapping(address => uint256) public balanceOf;
   event Transfer(address indexed from, address indexed to, uint256 value);
       struct HashplusData {
        string name;
        uint contributed;
        uint deadline;
        uint num_contributions;
        mapping(uint => Contribution) contributions;
    }
    struct Contribution {
        address contributor;
        uint amount;
    }
    uint Hashplusid;
    mapping(uint256 => HashplusData) campaigns;
    function start(string memory name, uint256 deadline) public returns (uint id) {
        HashplusData storage campaign = campaigns[Hashplusid];
        campaign.name = name;
        campaign.deadline = deadline;
        Hashplusid ++;
        id = Hashplusid;

        return id; 
    }

    function viewIdOfCampaign() public view returns(uint){
        return Hashplusid;
    }

    function contribute(uint256 campaignId) public payable {
        HashplusData storage campaign = campaigns[campaignId];
        if (campaign.deadline == 0)
            return;
        campaign.contributed += msg.value;
        Contribution storage contribution = campaign.contributions[campaign.num_contributions];
        contribution.contributor = msg.sender;
        contribution.amount = msg.value;
        campaign.num_contributions++;
    }
    function getContributedAmount(uint campaignId) public view  returns (uint amount) {
        amount = campaigns[campaignId].contributed;
    }
    function transfer (address _to,uint _value) external returns  (bool success){
        require(balanceOf[msg.sender]>=_value);
            _transfer(msg.sender, _to, _value);
        return true;
    }
    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from] - (_value);
        balanceOf[_to] = balanceOf[_to] + (_value);
        emit Transfer(_from, _to, _value);
    }
}











