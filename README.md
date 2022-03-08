# Frank Inu token

## Set up fees

All fee structures are set up as global variables. One can set the buy or sell fees separately.

Lines 67-73 are where to set fees accordingly. NOTE: The team fees are dispersed to treasury, marketing, and development.

Lines 78-79 are the percent of team fees to send to treasury and development. The remaining goes to marketing. **NOTE: ADD AN EXTRA DIGIT FOR GREATER ACCURACY. EXAMPLE: 333 = 33.3%, 200 = 20%.**

All fees are editable. Some tax tokens set a hardcoded maximum. This is set to 100% currently but can be adjusted in the setBuyFee and setSellFee functions in the require() statement.

Transaction limits are set in the constructor function at lines 149-154. These can be eliminated removeLimits(). They can be adjusted with setMaxTransaction and setMaxWallet functions. **NOTE: ADD AN EXTRA DIGIT FOR ACCURACY. EXAMPLE: 30 = 0.3%, 15 = 1.5%.**

## Adding team addresses

Lines 18-25 identify the team addresses. These are currently set to local default Hardhat development addresses. **YOU MUST CHANGE THESE FOR DEPLOYMENT**. By default, the owner is the contract deployer address, but this can be transferred at any time.