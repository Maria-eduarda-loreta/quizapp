import { verificarTema, trocarTema } from "../../helpers/tema-helper.js"

const botaoTema = document.querySelector(".tema button")
const body = document.querySelector("body")
const assunto = localStorage.getItem("assunto")

let quiz = {}
let pontos = 0
let pergunta  = 1
let resposta = ""
let respostaCorretaId = ""
let idInputResposta = ""


botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema)
})

verificarTema(body, botaoTema)

function alterarAssunto(){
    const divIcone = document.querySelector(".assunto_icone")
    const iconeImg = document.querySelector(".assunto_icone img")
    const assuntoTitulo = document.querySelector(".assunto h1")

   divIcone.classList.add(assunto.toLowerCase())
   console.log("Teste");
   
    iconeImg.setAttribute("src", `../../assets/images/icon-${assunto.toLowerCase()}.svg`) 
    iconeImg.setAttribute ("alt", `ícone de ${assunto}`)

    assuntoTitulo.innerText = assunto
   
}



async function buscarPerguntas() {
    const urlDados = "../../data.json"

    await fetch(urlDados).then(resposta => resposta.json()).then(dados => {
        dados.quizzes.forEach(dados => {
            if(dados.title === assunto) {
                quiz = dados
            }
        })
    })

console.log(quiz)
}



function montarPergunta(){
    const main = document.querySelector("main")

    main.innerHTML = 
    `
        <section class="pergunta">
            <div>
                <p>Questão ${pergunta} de 10</p>

                <h2>${alterarSinais(quiz.questions[pergunta-1].question)}</h2>
            </div>
                

            <div class="barra_progresso">
                <div style="width: ${pergunta * 10}%"></div>
            </div>
        </section>

        <section class="alternativas">
            <form action="">
                <label for="alternativa_a">
                    <input type="radio" id="alternativa_a" name="alternativa" value=" ${alterarSinais(quiz.question[pergunta-1].options[0])}">

                    <div>
                        <span>A</span>
                        ${alterarSinais(quiz.question[pergunta-1].options[0])}
                    </div>
                </label>

                <label for="alternativa_b">
                    <input type="radio" id="alternativa_b" name="alternativa" value=" ${alterarSinais(quiz.question[pergunta-1].options[1])}">

                    <div>
                        <span>B</span>
                        ${alterarSinais(quiz.question[pergunta-1].options[1])}
                    </div>

                </label>

                <label for="alternativa_c">
                    <input type="radio" id="alternativa_c" name="alternativa" value="${alterarSinais(quiz.question[pergunta-1].options[2])}">

                    <div>
                        <span>C</span>
                         ${alterarSinais(quiz.question[pergunta-1].options[2])}
                    </div>
                </label>

                <label for="alternativa_d">
                    <input type="radio" id="alternativa_d" name="alternativa" value="${alterarSinais(quiz.question[pergunta-1].options[3])}">

                    <div>
                        <span>D</span>
                         ${alterarSinais(quiz.question[pergunta-1].options[3])}
                    </div>
                </label>

            </form>

            <button>Responder</button>

        </section>

    `
}

function alterarSinais(texto) {
    return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function guardarResposta(evento) {
   resposta = evento.target.value
   idInputResposta = evento.target.id 

   const botaoEnviar = document.querySelector(".alternativas button")
    botaoEnviar.addEventListener("click", validarResposta)

}

function validarResposta() {
    const botaoEnviar = document.querySelector(".alternativas button")
    botaoEnviar.removeEventListener("click", validarResposta)
    botaoEnviar.addEventListener("click", proximaPergunta)

    botaoEnviar.innerText = "Próxima"

    if (pergunta === 10) {
        botaoEnviar.innerText = "Finalizar"
        botaoEnviar.addEventListener("click", finalizar)
    } else {
        botaoEnviar.addEventListener("click", proximaPergunta)
    }

    if (resposta === quiz.questions[pergunta-1].answer){
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "correta")
        pontos = pontos + 1
    } else {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "errada")
        document.querySelector(`label[for='${respostaCorretaId}']`).setAttribute("id", "correta")
    }

    pergunta = pergunta + 1
}

function finalizar (){
    localStorage.setItem("pontos", pontos)

    window.location.href = "../resultado/resultado.html"
}

function proximaPergunta () {
    montarPergunta()
    adicionarEventoInputs()
}

function adicionarEventoInputs() {
    const inputsResposta = document.querySelectorAll(".alternativas input")
    inputsResposta.forEach(input => {
        input.addEventListener("click", guardarResposta)

        if (InputEvent.value === quiz.questions[pergunta-1].answer){
            respostaCorretaId = input.id
        }
    })
}

async function iniciar(){
    alterarAssunto()
    await buscarPerguntas()
    montarPergunta()
    adicionarEventoInputs()
}

iniciar()