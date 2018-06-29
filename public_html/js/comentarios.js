//console.log("comentarios")
function habilitaClickParaAbrirComentarios() {
    $('.onClikOpenComents').click(function () {
        var idPostagem = "";
//        console.log($(this).parent('div').attr("id"));
        idPostagem = $(this).parent('div').attr("id");
        $('#modal-comentarios').modal('open');
        $('.divDosComentariosRealizados').empty();
        recuperaComentariosDaPostagem(idPostagem);
    });
}

function recuperaComentariosDaPostagem(idPostagem) {
    $.ajax({
        url: "https://ifcommunity.herokuapp.com/post/comment",
        type: 'get',
        contentType: "application/json",
        crossDomain: true,
        data: {
            postId: idPostagem
        },
        beforeSend: function () {
            $("#progressComentarios").show();
        }
    })
            .done(function (comentarios) {
//                console.log(comentarios);
//                console.log(typeof (comentarios));
                $("#progressComentarios").hide();

                if (typeof (comentarios) != 'undefined') {
                    montaComentarios(comentarios);
                }

            })
            .fail(function (jqXHR, textStatus, postagem) {
                M.toast('Erro ao recuperar comentários, contate um administrador!', 6000, 'red');
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

function montaComentarios(comentarios) {
//    console.log(comentarios);

    sortResults(comentarios, 'commentId', false);

    $(jQuery.parseJSON(JSON.stringify(comentarios))).each(function (index) {
        var commentId = this.commentId;
        var registerDate = this.registerDate;
        var authorName = this.authorName;
        var commentText = this.commentText;
        var postId = this.postId;
        insereComentariosNaTela(commentId, registerDate, authorName, commentText, postId);
    });
}

function insereComentariosNaTela(commentId, registerDate, authorName, commentText, postId) {
//   2018-06-25 10:17:33.0
//   ÀS 21:11 26/06/2018

    //Manipulação da data da postagem
    var temporarioData = registerDate.split(" ");
    var temporarioHora = temporarioData[1].split(".");

    //Manipulação da hora da postagem
    var horaPostagem = temporarioHora[0];
    horaPostagem = horaPostagem.split(":");
    horaPostagem = horaPostagem[0] + ":" + horaPostagem[1];

    //Manipulação do dia do comentário
    var dataComentarioTemp = temporarioData[0];
    dataComentarioTemp = dataComentarioTemp.split("-");
    dataComentarioTemp = dataComentarioTemp[2] + "/" + dataComentarioTemp[1] + "/" + dataComentarioTemp[0];

    //Concatenação da data e hora manipulada
    registerDate = "às " + horaPostagem + " " + dataComentarioTemp;

    $('.divDosComentariosRealizados').append('<div id=' + commentId + ' class="comentariosRealizadosPorUsuarios col s12 acessibilidade"><div id="nomeUsuarioComentario' + commentId + '" class="col s8">' + authorName + '</div><div id="dataComentario" class="col s4 right-align">' + registerDate + '</div><div id="Comentario" class="textoComentariosRealizados col s12">' + commentText + '</div></div>');
    $('.divDosComentariosRealizados').append('<div class="commentIdToPostId" id="' + postId + '"</div>');

}

function sortResults(array, prop, asc) {
    array = array.sort(function (a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}

$('#textarea-comentarios').keyup(function () {
//    M.textareaAutoResize($('#textarea-comentarios'));
    var commentText = $('#textarea-comentarios').val();
    var commentSize = commentText.split('').length;
    var qtdCaract = 600 - commentSize;
    $('#caracteresRestantesComentario').text();
    $('#caracteresRestantesComentario').text("Caracteres restantes: " + qtdCaract);
})


$('#btn-submeter-comentarios').click(function () {

    var usuario = $(jQuery.parseJSON($.session.get('usuario')));
    var userId = usuario["0"].userId;
//    console.log(userId);
    var postId = $('.commentIdToPostId').attr('id');
    var commentText = $('#textarea-comentarios').val();

    var commentSize = commentText.split('');

    if (commentSize.length <= 600) {
        ajaxToSendComment(userId, postId, commentText);
    }

});

function ajaxToSendComment(userId, postId, commentText) {
    $.ajax({
        url: "https://ifcommunity.herokuapp.com/post/comment",
        type: 'post',
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify({
            postId: postId,
            authorId: userId,
            commentText: commentText
        }),
        beforeSend: function () {
            $("#progressComentarios").show();
        }
    })
            .done(function (critica) {
                console.log(critica);
                console.log(typeof (critica));
                $("#progressComentarios").hide();
                recuperaComentariosDaPostagem(postId);
            })
            .fail(function (jqXHR, textStatus, postagem) {
                M.toast('Erro ao postar comentário, contate um administrador!', 6000, 'red');
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
















