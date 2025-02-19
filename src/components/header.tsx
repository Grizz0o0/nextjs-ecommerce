import { ModeToggle } from './mode-toggle';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ButtonLogout from './button-logout';

async function Header() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const isLoggedIn = !!accessToken;

    return (
        <div className="flex items-center justify-between p-4">
            <ul className="flex items-center space-x-4">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/product">Product</Link>
                </li>
                <li>
                    <Link href="/me">Profile</Link>
                </li>
            </ul>
            <div className="flex items-center space-x-4">
                <ModeToggle />
                <ul className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <li>
                            <ButtonLogout />
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link href="/login">Đăng nhập</Link>
                            </li>
                            <li>
                                <Link href="/register">Đăng ký</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Header;
