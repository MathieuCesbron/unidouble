import { AnchorProvider, web3, Program } from '@project-serum/anchor'
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"


const network = clusterApiUrl("devnet")

const opts = {
    preflightCommitment: "confirmed",
}

const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment)
    return provider
}

export { getProvider }