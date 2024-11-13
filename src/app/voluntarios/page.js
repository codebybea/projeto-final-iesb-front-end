"use client";

import Pagina from "@/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";

export default function VoluntarioslPage() {
  const [voluntarios, setVoluntarios] = useState([]);

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const voluntariosLocalStorage =
      JSON.parse(localStorage.getItem("voluntarios")) || [];
    // guarda a lista no estado faculdades
    setVoluntarios(voluntariosLocalStorage);
    console.log(voluntariosLocalStorage);
  }, []);

  // Função para exclusão do item
  function excluir(voluntario) {
    // Confirma com o usuário a exclusão
    if (
      window.confirm(
        `Deseja realmente excluir a voluntario ${voluntario.nome}?`
      )
    ) {
      // filtra a lista antiga removando o curso recebido
      const novaLista = voluntarios.filter((item) => item.id !== voluntario.id);
      // grava no localStorage a nova lista
      localStorage.setItem("voluntarios", JSON.stringify(novaLista));
      // grava a nova lista no estado para renderizar na tela
      setVoluntarios(novaLista);
      alert("Voluntario Removido com sucesso!");
    }
  }

  return (
    <Pagina titulo={"Voluntários atuais"}>
      <div className="text-end mb-2">
        <Button variant="success" href="/voluntarios/form">
          <FaPlusCircle /> Se cadastre
        </Button>
      </div>

      <Container>
        <h2 className="text-center">Nosso Objetivo</h2>
        <p>
          Aumentar o número de pessoas dispostas a ajudar na causa animal, seja
          fazendo visitas aos animais em abrigos, organizando eventos, ou
          ajudando com tarefas administrativas.
        </p>
      </Container>

      {/* Tabela com os Cursos */}
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Órgão</th>
            <th>Área</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {voluntarios.map((voluntario) => (
            <tr key={voluntario.id}>
              {/* Use voluntario.id as the key */}
              <td className="text-center">
                <img
                  className="img-fluid img-center"
                  src={voluntario.foto}
                  width={85}
                />
              </td>
              <td>{voluntario.nome}</td>
              <td>{voluntario.sobrenome}</td>
              <td>{voluntario.ong}</td>
              <td>{voluntario.area}</td>
              <td>
                {voluntario.cidade}, {voluntario.estado}
              </td>
              <td className="text-center">
                {/* Botões das ações */}
                <Button
                  className="me-2"
                  href={`/voluntarios/form?id=${voluntario.id}`}
                >
                  <FaPen />
                  <p>Editar</p>
                </Button>
                <Button variant="danger" onClick={() => excluir(voluntario)}>
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
