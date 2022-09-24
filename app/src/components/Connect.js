import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
    SolletWalletAdapter,
    GlowWalletAdapter,
    SlopeWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { useMemo } from 'react'

require('@solana/wallet-adapter-react-ui/styles.css')

const Context = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
        ],
        []
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default function App() {
    return (
        <Context>
            <div>
                <WalletMultiButton />
            </div>
        </Context>
    )
}