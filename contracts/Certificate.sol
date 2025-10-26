// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    mapping(bytes32 => bool) public registeredCertificates;

    function registerCertificate(bytes32 certHash) public {
        require(!registeredCertificates[certHash], "Certificate already exists");
        registeredCertificates[certHash] = true;
    }

    function verifyCertificate(bytes32 certHash) public view returns (bool) {
        return registeredCertificates[certHash];
    }
}
