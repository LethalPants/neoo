import React from 'react';
import { Form, Input, Button, Row, Col, Typography } from 'antd';
import { Formik, Form as FormikForm } from 'formik';

const Register: React.FC = () => {
	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 16 },
	};
	const [loading, setLoading] = React.useState(false);
	const toggleLoading = () => setLoading(!loading);
	const onFinish = (values) => {
		toggleLoading();
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
				<Typography.Title level={3}>Create an account</Typography.Title>
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
						label="Email"
						name="email"
						rules={[
							{ required: true, message: 'Please enter your email' },
							{ type: 'email', message: 'Enter a valid email' },
						]}
					>
						<Input />
					</Form.Item>

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
				<Typography.Text>Already have an account? </Typography.Text>
				<Typography.Link href="/login">Login</Typography.Link>{' '}
			</Col>
		</Row>
	);
};

export default Register;
