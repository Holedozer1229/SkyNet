const anchor = require("@project-serum/anchor");

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  const program = anchor.workspace.SkyntAnchor;
  
  console.log("Initializing genesis block with difficulty adjustment...");
  
  const difficultyAccount = anchor.web3.Keypair.generate();
  
  await program.rpc.initGenesis({
    accounts: {
      difficulty: difficultyAccount.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [difficultyAccount],
  });
  
  console.log("Genesis initialized with difficulty account:", difficultyAccount.publicKey.toString());
};
