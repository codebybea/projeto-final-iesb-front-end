"use client";

import Carrosel from "@/components/Carrosel";
import Pagina from "@/components/Pagina";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { FaPlusCircle, FaRegHeart } from "react-icons/fa";

const animais = JSON.parse(localStorage.getItem("animais")) || [];

export default function homePage() {
  return (
    <>
      <Pagina></Pagina>
      <Carrosel></Carrosel>

      {/* Animais */}

      <Container className="text-end mb-2 pt-5">
        <h1 className="text-center mb-4 pt-5">Adote um Amiguinho!</h1>
        <Button variant="success" href="/animais/form">
          <FaPlusCircle /> Cadastrar Animal
        </Button>
      </Container>
      <Container className="text-center py-5 img">
        <Row xs={1} md={2} lg={3} className="g-4">
          {animais.map((animal) => (
            <Col key={animal.id}>
              <Card
                className="mb-5 img-hover"
                style={{
                  borderRadius: "50px",
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <Card.Img
                  style={{
                    borderRadius: "50px",
                  }}
                  className="card-img-top"
                  variant="top"
                  src={animal.foto}
                />
                <Card.Body className=" mb-2">
                  <Card.Title>{animal.nome}</Card.Title>
                  <Card.Text>
                    <p>
                      {animal.cidade}, {animal.estado}
                    </p>
                  </Card.Text>
                  <Button
                    className="btn-purple"
                    href={`/adotadores/form?animalId=${animal.id}`}
                  >
                    <FaRegHeart /> Adotar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <section className="py-5">
          {/* Sobre PETZ */}
          <h1 className="mt-5 mb-2 ">Sobre o patinhas</h1>
          <Image src="/imgs/04.png"></Image>
          <p>
            Nossa missão é construir um mundo onde todos os animais tenham um
            lar amoroso e seguro. <br></br> Acreditamos que cada pet merece uma
            segunda chance e que a adoção é a melhor forma de salvar vidas.{" "}
            <br></br> Nosso compromisso é conectar animais abandonados a
            famílias responsáveis, promovendo o bem-estar animal <br></br> e a
            conscientização sobre a importância da castração e da adoção
            responsável.
          </p>
        </section>
      </Container>
    </>
  );
}
