import { formatEther } from '@ethersproject/units'
import { shortenAddress, useEtherBalance, useEthers, useLookupAddress, useTokenBalance } from '@usedapp/core'
import WalletConnectProvider from '@walletconnect/web3-provider'
import React, { useEffect, useState } from 'react'
import Web3Modal, { getInjectedProvider } from 'web3modal'
import { ADDRESS_BUSD, ADDRESS_CZUSD, ADDRESS_USDC, ADDRESS_USDT } from '../../constants/addresses'
import { AccountModal } from '../AccountModal'

const Web3ModalButton = () => {
  const { account, activate, deactivate, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  const czusdBal = useTokenBalance(ADDRESS_CZUSD, account);
  const usdtBal  = useTokenBalance(ADDRESS_USDT, account);

  const ens = useLookupAddress();
  const [showModal, setShowModal] = useState(false);
  const [activateError, setActivateError] = useState('');
  const { error } = useEthers();
  useEffect(() => {
    if (error) {
      console.log(error);
      setActivateError(error.message)
    }
  }, [error])

  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      }
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    })
    try {
      const injectedProvider = getInjectedProvider();
      console.log(injectedProvider);
      if(injectedProvider) {
        const provider = await web3Modal.connect()
        await activate(provider)
        setActivateError('')
      } else {
        setActivateError('No BSC wallet found. Use your wallet dapp browser, or install a browser extension like MetaMask.')
      }
    } catch (error: any) {
      setActivateError(error.message)
    }
  }

  return (
    <div className="container has-text-right mr-5 mt-3 pb-3">
      {showModal && <AccountModal setShowModal={setShowModal} />}
    {activateError && (
        <div 
            className="message is-inline-block mt-2 color-primary pb-0 pt-1 pr-3 pl-3 is-small mb-0" 
            >
            {activateError}
        </div>
    )}
      {account ? (
        <>
        
          <div className="is-size-7 pl-3" style={{float:"right"}}>
          <b>Your wallet</b><br/>{ens ?? shortenAddress(account)}<br/>
          {!!etherBalance ? Number(formatEther(etherBalance)).toFixed(2) : "..."} BNB<br/>
          {!!czusdBal ? Number(formatEther(czusdBal)).toFixed(0) : "..."} CZUSD<br/>
          {!!usdtBal ? Number(formatEther(usdtBal)).toFixed(0) : "..."} USDT<br/>
          </div>
        <button className="button is-inline-block ml-2 is-small is-dark is-rounded" style={{marginTop:"3px",paddingTop:"6px"}} onClick={() => deactivate()}>Disconnect</button><br/>
        {chainId && chainId == 56 ? (<div style={{color:"orange"}}
            className="message is-inline-block mt-0 is-warning-dark  pb-0 pt-1 pr-3 pl-3 is-small mb-0 ml-2" 
        >BSC</div>) : (
            <div 
                className="message is-inline-block mt-0 is-warning has-text-danger-dark has-background-warning pb-0 pt-1 pr-3 pl-3 is-small mb-0 ml-2" 
            >BSC Not Connected</div>
        )}
        </>
      ) : (
        <button className="button is-inline-block ml-2 is-small is-dark is-rounded" style={{marginTop:"3px",paddingTop:"6px"}}  onClick={activateProvider}>Connect</button>
      )}
    </div>
  )
}

export default Web3ModalButton;