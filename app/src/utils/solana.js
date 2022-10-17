import { AnchorProvider, Program } from '@project-serum/anchor'
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"

import idl from "./idl.json"

const network = clusterApiUrl("devnet")

const opts = {
    preflightCommitment: "confirmed",
}

const connection = new Connection(network, opts.preflightCommitment)

const programID = new PublicKey(idl.metadata.address)

const storePubKey = "41nssbCHHN7CwdcXHwAszkWMVPa5iXdKS2yZa8Y7DzZm"
const storeCreatorPubKey = "BDbyMbeGVu1vG9kmaNHxPrgP7QxVYAzHhYoSzxhGxQcT"

const getProgram = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment)
    return new Program(idl, programID, provider)
}

export { getProgram, connection, programID, storePubKey, storeCreatorPubKey }