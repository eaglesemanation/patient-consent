//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import './Roles.sol';

contract DataAccessPermissions is PatientConsentRoles {

    mapping(address => uint32) private clientAddressToId;
    mapping(uint32 => address) private idToClientAddress;

    // TODO: Another hardcoded solution, it has to be more flexible to get into production
    struct Permissions {
        bool addiction;
    }

    mapping(address => Permissions) private clientPermissions;

    event RequestedClientPermissions(address requester, address client, bool permission);

    function addClient(address _client, uint32 _id) external admin {
        clientAddressToId[_client] = _id;
        idToClientAddress[_id] = _client;
        clientPermissions[_client] = Permissions(false); 
    }

    function setPermission(bool _addiction) external {
        clientPermissions[msg.sender].addiction = _addiction;
    }

    // FIXME: Currently anyone can request for permissions of any client just by getting
    // public key of any doctor/admin. It could be fixed by implementing oracle, and sending 
    // permissions through it to API but I don't have time for that
    function getClientPermission(address _requester, address _client) external {
        require(isDoctor(_requester) || isAdmin(_requester) || _requester == _client, "Not enough permissions");
        emit RequestedClientPermissions(_requester, _client, clientPermissions[_client].addiction);
    }

    function getClientId(address _client) external view returns(uint32) {
        return clientAddressToId[_client];
    }
}
