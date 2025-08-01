class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleUserMessage(message) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: "ID_HARD_CODE" })
      });

      const data = await res.json();
      const botMessage = this.createChatBotMessage(data.reply);
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage]
      }));
    } catch {
      const errorMessage = this.createChatBotMessage("Lỗi máy chủ!");
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage]
      }));
    }
  }
}

export default ActionProvider;
