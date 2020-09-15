import { LoadingOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, List, Result, Row, Spin } from 'antd';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { CreatePost } from '../components/CreatePost';
import { Navbar } from '../components/navbar';
import { usePostsQuery } from '../src/generated/graphql';
import { createUrqlClient } from '../src/utils/createUrqlClient';

function Home() {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as string | null,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});

	if (!fetching && !data) {
		return (
			<Result
				status='error'
				title='An error while fetching the data.'
				extra={
					<Button type='primary' key='console'>
						Open Console
					</Button>
				}
			/>
		);
	}

	const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
	return (
		<div>
			<Navbar />
			{!data && fetching ? (
				<Row
					align='middle'
					justify='center'
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
							itemLayout='horizontal'
							dataSource={data!.posts.posts}
							renderItem={(post) => (
								<Card style={{ margin: '10px 0' }}>
									<Card.Meta
										avatar={
											<Avatar
												style={{
													backgroundColor: '#ed641a',
													verticalAlign: 'middle',
												}}
												size='large'
												gap={7}
											>
												{post.creator.username[0]}
											</Avatar>
										}
										title={<span style={{ marginTop: 20 }}>{post.title}</span>}
										description={`${post.textSnippet}...`}
									/>
								</Card>
							)}
						/>

						{data && data.posts.hasMore ? (
							<Button
								type='primary'
								size='large'
								style={{ margin: 'auto' }}
								onClick={() =>
									setVariables({
										limit: variables.limit,
										cursor: data!.posts.posts[data!.posts.posts.length - 1]
											.createdAt,
									})
								}
							>
								Load more
							</Button>
						) : null}
					</Col>
				</Row>
			)}
		</div>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
