import { Button, Menu } from 'antd';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../src/generated/graphql';
import { isServer } from '../src/utils/isServer';

interface themeProps {}

export const Navbar: React.FC<themeProps> = ({}) => {
	const [, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	let body = null;
	if (!fetching) {
		if (!data?.me) {
			body = (
				<>
					<li>
						<NextLink href='/register'>Register</NextLink>
					</li>
					<li>
						<Button type='primary' className='menu-button'>
							<NextLink href='/login'> Login</NextLink>
						</Button>
					</li>
				</>
			);
		} else {
			body = (
				<Menu.Item key='logout' className='no-eff-hover'>
					<Button
						type='primary'
						style={{ margin: '10px 20px' }}
						onClick={() => logout()}
					>
						Logout
					</Button>
				</Menu.Item>
			);
		}
	}

	return (
		<Menu
			mode='horizontal'
			style={{ display: 'flex', justifyContent: 'flex-end' }}
			key='nav'
		>
			{body}
		</Menu>
	);
};
