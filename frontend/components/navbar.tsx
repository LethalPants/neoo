import React from 'react';
import { Menu, Button } from 'antd';
import NextLink from 'next/link';
import { UserOutlined } from '@ant-design/icons';

import { useMeQuery, useLogoutMutation } from '../src/generated/graphql';
import { isServer } from '../src/utils/isServer';
interface themeProps {}

export const Navbar: React.FC<themeProps> = ({}) => {
	const [{ fetching: isLoggingOut }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	let body = null;
	if (!fetching) {
		if (!data?.me) {
			body = (
				<>
					<NextLink href="/register">Register</NextLink>

					<Button type="primary" className="menu-button">
						<NextLink href="/login"> Login</NextLink>
					</Button>
				</>
			);
		} else {
			body = (
				<Menu.SubMenu
					key="sub1"
					icon={<UserOutlined />}
					title={`Welcome ${data.me.username}`}
				>
					<Menu.Item key="1" onClick={() => logout()} disabled={isLoggingOut}>
						Logout
					</Menu.Item>
				</Menu.SubMenu>
			);
		}
	}

	return (
		<Menu
			mode="horizontal"
			style={{ display: 'flex', justifyContent: 'flex-end' }}
		>
			{body}
		</Menu>
	);
};
