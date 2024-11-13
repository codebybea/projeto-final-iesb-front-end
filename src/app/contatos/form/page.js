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

export default function ContatosFormPage(props) {
  const [showAlert, setShowAlert] = useState(false);
  // router -> hook para navegação de telas
  const router = useRouter();

  // Buscar a lista de animais no localStorage, se não existir, inicializa uma lista vazia
  const contatos = JSON.parse(localStorage.getItem("contatos")) || [];
  const ongs = JSON.parse(localStorage.getItem("ongs")) || [];

  // Recuperando id para edição
  const id = props.searchParams.id;
  console.log(props.searchParams.id);
  // Buscar na lista a animal com o ID recebido no parametro
  const contatoEditado = contatos.find((item) => item.id == id);
  console.log(contatoEditado);

  // função para salvar os dados do form
  function salvar(dados) {
    // Alert
    setShowAlert(true);
    // Se contatosEditado existe, mudar os dados e gravar no localStorage
    if (contatoEditado) {
      Object.assign(contatoEditado, dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("contatos", JSON.stringify(contatos));
    } else {
      // se faculdadeEditada não existe, é criação de uma nova
      // gerar um ID (Identificador unico)
      dados.id = v4();
      // Adiciona a nova faculdade na lista de ongs
      contatos.push(dados);
      // Substitui a lista antiga pela nova no localStorage
      localStorage.setItem("contatos", JSON.stringify(contatos));
    }

    router.push("/contatos");
  }

  // Campos do form e valores iniciais(default)
  const initialValues = {
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    descricao: "",
    ong: "",
    interesse: "",
    check: false,
  };

  // Esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Campo obrigatório"),
    sobrenome: Yup.string().required("Campo obrigatório"),
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    telefone: Yup.string().required("Campo obrigatório"),
    ong: Yup.string().required("Campo obrigatório"),
    interesse: Yup.string().required("Campo obrigatório"),
    descricao: Yup.string().required("Campo obrigatório"),
    check: Yup.boolean().required(
      "É necessário escolher se deseja receber novidades"
    ),
  });

  return (
    <Pagina titulo={"Inscreva-se para receber novidades!"}>
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
        initialValues={contatoEditado || initialValues}
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
                </Row>

                {/* botões */}

                <Form.Group className="mt-3" as={Col}>
                  <Form.Label>Ong de Interesse :)</Form.Label>
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

                <Form.Group className="mt-3" as={Col}>
                  <Form.Label>Assuntos de Interesse :)</Form.Label>
                  <Form.Select
                    name="interesse"
                    value={values.interesse}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.interesse && !errors.interesse}
                    isInvalid={touched.interesse && errors.interesse}
                  >
                    <option value="">Selecione</option>

                    <option value="Adoção">Adoção</option>
                    <option value="Voluntariado">Voluntariado</option>
                    <option value="Ongs">Ongs</option>
                    <option value="AnimaisAdocao">Animais para adoção</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.interesse}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="py-3" as={Col}>
                  <Form.Label>Descrição:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descricao"
                    type="text"
                    placeholder="Diga algo que você gostaria que melhorase no patinhas ou ideias..."
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

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="check"
                    label="Deseja saber informações e novidades de patinhas?"
                    name="check"
                    checked={values.check}
                    onChange={handleChange}
                  />
                  {errors.check && touched.check && (
                    <div className="text-danger">{errors.check}</div>
                  )}
                </Form.Group>
                <Form.Group className="py-4 text-end">
                  <Button className="me-2" href="/contatos">
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
                    <FaCheck /> Increver-se
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
