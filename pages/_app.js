import { BSC, DAppProvider } from '@usedapp/core';
import App from 'next/app';
import Head from 'next/head';
import { withRouter } from 'next/router';
import React from 'react';
import '../public/static/assets/fonts/stylesheet.css';
import Favicon from '../public/static/assets/logo.png';
import OpenGraphImg from '../public/static/assets/opengraph.jpg';
import '../styles/styles.scss';

const config = {
  readOnlyChainId: BSC.chainId,
  readOnlyUrls: {
    [BSC.chainId]: 'https://bscrpc.com'
  },
  networks: [BSC]
}

class MyApp extends App {
  static async getInitialProps(props) {
    const { Component, ctx } = props;
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <DAppProvider config={config}>
        <Head>
          <title>DRXS Private Sale | Early access, DRX DAO and Network NFT (grow your DRX Network and earn rewards worth $250)</title>
          <meta name="description" content="DRXS Private Sale | Early access, DRX DAO and Network NFT (grow your DRX Network and earn rewards worth $250)" />
          <meta name="robots" content="index, follow"></meta>
          <meta property="og:locale" content="en_EN" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="HandheldFriendly" content="true"></meta>
          <link
            rel="shortcut icon"
            type="image/png"
            href={Favicon}
          />

          <meta property="og:title" content="DRXS Private Sale | Early access, DRX DAO and Network NFT (grow your DRX Network and earn rewards worth $250)" />
          <meta property="og:site_name" content="DRXS Private Sale" />
          <meta property="og:url" content="https://drxs.cz.cash/" />
          <meta property="og:description" content="DRXS Private Sale | Early access, DRX DAO and Network NFT (grow your DRX Network and earn rewards worth $250)" />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={"https://drxs.cz.cash" + OpenGraphImg} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="https://drxs.cz.cash/" />
          <meta name="twitter:title" content="DRXS Private Sale | Early access, DRX DAO and Network NFT (grow your DRX Network and earn rewards worth $250)" />
          <meta name="twitter:image" content={"https://drxs.cz.cash/" + OpenGraphImg} />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="630" />
          <meta name="twitter:description" content="DRXS Private Sale | Early access, DRX DAO and Network NFT (grow your DRX Network and earn rewards worth $250)" />


        </Head>
        <Component {...pageProps} />
      </DAppProvider>
    );
  }
}

export default withRouter(MyApp);
