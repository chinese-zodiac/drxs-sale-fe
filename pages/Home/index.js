import { useCoingeckoPrice } from '@usedapp/coingecko';
import {
  useCall,
  useContractFunction,
  useEtherBalance,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from '@usedapp/core';
import { Contract, constants, utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import DggSaleAbi from '../../abi/DggSale.json';
import IERC20Abi from '../../abi/IERC20.json';
import Footer from '../../components/Footer';
import Web3ModalButton from '../../components/Web3ModalButton';
import {
  ADDRESS_BUSD,
  ADDRESS_CZUSD,
  ADDRESS_DGGSALE,
  ADDRESS_USDC,
  ADDRESS_USDT,
} from '../../constants/addresses';
import useCountdown from '../../hooks/useCountdown';
import PoweredByCz from '../../public/static/assets/images/poweredbycz.png';
import DggLogo from '../../public/static/assets/logo.png';
import BackgroundVideo from '../../public/static/assets/vids/bgv1.mp4';
import './index.module.scss';
const { formatEther, parseEther, Interface } = utils;

const DggSaleInterface = new Interface(DggSaleAbi);
const DggaleContract = new Contract(ADDRESS_DGGSALE, DggSaleInterface);

const Ierc20Interface = new Interface(IERC20Abi);
const CONTRACT_CZUSD = new Contract(ADDRESS_CZUSD, Ierc20Interface);
const CONTRACT_BUSD = new Contract(ADDRESS_BUSD, Ierc20Interface);
const CONTRACT_USDC = new Contract(ADDRESS_USDC, Ierc20Interface);
const CONTRACT_USDT = new Contract(ADDRESS_USDT, Ierc20Interface);

const displayWad = (wad) =>
  !!wad ? Number(formatEther(wad)).toFixed(2) : '...';

function Home() {
  const { account, library, chainId, activateBrowserWallet } = useEthers();
  const bnbPrice = useCoingeckoPrice('binancecoin');

  const accountBnbBal = useEtherBalance(account);

  const czusdBal = useTokenBalance(ADDRESS_CZUSD, account);
  const usdcBal = useTokenBalance(ADDRESS_USDC, account);
  const busdBal = useTokenBalance(ADDRESS_BUSD, account);
  const usdtBal = useTokenBalance(ADDRESS_USDT, account);

  const czusdAllow = useTokenAllowance(ADDRESS_CZUSD, account, ADDRESS_DGGSALE);
  const usdcAllow = useTokenAllowance(ADDRESS_USDC, account, ADDRESS_DGGSALE);
  const busdAllow = useTokenAllowance(ADDRESS_BUSD, account, ADDRESS_DGGSALE);
  const usdtAllow = useTokenAllowance(ADDRESS_USDT, account, ADDRESS_DGGSALE);

  const { state: stateCzusdApprove, send: sendCzusdApprove } =
    useContractFunction(CONTRACT_CZUSD, 'approve');
  const { state: stateBusdApprove, send: sendBusdApprove } =
    useContractFunction(CONTRACT_BUSD, 'approve');
  const { state: stateUsdcApprove, send: sendUsdcApprove } =
    useContractFunction(CONTRACT_USDC, 'approve');
  const { state: stateUsdtApprove, send: sendUsdtApprove } =
    useContractFunction(CONTRACT_USDT, 'approve');

  const { state: stateDepositBnb, send: sendDepositBnb } = useContractFunction(
    DggaleContract,
    'depositBnb'
  );
  const { state: stateDepositCzusd, send: sendDepositCzusd } =
    useContractFunction(DggaleContract, 'depositCzusd');
  const { state: stateDepositBusd, send: sendDepositBusd } =
    useContractFunction(DggaleContract, 'depositBusd');
  const { state: stateDepositUsdc, send: sendDepositUsdc } =
    useContractFunction(DggaleContract, 'depositUsdc');
  const { state: stateDepositUsdt, send: sendDepositUsdt } =
    useContractFunction(DggaleContract, 'depositUsdt');

  const [selectedStable, setSelectedStable] = useState('CZUSD');
  const [selectStableBal, setSelectedStableBal] = useState(czusdBal);
  const [isApproveNeeded, setIsApproveNeeded] = useState(false);

  const [depositBnbInput, setDepositBnbInput] = useState(0.1);
  const [depositUsdInput, setDepositUsdInput] = useState(20);

  const {
    value: [minDepositWad],
    error: minDepositWadError,
  } = useCall({
    contract: DggaleContract,
    method: 'minDepositWad',
    args: [],
  }) ?? { value: [] };

  const {
    value: [maxDepositWad],
    error: maxDepositWadError,
  } = useCall({
    contract: DggaleContract,
    method: 'maxDepositWad',
    args: [],
  }) ?? { value: [] };
  const {
    value: [hardcap],
    error: hardcapError,
  } = useCall({
    contract: DggaleContract,
    method: 'hardcap',
    args: [],
  }) ?? { value: [] };
  const {
    value: [totalDeposits],
    error: totalDepositsError,
  } = useCall({
    contract: DggaleContract,
    method: 'totalDeposits',
    args: [],
  }) ?? { value: [] };
  const {
    value: [startEpoch],
    error: startEpochError,
  } = useCall({
    contract: DggaleContract,
    method: 'startEpoch',
    args: [],
  }) ?? { value: [] };
  const {
    value: [endEpoch],
    error: endEpochError,
  } = useCall({
    contract: DggaleContract,
    method: 'endEpoch',
    args: [],
  }) ?? { value: [] };
  const {
    value: [depositedAmount],
    error: depositedAmountError,
  } = useCall({
    contract: DggaleContract,
    method: 'depositedAmount',
    args: [account],
  }) ?? { value: [] };

  const startEpochTimer = useCountdown(startEpoch, 'Started');
  const endEpochTimer = useCountdown(endEpoch, 'Ended');

  useEffect(() => {
    if (!account) {
      setSelectedStableBal(parseEther('0'));
      setIsApproveNeeded(false);
      return;
    }
    if (selectedStable == 'CZUSD') {
      setSelectedStableBal(czusdBal ?? parseEther('0'));
      setIsApproveNeeded(!!czusdAllow?.lt(czusdBal.add(1)));
    }
    if (selectedStable == 'USDT') {
      setSelectedStableBal(usdtBal ?? parseEther('0'));
      setIsApproveNeeded(!!usdtAllow?.lt(usdtBal.add(1)));
    }
    if (selectedStable == 'BUSD') {
      setSelectedStableBal(busdBal ?? parseEther('0'));
      setIsApproveNeeded(!!busdAllow?.lt(busdBal.add(1)));
    }
    if (selectedStable == 'USDC') {
      setSelectedStableBal(usdcBal ?? parseEther('0'));
      setIsApproveNeeded(!!usdcAllow?.lt(usdcBal.add(1)));
    }
  }, [
    selectedStable,
    czusdBal,
    czusdAllow,
    busdBal,
    busdAllow,
    usdcBal,
    usdcAllow,
    usdtAllow,
    usdtAllow,
    account,
  ]);

  return (
    <>
      <section
        id="top"
        className="hero has-text-centered"
        style={{ backgroundColor: '#09070b', minHeight: '85vh' }}
      >
        <video className="background-video" preload="none" autoPlay loop muted>
          <source src={BackgroundVideo} type="video/mp4" />
        </video>
        <div
          className="hero-head has-text-left pb-5 mt-0 pt-1"
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#09070b',
          }}
        >
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '1080px',
            }}
          >
            <div className="mt-3 pb-0 mb-0" style={{ float: 'left' }}>
              <a href="https://dojak.cz.cash/">
                <figure
                  className="image is-128x128 is-rounded m-0 is-pulled-left ml-2 mr-5 mb-0"
                  style={{
                    display: 'inline-block',
                    top: '2px',
                    position: 'relative',
                  }}
                >
                  <img src={DggLogo} />
                </figure>
              </a>
              <p className="title ml-5 mt-4" style={{ color: '#36CCEB' }}>
                DRXS Private Sale
              </p>
              <p className="subtitle is-size-6 mr-5 " style={{ color: '#ddd' }}>
                {' '}
                Early access, DRX DAO and Network NFT (grow your DRX Network and
                earn rewards worth $250)
              </p>
            </div>
            <Web3ModalButton />
            <div className="is-clearfix"></div>
          </div>
        </div>
        <div
          className="hero-body p-0 m-0 pt-5 pb-5"
          style={{ color: '#ddd', position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.75)',
              position: 'absolute',
              top: '0',
              left: '0',
              bottom: '0',
              right: '0',
            }}
          />
          <div className="container has-text-centered">
            <h2 className="is-size-3 mt-3">
              PRIVATE SALE:
              <br /> Use <span style={{ color: '#36CCEB' }}>BNB</span> or{' '}
              <span style={{ color: '#32bc35' }}>STABLES</span>
            </h2>
            <div
              className="p-2"
              style={{
                maxWidth: '300px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <ul>
                <hr className="m-2 has-background-primary" />
                <li style={{ textShadow: '0px 0px 4px black' }}>1 DRXS = $1</li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Softcap: 10000 USD
                </li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Hardcap: {displayWad(hardcap)} USD
                </li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Total Deposits: {displayWad(totalDeposits)} USD
                </li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Wallet Max: {displayWad(maxDepositWad)} USD
                </li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Wallet Min: {displayWad(minDepositWad)} USD
                </li>
                <hr className="m-2 has-background-primary" />
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Launch Timers
                </li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Start Timer: {startEpochTimer}
                </li>
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  End Timer: {endEpochTimer}
                </li>
                <hr className="m-2 has-background-primary" />
                <li style={{ textShadow: '0px 0px 4px black' }}>
                  Your Deposit: {displayWad(depositedAmount)} USD
                </li>
                <hr className="m-2 has-background-primary" />
              </ul>
            </div>
            <div className="mt-6 is-inline-block">
              <input
                id="amountEtherInput"
                name="amountEtherInput"
                type="number"
                className="mb-3 input is-normal"
                step="0.1"
                min="0"
                max="3"
                style={{
                  maxWidth: '70px',
                  border: 'solid 2px #09070b',
                  paddingRight: '3px',
                }}
                value={depositBnbInput}
                onChange={(event) => {
                  let inputNum = Number(event.target.value);
                  if (!Number.isFinite(inputNum)) return;
                  let minNum = !!minDepositWad
                    ? Number(
                        formatEther(
                          minDepositWad
                            .add(parseEther('5'))
                            .mul(100)
                            .div(Math.floor(Number(bnbPrice) * 100))
                        )
                      )
                    : 0;
                  if (!!minDepositWad && inputNum < minNum) inputNum = minNum;
                  let maxNum = !!maxDepositWad
                    ? Number(
                        formatEther(
                          maxDepositWad
                            .sub(parseEther('5'))
                            .mul(100)
                            .div(Math.floor(Number(bnbPrice) * 100))
                        )
                      )
                    : 100;
                  if (!!maxDepositWad && inputNum > maxNum) inputNum = maxNum;
                  inputNum = Math.round(inputNum * 100) / 100;
                  setDepositBnbInput(inputNum);
                }}
              />
              <span style={{ position: 'relative', top: '7px' }}>
                <span
                  style={{ textShadow: '0px 0px 4px black', marginLeft: '4px' }}
                >
                  BNB
                </span>
              </span>
              <br />
              <button
                className="is-size-6 button is-primary"
                style={{
                  color: !!account ? '#09070b' : '#444',
                  backgroundColor:
                    !!account &&
                    accountBnbBal?.gte(
                      parseEther(depositBnbInput?.toString() ?? '0')
                    )
                      ? '#36CCEB'
                      : '#555',
                  border: 'solid 4px #36CCEB',
                }}
                onClick={() => {
                  console.log(
                    (Number(bnbPrice) * depositBnbInput * 0.9).toString()
                  );
                  sendDepositBnb(
                    parseEther(
                      Math.floor(
                        Number(bnbPrice) * depositBnbInput * 0.9
                      ).toString()
                    ),
                    { value: parseEther(depositBnbInput.toString()) }
                  );
                }}
              >
                DEPOSIT
              </button>
              <br />
            </div>
            <div className="is-inline-block m-3 is-size-3">OR</div>
            <div
              className="mt-6 is-inline-block "
              style={{ whiteSpace: 'nowrap' }}
            >
              <input
                id="amountEtherInput"
                name="amountEtherInput"
                type="number"
                className="mb-3 input is-normal"
                step="5"
                min="0"
                max="850"
                style={{
                  maxWidth: '70px',
                  border: 'solid 2px #09070b',
                  paddingRight: '3px',
                }}
                value={depositUsdInput}
                onChange={(event) => {
                  let inputNum = Number(event.target.value);
                  if (!Number.isFinite(inputNum)) return;
                  let minNum = !!minDepositWad
                    ? Number(formatEther(minDepositWad))
                    : 0;
                  if (!!minDepositWad && inputNum < minNum) inputNum = minNum;
                  let maxNum = !!maxDepositWad
                    ? Number(formatEther(maxDepositWad))
                    : 100;
                  if (!!maxDepositWad && inputNum > maxNum) inputNum = maxNum;
                  inputNum = Math.round(inputNum * 100) / 100;
                  setDepositUsdInput(inputNum);
                }}
              />
              <div
                className="select is-inline-block is-small ml-1"
                style={{ position: 'relative', top: '4px' }}
              >
                <select
                  name="Stablecoin"
                  style={{ paddingRight: '1.8em', paddingLeft: '0.3em' }}
                  value={selectedStable}
                  onChange={(event) => setSelectedStable(event.target.value)}
                >
                  <option value="CZUSD">CZUSD</option>
                  <option value="BUSD">BUSD</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
              <br />
              <button
                className="is-size-6 button is-primary"
                style={{
                  color: !!account ? '#09070b' : '#444',
                  backgroundColor:
                    isApproveNeeded ||
                    (!!account &&
                      selectStableBal?.gte(
                        parseEther(depositUsdInput?.toString() ?? '0')
                      ))
                      ? '#32bc35'
                      : '#555',
                  border: 'solid 4px #32bc35',
                }}
                onClick={() => {
                  const wad = parseEther(depositUsdInput.toString());
                  if (isApproveNeeded) {
                    console.log(
                      'Sending approve for',
                      selectedStable,
                      ADDRESS_DGGSALE
                    );
                    if (selectedStable == 'CZUSD')
                      sendCzusdApprove(ADDRESS_DGGSALE, constants.MaxUint256);
                    if (selectedStable == 'BUSD')
                      sendBusdApprove(ADDRESS_DGGSALE, constants.MaxUint256);
                    if (selectedStable == 'USDC')
                      sendUsdcApprove(ADDRESS_DGGSALE, constants.MaxUint256);
                    if (selectedStable == 'USDT')
                      sendUsdtApprove(ADDRESS_DGGSALE, constants.MaxUint256);
                  } else {
                    console.log('Doesnt need approve...');
                    if (selectedStable == 'CZUSD') sendDepositCzusd(wad);
                    if (selectedStable == 'BUSD') sendDepositBusd(wad);
                    if (selectedStable == 'USDC') sendDepositUsdc(wad);
                    if (selectedStable == 'USDT') sendDepositUsdt(wad);
                  }
                }}
              >
                {!!isApproveNeeded ? 'APPROVE' : 'DEPOSIT'}
              </button>
              <br />
            </div>
            <br />
            <figure
              className="image pt-3 pb-6 pt-6"
              style={{ display: 'inline-block', maxWidth: '120px' }}
            >
              <img src={PoweredByCz} />
            </figure>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
