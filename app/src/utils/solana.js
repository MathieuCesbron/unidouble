import { AnchorProvider, Program } from '@project-serum/anchor'
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"

import idl from "./idl.json"

const network = clusterApiUrl("devnet")

const opts = {
    preflightCommitment: "confirmed",
}

const connection = new Connection(network, opts.preflightCommitment)

const programID = new PublicKey(idl.metadata.address)

const storePubKey = "JBR9FfA1TswWdcMQB6VQnPgPGXGJqZvAiNndAcnRWrF9"
const storeCreatorPubKey = "9VpmjfWZnLYePzx2xVVTCYnBBxHmiqw6qAC4MrZZkWcT"

const getProgram = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment)
    return new Program(idl, programID, provider)
}

export { getProgram, connection, programID, storePubKey, storeCreatorPubKey }