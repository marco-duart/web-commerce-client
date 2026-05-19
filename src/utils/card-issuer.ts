export type CardIssuer = 'visa' | 'mastercard' | 'amex' | 'diners' | 'discover' | 'jcb' | 'unionpay' | 'maestro' | 'elo' | 'hipercard' | 'default';

export interface CardStyle {
  gradient: string;
  textColor: string;
  logo: string;
  name: string;
}

export const CARD_STYLES: Record<CardIssuer, CardStyle> = {
  visa: {
    name: 'Visa',
    gradient: 'linear-gradient(135deg, #1a1f71, #f7b600)',
    textColor: '#ffffff',
    logo: ''
  },
  mastercard: {
    name: 'Mastercard',
    gradient: 'linear-gradient(135deg, #eb001b, #f79e1b)',
    textColor: '#ffffff',
    logo: ''
  },
  amex: {
    name: 'American Express',
    gradient: 'linear-gradient(135deg, #0070d2, #ffffff)',
    textColor: '#000000',
    logo: ''
  },
  diners: {
    name: 'Diners Club',
    gradient: 'linear-gradient(135deg, #0079bc, #cccccc)',
    textColor: '#ffffff',
    logo: ''
  },
  discover: {
    name: 'Discover',
    gradient: 'linear-gradient(135deg, #ff6000, #ffffff, #000000)',
    textColor: '#000000',
    logo: ''
  },
  jcb: {
    name: 'JCB',
    gradient: 'linear-gradient(135deg, #0d4b9f, #d91c2a, #007b40)',
    textColor: '#ffffff',
    logo: ''
  },
  unionpay: {
    name: 'UnionPay',
    gradient: 'linear-gradient(135deg, #d22630, #0066a1, #00a0e9)',
    textColor: '#ffffff',
    logo: ''
  },
  maestro: {
    name: 'Maestro',
    gradient: 'linear-gradient(135deg, #009ddd, #ed1c24)',
    textColor: '#ffffff',
    logo: ''
  },
  elo: {
    name: 'Elo',
    gradient: 'linear-gradient(135deg, #00a4e0, #ef4123, #00a859)',
    textColor: '#000000',
    logo: ''
  },
  hipercard: {
    name: 'Hipercard',
    gradient: 'linear-gradient(135deg, #d52b1e, #ff0000)',
    textColor: '#ffffff',
    logo: ''
  },
  default: {
    name: 'CARTÃO',
    gradient: 'linear-gradient(135deg, #2c3e50, #3498db)',
    textColor: '#ffffff',
    logo: ''
  }
};

export const CARD_TYPES = {
  elo: {
    name: 'Elo',
    pattern: /^(4011|431274|438935|451416|457393|504175|506699|5067|509000|627780|636297|636368)/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  visa: {
    name: 'Visa',
    pattern: /^4/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  mastercard: {
    name: 'Mastercard',
    pattern: /^5[1-5]/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  amex: {
    name: 'American Express',
    pattern: /^3[47]/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/],
    cvcLength: 4
  },
  diners: {
    name: 'Diners Club',
    pattern: /^3[0689]/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/],
    cvcLength: 3
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5)/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  jcb: {
    name: 'JCB',
    pattern: /^35/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  unionpay: {
    name: 'UnionPay',
    pattern: /^62/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  maestro: {
    name: 'Maestro',
    pattern: /^5[0678]/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  },
  hipercard: {
    name: 'Hipercard',
    pattern: /^(606282|3841)/,
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    cvcLength: 3
  }
};

export const CARD_DETECTION_ORDER: CardIssuer[] = [
  'elo',
  'hipercard',
  'discover',
  'amex',
  'diners',
  'jcb',
  'unionpay',
  'mastercard',
  'maestro',
  'visa'
];

export const detectCardIssuer = (cardNumber: string): CardIssuer => {
  const num = cardNumber.replace(/\s/g, "");
  if (!num || num.length < 2) return "default";

  for (const issuer of CARD_DETECTION_ORDER) {
    const cardType = CARD_TYPES[issuer as keyof typeof CARD_TYPES];
    if (cardType.pattern.test(num)) {
      return issuer;
    }
  }

  return "default";
};
