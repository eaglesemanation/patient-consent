pragma solidity ^0.8.0;

import "@openzeppelin/contract/access/AccessControl.sol";

contract PatientConsentRoles is AccessControl {
    /* TODO: Probably should be more flexible, maybe admins should be able to create new roles,
     * and each controlled method should store info about which role should be able to
     * access it.
     * Good enough for now */

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");

    function isAdmin(address _admin) public view returns(bool){
        return hasRole(ADMIN_ROLE, _admin);
    }
    
    function isDoctor(address _doctor) public view returns(bool){
        return hasRole(DOCTOR_ROLE, _doctor);
    }

    function isClient(address _client) public view returns(bool){
        return hasRole(CLIENT_ROLE, _client);
    }

    function setAdmin(address _admin) public isAdmin {
        _setupRole(ADMIN_ROLE, _admin);
    }

    function setDoctor(address _doctor) public isAdmin {
        _setupRole(DOCTOR_ROLE, _doctor);
    }

    function setClient(address _client) public isAdmin {
        _setupRole(CLIENT_ROLE, _client);
    }
}
