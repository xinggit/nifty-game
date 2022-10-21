import React, { Component } from 'react';
import classnames from 'classnames/bind';
import cardtitle from '../../images/cardtitle.png';
import style from './Card.css';
import { getCryptoHerosTokenAddress } from '../../lib/web3Service';
import axios from 'axios';
import LoadingCoin from '../LoadingCoin';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'


const cx = classnames.bind(style);


function ipfsUrl(hash) {
  if (Math.floor(Math.random() * 10 + 1) % 4 === 0) {
    return "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F14144900367%2F641&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668965480&t=95915f1ffe5d50fbb55dbc06f957f6ed";
  } else if (Math.floor(Math.random() * 10 + 1) % 4 === 1) {
    return "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F14144900587%2F641&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668965480&t=78d313a1eb27ce947ca850bc18a400fc";
  } else if (Math.floor(Math.random() * 10 + 1) % 4 === 2) {
    return "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F14144900643%2F641.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668965480&t=dfe3954baab69abe9188e6716515bb94";
  } else if (Math.floor(Math.random() * 10 + 1) % 4 === 3) {
    return "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fx0.ifengimg.com%2Fres%2F2021%2F136457B3CFE5FACB8A03B11906CA5FFA10A267B5_size37_w700_h601.jpeg&refer=http%3A%2F%2Fx0.ifengimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668965480&t=f51882d15bc6bde4213a6bac8a244cb3";
  }
  else {
    return "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F14144900367%2F641&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668965480&t=95915f1ffe5d50fbb55dbc06f957f6ed";
  }
}

const ErrorAlertDialog = (props) => (
  <Dialog
    open={props.isOpenAlert}
    onClose={props.handleAlertClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {props.errmsg}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleAlertClose} color="primary" autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

class Card extends Component {

  state = {
    doMintTx: '',
    isLoading: false,
    isOpenAlert: false,
    errmsg: '',
  }

  handleClickAlertOpen = () => {
    this.setState({ isOpenAlert: true });
  }

  handleAlertClose = () => {
    this.setState({ isOpenAlert: false });
  }

  CreateHero = async() =>{
    const{doMint} = this.props;
    const result = await doMint();
    this.setState({'doMintTx': result, isLoading: true},()=>{
      this.handleSubmitMetaMask(this.state.doMintTx);
    })
  }

  handleSubmitMetaMask =(doMintTx)=>{
    const {account, network} = this.props.metaMask;
    const {web3} = this.props;
    
    const msk = {
      from: account,
      to: getCryptoHerosTokenAddress(network),
      value: this.props.web3.toWei(0.01, 'ether'),
      data: doMintTx
    }

    console.log("card:80 msk: " + msk);
    console.log(msk);

    web3.eth.sendTransaction(msk, this.handleMetaMaskCallBack);
    
  }

  handleMetaMaskCallBack = (err, result)=>{

    if(err) {
      this.setState({errmsg: 'Sorry, transaction failed'}, ()=> this.setState({isOpenAlert: true}));
      console.error('MetaMask Error:', err.message);
      this.setState({isLoading: false});
      return;
    } else {
      console.log("hello world card:92")
    }

    const tx = result;
    let t = setInterval(async ()=>{
      let url = `https://api-ropsten.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${tx}&apikey=RAADZVN65BQA7G839DFN3VHWCZBQMRBR11`;
      console.log("card: 101, url: " + url);
      const result = await axios.get(url);

      if(result.data.status === "1") {
        this.ReloadDataFn();
        window.clearInterval(t);
      }
      console.log("result.data.result.status: " + result.data.result.status)

    },3000);
  }

  ReloadDataFn =()=>{
    const {network, account} = this.props.metaMask;
    console.log("card:116");
    //抓卡牌編號
    this.props.handleCryptoHerosTokenGetOwnedTokens(network, account, this.props.TimeOutGoTokens);
    setTimeout(() => {
      this.setState({isLoading: false},()=> this.props.gotoAndPlayGame());
    }, 6000);
  }

  render() {
    const {brandItem, isGetCardPage, closeMyCard} = this.props;

    const alertMsg = this.state.isOpenAlert && 
      <ErrorAlertDialog 
        {...this.state} 
        handleAlertClose={this.handleAlertClose}
    />;

    return (
      <div className={cx('Card', {open: isGetCardPage})}>
        
        <div className="cloud_card1"></div>
        <div className="cloud_card2"></div>

        <div className="ui start1"></div>
        <div className="ui start2"></div>
        <div className="ui start3"></div>
        <div className="ui Elf1"></div>
        <div className="ui Elf2"></div>
        <div className="ui Elf3"></div>

        <div className="cardtitle">
          <img src={cardtitle} />
          <div className="btn_box">
            <a className="goback" onClick={closeMyCard}></a>
            <a className="getHero" onClick={this.CreateHero}></a>
          </div>
        </div>

        <div className="c_mid">
          {
            brandItem.map((obj, idx)=>{
              return (
                <div className="cardBox" key={idx}>
                  <div className="cardbg">
                    <div className="s_bgcard" style={{backgroundImage: `url("${ipfsUrl(obj[idx])}")` }}></div>
                  </div>
                </div>
              )
            })
          }
          <div className='addCardBtn'>
            <a onClick={this.CreateHero}></a>
          </div>
        </div>  
        {
          this.state.isLoading && <LoadingCoin/>
        }
        { alertMsg }
      </div>
    );
  }
}
export default Card;
