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
    console.log(this.files[0].size);
    var target = event.target || event.srcElement;
    if (target.value.length === 0) {
        if (numFiles === target.files.length) {
        }
    } else if (this.files[0].size > 999999) {
        var ext = this.value.match(/\.([^\.]+)$/)[1];
        Materialize.toast('Tamanho máximo de imagem é 1 megabyte!', 6000, 'red');
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
        landscape = $('.my-image');

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


            // Envia foto para o banco;
            uploadImg(ImageURL);

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

function uploadImg(ImageURL) {
    $.ajax({
        url: 'https://ifcommunity.herokuapp.com/user/photo', // Url do lado server que vai receber o arquivo
        type: 'POST',
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify({
            "userId": userId,
            "photoHash": ImageURL
        }),
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
//    console.log("aqui cropie")
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
//             console.log('croppie updated avatar: ', croppie);
            landscape.croppie('result', {
                circle: false,
                format: extention,
                quality: 0.1,
                type: 'canvas'
            }).then(function (resp) {
//                console.log(resp.length)
                // console.log("result = ", resp);
                // landscapeLiveResultbox.attr('src', resp);
                ImageURL = resp;
            });
        }
    });
}
;