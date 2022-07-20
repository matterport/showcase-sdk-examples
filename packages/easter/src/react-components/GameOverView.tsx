import React, { Component } from 'react';
import { ISceneConfig } from '../interfaces';
import { shareWindow, ShareMedium, getShareUrls } from './urls';

interface Props {
  config: ISceneConfig,
}


export class GameOverView extends Component<Props, {}> {
  private urlFieldRef: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.onFacebookClicked = this.onFacebookClicked.bind(this);
    this.onTwitterClicked = this.onTwitterClicked.bind(this);
    this.onLinkedinClicked = this.onLinkedinClicked.bind(this);
    this.onPinterestClicked = this.onPinterestClicked.bind(this);
    this.onEmailClicked = this.onEmailClicked.bind(this);
    this.onCopy = this.onCopy.bind(this);
  }

  private onFacebookClicked() {
     this.openShareWindow(ShareMedium.FACEBOOK);
  }

  private onTwitterClicked() {
    this.openShareWindow(ShareMedium.TWITTER);
  }

  private onLinkedinClicked() {
    this.openShareWindow(ShareMedium.LINKEDIN);
  }

  private onPinterestClicked() {
    this.openShareWindow(ShareMedium.PINTEREST);
  }

  private onEmailClicked() {
    this.openShareWindow(ShareMedium.MAIL)
  }

  private onCopy() {
    this.urlFieldRef.select();
    document.execCommand('copy');
    window.getSelection()!.removeAllRanges();
    this.urlFieldRef.blur();
  }

  private openShareWindow = (shareMedium: ShareMedium) => {
    const { width, height } = shareWindow[shareMedium];
    const urls = getShareUrls(window.location.href, 'title', 'image');
    const shareUrl = urls[shareMedium];
    let windowProperties;

    if (width && height) {
      const popupTop = window.screenY + (window.innerHeight - height) / 2;
      const popupLeft = window.screenX + (window.innerWidth - width) / 2;
      windowProperties = 'top=' + popupTop + ',left=' + popupLeft + ',width=' + width + ',height=' + height;
    }

    window.open(shareUrl, '', windowProperties);
  }

  render() {
    const url = window.location.href;

    return (
      <div className='overlay-container game-over'>
        <div className='text-wrapper'>
          <div className='title'>Congratulations, you found all the hidden bunnies!</div>
          <div className='description'>Be sure to click and share this activity with your friends and help us reach our goal of $5,000 for United Way NYC! &nbsp;&nbsp;
            <a href='https://matterport.com/blog/tumble-down-rabbit-hole-immersed-wonderland' target="_blank">Click here to learn more.</a>
          </div>

          <div className='link-item-container'>
            <div className='link-item'>
              <div className='link-background' onClick={this.onFacebookClicked}>
                <img className='link-icon' src='./assets/facebook.svg'></img>
              </div>
            </div>
            <div className='link-item'>
              <div className='link-background' onClick={this.onTwitterClicked}>
                <img className='link-icon' src='./assets/twitter.svg'></img>
              </div>
            </div>
            <div className='link-item'>
              <div className='link-background' onClick={this.onLinkedinClicked}>
                <img className='link-icon' src='./assets/linkedin.svg'></img>
              </div>
            </div>
            <div className='link-item'>
              <div className='link-background' onClick={this.onPinterestClicked}>
                <img className='link-icon' src='./assets/pinterest.svg'></img>
              </div>
            </div>
            <div className='link-item'>
              <div className='link-background' onClick={this.onEmailClicked}>
                <img className='link-icon' src='./assets/email.svg'></img>
              </div>
            </div>
          </div>

          <div className='url-container'>
            <input
              className='url-string'
              type='text'
              readOnly
              value={url}
              ref={(ref) => {this.urlFieldRef = ref! as HTMLInputElement; }}
            />
            <button className='url-copy' onClick={this.onCopy}>COPY</button>
          </div>
        </div>
      </div>
    );
  }
}
