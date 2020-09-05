import React from 'react';
import { Menu, Typography, Button } from 'antd';

interface themeProps {}

export const Navbar: React.FC<themeProps> = ({}) => {
	return (
		<Menu
			mode="horizontal"
			style={{ display: 'flex', justifyContent: 'flex-end' }}
		>
			<Menu.Item key="register">
				<Typography.Link href="/register">Register</Typography.Link>
			</Menu.Item>

			<Button href="/login" className="menu-button" type="primary">
				Login
			</Button>
		</Menu>
	);
};
