import { LoadingOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, List, Row, Spin } from 'antd';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { CreatePost } from '../components/CreatePost';
import { Navbar } from '../components/navbar';
import { usePostsQuery } from '../src/generated/graphql';
import { createUrqlClient } from '../src/utils/createUrqlClient';

function Home() {
	const [{ data }] = usePostsQuery();
	const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
	return (
		<div>
			<Navbar />
			{!data ? (
				<Row
					align="middle"
					justify="center"
					style={{ minHeight: '100vh', margin: 'auto' }}
				>
					<Col>
						<Spin indicator={antIcon} />
					</Col>
				</Row>
			) : (
				<Row>
					<Col xs={{ span: 22, offset: 1 }} lg={{ span: 12, offset: 6 }}>
						<CreatePost />
						<List
							itemLayout="horizontal"
							dataSource={data.posts}
							renderItem={(post) => (
								<Card style={{ margin: '10px 0' }}>
									<Card.Meta
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
										title={<span style={{ marginTop: 20 }}>{post.title}</span>}
										description={post.body}
									/>
								</Card>
							)}
						/>
					</Col>
				</Row>
			)}
		</div>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
