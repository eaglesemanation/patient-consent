//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract PatientConsentRoles is AccessControl {
    /* TODO: Probably should be more flexible, maybe admins should be able to create new roles,
     * and each controlled method should store info about which role should be able to
     * access it.
     * Good enough for now */

    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");

    constructor(){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function isAdmin(address _admin) public view returns(bool){
        return hasRole(DEFAULT_ADMIN_ROLE, _admin);
    }
    
    function isDoctor(address _doctor) public view returns(bool){
        return hasRole(DOCTOR_ROLE, _doctor);
    }

    function isClient(address _client) public view returns(bool){
        return hasRole(CLIENT_ROLE, _client);
    }

    modifier admin() {
        require(isAdmin(msg.sender), "User doesn't have enough permissions");
        _;
    }

    modifier doctor() {
        require(
            isAdmin(msg.sender) || isDoctor(msg.sender), 
            "User doesn't have enough permissions"
        );
        _;
    }

    modifier client() {
        require(
            isAdmin(msg.sender) || isDoctor(msg.sender) || isClient(msg.sender), 
            "User doesn't have enough permissions"
        );
        _;
    }

    function setAdmin(address _admin) public admin {
        grantRole(DEFAULT_ADMIN_ROLE, _admin);
        revokeRole(DOCTOR_ROLE, _admin);
        revokeRole(CLIENT_ROLE, _admin);
    }

    function setDoctor(address _doctor) public admin {
        revokeRole(DEFAULT_ADMIN_ROLE, _doctor);
        grantRole(DOCTOR_ROLE, _doctor);
        revokeRole(CLIENT_ROLE, _doctor);
    }

    function setClient(address _client) public admin {
        revokeRole(DEFAULT_ADMIN_ROLE, _client);
        revokeRole(DOCTOR_ROLE, _client);
        grantRole(CLIENT_ROLE, _client);
    }
}
