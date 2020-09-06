import React from 'react';
import { Formik } from 'formik';
import { SubmitButton, Input, Form, FormItem } from 'formik-antd';
import { Row, Col, Typography, Space } from 'antd';
import * as Yup from 'yup';
import { useRegisterMutation } from '../src/generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../src/utils/toErrorMap';
import NextLink from 'next/link';

const RegisterSchema = Yup.object().shape({
	username: Yup.string()
		.min(3, 'Username must be atleast 3 characters long')
		.max(50, 'Too Long!')
		.required('Username is required'),
	password: Yup.string()
		.min(8, 'Password must be atleast 8 characters long')
		.max(50, 'Too Long!')
		.required('Password is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
});

const Register = () => {
	const [, register] = useRegisterMutation();
	const router = useRouter();
	return (
		<Row
			align="middle"
			justify="start"
			style={{ minHeight: '100vh', marginRight: 0 }}
			gutter={[8, 16]}
		>
			<Col span={12} offset={2}>
				<Typography.Title level={3}>Create an account</Typography.Title>
				<Formik
					initialValues={{
						username: '',
						email: '',
						password: '',
					}}
					onSubmit={async (values, { setErrors }) => {
						const res = await register(values);
						if (res.data?.register.errors) {
							setErrors(toErrorMap(res.data.register.errors));
						} else if (res.data?.register.user) {
							router.push('/');
						}
					}}
					validationSchema={RegisterSchema}
				>
					{({ isSubmitting }) => (
						<Form
							labelCol={{ xs: 6 }}
							wrapperCol={{ xs: 16 }}
							name="basic"
							layout="vertical"
							size="large"
						>
							<FormItem name="username" label="Username" required={true}>
								<Input name="username" placeholder="Username" />
							</FormItem>
							<FormItem name="email" label="Email" required={true}>
								<Input name="email" placeholder="Email" />
							</FormItem>
							<FormItem name="password" label="Password" required={true}>
								<Input.Password name="password" placeholder="Password" />
							</FormItem>

							<SubmitButton
								loading={isSubmitting}
								style={{ marginBottom: '10px' }}
							>
								Register
							</SubmitButton>
						</Form>
					)}
				</Formik>
				<Typography.Text>Have an account? </Typography.Text>
				<NextLink href="/login">Login</NextLink>
			</Col>
		</Row>
	);
};

export default Register;
