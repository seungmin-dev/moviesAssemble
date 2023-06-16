import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "../../client/client";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
