import 'antd/dist/antd.dark.css';
import '../styles/global.css';

type appProps = {
	Component: any;
	pageProps: any;
};

export default function MyApp({ Component, pageProps }: appProps) {
	return <Component {...pageProps} />;
}
