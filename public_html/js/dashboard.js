var administratorId;
var enrolledNumber;
var mail;
var name;
var password;
var period;
var permission;
var phone;
var studentId;
var teacherId;
var typeUser;
var user;
var userId;
var website;

//console.log($.session._cookieCache.usuario);

$(jQuery.parseJSON($.session._cookieCache.usuario)).each(function () {

    administratorId = this.administratorId;
    enrolledNumber = this.enrolledNumber;
    mail = this.mail;
    name = this.name;
    password = this.password;
    period = this.period;
    permission = this.permission;
    phone = this.phone;
    studentId = this.studentId;
    teacherId = this.teacherId;
    typeUser = this.typeUser;
    user = this.user;
    userId = this.userId;
    website = this.website;

    var nomeParaDashBoard = name.split(" ");

    $("#nome-usuario").text(name);
    $(".nome-perfil-dashboard").val(nomeParaDashBoard[0] + " " + nomeParaDashBoard[1]);
    $(".telefone-perfil-dashboard").val(phone);
    $(".email-perfil-dashboard").val(mail);
    $(".matricula-perfil-dashboard").val(enrolledNumber);
});
/*-----------------------------------------------------------------------------*/
/* global Materialize, aluno */

$('.telefone-perfil-dashboard').mask('(00) 00009-0000');

/*------------------------------------------------------------------------*/

//Função que mostra o "carregando" na tela.
function carregando() {
    $(".preloader-wrapper").show();
}

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
/*     DROP DOWN DAS MATERIAS     */

$('li.icon-materias').click(function () {
    $('.minhas-materias-adicionadas').slideToggle(500);
    closeImgChangeButton();
});

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
/*     RECUPERA ÍNDICES     */
var flagOpenIndices = true;
$('.perfil .collapsible-header').click(function () {
    mapDeLinguagens.clear();
    $('section').scrollTo('.wrapper1');
    var idGlobal = $('#id-usuario').html();
    if (flagOpenIndices === true) {
        $('.pie-chart__legend').empty();
        pegaIndicesAJAX(idGlobal);
        flagOpenIndices = false;
    } else {
        $('.pie-chart__legend').empty();
        flagOpenIndices = true;
    }
});


/*-----------------------------------------------------------------------------*/
/*    Na escolha da opção no menu substitui a pagina inicial      */

/*    Na escolha da opção no menu substitui a pagina inicial      */
/*    Esses sinais chevron significam diretamente filhos, para que n pegue o sub-menu como função click tbm */
$("ul.para-scroll > li").click(function () {
    closeImgChangeButton();
    $("main > section.minhas-materias").empty();
    $('ul label li').removeClass('fundo-checked');
    //remove a tela que está aparecendo
    $("section").removeClass("section-aparece");

    //fecha o menu de minhas materias
    var textoDoClique = $(this).children("span").text();
    if (textoDoClique !== 'Minhas matérias') {
        $('.minhas-materias-adicionadas').slideUp();
        $('.aviso-minhas-materias').hide();
        abreComBotaoCelular();
        // se for gerenciar materias, monta o gerenciar materias.
        if (textoDoClique === "Gerenciar matérias") {
            $(".adicionar-materias div.box-padrao .row > ul.collapsible").empty();
            retornaMaterias();
        } else if (textoDoClique === "Perfil") {
            $('.pie-chart__legend').empty();
            var idGlobal = $('#id-usuario').html();
            mapDeLinguagens.clear();
            pegaIndicesAJAX(idGlobal);
        }


    } else {
        $('.aviso-minhas-materias').show();
    }
    // Aplica a classe para aparecer alguma section
    var classe = '.' + $(this).children("span").attr("id");
    qualApareceNaTela(classe);
});

function qualApareceNaTela(classe) {
    $("section").hide();
    $(".site-content").find(classe).addClass("section-aparece");
    //Se tiver a section-aparece, ele exibe ela na tela.
    if ($("section").hasClass("section-aparece")) {
        $(this).show();
    }
    MontaCondicoesBotaoModal($(this).children("span").text());
}
;

/*-----------------------------------------------------------------------------*/
/*    Adiciona as materias   */

//  Estamos com variável global aqui e ainda não pensei numa solução, visto que queremos q carregue junto com a página.

var materias = [];
var periodoMateria = [];
pegaMateriasComAjax();
var lista = $(".lista-materias");
var minhasMaterias = lista.parent();

//  Essa função preenche o vetor matérias de acordo com o retorno do ajax que busca as mastérias cadastradas pelo usuário.
// Caso esse vetor esteja vazio, ele retorna uma mensagem pro cara cadastrar nas materias.
function preencheAListaDeMateriasDoMenu() {
    lista.detach().empty().each(function (i) {

        if (materias.length === 0) {
            materias.push("Você ainda não tem nenhuma matéria cadastrada!");
        }

        for (var x = 0; x < materias.length; x++) {

            // Isso aqui é um remédio caso ocorra, acho que não tem situação em que possa occorer, mas... É mais um cuidado.
            // Enfim, caso o array materias chegue aqui com a mensagem de não tem matérias, ele remove essa mensage antes de gerar a lista de materias cadastradas.
            var a = materias.indexOf("Você ainda não tem nenhuma matéria cadastrada!");
            if (a !== 0) {
                for (var i = materias.length - 1; i >= 0; i--) {
                    if (materias[i] === "Você ainda não tem nenhuma matéria cadastrada!") {
                        materias.splice(i, 1);
                    }
                }
            }
            // Aqui preenche a lista de materias com as matérias que o cara tem cadastradas.
            $(this).append('<input type="radio" name="materias-radio" id="materia' + x + '" style="display:none!important" /><label for="materia' + x + '"><li><span>' + materias[x] + '</span></li></label>');
            if (x === materias.length - 1) {
                $(this).appendTo(minhasMaterias);
            }
        }
    });
}
;

