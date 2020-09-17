import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { useVoteMutation } from '../src/generated/graphql';

interface UpdootProps {
	points: number;
	id: number;
	voteStatus: number | null | undefined;
}

export const Updoot: React.FC<UpdootProps> = ({ points, id, voteStatus }) => {
	const [, vote] = useVoteMutation();
	return (
		<Col style={{ marginRight: 10 }}>
			<Row>
				<CaretUpOutlined
					style={{
						fontSize: 20,
						color: voteStatus === 1 ? '#ca1111' : 'darkgrey'
					}}
					className='updoot-icon'
					aria-label='updoot post'
					onClick={async () => {
						await vote({
							postId: id,
							value: 1
						});
					}}
				/>
			</Row>
			<Row style={{ marginLeft: 6 }}>{points}</Row>
			<Row>
				<CaretDownOutlined
					style={{
						fontSize: 20,
						color: voteStatus === -1 ? '#155fcf' : 'darkgrey'
					}}
					className='downdoot-icon'
					aria-label='downdoot post'
					onClick={async () => {
						await vote({
							postId: id,
							value: -1
						});
					}}
				/>
			</Row>
		</Col>
	);
};
