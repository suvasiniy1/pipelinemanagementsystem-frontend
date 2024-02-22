import { colors } from '@atlaskit/theme';
import finnImg from './static/finn-min.png';
import bmoImg from './static/bmo-min.png';
import princessImg from './static/princess-min.png';
import jakeImg from './static/jake-min.png';

const ContactMade = {
  id: '1',
  name: 'Contact Made',
  url: 'http://adventuretime.wikia.com/wiki/Jake',
  avatarUrl: null,
  colors: {
    soft: colors.Y50,
    hard: colors.N400A,
  },
};

const Qualified = {
  id: '2',
  name: 'Qualified',
  url: 'http://adventuretime.wikia.com/wiki/BMO',
  avatarUrl: bmoImg,
  colors: {
    soft: colors.G50,
    hard: colors.N400A,
  },
};

const DemoScheduled = {
  id: '3',
  name: 'Demo Scheduled',
  url: 'http://adventuretime.wikia.com/wiki/Finn',
  avatarUrl: finnImg,
  colors: {
    soft: colors.B50,
    hard: colors.N400A,
  },
};

const ProposalMade = {
  id: '4',
  name: 'Proposal Made',
  url: 'http://adventuretime.wikia.com/wiki/Princess_Bubblegum',
  avatarUrl: princessImg,
  colors: {
    soft: colors.P50,
    hard: colors.N400A,
  },
};

const NegotiationsStarted = {
  id: '5',
  name: 'Negotiations Started',
  url: 'http://adventuretime.wikia.com/wiki/Princess_Bubblegum',
  avatarUrl: princessImg,
  colors: {
    soft: colors.P50,
    hard: colors.N400A,
  },
};

export const authors = [ContactMade, Qualified, DemoScheduled, ProposalMade, NegotiationsStarted];

export const quotes = [
  {
    id: '1',
    content: '[Sample] Damone',
    author: ContactMade,
  },
];

// So we do not have any clashes with our hardcoded ones
let idCount = quotes.length + 1;

export const getQuotes = (count) =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    
    const random = quotes[0];

    const custom = {
      ...random,
      id: `G${idCount++}`,
    };

    return custom;
  });

export const getAuthors = (count) =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random = authors[0];

    const custom = {
      ...random,
      id: `author-${idCount++}`,
    };

    return custom;
  });

const getByAuthor = (author, items) =>
  items.filter((quote) => quote.author === author);

export const authorQuoteMap = authors.reduce(
  (previous, author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes),
  }),
  {}
);

export const generateQuoteMap = (quoteCount) =>
  authors.reduce(
    (previous, author) => ({
      ...previous,
      [author.name]: getQuotes(quoteCount / authors.length),
    }),
    {}
  );
