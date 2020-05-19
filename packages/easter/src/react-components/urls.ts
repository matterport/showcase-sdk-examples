import { Dict } from "@mp/core";

/* eslint-disable no-shadow */
export enum ShareMedium {
  MAIL = 'mail',
  PINTEREST = 'pinterest',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  COPYLINK = 'copylink',
  NATIVE = 'native',  /** Native sharing mechanism of host OS/device */
}
/* eslint-enable no-shadow */

const { FACEBOOK, TWITTER, MAIL, PINTEREST, LINKEDIN, COPYLINK, NATIVE } = ShareMedium;

// Shortcodes for each platform, used for &ref= URL tracking parameter
const refs = {
  [MAIL]: 'em',
  [PINTEREST]: 'pn',
  [LINKEDIN]: 'ln',
  [TWITTER]: 'tw',
  [FACEBOOK]: 'fb',
  [COPYLINK]: 'cp',
  [NATIVE]: 'os',
};

export const shareWindow: {
  [key in ShareMedium]: { width?: number, height?: number }
} = {
  [FACEBOOK]: {width: 626, height: 436},
  [TWITTER]: {width: 550, height: 440},
  [PINTEREST]: {width: 750, height: 749},
  [LINKEDIN]: {width: 550, height: 453},
  [COPYLINK]: {},
  [MAIL]: {},
  [NATIVE]: {},
};

/**
 * Build a query string from a dictionary of parameters
 * @param params
 */
const makeQueryString = (params: Dict<string>) => {
  return Object.keys(params).map((key) => key + '=' + encodeURIComponent(params[key])).join('&');
};

const shareText = 
`Ever dreamed of doing your #EasterEgg hunt in Wonderland? You can hunt for 10 bunnies in @immersedwonder by @AlexaMeadeArt. The Magical Bunny Adventure #virtual game launches tomorrow! @RoseWineMansion #HoppyEaster`;

/**
 * Build a URL for sharing a Showcase model on Facebook
 * @param showcaseUrl
 * @param title
 * @param locale
 */
const makeFacebookUrl = (showcaseUrl: string, title: string): string => {
  const baseUrl = 'http://www.facebook.com/sharer.php';
  // const baseUrl = `http://www.facebook.com/sharer.php?display=popup&u=${window.location.href}?ref=fb&m=${ModelSid}`;
  const sharedUrl = `${showcaseUrl}?ref=${refs[FACEBOOK]}`;
  const params = {
    display: 'popup',
    u: sharedUrl,
  };
  return `${baseUrl}?${makeQueryString(params)}`;
};

/**
 * Build a URL for sharing a Showcase model on Twitter
 * @param showcaseUrl
 * @param title
 * @param locale
 */
const makeTwitterUrl = (showcaseUrl: string, title: string): string => {
  const baseUrl = 'http://twitter.com/intent/tweet';
  const sharedUrl = `${shareText}\n${showcaseUrl}?ref=${refs[TWITTER]}`;
  const params = {
    text: `${sharedUrl}`,
  };

  return `${baseUrl}?${makeQueryString(params)}`;
};

const line1 = `Looking for some fun this easter?`;
const line2 = `Join us for a Magical Bunny Adventure`;
const line3 = `Find the 10 hidden bunnies throughout Alexa Meade's dreamscape: Immersed Wonderland in this 3D interactive game! Share the fun and help those most vulnerable during the Covid-19 crisis.`;
const line4 = `Visit our blog page to learn more.`
const blogLink = `https://matterport.com/blog/tumble-down-rabbit-hole-immersed-wonderland`;
/**
 * Build a URL for sharing a Showcase model via Email
 * @param showcaseUrl
 * @param title
 * @param locale
 */
const makeEmailUrl = (showcaseUrl: string, title: string): string => {
  const baseUrl = 'mailto:';
  const sharedUrl = `${showcaseUrl}?ref=${refs[MAIL]}&`;
  const params = {
    subject: 'Magic Bunny Adventure Immersive Game',
    body: `${line1} ${'\n'}${'\n'} ${line2} ${'\n'} ${sharedUrl} ${'\n'}${'\n'} ${line3} ${'\n'}${'\n'} ${line4}${'\n'}${blogLink}`,
  };

  return `${baseUrl}?${makeQueryString(params)}`;
};

/**
 * Build a URL for sharing a Showcase model via Pinterest
 * @param showcaseUrl
 * @param title
 * @param locale
 */
const makePinterestUrl = (showcaseUrl: string, title: string, image: string): string => {
  const baseUrl = 'http://pinterest.com/pin/create/link/';
  const sharedUrl = `${showcaseUrl}?ref=${refs[PINTEREST]}`;
  const params = {
    url: sharedUrl,
    description: 'Play the Magic Bunny Adventure Game',
  };

  return `${baseUrl}?${makeQueryString(params)}`;
};

/**
 * Build a URL for sharing a Showcase model via LinkedIn
 * @param showcaseUrl
 * @param title
 * @param locale
 */
const makeLinkedInUrl = (showcaseUrl: string, title: string): string => {
  const baseUrl = 'https://www.linkedin.com/shareArticle';
  const sharedUrl = `${showcaseUrl}?ref=${refs[LINKEDIN]}`;
  const params = {
    mini: 'true',
    url: sharedUrl,
  };

  return `${baseUrl}?${makeQueryString(params)}`;
};

/**
 * Returns a dictionary of web share URLs for every supported ShareMedium
 * @param showcaseUrl Showcase player url
 * @param title Model title
 * @param image Model thumbnail image
 * @param locale Locale module for translation
 */
export const getShareUrls = (showcaseUrl: string, title: string, image: string) => {
  const urls: {[key in ShareMedium]: string} = {
    [FACEBOOK]: makeFacebookUrl(showcaseUrl, title),
    [TWITTER]: makeTwitterUrl(showcaseUrl, title),
    [MAIL]: makeEmailUrl(showcaseUrl, title),
    [PINTEREST]: makePinterestUrl(showcaseUrl, title, image),
    [LINKEDIN]: makeLinkedInUrl(showcaseUrl, title),
    // intentionally not adding &ref= to copied URLs or native sharing
    [COPYLINK]: showcaseUrl,
    [NATIVE]: showcaseUrl,
  };
  return urls;
};
