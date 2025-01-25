import React, { useState } from "react";
import axios from "axios";

const ChatInterface = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleQuery = async () => {
    try {
      const res = await axios.get("https://order-backend-w7dt.onrender.com/api/chat", {
        params: { message: query },
      });
      setResponse(res.data);
    } catch (error) {
      console.error(error);
      setResponse(null);
    }
  };
};

export default ChatInterface;
