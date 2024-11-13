"use client";

import Pagina from "@/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";

export default function OngslPage() {
  const [ongs, setOngs] = useState([]);

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const ongsLocalStorage = JSON.parse(localStorage.getItem("ongs")) || [];
    const animaisLocalStorage =
      JSON.parse(localStorage.getItem("animais")) || [];
    // guarda a lista no estado faculdades
    setOngs(ongsLocalStorage);
    console.log(ongsLocalStorage);
  }, []);

  // Função para exclusão do item
  function excluir(ong) {
    // Confirma com o usuário a exclusão
    if (window.confirm(`Deseja realmente excluir a ong ${ong.nome}?`)) {
      // filtra a lista antiga removando o curso recebido
      const novaLista = ongs.filter((item) => item.id !== ong.id);
      // grava no localStorage a nova lista
      localStorage.setItem("ongs", JSON.stringify(novaLista));
      // grava a nova lista no estado para renderizar na tela
      setOngs(novaLista);
      alert("Ong Removido com sucesso!");
    }
  }

  return (
    <Pagina titulo={"Lista de ONGs"}>
      <div className="text-end mb-2">
        <Button variant="success" href="/ongs/form">
          <FaPlusCircle /> Cadastrar ONGs
        </Button>
      </div>

      {/* Tabela com os Cursos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {ongs.map((ong) => (
            <tr key={ong.id}>
              {/* Use ong.id as the key */}
              <td className="text-center">
                <img
                  className="img-fluid img-center"
                  src={ong.foto}
                  width={85}
                />
              </td>
              <td>{ong.nome}</td>
              <td>{ong.estado}</td>
              <td>{ong.cidade}</td>
              <td className="text-center">
                {/* Botões das ações */}
                <Button className="me-2" href={`/ongs/form?id=${ong.id}`}>
                  <FaPen />
                  <p>Editar</p>
                </Button>
                <Button variant="danger" onClick={() => excluir(ong)}>
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
