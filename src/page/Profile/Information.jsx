export default function Information() {
    const resp = {
        "data": {
            "id": 1,
            "full_name": "Đinh Việt Dũng",
            "email": "john.doe@example.com",
            "phone_number": "1234567890",
            "password": "1234567890",
            "role_id": "1234567890"        
        }
    }

    return (
        <div>
            <h1>Information code ở đây!</h1>
            <p>{resp.data.full_name}</p>
            <p>{resp.data.email}</p>
            <p>{resp.data.phone_number}</p>
            <p>{resp.data.password}</p>
            <p>{resp.data.role_id}</p>
        </div>
    )
}