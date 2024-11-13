"use client";

import Pagina from "@/components/Pagina";
import apiLocalidades from "@/services/apiLocalidades";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { FaArrowLeft, FaCheck, FaCheckCircle, FaTrash } from "react-icons/fa";
import ReactInputMask from "react-input-mask";
import { v4 } from "uuid";
import * as Yup from "yup";

export default function VoluntariosFormPage(props) {
  const [showAlert, setShowAlert] = useState(false);
  // router -> hook para navegação de telas
  const router = useRouter();

  // Criar estados(react) para armazenar os dados dos selects
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Buscar a lista de animais no localStorage, se não existir, inicializa uma lista vazia
  const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
  const ongs = JSON.parse(localStorage.getItem("ongs")) || [];

  // Recuperando id para edição
  const id = props.searchParams.id;
  console.log(props.searchParams.id);
  // Buscar na lista a animal com o ID recebido no parametro
  const voluntarioEditado = voluntarios.find((item) => item.id == id);
  console.log(voluntarioEditado);

  // carregar os dados na inicialização da página
  useEffect(() => {
    // buscar os paises da api, imprimi no log e guarda no armazenamento
    apiLocalidades.get("/paises").then((response) => {
      console.log("paises >>> ", response.data);
      setPaises(response.data);
    });

    apiLocalidades.get("estados?orderBy=nome").then((response) => {
      console.log("estados >>> ", response.data);
      setEstados(response.data);
    });
  }, []);

  // função para salvar os dados do form
  function salvar(dados) {
    // Alert
    setShowAlert(true); 
    // Se voluntariosEditado existe, mudar os dados e gravar no localStorage
    if (voluntarioEditado) {
      Object.assign(voluntarioEditado, dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("voluntarios", JSON.stringify(voluntarios));
    } else {
      // se faculdadeEditada não existe, é criação de uma nova
      // gerar um ID (Identificador unico)
      dados.id = v4();
      // Adiciona a nova faculdade na lista de ongs
      voluntarios.push(dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("voluntarios", JSON.stringify(voluntarios));
    }

    router.push("/voluntarios");
  }

  // Campos do form e valores iniciais(default)
  const initialValues = {
    nome: "",
    sobrenome: "",
    ong: "",
    area: "",
    pais: "",
    cnpj: "",
    cep: "",
    foto: "",
    estado: "",
    cidade: "",
    endereco: "",
  };

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    ong: Yup.string().required("Por favor, selecione uma ONG"),
    area: Yup.string().required("Por favor, selecione Area"),
    pais: Yup.string().required("Campo obrigatório"),
    cnpj: Yup.string().required("Campo obrigatório"),
    cep: Yup.string().required("Campo obrigatório"),
    foto: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    endereco: Yup.string().required("Campo obrigatório"),
  });

  return (
    <Pagina titulo={"Se torne um Volutário"}>
      <Alert
        show={showAlert}
        variant="success"
        onClose={() => setShowAlert(false)}
        dismissible
      >
        <Alert.Heading>
          <FaCheckCircle className="me-2" /> Sucesso!
        </Alert.Heading>
        <p>Voluntário cadastrado com sucesso!</p>
      </Alert>
      {/* Formulário */}
      <Formik
        // Atributos do formik
        // Se for edição, coloca os dados da faculdadeEditada
        // Se for nova, colocar o initialValues com os valores vazios
        initialValues={voluntarioEditado || initialValues}
        validationSchema={validationSchema}
        onSubmit={salvar}
      >
        {/* construção do template do formulário */}
        {
          // os valores e funções do formik
          ({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          }) => {
            // ações do formulário
            // debug
            // console.log("DEBUG >>>")
            // console.log({values, errors, touched})

            useEffect(() => {
              console.log("Mexeu no estado >>>");
              if (values.estado !== "") {
                apiLocalidades
                  .get(`/estados/${values.estado}/municipios`)
                  .then((response) => {
                    console.log("cidades >>>", response.data);
                    setCidades(response.data);
                  });
              }
            }, [values.estado]);

            // retorno com o template jsx do formulário
            return (
              <Form onSubmit={handleSubmit}>
                {/* Campos do form */}
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                      name="nome"
                      type="text"
                      value={values.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.nome && !errors.nome}
                      isInvalid={touched.nome && errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Sobrenome */}
                  <Form.Group as={Col}>
                    <Form.Label>Sobrenome:</Form.Label>
                    <Form.Control
                      name="sobrenome"
                      type="text"
                      value={values.sobrenome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.sobrenome && !errors.sobrenome}
                      isInvalid={touched.sobrenome && errors.sobrenome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sobrenome}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Ong Desejada:</Form.Label>
                    <Form.Select
                      name="ong"
                      value={values.ong}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.ong && !errors.ong}
                      isInvalid={touched.ong && errors.ong}
                    >
                      <option value="">Selecione</option>
                      {ongs.map((ong) => (
                        <option value={ong.nome}>{ong.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.ong}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Area de Interesse:</Form.Label>
                    <Form.Select
                      name="area"
                      value={values.area}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.area && !errors.area}
                      isInvalid={touched.area && errors.area}
                    >
                      <option disabled value="">
                        Selecione
                      </option>
                      <option value="Animais">Animais</option>
                      <option value="Eventos">Eventos</option>
                      <option value="Marketing">Marketing</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.area}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Endereço:</Form.Label>
                    <Form.Control
                      name="endereco"
                      type="text"
                      value={values.endereco}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.endereco && !errors.endereco}
                      isInvalid={touched.endereco && errors.endereco}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endereco}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={3}>
                    <Form.Label>Cnpj:</Form.Label>
                    <Form.Control
                      name="cnpj"
                      type="text"
                      as={ReactInputMask}
                      mask={"99.99999.999/9999-99"}
                      placeholder="99.99999.999/9999-99"
                      value={values.cnpj}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.cnpj && !errors.cnpj}
                      isInvalid={touched.cnpj && errors.cnpj}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cnpj}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={2}>
                    <Form.Label>Cep:</Form.Label>
                    <Form.Control
                      as={ReactInputMask}
                      mask={"99999-999"}
                      placeholder="99999-999"
                      name="cep"
                      type="text"
                      value={values?.cep}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched?.cep && !errors?.cep}
                      isInvalid={touched?.cep && !!errors?.cep}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.cep}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Pais:</Form.Label>
                    <Form.Select
                      name="pais"
                      value={values.pais}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.pais && !errors.pais}
                      isInvalid={touched.pais && errors.pais}
                    >
                      <option value="">Selecione</option>
                      {paises
                        .filter((pais) => pais.nome === "Brasil")
                        .map((pais) => (
                          <option key={pais.nome} value={pais.nome}>
                            {pais.nome}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.pais}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Estado:</Form.Label>
                    <Form.Select
                      name="estado"
                      value={values.estado}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.pais !== "Brasil"}
                      isValid={touched.estado && !errors.estado}
                      isInvalid={touched.estado && errors.estado}
                    >
                      <option value="">Selecione</option>
                      {estados.map((estado) => (
                        <option value={estado.sigla}>{estado.sigla}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.estado}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Cidade:</Form.Label>
                    <Form.Select
                      name="cidade"
                      value={values.cidade}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.pais !== "Brasil"}
                      isValid={touched.cidade && !errors.cidade}
                      isInvalid={touched.cidade && errors.cidade}
                    >
                      <option value="">Selecione</option>
                      {cidades.map((cidade) => (
                        <option value={cidade.nome}>{cidade.nome}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.cidade}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* botões */}

                <Form.Group as={Col}>
                  <Form.Label>Foto:</Form.Label>
                  <Form.Control
                    name="foto"
                    type="text"
                    placeholder="coloque sua foto aqui  :)"
                    value={values.foto}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.foto && !errors.foto}
                    isInvalid={touched.foto && !!errors.foto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.foto}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="py-4 text-end">
                  <Button className="me-2" href="/voluntarios">
                    <FaArrowLeft /> Voltar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleReset}
                    className="me-2"
                  >
                    <FaTrash /> Limpar
                  </Button>
                  <Button type="submit" variant="success">
                    <FaCheck /> Enviar
                  </Button>
                </Form.Group>
              </Form>
            );
          }
        }
      </Formik>
    </Pagina>
  );
}
