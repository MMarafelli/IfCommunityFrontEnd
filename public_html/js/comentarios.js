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
                $("main > section.minhas-materias").empty();

                if (typeof (comentarios) != 'undefined') {
                    montaComentarios(comentarios);
                }

            })
            .fail(function (jqXHR, textStatus, postagem) {
                Materialize.toast('Erro ao recuperar comentários, contate um administrador!', 6000, 'red');
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
        insereComentariosNaTela(commentId, registerDate, authorName, commentText);
    });
}

function insereComentariosNaTela(commentId, registerDate, authorName, commentText) {

    $('.divDosComentariosRealizados').append('<div id=' + commentId + ' class="comentariosRealizadosPorUsuarios col s12"><div id="nomeUsuarioComentario' + commentId + '" class="col s8">' + authorName + '</div><div id="dataComentario" class="col s4">' + registerDate + '</div><div id="Comentario" class="textoComentariosRealizados col s12">' + commentText + '</div></div>');

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