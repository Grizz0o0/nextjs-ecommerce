import RegisterForm from './register-form';

function Register() {
    return (
        <div>
            <h1 className="text-xl font-semibold text-center ">Sign up</h1>
            <div className="flex justify-center">
                <RegisterForm />
            </div>
        </div>
    );
}

export default Register;
