// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Greeting {
  string private greeting; 

  constructor(string memory _greeting){
    greeting = _greeting; 
  }

  function getGreeting() public view returns  (string memory) {
    return greeting; 
  }

  function setGreeting(string memory _greeting) public {
    greeting = _greeting; 
  }
}
