import { Navbar } from '../components/navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../src/utils/createUrqlClient';
import { usePostsQuery } from '../src/generated/graphql';
import { Spin, List, Avatar } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function Home() {
	const [{ data }] = usePostsQuery();
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	return (
		<div>
			<Navbar />
			{!data ? (
				<Spin indicator={antIcon} />
			) : (
				<List
					itemLayout="horizontal"
					dataSource={data.posts}
					renderItem={(post) => (
						<List.Item>
							<List.Item.Meta
								title={<span style={{ marginTop: 20 }}>{post.title}</span>}
								avatar={
									<Avatar
										style={{
											backgroundColor: '#ed641a',
											verticalAlign: 'middle',
										}}
										size="large"
										gap={7}
									>
										{'U'}
									</Avatar>
								}
							/>
							{post.body}
						</List.Item>
					)}
				/>
			)}
		</div>
	);
}

export default withUrqlClient(createUrqlClient)(Home);
