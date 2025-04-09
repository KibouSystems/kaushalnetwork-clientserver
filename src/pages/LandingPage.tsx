import {useState} from "react";
import {useNavigate} from "react-router";

export default function LandingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await fetch("dummyurl", { // TODO: replace with your backend URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({query: searchTerm}),
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            console.log("Server response:", data);
        } catch (error) {
            console.error("Error sending search term:", error);
            navigate("/register-company");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <p className="text-2xl font-bold mb-6">Join Kaushal Network</p>

            <div className="w-full max-w-md flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Search seactor, product, service provider, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />

                <button
                    onClick={handleSearch}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl shadow-md transition duration-300"
                >
                    Search
                </button>
            </div>
        </div>
    );
}
