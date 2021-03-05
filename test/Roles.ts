import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";

import { PatientConsentRoles } from "../typechain/PatientConsentRoles";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
    before(async function () {
        this.signers = {} as Signers;

        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        [this.signers.admin, ...this.signers.users] = signers;
    });

    describe("Roles", function () {
        beforeEach(async function () {
            const rolesArtifact: Artifact = await hre.artifacts.readArtifact("PatientConsentRoles");
            this.roles = await deployContract(this.signers.admin, rolesArtifact) as PatientConsentRoles;
        });

        it("should make deployer an admin", async function () {
            expect(await this.roles.isAdmin(this.signers.admin.address)).to.equal(true);
        });

        it("should allow admins to assign any role", async function() {
            this.roles.setAdmin(this.signers.users[0].address);
            expect(await this.roles.isAdmin(this.signers.users[0].address)).to.equal(true, "Couldn't assign admin role");
            this.roles.setDoctor(this.signers.users[1].address);
            expect(await this.roles.isDoctor(this.signers.users[1].address)).to.equal(true, "Couldn't assign doctor role");
            this.roles.setClient(this.signers.users[2].address);
            expect(await this.roles.isClient(this.signers.users[2].address)).to.equal(true, "Couldn't assign client role");
        });

    });
});


