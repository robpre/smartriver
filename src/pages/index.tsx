import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { getSecrets } from "../config";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>Water</h1>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

export default Home;
