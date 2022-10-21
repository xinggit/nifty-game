import React, {Component} from 'react';
import Web3 from 'web3';
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Slide from '@material-ui/core/Slide';
import Button from "@material-ui/core/Button";

const messages = {
  'LOAD_MATAMASK_WALLET_ERROR': 'Load metamask wallet error, maybe try Metamask later, or upload a wallet json file.',
  'EMPTY_METAMASK_ACCOUNT': 'You can choose one MetaMask wallet by unlocking it',
  'METAMASK_ACCOUNT': 'You have choosen the MetamMask Wallet: ',
  'NETWORK_ERROR': 'Network error, please check it.',
  'METAMASK_NOT_INSTALL': 'You must install MetaMask before start.',
  'METAMASK_TEST_NET': 'Our game is available on Ropsten Test Network only. Please switch via MetaMask!'
};

const MetaMaskInstallDialog = (props) => (
  <Dialog
    className="MetaMaskDialog"
    open={props.metaMaskInstallDialogOpen}
    transition={Slide}>
    <DialogTitle>{"Oops, you haven't installed MetaMask"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {"What is MetaMask? "}
        <a href="https://metamask.io/" target="_blank">Link</a>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button raised href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-ntp-icon" color="primary">
        Install MetaMask
      </Button>
      <Button raised onClick={props.handleMetaMaskInstallDialogClose} color="primary">
        I understand, continue
      </Button>
    </DialogActions>
  </Dialog>
);

const MetaMaskLockDialog = (props) => (
  <Dialog
    className="MetaMaskDialog"
    open={props.metaMaskLockDialogOpen}
    transition={Slide}>
    <DialogTitle>{"Oops, your MetaMask is locked"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {props.message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button raised onClick={props.handleMetaMaskLockDialogClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export class MetaMask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      metaMaskInstallDialogOpen: false,
      metaMaskLockDialogOpen: false,
      disableDialog: false
    };
    this.handleMetaMaskInstallDialogClose = this.handleMetaMaskInstallDialogClose.bind(this);
    this.handleMetaMaskLockDialogClose = this.handleMetaMaskLockDialogClose.bind(this);
  }

  fetchWeb3() {
    let web3 = window.web3;
    if (typeof web3 === 'undefined') {
      this.props.setWeb3(null);
      this.setState({message: messages.METAMASK_NOT_INSTALL});
    }
  }

  fetchAccounts() {
    //const { web3 } = window;
    if (this.props.web3 !== null) {

      this.props.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          this.setState({message: messages.LOAD_MATAMASK_WALLET_ERROR});
        } else {
          if (accounts.length === 0) {
            this.props.handleMetaMaskAccount(null);
            this.setState({metaMaskLockDialogOpen: true, message: messages.EMPTY_METAMASK_ACCOUNT})
          } else {
            // if account changed then change redux state
            if (accounts[0] !== this.props.metaMask.account) {
              this.props.handleMetaMaskAccount(accounts[0]);
              console.log("accounts: " + accounts[0])
            }
          }
        }
      });
    }
  }

  fetchNetwork() {
    //const { web3 } = window;
    if (this.props.web3 !== null) {
      this.props.web3.version.getNetwork((err, netId) => {
        if(netId === "1"){
          console.log('netId 113:',netId);
          this.props.handleMetaMaskNetwork(null);
          this.setState({metaMaskLockDialogOpen: true, message:messages.METAMASK_TEST_NET  });
        }

        
        if (err) {
          console.log('netId 120:',netId);
          this.props.handleMetaMaskNetwork(null);
          this.setState({metaMaskLockDialogOpen: true, message: messages.NETWORK_ERROR });
        } else {
          console.log('netId 124:',netId);
          // if network changed then change redux state
          if (netId !== this.props.metaMask.network) {
            console.log('netId 127:',netId);
            this.props.handleMetaMaskNetwork(netId);
          }
        }
      });
    }
  }



  componentDidMount() {
    let self = this;
    window.addEventListener('load', function() {
      let web3 = window.web3;
      var web3Provider;
      console.log("window.ethereum: ", window.ethereum);
      if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
          // 请求用户授权
          window.ethereum.enable();
        } catch (error) {
          // 用户不授权时
          console.error("User denied account access")
        }
      } else if (window.web3) {   // 老版 MetaMask Legacy dapp browsers...
        web3Provider = window.web3.currentProvider;
      } else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      web3 = new Web3(web3Provider);//web3js就是你需要的web3实例



      if (typeof web3 !== 'undefined') {
        window.web3 = web3;
        self.props.setWeb3(window.web3);
        self.fetchAccounts();
        self.fetchNetwork();
        self.Web3Interval = setInterval(() => self.fetchWeb3(), 1000);
        self.AccountInterval = setInterval(() => self.fetchAccounts(), 1000);
        self.NetworkInterval = setInterval(() => self.fetchNetwork(),  1000);
      } else {
        self.setState({metaMaskInstallDialogOpen: true, message: messages.METAMASK_NOT_INSTALL});
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.Web3Interval);
    clearInterval(this.AccountInterval);
    clearInterval(this.NetworkInterval);
  }

  handleMetaMaskInstallDialogClose() {
    this.setState({metaMaskInstallDialogOpen: false, disableDialog: true});
  }

  handleMetaMaskLockDialogClose() {
    this.setState({metaMaskLockDialogOpen: false, disableDialog: true});
  }

  render() {
    const metaMaskInstall = this.state.disableDialog === false &&
      <MetaMaskInstallDialog 
        {...this.state}
        handleMetaMaskInstallDialogClose={this.handleMetaMaskInstallDialogClose}
      />;

    const metaMaskLock = this.state.disableDialog === false && 
      <MetaMaskLockDialog 
        {...this.state}
        handleMetaMaskLockDialogClose={this.handleMetaMaskLockDialogClose}
      />

    return (
      <div className="MetaMask">
        {metaMaskInstall}
        {metaMaskLock}
      </div>
    );
  }
}
