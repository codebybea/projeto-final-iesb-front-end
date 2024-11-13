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

export default function AdotadoresFormPage(props) {
  const router = useRouter();
  // Criar estados(react) para armazenar os dados dos selects
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Alert State
  const [showAlert, setShowAlert] = useState(false);

  // Buscar a lista de adotadores no localStorage, se não existir, inicializa uma lista vazia
  const adotantes = JSON.parse(localStorage.getItem("adotantes")) || [];
  const animais = JSON.parse(localStorage.getItem("animais")) || [];

  // Recuperando id para edição
  const id = props.searchParams.id;
  console.log(props.searchParams.id);
  // Buscar na lista a animal com o ID recebido no parametro
  const adotantesEditado = adotantes.find((item) => item.id == id);
  console.log(adotantesEditado);

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
    // se adotadoresEditada existe, mudar os dados e gravar no localStorage
    if (adotantesEditado) {
      Object.assign(adotantesEditado, dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("adotantes", JSON.stringify(adotantes));
    } else {
      // se adotantesEditada não existe, é criação de uma nova
      // gerar um ID (Identificador unico)
      dados.id = v4();
      // Adiciona a nova faculdade na lista de ongs
      adotantes.push(dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("adotantes", JSON.stringify(adotantes));
    }
    router.push("/adotadores");
  }

  // Campos do form e valores iniciais(default)
  const initialValues = {
    nome: "",
    sobrenome: "",
    animal: "",
    email: "",
    telefone: "",
    data: "",
    pais: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    foto: "",
    descricao: "",
  };

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    animal: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    pais: Yup.string().required("Campo obrigatório"),
    data: Yup.string().required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    cep: Yup.string().required("Campo obrigatório"),
    foto: Yup.string().required("Campo obrigatório"),
    estado: Yup.string().required("Campo obrigatório"),
    cidade: Yup.string().required("Campo obrigatório"),
    endereco: Yup.string().required("Campo obrigatório"),
    descricao: Yup.string().required("Campo obrigatório"),
  });

  return (
    <Pagina titulo={"Cadastro do Adotante"}>
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
        initialValues={adotantesEditado || initialValues}
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

                  <Row className="mb-2 py-2">
                    <Form.Group as={Col}>
                      <Form.Label>E-mail:</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={values?.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched?.email && !errors?.email}
                        isInvalid={touched?.email && !!errors?.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={3}>
                      <Form.Label>Data de Nascimento:</Form.Label>
                      <Form.Control
                        as={ReactInputMask}
                        mask={"99/99/9999"}
                        placeholder="dd/mm/aaa"
                        name="data"
                        type="text"
                        value={values?.data}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched?.data && !errors?.data}
                        isInvalid={touched?.data && !!errors?.data}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.data}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <Form.Label>Telefone:</Form.Label>
                      <Form.Control
                        as={ReactInputMask}
                        mask={"(99)99999-9999"}
                        placeholder="(99)99999-9999"
                        name="telefone"
                        type="text"
                        value={values?.telefone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched?.telefone && !errors?.telefone}
                        isInvalid={touched?.telefone && !!errors?.telefone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.telefone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

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

                <Form.Group className="mt-2" as={Col}>
                  <Form.Label>Foto do adotante:</Form.Label>
                  <Form.Control
                    name="foto"
                    type="text"
                    placeholder="coloque uma foto sua aqui  :)"
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

                <Form.Group className="mt-3" as={Col}>
                  <Form.Label>Escolha seu amiguinho :)</Form.Label>
                  <Form.Select
                    name="animal"
                    value={values.animal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.animal && !errors.animal}
                    isInvalid={touched.animal && errors.animal}
                  >
                    <option value="">Selecione</option>
                    {animais.map((animal) => (
                      <option value={animal.nome}>{animal.nome}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.animal}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="py-3" as={Col}>
                  <Form.Label>Razões para adotar o animal:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descricao"
                    type="text"
                    placeholder="Descrição breve do animal destacando suas características."
                    value={values.descricao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.descricao && !errors.descricao}
                    isInvalid={touched.descricao && !!errors.descricao}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.descricao}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="py-4 text-end">
                  <Button className="me-2" href="/adotadores">
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
