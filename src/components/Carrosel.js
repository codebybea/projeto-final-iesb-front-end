import Link from "next/link";
import { Button, CarouselCaption, CarouselItem } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

function LightVariantExample() {
  return (
    <Carousel data-bs-theme="light">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/imgs/carrosel01.jpg"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/imgs/carrosel02.jpg"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <div style={{ position: "relative" }}>
          <img
            className="d-block w-100"
            src="/imgs/carrosel03.jpg"
            alt="Third slide"
          />{" "}
          {/* Substitua '/your-link' pelo link desejado */}
          <Button
            className="p-2 btn-crsl"
            width={50}
            href="/voluntarios"
            variant="dark"
            size="lg"
            style={{
              position: "absolute",
              top: "65%",
              right: "23.2%",
              transform: "translateY(-5%)",
            }}
          >
            <b>CLIQUE AQUI</b>
          </Button>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default LightVariantExample;
