import { useState } from "react";
import { Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import MessageParser from "../Chatbot/MessageParser";
import ActionProvider from "../Chatbot/ActionProvider";
import config from "../Chatbot/ChatBotConfig";
import { FaComments, FaTimes } from "react-icons/fa";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {isOpen ? (
        <div
          style={{
            width: "90vw",
            maxWidth: 370,  
            height: 500,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Chatbot */}
          <div style={{ flex: 1 }}>
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              customComponents={{header: () => null,}}
              customStyles={{
                botMessageBox: { maxWidth: "90%" },
                userMessageBox: { maxWidth: "90%" },
                chatButton: { display: "none" }, // ẩn nút nếu có
              }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <FaComments size={20} />
        </button>
      )}
    </div>
  );
}

export default ChatBot;
