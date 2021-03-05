import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";

import { DataAccessPermissions } from "../typechain/DataAccessPermissions";
import { Signers } from "../types";

const { deployContract } = hre.waffle;
const { constants } = hre.ethers;

describe("Unit tests", function () {
    before(async function () {
        this.signers = {} as Signers;

        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        [this.signers.admin, ...this.signers.users] = signers;
    });

    describe("Permissions", function () {
        beforeEach(async function () {
            const permissionsArtifact: Artifact = await hre.artifacts.readArtifact("DataAccessPermissions");
            this.permissions = await deployContract(this.signers.admin, permissionsArtifact) as DataAccessPermissions;
        });

        it("should allow admin to make anyone client", async function () {
            const permissions: DataAccessPermissions = this.permissions;
            const users: SignerWithAddress[] = this.signers.users;
            const admin = this.signers.admin;
            await permissions.addClient(users[0].address, 0);

            const result = await permissions.getClientPermission(admin.address, users[0].address).then(response => response.wait());
            expect(result.events).to.be.a('array');
            if(result.events) {
                expect(result.events.length).to.be.greaterThan(0);
                if(result.events.length > 0) {
                    expect(result.events[0].args).to.be.a('array');
                    if(result.events[0].args) {
                        expect(result.events[0].args.length).to.equal(3);
                        if(result.events[0].args.length === 3) {
                            expect(result.events[0].args[2]).to.equal(false);
                        }
                    }
                }
            }
        });

        it("should allow mapping from client address to client id", async function () {
            const permissions: DataAccessPermissions = this.permissions;
            const users: SignerWithAddress[] = this.signers.users;
            const id = 1;
            await permissions.addClient(users[0].address, id);

            expect(await permissions.getClientId(users[0].address)).to.equal(id);
        });

        it("shouldn't fail if client address is not mapped to client id", async function () {
            const permissions: DataAccessPermissions = this.permissions;
            const users: SignerWithAddress[] = this.signers.users;

            expect(await permissions.getClientId(users[0].address)).to.equal(0);
        });

        it("shouldn't fail if client address is zeroAddress", async function () {
            const permissions: DataAccessPermissions = this.permissions;

            expect(await permissions.getClientId(constants.AddressZero)).to.equal(0);
        });

        it("should allow mapping from client id to client address", async function () {
            const permissions: DataAccessPermissions = this.permissions;
            const users: SignerWithAddress[] = this.signers.users;
            const id = 0;
            await permissions.addClient(users[0].address, id);

            expect(await permissions.getClientAddress(id)).to.equal(users[0].address);
        });

        it("shouldn't fail if client id is not mapped to client address", async function () {
            const permissions: DataAccessPermissions = this.permissions;
            const id = 1;

            expect(await permissions.getClientAddress(id)).to.equal(constants.AddressZero);
        })
        
    });
});


