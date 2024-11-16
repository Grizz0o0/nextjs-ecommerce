import LoginForm from './login-form';

function Login() {
    return (
        <div>
            <h1 className="text-xl font-semibold text-center">Sign in</h1>
            <div className="flex justify-center">
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;
