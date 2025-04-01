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
    [BSC.chainId]: 'https://bsc.rpc.blxrbdn.com',
  },
  networks: [BSC],
};

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
          <title>
            Dojak Private Sale | Get in early and boost Dojak with Solana Liquidity
          </title>
          <meta
            name="description"
            content="Dojak Private Sale | Get in early and boost Dojak with Solana Liquidity"
          />
          <meta name="robots" content="index, follow"></meta>
          <meta property="og:locale" content="en_EN" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" type="image/png" href={Favicon} />

          <meta
            property="og:title"
            content="Dojak Private Sale | Get in early and boost Dojak with Solana Liquidity"
          />
          <meta property="og:site_name" content="Dojak Private Sale" />
          <meta property="og:url" content="https://dojak.cz.cash/" />
          <meta
            property="og:description"
            content="Dojak Private Sale | Get in early and boost Dojak with Solana Liquidity"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:image"
            content={'https://dojak.cz.cash' + OpenGraphImg}
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="https://dojak.cz.cash/" />
          <meta
            name="twitter:title"
            content="Dojak Private Sale | Get in early and boost Dojak with Solana Liquidity"
          />
          <meta
            name="twitter:image"
            content={'https://dojak.cz.cash/' + OpenGraphImg}
          />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="630" />
          <meta
            name="twitter:description"
            content="Dojak Private Sale | Get in early and boost Dojak with Solana Liquidity"
          />
        </Head>
        <Component {...pageProps} />
      </DAppProvider>
    );
  }
}

export default withRouter(MyApp);
