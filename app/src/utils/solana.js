import { AnchorProvider, Program } from '@project-serum/anchor'
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"

import idl from "./idl.json"

const network = clusterApiUrl("devnet")

const opts = {
    preflightCommitment: "confirmed",
}

const connection = new Connection(network, opts.preflightCommitment)

const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment)

const programID = new PublicKey(idl.metadata.address)
const program = new Program(idl, programID, provider)

const storePubKey = "29E6ZCPWBZAXntb3EUCZdiwXpk5aek77SBGqhQEKBekj"
const storeCreatorPubKey = "Dr5EsVVJjV5MBbmkPBhH84wqid37vjTcXhmafeEfEQSa"

export { provider, program, programID, storePubKey, storeCreatorPubKey }