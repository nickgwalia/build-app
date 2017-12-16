import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import Web3 from 'web3'
import { withTracker } from 'meteor/react-meteor-data'

import { TOKEN_ABI, TOKEN_ADDRESS, CROWDSALE_ADDRESS, isAddress,
  getEthUsd, fetchAddressBalance, grabTransactionsForAddress, grabTokenInfo } from '../misc/ethtools'
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

  async fromWei (value) {
    const localWeb3 = new Web3(window.web3.currentProvider)
    return localWeb3.eth.fromWei(value)
  }

  async componentWillReceiveProps() {
    // Load user's eth balance
    try {
      const
        ethAddress = Meteor.user() && Meteor.user().ethereum && Meteor.user().ethereum.address,
        ethBalance = (ethAddress && await fetchAddressBalance(ethAddress)) || 0;
      console.log("Got ethBalance:", ethBalance);
      this.setState({ethBalance});
    } catch (error) {
      console.error('Error fetching ethBalance:', error);
    }
  }

  async readWeb3WalletAddress() {
    if (!(window.web3 && window.web3.currentProvider)) {
      console.error('web3 not detected');
      return alert('Error connecting to Metamask, is it installed?');
    }

    const localWeb3 = new Web3(window.web3.currentProvider);

    if (!(localWeb3.eth && localWeb3.eth.accounts.length && localWeb3.eth.accounts[0])) {
      console.error('web3 detected but web3.eth.defaultAccount is missing');
      return alert('Unable to read wallet address. Please login to Metamask then reload page.');
    }

    const account = localWeb3.eth.accounts[0];
    console.log('Detected wallet address from web3:', account);
    return account;
  }

  render() {
    console.log('State: ', this.state)
    console.log('Props: ', this.props)

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
      );
    }

    return (
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-8" style={{margin: '40px 0'}}>
            <h2 style={{marginBottom: '25px'}}>Arcade City Builders</h2>
            <p>Log in</p>
          </div>
        </div>
      </div>
    )
  }
}

export default withTracker(props => {
  // Meteor.subscribe('transactions')
  //
  // return {
  //   txs: Transactions.find().fetch(),
  // }
  return {

  }
})(App)
