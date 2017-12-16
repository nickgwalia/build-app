import React, { Component } from 'react'

export default class IntroExplainer extends Component {

  render() {
    return (
      <div style={{marginTop: '10px'}}>
        <div className="justify-content-md-center" style={{margin: '25px 0', alignContent: 'center', display: 'flex', flexWrap: 'wrap'}}>
          <img src="/icon_img1.png" width="100" height="100" style={{marginRight: '25px'}} />
          <img src="/icon_img2.png" width="100" height="100" style={{marginRight: '25px'}} />
          <img src="/icon_img4.png" width="100" height="100" style={{marginRight: '25px'}} />
          <img src="/icon_img3.png" width="100" height="100" style={{marginRight: '25px'}} />
          <img src="/icon_img5.png" width="100" height="100" style={{marginRight: '25px'}} />
        </div>
        <p>Build your local Arcade City network. Get paid in Ether and Arcade Tokens.</p>
        <p>This requires the <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank">MetaMask Chrome Plugin</a>.</p>
        <p>To get your referral code, you first need to input someone else's. If you're here because someone referred you, use the code they gave you. If not, find a code in our community FB group <a href="https://www.facebook.com/groups/ArcadeCitySquare/" target="_blank">Arcade City Square</a>.</p>
        <p>When someone uses your referral code, you'll instantly be sent 0.001 ETH, and you'll see their name in your list of referrals.</p>
        <p>Any questions or issues please post in <a href="https://www.facebook.com/groups/ArcadeCitySquare/" target="_blank">Arcade City Square</a> or our <a href="https://arcadecitybuilders.slack.com" target="_blank">Slack channel</a>.</p>
        <div style={{marginTop: '35px'}}>
          <center><a href="https://metamask.io/" target="_blank"><img src="download-metamask.png" width="400"/></a></center>
        </div>
      </div>
    )
  }
}
