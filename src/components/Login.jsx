import { useState } from "react";
import image from "../assets/image.png"

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error("Credenciales inválidas");
            const data = await res.json();
            localStorage.setItem("user_id", data.id);
            localStorage.setItem("user", JSON.stringify(data))
            onLogin();
        } catch (err) {
            setError(err.message);
        }
    }; 


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-screen">
            <form 
                onSubmit={handleSubmit}
                className={"bg-white shadow-x1 rounded-2x1 p-8 w-full max-w-sm"}>
                <h1 className="text-2x1 font-semibold text-center mb-6 text-black-500">
                    Iniciar sesión
                </h1>
                <div className="logo pb-8 flex justify-center">
                    <img src={image} alt="Logo" className="w-32 h-auto" />
                </div>
                


                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                {error && (
                    <p className="text-red-500 text-center mb-3 text-sm">{ error }</p>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Ingresar
                </button>
            </form>
        </div>
    )
}