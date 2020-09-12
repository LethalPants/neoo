import React from 'react';
import { Card, Input, Typography } from 'antd';
import { useRouter } from 'next/router';

interface createPostProps {}

export const CreatePost: React.FC<createPostProps> = ({}) => {
	const router = useRouter();
	return (
		<>
			<Card
				size="small"
				style={{ margin: '20px 0 10px' }}
				onFocus={() => router.push('/submit')}
			>
				<Input placeholder="Create post."></Input>
			</Card>
		</>
	);
};