//Função que pega as matérias do usuário e armazena em um array
// Aqui, quando ele faz a requisição das materias cadastradas, ele fica exibindo uma barrinha de loading.
// Quando retorna com sucesso as materias, ele troca o loading pelas materias q o cara tem cadastradas.
// Ou se retornar insucesso, ele mostra mensagem para cadastrar em alguma matéria.
function pegaMateriasComAjax() {
    var loading = $(".lista-materias");
    var li = document.createElement("li");
    var progress = document.createElement("div");
    progress.setAttribute("class", "progress");
    var indeterminate = document.createElement("div");
    indeterminate.setAttribute("class", "indeterminate");
    progress.append(indeterminate);
    li.append(progress);

    $.ajax({
        url: "https://ifcommunity.herokuapp.com/matter/user?studentId=" + studentId,
        type: 'get',
        beforeSend: function () {
            loading.append(li);
        }
    })
            .done(function (materia) {
//                console.log((materia));
                loading.empty();

                $(jQuery.parseJSON(JSON.stringify(materia))).each(function () {
                    var matterId = this.matterId;
                    var matterName = this.matterName;
                    var period = this.period;
//                    materias.push(matterId);
                    materias.push(matterName);
//                    materias.push(period);
                });

                preencheAListaDeMateriasDoMenu();
                checkedNasMateriasDoMenu();

            })
            .fail(function (jqXHR, textStatus, materia) {
                loading.empty();
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
                preencheAListaDeMateriasDoMenu();
            });
}

/*-----------------------------------------------------------------------------*/

/*           Checked img na matéria (submenu) que está selecionada         */
/* ela tem que carregar após as matérias serem carregadas para funcionar   */

/* NESSE PONTO QUE PEGA QUAL MATÉRIA ESTAMOS QUERENDO POSTAR               */

function checkedNasMateriasDoMenu() {
    $("input[name='materias-radio']").click(function () {
        $('.aviso-minhas-materias').hide();
        var qualMateria;
        if ($(this).is(':checked')) {
            $('ul label li').removeClass('fundo-checked');
            $(this).next('label').children('li').addClass('fundo-checked');
            qualMateria = $(this).next('label').children('li').children("span").text();
        }
        closeImgChangeButton();
        limpaCamposPostagem();
        MontaCondicoesBotaoModal(qualMateria);
        abreComBotaoCelular();
        pegaPostagensDaMateriaSelecionada();
    });
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*    Botão para abrir menu do celular   */

// É em toggle pra não precisar identificar se tá aberto ou não, ele faz o switch da class sozinho.
function abreComBotaoCelular() {
    $(".nav-side .nav-toggle").parent().toggleClass("nav-open");
    closeImgChangeButton();
}
;

$(".nav-side .nav-toggle").on("click", function (e) {
    e.preventDefault();
    $(this).parent().toggleClass("nav-open");
    closeImgChangeButton();
});
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*              Plugin dos selects                          */

$(document).ready(function () {
    $('select').material_select();
});
$('select').material_select('destroy');

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*                Sidebar para postar os codigos, ou seja, aquele botão com <> que clica e abre o modal.                    */

/*  esconde e mostra a opção de publicação dependendo da página que está  */

// O botão de postagem não some se o click for em "minhas matérias ou em qualquer submenu do mesmo.

function MontaCondicoesBotaoModal(TextoValidacao) {
    // Esta variável TextoValidacao é uma flag, pra saber se deixa ou nao visivel o botao do modal
    //Monta Array com "Minhas matérias e com as matérias em que o usuário está inscrito.
    var StringQueNaoEscondemOBotaoDePublicacao = [];
    // Clona o vetor que tem a lista de matérias cadastradas
    StringQueNaoEscondemOBotaoDePublicacao = materias.slice(0);
    //Agora chama a função do botão passando como argumento o array de nomes.
    apareceBotaoAbrirModal(TextoValidacao, StringQueNaoEscondemOBotaoDePublicacao);
}

function apareceBotaoAbrirModal(TextoValidacao, StringQueNaoEscondemOBotaoDePublicacao) {
    // Verifica se o array tem a String do botão clicado.
    if (StringQueNaoEscondemOBotaoDePublicacao.includes(TextoValidacao)) {
        $(".botao-modal").show();
    } else {
        $(".botao-modal").hide();
    }
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*                Modal de publicação                     */

// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered

$('#modal1').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .8, // Opacity of modal background
    inDuration: 400, // Transition in duration
    outDuration: 250, // Transition out duration
    startingTop: '90%', // Starting top style attribute
    endingTop: '15%' // Ending top style attribute
});

$('#modal-buscar').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .8, // Opacity of modal background
    inDuration: 400, // Transition in duration
    outDuration: 250, // Transition out duration
    startingTop: '90%', // Starting top style attribute
    endingTop: '25%' // Ending top style attribute
});

$('#modal-foto').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .8, // Opacity of modal background
    inDuration: 400, // Transition in duration
    outDuration: 250, // Transition out duration
    startingTop: '90%', // Starting top style attribute
    endingTop: '25%' // Ending top style attribute
});

/*-----------------------------------------------------------------------------*/
// Eventos para escrever o código.

escreverCodigo();

function escreverCodigo() {
    $("#modal-de-escrever-codigo").click(function () {
        // Quando muda o select do modal, adiciona o textarea de acordo com a linguagem escolhida
        $('#formDoModal select').change(function (e) {
            var val = $(e.target).val();
            var text = $(e.target).find("option:selected").text();
            var linguagem = text.toLowerCase();
            if (linguagem == 'selecione a linguagem') {
            } else {
                adicionaOsTextAreaModal(linguagem);
            }

        });
    });
}
;

function adicionaOsTextAreaModal(text) {
    $('.paraCodigo').show();
    qualLinguagem(text);
}
;
/*-----------------------------------------------------------------------------*/
/*                Highlight dos escritos dos códigos   Ace js                   */

var editor = ace.edit("editor");
editor.setTheme("ace/theme/xcode");
editor.session.setMode("ace/mode/javascript");
editor.setShowPrintMargin(false);

function qualLinguagem(text) {
    if (text == 'texto') {
        text = 'text';
    }
    var novoModo = text.toLowerCase();
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.session.setMode("ace/mode/" + novoModo);
    editor.setShowPrintMargin(false);
}

function qualLinguagemParaPostagem(text, IDPostagem) {
    // precisa mudar o modo de acordo com o modo que retornar do banco.
    if (text == 'texto') {
        text = 'text';
    }
    var novoModo = text.toLowerCase();
    var editor = ace.edit("editorLeitura" + IDPostagem);
    editor.setTheme("ace/theme/xcode");
    editor.session.setMode("ace/mode/" + novoModo);
    editor.setReadOnly(true);
    editor.setShowPrintMargin(false);
}

