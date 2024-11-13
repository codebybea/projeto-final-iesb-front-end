"use client";

import Pagina from "@/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";

export default function AdotantePage() {
  const [adotantes, setAdotantes] = useState([]);

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const adotantesLocalStorage =
      JSON.parse(localStorage.getItem("adotantes")) || [];
    // guarda a lista no estado faculdades
    setAdotantes(adotantesLocalStorage);
    console.log(adotantesLocalStorage);
  }, []);

  // Função para exclusão do item
  function excluir(adotante) {
    // Confirma com o usuário a exclusão
    if (
      window.confirm(`Deseja realmente excluir o adotante ${adotante.nome}?`)
    ) {
      // filtra a lista antiga removando o curso recebido
      const novaLista = adotantes.filter((item) => item.id !== adotante.id);
      // grava no localStorage a nova lista
      localStorage.setItem("animais", JSON.stringify(novaLista));
      // grava a nova lista no estado para renderizar na tela
      setAdotantes(novaLista);
      alert("Adotante Removido com sucesso!");
    }
  }

  return (
    <Pagina titulo={"Adotantes"}>
      <div className="text-end mb-2">
        <Button variant="success" href="/adotadores/form">
          <FaPlusCircle /> Cadastrar Adotante
        </Button>
      </div>

      {/* Tabela com os Adotantes */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Cidade</th>
            <th>Animal Adotado</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {adotantes.map((adotante) => (
            <tr key={adotante.id}>
              {/* Use adotante.id as the key */}
              <td className="text-center">
                <img
                  className="img-fluid img-center"
                  src={adotante.foto}
                  width={85}
                />
              </td>
              <td>{adotante.nome}</td>
              <td>{adotante.sobrenome}</td>
              <td>
                {adotante.cidade}, {adotante.estado}
              </td>
              <td>{adotante.animal}</td>
              <td className="text-center">
                {/* Botões das ações */}
                <Button
                  className="me-2"
                  href={`/adotadores/form?id=${adotante.id}`}
                >
                  <FaPen />
                  <p>Editar</p>
                </Button>
                <Button variant="danger" onClick={() => excluir(adotante)}>
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
