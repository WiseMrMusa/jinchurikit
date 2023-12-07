"use client";

// wagmi but for starknet

import { type ConnectOptions, connect, disconnect, } from "get-starknet";
import clsx from "clsx";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { AccountInterface, ProviderInterface } from "starknet";
import { ConnectedStarknetWindowObject } from "get-starknet-core";


function handleConnect(options?: ConnectOptions) {
    return async () => {
        const res = await connect(options);
    };
}

export interface ConnectConfig {
    provider: ProviderInterface | undefined,
    setProvider: Dispatch<SetStateAction<ProviderInterface | undefined>>,
    account: AccountInterface | undefined,
    setAccount: Dispatch<SetStateAction<AccountInterface | undefined>>,
    address: string | undefined,
    setAddress: Dispatch<SetStateAction<string | undefined>>;
    isConnected: boolean | undefined,
    setIsConnected: Dispatch<SetStateAction<boolean | undefined>>;
    connection: ConnectedStarknetWindowObject | undefined,
    setConnection: Dispatch<SetStateAction<ConnectedStarknetWindowObject | undefined>>,
}

export const JinchurikitContext = createContext<ConnectConfig | undefined>(undefined);
export const JinchurikitProvider = ({ children }: { children: ReactNode; }) => {
    const [provider, setProvider] = useState<ProviderInterface>();
    const [account, setAccount] = useState<AccountInterface>();
    const [connection, setConnection] = useState<ConnectedStarknetWindowObject>();
    const [isConnected, setIsConnected] = useState<boolean>();
    const [address, setAddress] = useState<string>();
    return (
        <JinchurikitContext.Provider
            value={
                {
                    provider, setProvider,
                    account, setAccount,
                    address, setAddress,
                    isConnected, setIsConnected,
                    connection, setConnection,
                }
            }>
            {children}
        </JinchurikitContext.Provider>
    );
};

export const ConnectButton = () => {
    const value = useContext(JinchurikitContext);
    if (!value) return;
    const { provider, setProvider, account, setAccount, address, setAddress, isConnected, setIsConnected, setConnection, connection } = value;
    const handleConnect = async () => {
        const connection = await connect({ modalMode: "alwaysAsk" });
        if (connection && connection.isConnected) {
            setConnection(connection);
            setAccount(connection.account);
            setAddress(connection.selectedAddress);
            setIsConnected(true);
        }
    };


    const handleDisconnect = async () => {
        await disconnect();
        setConnection(undefined);
        setAccount(undefined);
        setAddress(undefined);
        setIsConnected(false);
    };


    if (isConnected) {
        return <ConnectedWalletButton handleDisconnect={handleDisconnect} address={address} />;
    } else return <DisconnectedWalletButton handleConnect={handleConnect} />;

};

const DisconnectedWalletButton = ({ handleConnect }: { handleConnect: Function; }) => {
    return (
        <button
            className={clsx(
                "rounded-md bg-white text-slate-900 py-2 px-4 h-max"
            )}
            onClick={() => handleConnect({ modalMode: "alwaysAsk" })}
        >Connect Button -&gt;</button>
    );
};

const ConnectedWalletButton = ({ handleDisconnect, address }: { handleDisconnect: Function, address?: string; }) => {
    return (
        <button
            onClick={() => handleDisconnect()}
            className={clsx(
                "rounded-md bg-white text-slate-900 py-2 px-4 h-max"
            )}>{address}</button>
    );
};
