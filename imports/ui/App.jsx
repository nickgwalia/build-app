import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import Web3 from 'web3'
import { withTracker } from 'meteor/react-meteor-data'
import { TOKEN_ABI, TOKEN_ADDRESS, CROWDSALE_ADDRESS, isAddress,
  getEthUsd, fetchAddressBalance, grabTransactionsForAddress, grabTokenInfo } from '../misc/ethtools'
import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import IntroExplainer from './IntroExplainer.jsx'
import { Referrals } from '../api/referrals'
import settings from '../../settings.json'

let abi = require('human-standard-token-abi')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  async componentWillMount() {
    // Get eth price here because we consider it constant and don't need to
    // change or reload it during the lifetime of this component being mounted,
    // hence it lives in state.
    EthTools.setUnit('ether')
    let ethPrice

    // Load eth price and ARCD token info for shits and giggles
    try {
      ethPrice = await getEthUsd()
      console.log('Got ethPrice:', ethPrice)
      this.setState({ethPrice})
      grabTokenInfo()
    } catch (error) {
      console.error('Error fetching ethPrice:', error)
    }
  }

  async handleSubmitCode(event) {
    event.preventDefault()

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInputCode).value.trim()

    try {
      await Meteor.callPromise('referrals.referralClaimed', text)
      console.log('Successfully processed referral code.')
    } catch (error) {
      console.error('Error claiming referral code:', error)
      alert('Error finding this referral code, are you sure it\'s valid?')

      // Clear form (no need to do this if it succeeds since the form will
      // disappear).
      ReactDOM.findDOMNode(this.refs.textInputCode).value = ''
    }
  }

  async setEthAddress(address) {
    if (!isAddress(address)) {
      alert('Invalid ethereum address.')
      return false
    }

    try {
      await Meteor.callPromise('users.setEthAddress', address)
    } catch (error) {
      console.error('Error setting eth address:', error)
      alert('An error occurred setting your eth address.')
    }
  }


  async fromWei (value) {
    const localWeb3 = new Web3(window.web3.currentProvider)
    return localWeb3.eth.fromWei(value)
  }

  async componentWillReceiveProps() {
    // Load user's eth balance
    try {
      const
        ethAddress = Meteor.user() && Meteor.user().ethereum && Meteor.user().ethereum.address,
        ethBalance = (ethAddress && await fetchAddressBalance(ethAddress)) || 0
      console.log("Got ethBalance:", ethBalance)
      this.setState({ethBalance})
    } catch (error) {
      console.error('Error fetching ethBalance:', error)
    }
  }

  async readWeb3WalletAddress() {
    if (!(window.web3 && window.web3.currentProvider)) {
      console.error('web3 not detected')
      return alert('Error connecting to Metamask, is it installed?')
    }

    const localWeb3 = new Web3(window.web3.currentProvider)

    if (!(localWeb3.eth && localWeb3.eth.accounts.length && localWeb3.eth.accounts[0])) {
      console.error('web3 detected but web3.eth.defaultAccount is missing')
      return alert('Unable to read wallet address. Please login to Metamask then reload page.')
    }

    const account = localWeb3.eth.accounts[0]
    console.log('Detected wallet address from web3:', account)
    return account
  }

  render() {
    console.log('State: ', this.state)
    console.log('Props: ', this.props)
    console.log('Current user is:', this.props.currentUser)
    console.log('Referred is:', this.props.referred)

    // Must already be running inside an ETH browser such as Metamask.
    if (typeof web3 === 'undefined') {
      return (
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-6" style={{margin: '40px 0'}}>
              <h2 style={{marginBottom: '25px'}}>Arcade City Builders</h2>
              <div>
                Please install an Ethereum browser such as Metamask
                to use this application.
                <br /><br />
                Note that Metamask does not currently work on mobile devices. Try using Chrome on a desktop computer.
                <br /><br /><br />
                <center><a href="https://metamask.io/" target="_blank"><img src={"/download-metamask.png"} style={{maxWidth: 400}}/></a></center>
              </div>
            </div>
          </div>
        </div>
      )
    }


    const currentUser = this.props.currentUser,
      ethPrice = this.state && this.state.ethPrice || 0,
      ethBalance = this.state && this.state.ethBalance || 0,
      bountyInEth = EthTools.formatBalance(settings.reward.wei, '0,0.0[00] unit'),
      ethNetwork = settings.eth.network,
      bountyWalletAddress = settings.eth[ethNetwork].walletPubkey
    let ethAddress, referrals, referred, ethUsdValue, ethBalanceFormatted, bountyUsdValue

    if (ethPrice) {
      bountyUsdValue = (parseFloat(ethPrice) * parseFloat(EthTools.formatBalance(settings.reward.wei))).toFixed(2)
      console.log('bounty usd value:', bountyUsdValue)
    }

    if (currentUser) {
      ethAddress = currentUser && currentUser.ethereum && currentUser.ethereum.address
      ethBalanceFormatted = EthTools.formatBalance(ethBalance, '0,0.0[00] unit')
      if (ethBalance && ethPrice)
        ethUsdValue = (parseFloat(ethPrice) * parseFloat(EthTools.formatBalance(ethBalance))).toFixed(2)
      else
        ethUsdValue = '...'
      referrals = currentUser.referrals
      referred = this.props.referred && this.props.referred.referred || []
    }

    return (
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-8" style={{margin: '40px 0'}}>
            <div className="row">
              <div className="col-md-6">
                <h2>Build Arcade City</h2>
              </div>
              <div className="col-md-6" style={{marginTop: '5px'}}>
                <AccountsUIWrapper/>
              </div>
            </div>

            <div>
              {!currentUser ? <IntroExplainer/> : (
                <div>
                  {
                    // Only show the "enter referral code" form to users who haven't
                    // already entered one.
                    (referrals && referrals.referredBy) ? null :
                      <div>
                        <hr />
                        <p>Enter referral code:</p>
                        <form className="new-task" onSubmit={this.handleSubmitCode.bind(this)} >
                          <input
                            type="text"
                            ref="textInputCode"
                            className="form-control mp-refinput"
                            placeholder="Enter referral code and press enter."
                          />
                        </form>
                      </div>
                  }

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )

  }
}

App.propTypes = {
  currentUser: PropTypes.object,
  referred: PropTypes.object,
}

export default withTracker(props => {
  // Get extended user data from the server
  Meteor.subscribe('userData')
  Meteor.subscribe('referrals')

  // User, and data tied to user balance, change hence they live in props not state
  return {
    currentUser: Meteor.user(),
    referred: Referrals.findOne({userId: Meteor.userId()})
  }
})(App)
