import 'antd/dist/antd.dark.css';
import '../styles/global.css';

import { createClient, Provider } from 'urql';

const client = createClient({
	url: 'http://localhost:4000/graphql',
	fetchOptions: { credentials: 'include' },
});

type appProps = {
	Component: any;
	pageProps: any;
};

export default function MyApp({ Component, pageProps }: appProps) {
	return (
		<Provider value={client}>
			<Component {...pageProps} />{' '}
		</Provider>
	);
}
