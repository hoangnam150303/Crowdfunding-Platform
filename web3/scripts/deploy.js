async function main() {
  const crowdFunding_contract = await ethers.getContractFactory("Crowdfunding");
  const crowdFunding = await crowdFunding_contract.deploy();
  await crowdFunding.waitForDeployment();
  console.log("YSoul token deployed to:", await crowdFunding.getAddress());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
