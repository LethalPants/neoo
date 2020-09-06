import { Navbar } from '../components/navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../src/utils/createUrqlClient';

function Home() {
	return (
		<div>
			<Navbar />
		</div>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
