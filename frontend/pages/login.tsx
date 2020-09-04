import React from 'react';
import { Form, Input, Button, Layout, Row, Col, Typography } from 'antd';

const Login: React.FC = () => {
	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 16 },
	};
	const [loading, setLoading] = React.useState(false);
	const toggleLoading = () => setLoading(!loading);
	const onFinish = (values) => {
		console.log('Success:', values);
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Row
			align="middle"
			justify="start"
			style={{ minHeight: '100vh', marginRight: 0 }}
			gutter={[8, 16]}
		>
			<Col span={12} offset={2}>
				<Typography.Title level={3}>Login</Typography.Title>
				<Form
					{...layout}
					name="basic"
					layout="vertical"
					size="large"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item
						label="Username"
						name="username"
						rules={[{ required: true, message: 'Please enter your username' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{ required: true, message: 'Please enter your password' }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" loading={loading}>
							Submit
						</Button>
					</Form.Item>
				</Form>
				<Typography.Text>Don't have an account? </Typography.Text>
				<Typography.Link href="/register">Register now</Typography.Link>{' '}
			</Col>
		</Row>
	);
};

export default Login;
