"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import { FaPaw } from "react-icons/fa";

export default function Pagina({ titulo, children }) {
  return (
    <>
      {/* Barra de Navegação */}
      <Navbar className="p-4" data-bs-theme="light">
        <Container>
          <Navbar.Brand className="logo" href="/">
            <p className=" d-flex justify-content-center align-items-center">
              Patinhas <FaPaw color="#f9b013" className="text-center m-2" />
            </p>
          </Navbar.Brand>
          <Nav className="me-end">
            <Nav.Link href="/animais">Animais</Nav.Link>
            <Nav.Link href="/ongs">ONGs</Nav.Link>
            <Nav.Link href="/adotadores">Adotadores</Nav.Link>
            <Nav.Link href="/voluntarios">Voluntários</Nav.Link>
            <Nav.Link href="/contatos">Contato</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Barra de Titulo */}
      <div className="text-center text-dark py-2">
        <h1>{titulo}</h1>
      </div>

      {/* Conteudo da Página */}
      <Container className="mt-2">{children}</Container>
    </>
  );
}
