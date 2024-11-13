"use client";

import Pagina from "@/components/Pagina";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

export default function AnimalPage() {
  const [animais, setAnimais] = useState([]);

  // Faz alguma coisa quando o usuário acessa a tela
  useEffect(() => {
    // Busca a lista do localStorage, se não existir, inicia uma vazia
    const animaisLocalStorage =
      JSON.parse(localStorage.getItem("animais")) || [];
    // guarda a lista no estado faculdades
    setAnimais(animaisLocalStorage);
    console.log(animaisLocalStorage);
  }, []);

  // Função para exclusão do item
  function excluir(animal) {
    // Confirma com o usuário a exclusão
    if (window.confirm(`Deseja realmente excluir o animal ${animal.nome}?`)) {
      // filtra a lista antiga removando o curso recebido
      const novaLista = animais.filter((item) => item.id !== animal.id);
      // grava no localStorage a nova lista
      localStorage.setItem("animais", JSON.stringify(novaLista));
      // grava a nova lista no estado para renderizar na tela
      setAnimais(novaLista);
      alert("Animal Removido com sucesso!");
    }
  }

  return (
    <Pagina titulo={"Lista de Animais para Adoção"}>
      <div className="text-end mb-2">
        <Button variant="success" href="/animais/form">
          <FaPlusCircle /> Cadastrar Animal
        </Button>
      </div>

      {/* Tabela com os Cursos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Sexo</th>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Raça</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {animais.map((animal) => (
            <tr key={animal.id}>
              {/* Use animal.id as the key */}
              <td className="text-center">
                <img
                  className="img-fluid img-center"
                  src={animal.foto}
                  width={85}
                />
              </td>
              <td>{animal.nome}</td>
              <td>{animal.sexo}</td>
              <td>{animal.estado}</td>
              <td>{animal.cidade}</td>
              <td>{animal.raca}</td>
              <td className="text-center">
                {/* Botões das ações */}
                <Button className="me-2" href={`/animais/form?id=${animal.id}`}>
                  <FaPen />
                  <p>Editar</p>
                </Button>
                <Button variant="danger" onClick={() => excluir(animal)}>
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
