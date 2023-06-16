import { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer, gql } from "apollo-server-micro";

const typeDefs = gql`
  type Movie {
    movieCd: String!
    movieNm: String!
    movieNmEn: String!
    prdtYear: String!
    openDt: String!
    typeNm: String!
    prdtStatNm: String!
    nationAlt: String!
    genreAlt: String!
    repNationNm: String!
    repGenreNm: String!
  }
  type GenreType {
    genreNm: String!
  }
  type MovieDetail {
    movieCd: String!
    movieNm: String!
    movieNmEn: String!
    movieNmOg: String
    showTm: String!
    prdtYear: String!
    openDt: String
    prdtStatNm: String!
    typeNm: String!
    nations: [String]
    genres: [GenreType!]!
    directors: [String!]
    actors: [String!]
    showTypes: [String]
    companys: [String!]
  }

  type Query {
    allMovies: [Movie!]!
    movie: Movie!
  }
`;

const resolvers = {
  Query: {
    allMovies() {
      const movieData = fetch(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${process.env.NEXT_PUBLIC_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) =>
          data.movieListResult.movieList.filter(
            (movie: any) => !movie.genreAlt.includes("성인물(에로)")
          )
        );
      return movieData;
    },
    movie(root: any, { id }: any) {
      return fetch(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${process.env.NEXT_PUBLIC_API_KEY}&movieCd=${id}`
      )
        .then((res) => res.json())
        .then((data) => data.movieInfoResult.movieInfo);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await server.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
