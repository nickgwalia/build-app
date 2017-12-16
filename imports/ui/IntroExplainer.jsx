import React, { Component } from 'react'

export default class IntroExplainer extends Component {

  render() {
    return (
      <div>
        <h3 style={{marginTop: '60px'}}>Psst. Want some ether?</h3>
        <p>This is a livenet test of our Ethereum reward pool for Arcade City user referrals.</p>
        <p>The idea: Instantly pay Arcade City users cryptocurrency for referring a new user to our app. For now the reward is in ether (ETH), and soon will be our ERC-20 <strong>Arcade Token</strong>.</p>
        <p>Our test on the Ropsten testnet worked well, so now we're pushing this live to test with real ETH. Next we'll integrate this into our v2.1 mobile app, release scheduled for early November.</p>
        <p>Unlike our previous test, you can't input an arbitrary ethereum address. You need the <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank">MetaMask Chrome Plugin</a> installed, and the app will populate your ethereum address from there once you are logged in.</p>
        <p>To get your referral code, you first need to input someone else's. If you're here because someone referred you, use the code they gave you. If not, find a code in our community FB group <a href="https://www.facebook.com/groups/ArcadeCitySquare/" target="_blank">Arcade City Square</a>.</p>
        <p>When someone uses your referral code, you'll instantly be sent 0.001 ETH, and you'll see their name in your list of referrals.</p>
        <p>Any questions or issues please post in <a href="https://www.facebook.com/groups/ArcadeCitySquare/" target="_blank">Arcade City Square</a>.</p>
        <center><a href="https://metamask.io/" target="_blank"><img src="download-metamask.png" width="400"/></a></center>
      </div>
    )
  }
}
