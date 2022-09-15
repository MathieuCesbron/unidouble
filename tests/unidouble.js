const anchor = require("@project-serum/anchor")
const { DEVNET_WALLET, generateUser } = require("../utils.js")


describe("unidouble", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Unidouble

  it("initialize store", async () => {
    const creator = await generateUser(1, provider)
    const [store] = await anchor.web3.PublicKey.findProgramAddress(
      [creator.publicKey.toBuffer()],
      program.programId
    )

    await program.methods
      .initialize()
      .accounts(
        {
          user: creator.publicKey,
          store: store,
          systemProgram: anchor.web3.SystemProgram.programId
        })
      .signers([creator])
      .rpc()
  })
})

