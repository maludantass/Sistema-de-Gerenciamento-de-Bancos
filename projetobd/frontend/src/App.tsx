import { useState } from "react";

interface Contato {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

export default function App() {
  const [formData, setFormData] = useState<Contato>({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Contato enviado com sucesso!");
        setFormData({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
      } else {
        alert("Erro ao enviar o contato.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Não foi possível conectar ao backend.");
    }
  };  

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Formulário de Contato</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone"
          value={formData.telefone}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="assunto"
          placeholder="Assunto"
          value={formData.assunto}
          onChange={handleChange}
        />
        <br />
        <textarea
          name="mensagem"
          placeholder="Mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          rows={4}
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
