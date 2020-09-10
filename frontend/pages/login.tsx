import React from 'react';
import { Formik } from 'formik';
import { SubmitButton, Input, Form, FormItem } from 'formik-antd';
import { Row, Col, Typography, Alert, Button } from 'antd';
import * as Yup from 'yup';
import { useLoginMutation } from '../src/generated/graphql';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../src/utils/createUrqlClient';

const LoginSchema = Yup.object().shape({
	inputUser: Yup.string().required('Username is required'),
	password: Yup.string().required('Password is required'),
});

const Login = () => {
	const [, login] = useLoginMutation();
	const router = useRouter();
	const [error, setError] = React.useState('');
	return (
		<Row
			align="middle"
			justify="start"
			style={{ minHeight: '100vh', marginRight: 0 }}
			gutter={[8, 16]}
		>
			<Col span={12} offset={2}>
				<Typography.Title level={3}>Create an account</Typography.Title>
				{error !== '' && (
					<Row>
						<Col span={16}>
							<Alert
								type="error"
								message={error}
								closable
								onClose={() => setError('')}
							/>
						</Col>
					</Row>
				)}
				<Formik
					initialValues={{
						inputUser: '',
						password: '',
					}}
					onSubmit={async (values, { setErrors }) => {
						const res = await login(values);
						if (res.data?.login.errors) {
							setError(res.data.login.errors[0].message);
						} else if (res.data?.login.user) {
							if (typeof router.query.next === 'string') {
								router.push(router.query.next);
							} else {
								router.push('/');
							}
						}
					}}
					validationSchema={LoginSchema}
				>
					{({ isSubmitting }) => (
						<Form
							labelCol={{ xs: 8 }}
							wrapperCol={{ xs: 16 }}
							name="basic"
							layout="vertical"
							size="large"
						>
							<FormItem
								name="inputUser"
								label="Username or Email"
								required={true}
							>
								<Input
									name="inputUser"
									placeholder="Enter your username or email"
									onChange={() => setError('')}
								/>
							</FormItem>
							<FormItem name="password" label="Password" required={true}>
								<Input.Password
									autoComplete="off"
									name="password"
									placeholder="Enter your password"
									onChange={() => setError('')}
								/>
							</FormItem>

							<SubmitButton
								loading={isSubmitting}
								style={{ marginBottom: '10px' }}
							>
								Login
							</SubmitButton>
						</Form>
					)}
				</Formik>
				<Typography.Text>Don't have an account? </Typography.Text>
				<NextLink href="/register">Register</NextLink>
			</Col>
		</Row>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
