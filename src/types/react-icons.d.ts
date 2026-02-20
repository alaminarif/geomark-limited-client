declare module 'react-icons/fa6' {
  import { IconType } from 'react-icons';
  export const FaDiscord: IconType;
  export const FaGithub: IconType;
  export const FaLinkedin: IconType;
  export const FaXTwitter: IconType;
  export const FaFacebook: IconType;
  export const FaInstagram: IconType;
  export const FaTwitter: IconType;
  export const FaYoutube: IconType;
  export const FaTiktok: IconType;
  export const FaReddit: IconType;
  export const FaPinterest: IconType;
  export const FaSnapchat: IconType;
  export const FaWhatsapp: IconType;
  export const FaTelegram: IconType;
  export const FaViber: IconType;
  export const FaSignal: IconType;
  export const FaSkype: IconType;
  export const FaSlack: IconType;
  export const FaMastodon: IconType;
  export const FaBluesky: IconType;
  export const FaThreads: IconType;
  export const FaBereal: IconType;
  [key: string]: IconType;
}

declare module 'react-icons' {
  import { FC, SVGProps } from 'react';

  type IconType = FC<SVGProps<SVGSVGElement>>;
  export type { IconType };
}
