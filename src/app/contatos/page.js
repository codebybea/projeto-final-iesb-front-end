"use client";

import Pagina from "@/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";

export default function ContatoslPage() {
  const [contatos, setContatos] = useState([]);

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const contatosLocalStorage =
      JSON.parse(localStorage.getItem("contatos")) || [];
    // guarda a lista no estado faculdades
    setContatos(contatosLocalStorage);
    console.log(contatosLocalStorage);
  }, []);

  // Função para exclusão do item
  function excluir(contato) {
    // Confirma com o usuário a exclusão
    if (window.confirm(`Deseja realmente excluir o contato ${contato.nome}?`)) {
      // filtra a lista antiga removando o curso recebido
      const novaLista = contatos.filter((item) => item.id !== contatos.id);
      // grava no localStorage a nova lista
      localStorage.setItem("contatos", JSON.stringify(novaLista));
      // grava a nova lista no estado para renderizar na tela
      setContatos(novaLista);
      alert("Contato removido com sucesso!");
    }
  }

  return (
    <Pagina titulo={"Lista de Contatos"}>
      <div className="text-end mb-2">
        <Button variant="success" href="/contatos/form">
          <FaPlusCircle /> Inscreva-se
        </Button>
      </div>

      {/* Tabela com os Cursos */}
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ong Interessada</th>
            <th>Interesse</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {contatos.map((contato) => (
            <tr key={contato.id}>
              {/* Use contato.id as the key */}
              <td>{contato.nome}</td>
              <td>{contato.sobrenome}</td>
              <td>{contato.email}</td>
              <td>{contato.telefone}</td>
              <td>{contato.ong}</td>
              <td>{contato.interesse}</td>
              <td className="text-center">
                {/* Botões das ações */}
                <Button
                  className="me-2"
                  href={`/contatos/form?id=${contato.id}`}
                >
                  <FaPen />
                  <p>Editar</p>
                </Button>
                <Button variant="danger" onClick={() => excluir(contato)}>
                  <FaTrash /> <p>Excluir</p>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Pagina>
  );
}
