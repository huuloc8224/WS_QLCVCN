class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleMessage(message) {
    try {
      const res = await fetch("https://be-qlcvcn.onrender.com/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      const botMessage = this.createChatBotMessage(data.reply);
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage]
      }));
    } catch (err) {
      const errorMessage = this.createChatBotMessage("Lỗi kết nối tới server.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage]
      }));
    }
  }
}

export default ActionProvider;
