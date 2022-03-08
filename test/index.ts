import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

const UNISWAP_ABI = [
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOut, address[] calldata path, address to, uint256 deadline) external"
]
const UNI = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

describe("Token", function () {
  it("Check deploy, launch, and fees", async function () {
    const accounts: SignerWithAddress[] = await ethers.getSigners();
  
    // We get the contract to deploy
    const Token = await ethers.getContractFactory("FrankInuToken");
    const token = await Token.deploy({value: ethers.utils.parseEther('10.0')});
  
    await token.deployed();
  
    console.log("Token deployed to:", token.address);

    console.log(await ethers.provider.getBalance(accounts[1].address));
    console.log(await ethers.provider.getBalance(accounts[2].address));
    console.log(await ethers.provider.getBalance(accounts[3].address));

    await ethers.provider.send("evm_setAutomine", [false]);

    // Check addresses are set properly
    expect(await token.marketingAddress()).to.equal(accounts[1].address);
    expect(await token.devAddress()).to.equal(accounts[2].address);
    expect(await token.liquidityAddress()).to.equal(accounts[3].address);
    expect(await token.treasuryAddress()).to.equal(accounts[4].address);

    // Check total supply is 100B
    expect(Number(ethers.utils.formatUnits((await token.totalSupply()).toString(), 'gwei'))).to.equal(100000000000);

    await token.launch();

    const uniswap = new ethers.Contract(UNI, UNISWAP_ABI, ethers.provider);

    await uniswap.connect(accounts[8]).swapExactETHForTokensSupportingFeeOnTransferTokens(
      0, [WETH, token.address], accounts[8].address, 9999999999,
      { value: ethers.utils.parseEther('0.01') }
    );

    await ethers.provider.send("evm_mine", []);

    await uniswap.connect(accounts[7]).swapExactETHForTokensSupportingFeeOnTransferTokens(
      0, [WETH, token.address], accounts[7].address, 9999999999,
      { value: ethers.utils.parseEther('0.02') }
    );

    await ethers.provider.send("evm_mine", []);

    await uniswap.connect(accounts[6]).swapExactETHForTokensSupportingFeeOnTransferTokens(
      0, [WETH, token.address], accounts[6].address, 9999999999,
      { value: ethers.utils.parseEther('0.03') }
    );

    await ethers.provider.send("evm_mine", []);

    await uniswap.connect(accounts[9]).swapExactETHForTokensSupportingFeeOnTransferTokens(
      0, [WETH, token.address], accounts[9].address, 9999999999,
      { value: ethers.utils.parseEther('0.03') }
    );

    await ethers.provider.send("evm_mine", []);

    await uniswap.connect(accounts[10]).swapExactETHForTokensSupportingFeeOnTransferTokens(
      0, [WETH, token.address], accounts[10].address, 9999999999,
      { value: ethers.utils.parseEther('0.03') }
    );

    await ethers.provider.send("evm_mine", []);

    await token.addToBlacklist(accounts[10].address);

    await ethers.provider.send("evm_mine", []);
    
    expect(await token.blacklist(accounts[10].address)).to.equal(true);

    await ethers.provider.send("evm_mine", []);

    await token.removeFromBlacklist(accounts[10].address);

    await ethers.provider.send("evm_mine", []);

    expect(await token.blacklist(accounts[10].address)).to.equal(false);

    const balance = await token.balanceOf(accounts[10].address);

    await token.connect(accounts[10]).approve(UNI, balance);

    await ethers.provider.send("evm_mine", []);
    
    await uniswap.connect(accounts[10]).swapExactTokensForETHSupportingFeeOnTransferTokens(
      balance, 0, [token.address, WETH], accounts[10].address, 9999999999
    );

    await ethers.provider.send("evm_mine", []);

    console.log(await ethers.provider.getBalance(accounts[1].address));
    console.log(await ethers.provider.getBalance(accounts[2].address));
    console.log(await ethers.provider.getBalance(accounts[4].address));

  });
});