/*-----------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

/*                  Postagens colapsadas                   */
function collapsible() {
    $('.collapsible').collapsible();
}

function trocaMaxMinBoxPostagens() {
    $('#body-principal section.minhas-materias > ul.collapsible > li > div.collapsible-header').click(function () {
        if ($(this).find(".btns > div").is('.max')) {
            $(this).find(".btns > div").removeClass("max").addClass("min");
        } else {
            $(this).find(".btns > div").removeClass("min").addClass("max");
        }
    });
}
;

/*---------------------------------------------------------*/
//Função que pega as postagems e armazena em um array
/*---------------------------------------------------------*/


// Seguinte:
// Mudei o fluxo pra acabar com aquelas requisições que só aconteciam da segunda vez.
// Agora essa primeira função aqui com o SetTimeout, que tem esse setTimeout por causa da primeira requisição 
// que trás a lista de matérias, que chama a requisição ajax.
// 
// Depois, a função que monta as postagens é chamada pela função ajax apenas quando a requisição acaba (.done).
//
// Essa função que enche o array de postagens e começa a distribuir as postagens na tela.
//
// Qualquer dúvida é só descomentar os console.log de fluxo que tem abaixo..


var postagens = [];

function pegaPostagensDaMateriaSelecionada() {
    var materia;
    materia = $(".fundo-checked").children().text();
    if (materia === "Você ainda não tem nenhuma matéria cadastrada!") {
        $('.minhas-materias-adicionadas').slideUp();
        console.log($("main > section.minhas-materias"))
        $("main > section.minhas-materias").empty();
        $('ul label li').removeClass('fundo-checked');
        $("section").removeClass("section-aparece");
        $(".adicionar-materias div.box-padrao .row > ul.collapsible").empty();
        retornaMaterias();
        qualApareceNaTela(".adicionar-materias");
    } else {
        $("main > section.minhas-materias").empty();
        pegaPostagens(materia);
    }
}

function pegaPostagens(materia) {
    Materialize.Toast.removeAll();

    $.ajax({
        url: "https://ifcommunity.herokuapp.com/post?name=" + materia + "&lastPost=",
        type: 'get',
        beforeSend: function () {
            carregando();
        }
    })
            .done(function (postagem) {
//                console.log(postagem);
                postagens = [];
                $("main > section.minhas-materias").empty();

                postagens = postagem;

                $(".preloader-wrapper").hide();
                montaPostagens(postagens);
            })
            .fail(function (jqXHR, textStatus, postagem) {
                Materialize.toast('Erro ao recuperar postagens, contate um administrador!', 6000, 'red');
                $(".preloader-wrapper").hide();
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
            });
}


/*------------------------------------------------------------------------*/

//Função que prepara o texto da postagem e chama a fução que cria e adiciona na tela
function montaPostagens(postagens) {
    $(".minhas-materias").empty();
    postagens.reverse();
    $(jQuery.parseJSON(JSON.stringify(postagens))).each(function (index) {
        var x = index;
        var textoPostagem = this.postText;
        var autorPostagem = this.authorName;
        var tituloPostagem = this.title;
        var dataPostagem = this.registerDate; 
        var materiaPostagem = this.matterName;
        var IDPostagem = this.postId;
        var linguagemPostagem = this.programmingLanguage;
        // console.log(linguagemPostagem);
        adicionaPostagens(textoPostagem, autorPostagem, tituloPostagem, dataPostagem, materiaPostagem, IDPostagem, x);
        collapsible();
        if (linguagemPostagem == 'selecione a linguagem') {
        } else {
            qualLinguagemParaPostagem(linguagemPostagem, IDPostagem);
        }
    });

    if (postagens.length === 0) {
        $(".minhas-materias").empty();
        $(".minhas-materias").prepend("<div class='aviso-falta-postagens container box-padrao'><h3>Não foram encontradas postagens dessa matéria</h3><div class='page-footer'><div class='container'><div class='row'><div class='col l6 s12 center-align'><h5 class='black-text'>Ainda não foi postado nada dessa matéria!</h5></div><div class='col l4 offset-l2 s12'><h5>Seja o primeiro a compartilhar algo da disciplina!</h5></div></div></div></div></div>");
    } else {
        $(".minhas-materias").append("<button class='btn btn-wave' type='button' id='pega-mais-postagens'>Carregar mais...</button>");
    }

    trocaMaxMinBoxPostagens();
}

