const anchor = require("@project-serum/anchor")
const elliptic = require('elliptic')
const cryptoJS = require('crypto-js')

const { generateUser } = require("../utils.js")

const curve = new elliptic.ec('curve25519')

describe("unidouble", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Unidouble

  it("works as a store", async () => {
    console.log("initialize store")
    const creator = await generateUser(2, provider)
    const [store] = await anchor.web3.PublicKey.findProgramAddress(
      [creator.publicKey.toBuffer()],
      program.programId
    )
    console.log("store: ", store.toString())
    console.log("creator: ", creator.publicKey.toString())

    const txInitializeStore = await program.methods
      .initializeStore()
      .accounts(
        {
          user: creator.publicKey,
          store: store,
          systemProgram: anchor.web3.SystemProgram.programId
        })
      .signers([creator])
      .rpc()

    await provider.connection.confirmTransaction(txInitializeStore, "confirmed")

    console.log("create seller account")
    await new Promise(r => setTimeout(r, 10000))
    const seller = await generateUser(2, provider)
    // seller must remember the private key
    const sellerDiffieKeyPair = curve.genKeyPair()
    const sellerDiffiePublicKey = sellerDiffieKeyPair.getPublic().encode("hex")

    const [sellerAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [seller.publicKey.toBuffer()],
      program.programId
    )

    const txCreateSellerAccount = await program.methods
      .createSellerAccount(sellerDiffiePublicKey)
      .accounts(
        {
          user: seller.publicKey,
          sellerAccount: sellerAccount,
          store: store,
          systemProgram: anchor.web3.SystemProgram.programId
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txCreateSellerAccount, "confirmed")

    console.log("update diffie seller account")
    const sellerDiffieKeyPairUpdate = curve.genKeyPair()
    const sellerDiffiePublicKeyUpdate = sellerDiffieKeyPairUpdate.getPublic().encode("hex")

    const txUpdateDiffieSellerAccount = await program.methods
      .updateDiffieSellerAccount(sellerDiffiePublicKeyUpdate)
      .accounts(
        {
          user: seller.publicKey,
          sellerAccount: sellerAccount
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txUpdateDiffieSellerAccount, "confirmed")

    console.log("initialize article")
    const uuid = Math.random().toString(36).slice(-6)
    const country = 0
    const category = 0
    const [article] = await anchor.web3.PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode(uuid)],
      program.programId
    )

    const txInitializeArticle = await program.methods
      .initializeArticle(uuid, country, category)
      .accounts(
        {
          user: seller.publicKey,
          article: article,
          sellerAccount: sellerAccount,
          store: store,
          systemProgram: anchor.web3.SystemProgram.programId
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txInitializeArticle, "confirmed")

    console.log("post article")
    const price = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL)
    const quantity = 10
    // title of max length 75
    const title = "Vintage 1994 IBM Model M2 Keyboard Part No 1395300 Buckling Spring Untested"
    // description of max length 800
    const description = "lauctor augue mauris augue. Id diam vel quam elementum. Orci porta non pulvinar neque laoreet suspendisse. Feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum. Interdum consectetur libero id faucibus nisl tincidunt eget. Integer vitae justo eget magna fermentum iaculis eu. Ultrices neque ornare aenean euismod elementum nisi quis. Et netus et malesuada fames ac turpis egestas integer.Sit amet dictum sit amet.Cursus mattis molestie a iaculis.Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque.Elementum nisi quis eleifend quam adipiscing.Sit amet. auctor augue mauris augue. Id diam vel quam elementum. Orci porta non pulvinar neque laoreqtaim"
    // imageURL of max length 50
    const imageURL = "https://book.anchor-lang.com/anchor_references/spa"

    const txPostArticle = await program.methods
      .postArticle(price, quantity, title, description, imageURL)
      .accounts(
        {
          user: seller.publicKey,
          article: article,
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txPostArticle, "confirmed")

    console.log("update article")
    const newQuantity = 12
    const newTitle = "Vintage 1996 IBM Model M2 Keyboard Part No 1395300 Buckling Spring Untested"
    const newDescription = "laurcot augue mauris augue. Id diam vel quam elementum. Orci porta non pulvinar neque laoreet suspendisse. Feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum. Interdum consectetur libero id faucibus nisl tincidunt eget. Integer vitae justo eget magna fermentum iaculis eu. Ultrices neque ornare aenean euismod elementum nisi quis. Et netus et malesuada fames ac turpis egestas integer.Sit amet dictum sit amet.Cursus mattis molestie a iaculis.Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque.Elementum nisi quis eleifend quam adipiscing.Sit amet. auctor augue mauris augue. Id diam vel quam elementum. Orci porta non pulvinar neque laoreqtaim"
    const newImageURL = "https://book.anchor-lang.com/anchor_references/aps"

    const txUpdateArticle = await program.methods
      .updateArticle(newQuantity, newTitle, newDescription, newImageURL)
      .accounts(
        {
          user: seller.publicKey,
          article: article,
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txUpdateArticle, "confirmed")

    console.log("buy article")
    await new Promise(r => setTimeout(r, 10000))
    const buyer = await generateUser(2, provider)

    const buyerDiffieKeyPair = curve.genKeyPair()
    const sellerDiffieBasepoint = curve.keyFromPublic(Buffer.from(sellerDiffiePublicKey, 'hex')).getPublic()
    const sharedSecretBuyerSide = buyerDiffieKeyPair.derive(sellerDiffieBasepoint).toString("hex")
    const cipher = cryptoJS.AES.encrypt(
      "(308) 367-4732-609 Howard Ave Curtis, Nebraska(NE), 69025",
      sharedSecretBuyerSide,
      { mode: cryptoJS.mode.CTR }
    )
    const cipherText = cipher.ciphertext.toString()
    const buyerDiffiePublicKey = buyerDiffieKeyPair.getPublic().encode("hex")
    const salt = cipher.salt.toString()
    const iv = cipher.iv.toString()

    const quantityToBuy = 2

    const txBuyArticle = await program.methods
      .buyArticle(quantityToBuy, cipherText, buyerDiffiePublicKey, salt, iv)
      .accounts(
        {
          user: buyer.publicKey,
          seller: seller.publicKey,
          article: article,
          storeCreator: creator.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
      .signers([buyer])
      .rpc()

    await provider.connection.confirmTransaction(txBuyArticle, "confirmed")

    console.log("review article")
    const rating = 4

    const txReviewArticle = await program.methods
      .reviewArticle(rating)
      .accounts(
        {
          user: buyer.publicKey,
          article: article,
          systemProgram: anchor.web3.SystemProgram.programId
        })
      .signers([buyer])
      .rpc()

    await provider.connection.confirmTransaction(txReviewArticle, "confirmed")

    console.log("remove article")

    const txRemoveArticle = await program.methods
      .removeArticle()
      .accounts(
        {
          user: seller.publicKey,
          article: article,
          sellerAccount: sellerAccount,
          store: store,
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txRemoveArticle, "confirmed")

    console.log("delete seller account")

    const txDeleteSellerAccount = await program.methods
      .deleteSellerAccount()
      .accounts(
        {
          user: seller.publicKey,
          sellerAccount: sellerAccount,
        })
      .signers([seller])
      .rpc()

    await provider.connection.confirmTransaction(txDeleteSellerAccount, "confirmed")
  })
})
