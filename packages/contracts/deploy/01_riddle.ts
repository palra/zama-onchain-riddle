import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function ({ deployments: { deploy }, getNamedAccounts }) {
  const { deployer } = await getNamedAccounts();

  await deploy("OnchainRiddle", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default func;
