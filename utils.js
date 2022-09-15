const anchor = require("@project-serum/anchor")


module.exports.DEVNET_WALLET = anchor.getProvider().wallet.publicKey

module.exports.generateUser = async (balance, provider) => {
    const user = anchor.web3.Keypair.generate()
    const tx = await provider.connection.requestAirdrop(
        user.publicKey,
        balance * anchor.web3.LAMPORTS_PER_SOL,
    )
    await provider.connection.confirmTransaction(tx)
    return user
}
