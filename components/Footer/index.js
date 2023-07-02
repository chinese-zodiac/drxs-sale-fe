import React from 'react';
import { LINK_PRIVACY_POLICY, LINK_TERMS_OF_USE, SOCIAL_GITHUB, SOCIAL_TELEGRAM, SOCIAL_TWITTER } from '../../constants/social';

function Footer() {
  return (<footer id="footer" className="footer pb-7" style={{ position: "relative" }}>
    <div className="content has-text-centered">
      <div>
        <a className="m-2" href={SOCIAL_TELEGRAM} target="_blank">
          <span className="icon"><i className="fa-brands fa-telegram"></i></span>
        </a>
        <a className="m-2" href={SOCIAL_TWITTER} target="_blank">
          <span className="icon"><i className="fa-brands fa-twitter"></i></span>
        </a>
        <a className="m-2" href={SOCIAL_GITHUB} target="_blank">
          <span className="icon"><i className="fa-brands fa-github"></i></span>
        </a>
      </div>
      <p className='pb-6'>
        v0.1.10
      </p>
      <p>
        <a style={{ color: '#36CCEB' }} href={LINK_TERMS_OF_USE}>Terms of Use</a>
      </p>
      <p>
        <a style={{ color: '#36CCEB' }} href={LINK_PRIVACY_POLICY}>
          Privacy Policy
        </a>
      </p>
    </div>
  </footer>);
}

export default Footer;