import { LoadingOutlined } from '@ant-design/icons';
import { Card, Col, Result, Row, Spin, Button, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { usePostQuery } from '../../src/generated/graphql';
import { createUrqlClient } from '../../src/utils/createUrqlClient';
import NextLink from 'next/link';

interface PostPageProps {}

const PostPage: React.FC<PostPageProps> = ({}) => {
	const router = useRouter();
	const postId =
		typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
	const [{ data, fetching }] = usePostQuery({
		pause: postId === -1,
		variables: {
			postId
		}
	});
	console.log(data, fetching);
	return (
		<Row
			align='middle'
			justify='center'
			style={{ minHeight: '80vh', marginRight: 0 }}
		>
			<Col span={14} lg={{ span: 10 }}>
				{fetching ? (
					<Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
				) : data && data.post !== null ? (
					<Card
						title={
							<Typography.Title level={3}>{data.post?.title}</Typography.Title>
						}
						extra={<NextLink href='/'>Back Home </NextLink>}
					>
						{data.post?.body ? data.post.body : null}
					</Card>
				) : (
					<Result
						status='404'
						title='404'
						subTitle='Sorry, the page you visited does not exist.'
						extra={<Button type='primary'></Button>}
					/>
				)}
			</Col>
		</Row>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(PostPage);