//Função que adiciona a estrutura de postagem
function adicionaPostagens(textoPostagem, autorPostagem, tituloPostagem, dataPostagem, materiaPostagem, IDPostagem, x) {

    //Manipulação da data da postagem
    var temporarioData = dataPostagem.split(" ");
    var temporarioHora = temporarioData[1].split(".");

    //Manipulação da hora da postagem
    var horaPostagem = temporarioHora[0];
    horaPostagem = horaPostagem.split(":");
    horaPostagem = horaPostagem[0] + ":" + horaPostagem[1];

    //Manipulação do dia da postagem
    var dataPostagemTemp = temporarioData[0];
    dataPostagemTemp = dataPostagemTemp.split("-");
    dataPostagemTemp = dataPostagemTemp[2] + "/" + dataPostagemTemp[1] + "/" + dataPostagemTemp[0];

    //Concatenação da data e hora manipulada
    dataPostagem = "às " + horaPostagem + " " + dataPostagemTemp;

    var secaoDePostagens = $("main > section.minhas-materias");
    var criaUl = document.createElement("ul");
    var criaLi = document.createElement("li");
    var criaDivHead = document.createElement("div");
    var criaUlHead = document.createElement("ul");
    var criaLiBrowse = document.createElement("li");
    var criaLiHead1 = document.createElement("li");
    var criaLiHead2 = document.createElement("li");
    var criaH4Titulo = document.createElement("h4");
    var criaPNome = document.createElement("p");
    var criaPSeta = document.createElement("p");
    var criaDivBody = document.createElement("div");
    var criaPreBody = document.createElement("pre");
    var criaDivBotões = document.createElement("div");
    var criaALike = document.createElement("a");
    var criaILike = document.createElement("i");
    var criaADislike = document.createElement("a");
    var criaIDislike = document.createElement("i");
    var criaPDataPostagem = document.createElement("p");
    criaDivHead.setAttribute("class", "collapsible-header");
    criaH4Titulo.setAttribute("class", "center");
    criaH4Titulo.innerHTML = tituloPostagem;
    criaPNome.innerHTML = autorPostagem + "<br><span class='data-postagem' id='data-hora-postagem-'" + IDPostagem + ">" + dataPostagem;
    criaPNome.setAttribute("class", "right-align autor-postagem");
    criaPSeta.setAttribute("class", "setinha-indicadora center");
    criaUlHead.setAttribute("class", "container");
    criaDivBody.setAttribute("class", "collapsible-body");
    criaPreBody.setAttribute("id", "editorLeitura" + IDPostagem);
    criaPreBody.setAttribute("class", "paraCodigoPostagens");
    criaPreBody.innerHTML = textoPostagem;
    criaDivBotões.setAttribute("class", "botoes-das-postagens right-align");
    criaALike.setAttribute("class", "waves-effect waves-light btn right-align botao-curtida");
    criaILike.setAttribute("class", "material-icons left");
    criaILike.innerHTML = "thumb_up";
    criaDivBotões.setAttribute("class", "botoes-das-postagens right-align");
    criaADislike.setAttribute("class", "waves-effect waves-light btn right-align botao-curtida");
    criaIDislike.setAttribute("class", "material-icons left");
    criaIDislike.innerHTML = "thumb_down";
    criaDivBotões.setAttribute("id", IDPostagem);
    criaUl.setAttribute("class", "collapsible content-topic z-depth-2 container row");
    criaUl.setAttribute('data-collapsible', "accordion");
    criaLiBrowse.innerHTML = "<div class='browser'><div class='btns'><div class='max'></div></div></div>";


    criaLiHead1.append(criaH4Titulo);
    criaLiHead2.append(criaPNome);
    criaLiHead2.append(criaPSeta);
    criaUlHead.append(criaLiBrowse);
    criaUlHead.append(criaLiHead1);
    criaUlHead.append(criaLiHead2);
    criaDivHead.append(criaUlHead);
    criaDivBody.append(criaPreBody);
    criaALike.append(criaILike);
    criaADislike.append(criaIDislike);
    criaDivBotões.append(criaALike);
    criaDivBotões.append(criaADislike);
    criaDivBody.append(criaDivBotões);
    criaLi.setAttribute("id", IDPostagem);
    criaLi.append(criaDivHead);
    criaLi.append(criaDivBody);
    criaUl.append(criaLi);
    criaUl.setAttribute("id", IDPostagem);
    // quando criar a regra de retorno do banco decide o prepend ou append.
    secaoDePostagens.prepend(criaUl);

    if (x === (postagens.length - 1)) {
        secaoDePostagens.append("<div class='rodape'></div>");
    }
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
//          GERENCIAR MATERIAS    

// Primeiro, do vetor com as matérias que ele já tem e os períodos delas.
// O vetor das materias, ja temos, agora falta o dos períodos.


function retornaMaterias() {
    $.ajax({
        url: "RecuperaMateriasTelaAdicionar",
        type: 'post',
        timeout: 6000,
        beforeSend: function () {
            $("#section-materias #div-loading").show();
        }
    })
            .done(function (materiasJSON) {
                $("#section-materias #div-loading").hide();
                periodoMateria = [];

                $(".adicionar-materias div.box-padrao .row > ul.collapsible").empty();
                for (var i = 0; i < materiasJSON.length; i++) {
                    periodoMateria.push(materiasJSON[i]);
                }

                gerenciarMateriasConteudo();

            })
            .fail(function (jqXHR, textStatus, postagem) {
                $("#section-materias #div-loading").slideUp(500);
                Materialize.Toast.removeAll();
                Materialize.toast('Erro ao recuperar matérias, contate um administrador!', 6500, 'red');
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
            });
}

function gerenciarMateriasConteudo() {
    var todosOsPeriodosRecebidos = [];

    for (var x = 0; x < periodoMateria.length; x++) {
        var periodoMateriaSplit = periodoMateria[x].split(";");
        todosOsPeriodosRecebidos.push(periodoMateriaSplit[1]);
    }
    // tirar os duplicados pra ver os períodos que tem
    var periodosQueTem = todosOsPeriodosRecebidos.filter(function (este, i) {
        return todosOsPeriodosRecebidos.indexOf(este) === i;
    });
    adicionaPeriodos(periodosQueTem);

    function adicionaPeriodos(periodosQueTem) {
        var periodosQueTemOrdenados = periodosQueTem.sort();

        for (var x = 0; x < periodosQueTem.length; x++) {
            var criaTextoDoBody = document.createElement("p");
            var criaDivBody = document.createElement("div");
            var criaDivHeader = document.createElement("div");
            var nomeDoCriaLi = ("criaLi" + periodosQueTemOrdenados[x]);
            nomeDoCriaLi = document.createElement("li");
            criaDivBody.setAttribute("class", "collapsible-body row");
            criaDivBody.setAttribute("id", periodosQueTemOrdenados[x]);
            criaDivHeader.setAttribute("class", "collapsible-header");
            criaDivHeader.appendChild(document.createTextNode(periodosQueTemOrdenados[x] + "° Período"));
            nomeDoCriaLi.append(criaDivHeader);
            nomeDoCriaLi.append(criaDivBody);
            $(".adicionar-materias div.box-padrao .row > ul.collapsible").append(nomeDoCriaLi);
        }
    }


    criaLinhasDeMaterias(periodosQueTem, periodoMateria);

    function criaLinhasDeMaterias(periodosQueTem, periodoMateria) {
        periodoMateria.sort();
        for (var x = 0; x < periodoMateria.length; x++) {
            // Pegar nome da matéria
            var periodoMateriaSplit = periodoMateria[x].split(";");
            var materia = periodoMateriaSplit[0];
            var periodo = periodoMateriaSplit[1];

            var criaNomeMateria = document.createElement("span");
            var criaLi = document.createElement("li");
            var nomeDoCriaLabel = ("criaLabel" + [x]);
            nomeDoCriaLabel = document.createElement("label");
            var nomeDoCriaInput = ("criaInput" + [x]);
            nomeDoCriaInput = document.createElement("input");
            criaNomeMateria.appendChild(document.createTextNode(materia));
            criaLi.append(criaNomeMateria);
            nomeDoCriaLabel.setAttribute("for", "test" + x);
            nomeDoCriaLabel.setAttribute("class", "col s12");
            nomeDoCriaLabel.append(criaLi);
            nomeDoCriaInput.setAttribute("type", "checkbox");
            nomeDoCriaInput.setAttribute("id", "test" + x);
            nomeDoCriaInput.setAttribute("name", materia);
            $(".adicionar-materias div.box-padrao .row > ul.collapsible  li").find("div.collapsible-body").each(function () {
                if (this.id === periodo) {
                    this.append(nomeDoCriaInput);
                    this.append(nomeDoCriaLabel);
                }

            });
        }
    }

    var todosOsCheckBox = $("input[type='checkbox']");
    todosOsCheckBox.each(function () {
        var temNoArrayDeMateriasOuNao = materias.indexOf($(this).attr('name'));
        if (temNoArrayDeMateriasOuNao === -1) {
            // console.log("se entrou aqui é pq n tem a materia cadastrada");
        } else {
            // console.log("se entrou aqui é pq tem a materia cadastrada");
            // console.log($(this).attr('name'));
            if ($(this).prop("checked", false)) {
                $(this).prop("checked", true);
            }
        }
    });
}
;

// PEGAR TODOS OS CHECKED BOX CHECADOS PRA VER AS MATÉRIAS QUE O CARA TÁ CADASTRANDO EM TEMPO REAL
$(document).on("change", "input[type='checkbox']", atualizaMaterias);

function atualizaMaterias() {
    // clona o vetor de materias.
    novoVetorDeMaterias = materias.slice(0);

    if (this.checked) {
        // console.log($(this).attr('name'));
        // verifica se já tem a matéria no array de matérias, se não tiver, adiciona ela com ajax.
        var temNoArrayDeMateriasOuNao = materias.indexOf($(this).attr('name'));
        // console.log(temNoArrayDeMateriasOuNao);
        if (temNoArrayDeMateriasOuNao === -1) {
            // console.log("não tem");

            // Limite de matérias
            if (novoVetorDeMaterias.length >= 7) {
                Materialize.Toast.removeAll();
                Materialize.toast('Você já atingiu o máximo de matérias, remova alguma antes!', 2500, 'red');
                $(this).prop("checked", false);
                return;
            }

            novoVetorDeMaterias.push($(this).attr('name'));
            // console.log(novoVetorDeMaterias);
            // console.log("se um");
            materias = novoVetorDeMaterias.slice(0);
            materias.sort();
            // console.log(materias);
            preencheAListaDeMateriasDoMenu();
            checkedNasMateriasDoMenu();
        }
    } else {
        //  console.log($(this).attr('name'));
        var index = novoVetorDeMaterias.indexOf($(this).attr('name'));
        //  console.log(index);
        novoVetorDeMaterias.splice(index, 1);
        // console.log(novoVetorDeMaterias);
        // console.log("se dois");
        materias = novoVetorDeMaterias.slice(0);
        materias.sort();
        // console.log(materias);
        preencheAListaDeMateriasDoMenu();
        checkedNasMateriasDoMenu();
    }

    atualizaMateriasTelaAdicionar(materias, $("#id-usuario").text());

    function atualizaMateriasTelaAdicionar(materias, id) {
        Materialize.Toast.removeAll();
        console.log(materias);
        $.ajax({
            url: "AtualizaMateriaTelaAdicionar",
            type: 'get',
            data: {
                materia1: materias[0],
                materia2: materias[1],
                materia3: materias[2],
                materia4: materias[3],
                materia5: materias[4],
                materia6: materias[5],
                materia7: materias[6],
                idUsuario: id
            },
            beforeSend: function () {
                // console.log("Atualizando as matérias");
            }
        })
                .done(function () {
                    Materialize.toast('Matéria atualizada com sucesso!', 2500, 'green');
                    //    console.log("Materias atualizadas com sucesso!");
                })
                .fail(function (jqXHR, textStatus, resultado) {
                    if (jqXHR["status"] === 500) {
                        console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                    } else if (jqXHR["status"] === 502) {
                        console.log("Erro 502, não foi possível estabelecer conexão!");
                    } else if (jqXHR["status"] === 404) {
                        console.log("Erro 404, não foi encontrado o diretório solicitado!");
                    }
                });
    }
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//Função que desloga o usuário
function deslogar() {
    $.ajax({
        url: "Deslogar",
        type: 'get'
    })
            .done(function () {
                window.location.href = "index.jsp";
            })
            .fail(function (jqXHR, status, data) {
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
            });
}

//Chama a função de deslogar quando clica dentro do item
$("#li-deslogar").on('click', function (e) {
    e.preventDefault();
    deslogar();
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
//ATUALIZAÇÃO DE PERFIL
$("#btn-atualizar-perfil").click(function () {
    var aluno = [];
    atualizaPerfilAJAX(userId, $(".nome-perfil-dashboard").val(), $(".telefone-perfil-dashboard").val(), $(".email-perfil-dashboard").val());
});

//Limpa os campos do perfil
$("#btn-limpar-perfil").click(function () {
    if (confirm("Tem certeza que deseja limpar todos os campos?")) {
        $(".nome-perfil-dashboard").val("");
        $(".telefone-perfil-dashboard").val("");
        $(".email-perfil-dashboard").val("");
        $("#btn-atualizar-perfil").addClass("disabled");
    }
});

//Função que muda nome do perfil após atualizar perfil
function atualizaNomePerfil() {
    var nomePerfil = aluno[0];

    nomePerfil = nomePerfil.split(" ");
    if (nomePerfil.length > 1) {
        nomePerfil = nomePerfil[0] + " " + nomePerfil[1];
    } else {
        nomePerfil = nomePerfil[0];
    }

    $("#nome-usuario").text(nomePerfil);
}

//Função que atualiza os dados do usuario e retorna os novos dados inseridos no banco
function atualizaPerfilAJAX(id, nome, telefone, email) {
    Materialize.Toast.removeAll();

    console.log(id);
    console.log(nome);
    console.log(telefone);
    console.log(email);

    telefone = telefone.split("(");
    telefone = telefone[1].split(")");
    telefone = telefone[0] + telefone[1];
    telefone = telefone.split(" ");
    telefone = telefone[0] + telefone[1];
    telefone = telefone.split("-");
    telefone = telefone[0] + telefone[1];

    $.ajax({
        url: "https://ifcommunity.herokuapp.com/user/update",
        type: 'post',
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify({
            userId: id,
            name: nome,
            phone: telefone,
            mail: email
        }),
        beforeSend: function () {
            $("#section-perfil #div-loading").slideDown(500);
        }
    })
            .done(function (alunoJSON) {
                $("#section-perfil #div-loading").slideUp(500);

                aluno = [];
                $(jQuery.parseJSON(JSON.stringify(alunoJSON))).each(function () {
                    var name = this.name;
                    aluno.push(name);
                });

                atualizaNomePerfil();
                Materialize.toast('Perfil atualizado com sucesso!', 2500, 'green');

            })
            .fail(function (jqXHR, textStatus, postagem) {
                $("#section-perfil #div-loading").slideUp(500);
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }

                Materialize.toast('Erro ao atualizar o perfil, contate um administrador!', 2500, 'red');
            });
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

// Parte que valida o formulário de perfil

validacaoFormulario(".nome-perfil-dashboard", "#erro-nome-perfil-dashboard", /^[a-záàâãéèêíïóôõöúçñ ]{3,}[a-záàâãéèêíïóôõöúçñ \s]+$/i, "Informe um nome válido!");
validacaoFormulario(".telefone-perfil-dashboard", "#erro-telefone-perfil-dashboard", /^\(0?[1-9]{2}\)\s9?[0-9]{4}\-[0-9]{4}$/, "Informe um celular válido!");
validacaoFormulario(".email-perfil-dashboard", "#erro-email-perfil-dashboard", /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "Informe um email válido!");

function validacaoFormulario(campo, span, regex, mensagem) {
    $(campo).on("blur", function () {
        if ($(campo).val().length === 0) {
            $(span).text("Campo obrigatório!");
            $(campo).addClass("erro-label-input");
            $(span).fadeIn(500);
        } else {
            $(campo).addClass("erro-label-input");
            if (regex.test(this.value) && campo !== "#matricula") {
                // console.log(this.value);
                // console.log(regex.test(this.value));
                $(span).fadeOut(2000);
                $(campo).addClass("sucesso-label-input");
                $(campo).removeClass("erro-label-input");
            } else {
                // console.log(this.value);
                $(span).text(mensagem);
                $(span).hide();
                $(span).fadeIn(500);
                $(campo).addClass("erro-label-input");
                $(campo).removeClass("sucesso-label-input");
            }

            if (/^[a-záàâãéèêíïóôõöúçñ]{3,}[a-záàâãéèêíïóôõöúçñ\s]+$/i.test($(".nome-perfil-dashboard").val())
                    && /^\(0?[1-9]{2}\)\s9?[0-9]{4}\-[0-9]{4}$/.test($(".telefone-perfil-dashboard").val())
                    && /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($(".email-perfil-dashboard").val())) {
                $("#btn-atualizar-perfil").removeClass("disabled");
            } else {
                $("#btn-atualizar-perfil").addClass("disabled");
            }
        }
    });
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
//Submissão de postagens

$("#btn-submeter-postagem").click(function (evento) {
    evento.stopPropagation();
//    console.log("entrou no submit");
//    console.log($('#formDoModal select').find("option:selected").text().toLowerCase());
//    console.log(editor.getValue());
//    console.log($(".fundo-checked").children().text());
//    console.log($("#nome-usuario").text());

    var assunto = $("[name='assunto']").val();
    var linguagem = $('#formDoModal select').find("option:selected").text().toLowerCase();
    var conteudoDaPostagem = editor.getValue();
    var qualMateria = $(".fundo-checked").children().text();
    var nomeDoUsuario = $("#id-usuario").text();

    var quantosCaracteresPostagem = conteudoDaPostagem.split("");
    var quantosCaracteresAssunto = assunto.split("");

    var assuntoTamanho = quantosCaracteresAssunto.length;
    var postagemTamanho = quantosCaracteresPostagem.length;

    var testaAssunto = testaPost(assunto);
    if (testaAssunto && linguagem != 'selecione a linguagem' && postagemTamanho >= 50 && (assuntoTamanho <= 20 && assuntoTamanho >= 5)) {
        adicionaPostagemNoBanco(assunto, linguagem, conteudoDaPostagem, qualMateria, nomeDoUsuario);
        $('#modal1').modal('close');
    } else {
        if (testaAssunto == false) {
            Materialize.toast('Preencha o assunto da postagem corretamente', 6000, 'red');
        } else if (assuntoTamanho > 20) {
            Materialize.toast('Você não pode postar um assunto tão extenso, resuma o mesmo!', 6000, 'red');
        } else if (assuntoTamanho < 5) {
            Materialize.toast('Você não pode postar um assunto tão pequeno, explique mais!', 6000, 'red');
        } else if (linguagem == 'selecione a linguagem') {
            Materialize.toast('Selecione a linguagem do código', 6000, 'red');
        } else if (postagemTamanho < 50) {
            Materialize.toast('Você não pode postar um código tão pequeno, aproveite o espaço!', 6000, 'red');
        } else {
            Materialize.toast('Erro ao adicionar postagem, contate um adiministrador', 6000, 'red');
        }
    }
});

function testaPost(texto) {
    var regex = /^[a-záàâãéèêíïóôõöúçñ0-9 ]+$/i;
    var teste = regex.test(texto);
    if (teste) {
        return true;
    } else {
        return false;
    }
}

function limpaCamposPostagem() {
    $("[name='assunto']").val("");
    $('#formDoModal select').prop('selectedIndex', 0);
    $('#formDoModal select').material_select();
    editor.setValue("");
    $('.paraCodigo').hide();
}

function adicionaPostagemNoBanco(assunto, linguagem, conteudoDaPostagem, qualMateria, nomeDoUsuario) {
    $.ajax({
        url: "AdicionaPostagem",
        type: 'get',
        timeout: 8000,
        data: {
            assunto: assunto,
            linguagem: linguagem,
            conteudoDaPostagem: conteudoDaPostagem,
            qualMateria: qualMateria,
            nomeDoUsuario: nomeDoUsuario
        },
        beforeSend: function () {
            carregando();
        }
    })
            .done(function (postagem) {
                pegaPostagens(qualMateria);
                limpaCamposPostagem();
                Materialize.toast('Postagem enviada com sucesso!', 6000, 'green');
            })
            .fail(function (jqXHR, textStatus, postagem) {
                Materialize.toast('Erro ao adicionar postagem, contate um administrador!', 6000, 'red');
                $(".preloader-wrapper").hide();
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
            });
}

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
// Página de ajuda

$('ul.tabs').tabs();
/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// Tratamento de imagem.
var numFiles = 0;
var ImageURL = '';
var landscape = $('.my-image');

$('.avatar').hover(function (e) {
    e.preventDefault();
    if (numFiles === 0 && ImageURL === '') {
        $('#imgChangeButton').show();
        $('#imgChangeButton').css('visibility', 'visible');
        $('#btn-save-cncl').hide();
    }
});

$('#profileImg').click(function (e) {
    e.preventDefault();
    if (numFiles === 0 && ImageURL === '') {
        $('#imgChangeButton').show();
        $('#imgChangeButton').css('visibility', 'visible');
        $('#btn-save-cncl').hide();
    }
});

$('#fileUpload').click(function (event) {
    var target = event.target || event.srcElement;
    $('#imgChangeButton').text("Escolha a imagem");
    if (target.value.length === 0) {
    } else {
        numFiles = target.files.length;
    }
});

$('#fileUpload').change(function (event) {
    var target = event.target || event.srcElement;
    if (target.value.length === 0) {
        if (numFiles === target.files.length) {
        }
    } else {
        var ext = this.value.match(/\.([^\.]+)$/)[1];
        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'bmp':
            case 'png':
                imgFormatAccepted(ext);
                break;
            default:
                Materialize.toast('Formato ' + ext + ' de imagem inválido!', 6000, 'red');
                this.value = '';
        }
    }

    function imgFormatAccepted(ext) {
        numFiles = target.files.length;

        // Trata o nome que a imagem será salva.
        var userName = $('#login-usuario').html();
        var imgName = userName + '.' + ext;
        var imgAnterior = $('#profileImg').attr('src');
        var fotoAtual = window.URL.createObjectURL(target.files[0]);

        // Muda imagem do perfil para preview
        landscape.attr('src', fotoAtual);
        $('.cr-boundary> img').attr('src', landscape.src);

        createCroppie(ext);

        // Mostra os Save/Cancel e o Zoom Slider;
        $('#imgChangeButton').hide();
        $('.cr-slider-wrap').show(500);
        $('#btn-save-cncl').show();

        // Limpa evendo do click pra não rodar mais vezes.
        $('#imgSaveButton').unbind('click');
        $('#imgSaveButton').click(function () {
            closeImgChangeButton();
            $('div.cr-slider-wrap').hide(500, function () {
                $('.avatar > .container').empty().append("<img id='profileImg' class='my-image'/>");
                $('.my-image').attr('src', ImageURL);
                landscape.croppie('destroy');
                landscape = $('.my-image');
                ImageURL = '';
            });

            // Split the base64 string in data and contentType
            var block = ImageURL.split(";");
            // Get the content type of the image
            var contentType = block[0].split(":")[1];// In this case "image/gif"
            // get the real base64 content of the file
            var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
            // Convert it to a blob to upload
            var blob = b64toBlob(realData, contentType);
            var fotoProBanco = new File([blob], imgName);
            // Create a FormData and append the file with "image" as parameter name
            var formDataToUpload = new FormData(fotoProBanco);
            formDataToUpload.append("image", fotoProBanco);
            // Envia a nova imagem para o banco.
            uploadImg(formDataToUpload);
            //Limpa o input.
            $('#fileUpload').val('');
            numFiles = 0;
        });

        $("#imgCancelButton").unbind('click');
        $('#imgCancelButton').click(function () {
            closeImgChangeButton();
            $('div.cr-slider-wrap').hide(500, function () {
                // Muda imagem do perfil para a antiga.
                $('.avatar > .container').empty().append("<img id='profileImg' class='my-image'/>");
                $('.my-image').attr('src', imgAnterior);
                landscape.croppie('destroy');
                landscape = $('.my-image');
                $('#fileUpload').val('');
                numFiles = 0;
                ImageURL = '';
            });
        });
    }
});

// Fechar botão de upar img;
$('.site-content').hover(function (event) {
    event.preventDefault();
    if (numFiles === 0 && ImageURL === '') {
        closeImgChangeButton();
    }
});

// Fechar botão de upar img;
$('html').click(function (e) {
    if (!$(e.target).hasClass('.avatar')) {
        if (numFiles === 0 && ImageURL === '') {
            closeImgChangeButton();
        }
    }
});

function closeImgChangeButton() {
    $('#imgChangeButton').show();
    $('#btn-save-cncl').hide();
    $('#imgChangeButton').css('visibility', 'hidden');
}

function uploadImg(form) {
    $.ajax({
        url: 'UpdateImagem', // Url do lado server que vai receber o arquivo
        data: form,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 12000,
        type: 'POST',
        beforeSend: function () {
            carregando();
        }
    })
            .done(function () {
                $(".preloader-wrapper").hide();
                Materialize.toast('Foto enviada com sucesso!', 6000, 'green');
            })
            .fail(function (jqXHR) {
                Materialize.toast('Erro ao adicionar foto, contate um administrador!', 6000, 'red');
                $(".preloader-wrapper").hide();
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
            });
}

function createCroppie(extention) {
    landscape.croppie({
        enforceBoundary: false,
        viewport: {//visible part of the cropped img
            width: 200,
            height: 200
        },
        boundary: {
            width: 200,
            height: 200
        },
        update: function (croppie) {
            // console.log('croppie updated avatar: ', croppie);
            landscape.croppie('result', {
                circle: false,
                format: extention,
                quality: 1,
                type: 'canvas'
            }).then(function (resp) {
                // console.log("result = ", resp);
                // landscapeLiveResultbox.attr('src', resp);
                ImageURL = resp;
            });
        }
    });
}
;


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
;

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
// Recupera indices

var mapDeLinguagens = new Map();
var flagLing = false;
var flagRep = false;
var flagComPost = false;


function pegaIndicesAJAX(id) {
    Materialize.Toast.removeAll();

    $.ajax({
        url: "RecuperarIndices",
        type: 'get',
        timeout: 8000,
        data: {
            id: id
        },
        beforeSend: function () {
            carregando();
        }
    })
            .done(function (resultados) {
                $(".preloader-wrapper").hide();
                var resultadoIndices = [];

                for (var i = 0; i < resultados.length; i++) {
                    resultadoIndices.push(resultados[i]);
                }

                preencheGraficos(resultadoIndices);

            })
            .fail(function (jqXHR, textStatus, resultados) {
                Materialize.toast('Erro ao recuperar índices, contate um administrador!', 6000, 'red');
                $(".preloader-wrapper").hide();
                if (jqXHR["status"] === 500) {
                    console.log("Erro 500, não foi possível estabelecer conexão com o servidor!");
                } else if (jqXHR["status"] === 502) {
                    console.log("Erro 502, não foi possível estabelecer conexão!");
                } else if (jqXHR["status"] === 404) {
                    console.log("Erro 404, não foi encontrado o diretório solicitado!");
                }
            });
}

function preencheGraficos(resultadoIndices) {
    $('.pieID--linguagens .pie-chart__legend').empty();

    for (var x = 0; x < resultadoIndices.length; x++) {
        var postouQualLinguagem = resultadoIndices[x]["postouQualLinguagem"];
        var postouQuantos = resultadoIndices[x]["postouQuantos"];
        var quantosDeslikes = resultadoIndices[x]["quantosDeslikes"];
        var quantosLikes = resultadoIndices[x]["quantosLikes"];
        var reputacao = resultadoIndices[x]["reputacao"];
        var postouQualMateria = resultadoIndices[x]["postouQualMateria"];
        montaDadosGrafico(postouQualLinguagem, postouQuantos, quantosLikes, quantosDeslikes, reputacao, postouQualMateria);
    }
    montaGraficosTela();
    createPieCharts();
}

function montaDadosGrafico(postouQualLinguagem, postouQuantos, quantosLikes, quantosDeslikes, reputacao, postouQualMateria) {

    if (postouQualLinguagem === "none") {
        $('.pieID--linguagens').hide();
        flagLing = false;
    } else {
        flagLing = true;
        postouQualLinguagem = postouQualLinguagem.split(",");
        if (mapDeLinguagens.has(postouQualLinguagem[0])) {
            var quantos = mapDeLinguagens.get(postouQualLinguagem[0]);
            mapDeLinguagens.delete(postouQualLinguagem[0]);
            quantos = parseInt(quantos) + parseInt(postouQualLinguagem[1]);
            mapDeLinguagens.set(postouQualLinguagem[0], quantos);
        } else {
            mapDeLinguagens.set(postouQualLinguagem[0], postouQualLinguagem[1]);
        }
    }
}
;

function montaGraficosTela() {
    // Soma de todas as postagens
    var quantasPostagens = 0;
    var quantosComentários = 0;
    var likes = 10;
    var deslikes = 0;

    mapDeLinguagens.forEach(function (item, key) {
        quantasPostagens = parseInt(quantasPostagens) + parseInt(item);
        $('.pieID--linguagens .pie-chart__legend').append("<li><em>" + key.toString() + "</em><span>" + item.toString() + "</span></li>");
        $('.pieID--linguagens').show();
    });

    if (quantasPostagens === 0 && quantosComentários === 0) {
        $('.pieID--micro-contribuicoes').hide();
        var flagComPost = false;
    } else {
        var flagComPost = true;
        $('.pieID--micro-contribuicoes').show();
        $('.pieID--micro-contribuicoes .pie-chart__legend').append('<li><em>Publicações</em><span>' + quantasPostagens + '</span></li>');
        $('.pieID--micro-contribuicoes .pie-chart__legend').append('<li><em>Comentários</em><span>0</span></li>');
    }

    if (likes === 0 && deslikes === 0) {
        $('.pieID--reputacao').hide();
        var flagRep = false;
    } else {
        var flagRep = true;
        $('.pieID--reputacao').show();
        $('.pieID--reputacao .pie-chart__legend').append('<li><em>Likes</em><span>' + likes + '</span></li>');
        $('.pieID--reputacao .pie-chart__legend').append('<li><em>Deslikes</em><span>' + deslikes + '</span></li>');
    }

    if (flagRep === false && flagComPost === false && flagLing === false) {
        $('#body-principal .wrapper1 #aviso').toggle('show');
    } else {
        $('#body-principal .wrapper1 #aviso').hide();
    }

}

// Plugin graficos;

function sliceSize(dataNum, dataTotal) {
    return (dataNum / dataTotal) * 360;
}

function addSlice(id, sliceSize, pieElement, offset, sliceID, color) {
    $(pieElement).append("<div class='slice " + sliceID + "'><span></span></div>");
    var offset = offset - 1;
    var sizeRotation = -179 + sliceSize;

    $(id + " ." + sliceID).css({
        "transform": "rotate(" + offset + "deg) translate3d(0,0,0)"
    });

    $(id + " ." + sliceID + " span").css({
        "transform": "rotate(" + sizeRotation + "deg) translate3d(0,0,0)",
        "background-color": color
    });
}

function iterateSlices(id, sliceSize, pieElement, offset, dataCount, sliceCount, color) {
    var
            maxSize = 179,
            sliceID = "s" + dataCount + "-" + sliceCount;

    if (sliceSize <= maxSize) {
        addSlice(id, sliceSize, pieElement, offset, sliceID, color);
    } else {
        addSlice(id, maxSize, pieElement, offset, sliceID, color);
        iterateSlices(id, sliceSize - maxSize, pieElement, offset + maxSize, dataCount, sliceCount + 1, color);
    }
}

function createPie(id) {
    var
            listData = [],
            listTotal = 0,
            offset = 0,
            i = 0,
            pieElement = id + " .pie-chart__pie"
    dataElement = id + " .pie-chart__legend"

    color = [
        "cornflowerblue",
        "olivedrab",
        "orange",
        "tomato",
        "crimson",
        "purple",
        "turquoise",
        "forestgreen",
        "navy"
    ];

    color = shuffle(color);

    $(dataElement + " span").each(function () {
        listData.push(Number($(this).html()));
    });

    for (i = 0; i < listData.length; i++) {
        listTotal += listData[i];
    }

    for (i = 0; i < listData.length; i++) {
        var size = sliceSize(listData[i], listTotal);
        iterateSlices(id, size, pieElement, offset, i, 0, color[i]);
        $(dataElement + " li:nth-child(" + (i + 1) + ")").css("border-color", color[i]);
        offset += size;
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }

    return a;
}

function createPieCharts() {
    createPie('.pieID--micro-contribuicoes');
    createPie('.pieID--reputacao');
    createPie('.pieID--linguagens');
}