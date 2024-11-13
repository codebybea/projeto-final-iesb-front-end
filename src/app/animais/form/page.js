"use client";

import Pagina from "@/components/Pagina";
import apiLocalidades from "@/services/apiLocalidades";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { FaArrowLeft, FaCheck, FaCheckCircle, FaTrash } from "react-icons/fa";
import ReactInputMask from "react-input-mask";
import { v4 } from "uuid";
import * as Yup from "yup";

export default function AnimalFormPage(props) {
  // router -> hook para navegação de telas
  const router = useRouter();

  // Criar estados(react) para armazenar os dados dos selects
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Buscar a lista de animais no localStorage, se não existir, inicializa uma lista vazia
  const animais = JSON.parse(localStorage.getItem("animais")) || [];

  // Alert State
  const [showAlert, setShowAlert] = useState(false);

  // Recuperando id para edição
  const id = props.searchParams.id;
  console.log(props.searchParams.id);
  // Buscar na lista a animal com o ID recebido no parametro
  const animalEditado = animais.find((item) => item.id == id);
  console.log(animalEditado);

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
    // Se aniamalEditada existe, mudar os dados e gravar no localStorage
    if (animalEditado) {
      Object.assign(animalEditado, dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("animais", JSON.stringify(animais));
    } else {
      // se aniamalEditada não existe, é criação de uma nova
      // gerar um ID (Identificador unico)
      dados.id = v4();
      // Adiciona a nova aniamal na lista de animais
      animais.push(dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("animais", JSON.stringify(animais));
    }

    router.push("/animais");
  }

  // Campos do form e valores iniciais(default)
  const initialValues = {
    nome: "",
    pais: "Brasil",
    sexo: "",
    cep: "",
    raca: "",
    foto: "",
    estado: "",
    cidade: "",
    endereco: "",
  };

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    pais: Yup.string().required("Campo obrigatório"),
    sexo: Yup.string().required("Campo obrigatório"),
    cep: Yup.string().required("Campo obrigatório"),
    raca: Yup.string().required("Campo obrigatório"),
    foto: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    endereco: Yup.string().required("Campo obrigatório"),
  });

  return (
    <Pagina titulo={"Cadastro do Animal"}>
      {/* Alert */}
      <Alert
        show={showAlert}
        variant="success"
        onClose={() => setShowAlert(false)}
        dismissible
      >
        <Alert.Heading>
          <FaCheckCircle className="me-2" /> Sucesso!
        </Alert.Heading>
        <p>Animal cadastrado com sucesso!</p>
      </Alert>

      {/* Formulário */}
      <Formik
        // Atributos do formik
        // Se for edição, coloca os dados da faculdadeEditada
        // Se for nova, colocar o initialValues com os valores vazios
        initialValues={animalEditado || initialValues}
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

                  <Form.Group as={Col}>
                    <Form.Label>Endereco:</Form.Label>
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
                  <Form.Group as={Col} md={3}>
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

                  <Form.Group as={Col}>
                    <Form.Label>Sexo:</Form.Label>
                    <Form.Select
                      name="sexo"
                      value={values.sexo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.pais !== "Brasil"}
                      isValid={touched.sexo && !errors.sexo}
                      isInvalid={touched.sexo && errors.sexo}
                    >
                      <option value="">Selecione</option>

                      <option value="Macho">Macho</option>
                      <option value="Femea">Fêmea</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.sexo}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Raça:</Form.Label>
                    <Form.Control
                      name="raca"
                      value={values.raca}
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={values.pais !== "Brasil"}
                      isValid={touched.raca && !errors.raca}
                      isInvalid={touched.raca && errors.raca}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.raca}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* botões */}

                <Form.Group as={Col}>
                  <Form.Label>Foto:</Form.Label>
                  <Form.Control
                    name="foto"
                    type="text"
                    placeholder="coloque uma foto do animal  :)"
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
                  <Button className="me-2" href="/animais">
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
