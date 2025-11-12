import { useAuth } from "../constext/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const { token, user } = useAuth();
  const [secureData, setSecureData] = useState(null);

  useEffect(() => {
    const fetchSecureData = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/secure/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecureData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSecureData();
  }, [token]);

  // console.log(token);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
      {secureData && (
        <p className="mt-4 text-green-600">
          ✅ Server says: {secureData.message}
        </p>
      )}
    </div>
  );
}
