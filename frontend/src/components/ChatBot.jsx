import { Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "../src/chatbot/ChatBotConfig";
import MessageParser from "../src/chatbot/MessageParser";
import ActionProvider from "../src/chatbot/ActionProvider";


function ChatBot() {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}

export default ChatBot;
