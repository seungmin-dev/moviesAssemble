import { gql, useQuery } from "@apollo/client";

const GET_MOVIES = gql`
  query getMovies {
    allMovies {
      movieNm
      movieCd
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_MOVIES);
  console.log(data);

  return <div></div>;
}
