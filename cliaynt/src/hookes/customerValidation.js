import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const customerValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validate = async () => {


            try {
                const result = await api.post('/customer/validate');

                if (!result.data.valid) {
                    throw new Error('Invalid token');
                }
            } catch (err) {
                console.log(err)
                navigate('/customer-sign-in');
            }
        };

        validate();
    }, [navigate]);
};

export default customerValidation;