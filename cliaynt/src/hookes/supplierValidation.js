import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const supplierValidation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const validate = async () => {


            try {
                const result = await api.post('/supplier/validate');

                if (!result.data.valid) {
                    throw new Error('Invalid token');
                }
            } catch (err) {
                console.log(err)
                navigate('/sign-in');
            }
        };

        validate();
    }, [navigate]);
};

export default supplierValidation;