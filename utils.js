const anchor = require("@project-serum/anchor")


module.exports.DEVNET_WALLET = anchor.getProvider().wallet.publicKey

module.exports.seller = anchor.web3.Keypair.fromSecretKey(new Uint8Array([
    103, 157, 147, 84, 21, 237, 249, 0, 80, 111, 11,
    41, 36, 213, 160, 47, 148, 7, 179, 103, 130, 70,
    205, 124, 185, 4, 65, 191, 26, 65, 222, 56, 211,
    76, 6, 162, 49, 151, 152, 117, 210, 171, 210, 170,
    15, 211, 191, 17, 12, 104, 158, 95, 124, 57, 147,
    231, 106, 41, 216, 252, 253, 17, 69, 157
]))

module.exports.buyer = anchor.web3.Keypair.fromSecretKey(new Uint8Array([
    44, 3, 20, 60, 75, 210, 182, 58, 80, 128, 80,
    162, 92, 169, 24, 202, 33, 52, 114, 255, 111, 103,
    227, 30, 130, 119, 76, 227, 13, 38, 155, 154, 255,
    196, 238, 232, 187, 117, 91, 49, 83, 228, 176, 80,
    4, 81, 191, 58, 168, 71, 223, 191, 78, 52, 249,
    6, 245, 209, 23, 23, 97, 219, 222, 182
]))

module.exports.generateUser = async (balance, provider) => {
    const user = anchor.web3.Keypair.generate()
    const tx = await provider.connection.requestAirdrop(
        user.publicKey,
        balance * anchor.web3.LAMPORTS_PER_SOL,
    )
    await provider.connection.confirmTransaction(tx)
    return user
}
