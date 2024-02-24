import { colors } from '@atlaskit/theme';

const ContactMade = {
  id: '1',
  name: 'Contact Made',
  colors: {
    soft: colors.Y50,
    hard: colors.N400A,
  },
};

const Qualified = {
  id: '2',
  name: 'Qualified',
  colors: {
    soft: colors.G50,
    hard: colors.N400A,
  },
};

const DemoScheduled = {
  id: '3',
  name: 'Demo Scheduled',
  colors: {
    soft: colors.B50,
    hard: colors.N400A,
  },
};

const ProposalMade = {
  id: '4',
  name: 'Proposal Made',
  colors: {
    soft: colors.P50,
    hard: colors.N400A,
  },
};

const NegotiationsStarted = {
  id: '5',
  name: 'Negotiations Started',
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

export const getQuotes = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    
    const random = quotes[0];

    const custom = {
      ...random,
      id: `G${idCount++}`,
    };

    return custom;
  });

export const getAuthors = (count: any) =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random = authors[0];

    const custom = {
      ...random,
      id: `author-${idCount++}`,
    };

    return custom;
  });

const getByAuthor = (author: { id: string; name: string; colors: { soft: string; hard: string; }; } | { id: string; name: string; url: string; avatarUrl: string; colors: { soft: string; hard: string; }; }, items: any[]) =>
  items.filter((quote: { author: any; }) => quote.author === author);

export const authorQuoteMap = authors.reduce(
  (previous, author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes),
  }),
  {}
);

export const generateQuoteMap = (quoteCount: number) =>
  authors.reduce(
    (previous, author) => ({
      ...previous,
      [author.name]: getQuotes(quoteCount / authors.length),
    }),
    {}
  );
