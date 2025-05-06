import { useQuery } from '@apollo/client';
import { GET_ITEM_PARTS } from '../graphql/queries';
import ItemCustomizer from '../components/ItemCustomizer';

function Home() {
  const { data, loading, error } = useQuery(GET_ITEM_PARTS);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Welcome to Marcus Sports</h1>
      <ItemCustomizer parts={data.itemParts} />
    </div>
  );
}

export default Home;
