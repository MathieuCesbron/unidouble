import { AnchorProvider, Program } from '@project-serum/anchor'
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"

import idl from "./idl.json"

const network = clusterApiUrl("devnet")

const opts = {
    preflightCommitment: "confirmed",
}

const connection = new Connection(network, opts.preflightCommitment)

const programID = new PublicKey(idl.metadata.address)

const storePubKey = "EzF8eQBdzVAbGiD3McM5PJ7NmUQp4q677whffoYcU7C6"
const storeCreatorPubKey = "22EokFzJSsa7QaRivEmAgj2Mnty8JaUf4xp3eQc7auGN"

const getProgram = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment)
    return new Program(idl, programID, provider)
}

export { getProgram, connection, programID, storePubKey, storeCreatorPubKey }