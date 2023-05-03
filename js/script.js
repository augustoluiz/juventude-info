click = {
    'quem_somos_texto': false,
    'nossos_lideres_texto': false,
    'calendario_div': false,
    'pibitaim_div': false
};

const dias = document.querySelector(".dias");
const dataAtual = document.querySelector(".calendario__data_atual");
const prevNextIcon = document.querySelectorAll(".calendario__icones span");
const cards_programacao = document.querySelector(".main__section__calendario__programacao");

const dadosEscala = (callback) => {
    fetch('https://raw.githubusercontent.com/augustoluiz/juventude-info/main/data/data.json')
    .then((response) => response.json())
    .then((json) => callback(json));
}

let escalaList = [];
let datas_escala = [];
let data = new Date();
let ano = data.getFullYear();
let mes = data.getMonth();

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function expandir_info(id_div) {
    const div = document.getElementById(id_div);
    if (!click[id_div]) {
        div.style.height = "auto";
        div.style.display = "flex";
        div.style.visibility = "visible";
        click[id_div] = true
    } else {
        div.style.height = "0px";
        div.style.display = "none";
        div.style.visibility = "hidden";
        click[id_div] = false;
    }
}

function renderCalendar(escala){
    if (escala != undefined){
        escalaList.push(escala);
        escala.data.forEach(d => datas_escala.push(Object.keys(d)[0]))
    }

    let primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
    let ultimaDataDoMes = new Date(ano, mes + 1, 0).getDate();
    let ultimoDiaDoMes = new Date(ano, mes, ultimaDataDoMes).getDay(); 
    let ultimaDataDoUltimoMes = new Date(ano, mes, 0).getDate();
    let liTag = "";

    for (let i = primeiroDiaDoMes; i > 0; i--) {
        liTag += `<li class="inactive">${ultimaDataDoUltimoMes - i + 1}</li>`;
    }
    for (let i = 1; i <= ultimaDataDoMes; i++) {
        let dataAtualFormatada = `${ano}-${String(new Date().getMonth()+1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
        let dataFormatada = `${ano}-${String(mes+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        let liId = `li_${dataFormatada}`

        let isToday = i === data.getDate() && mes === new Date().getMonth()
            && ano === new Date().getFullYear() ? "active" : "";
        
        if (datas_escala.includes(dataFormatada) && dataFormatada == dataAtualFormatada){
            gerarCardsProgramacao(dataFormatada)
        }

        let isProgramacao = datas_escala.includes(dataFormatada) ? "tem-programacao" : ""
        liTag += `<li class="${isToday} ${isProgramacao}" onclick="gerarProgramacao('${liId}')" id="${liId}">${i}</li>`;
    }
    for (let i = ultimoDiaDoMes; i < 6; i++) {
        liTag += `<li class="inactive">${i - ultimoDiaDoMes + 1}</li>`
    }
    dataAtual.innerText = `${meses[mes]} ${ano}`;
    dias.innerHTML = liTag;
}

dadosEscala(renderCalendar)

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        cards_programacao.innerHTML = '';
        mes = icon.id === "prev" ? mes - 1 : mes + 1;
        if (mes < 0 || mes > 11) {
            data = new Date(ano, mes, 1);
            ano = data.getFullYear();
            mes = data.getMonth();
        } else {
            data = new Date();
        }
        renderCalendar();
    });
});

function gerarProgramacao(liId){
    dataFormatada = liId.split('li_')[1]

    cards_programacao.innerHTML = '';
    li_dia = document.getElementById(liId)
    li_dia.classList.add("active");
    ul_dia = document.getElementById("ul_dias");
    ul_dia.childNodes.forEach(li => {
        if(li.id != liId){
            li.classList.remove("active");
        }
    })
    
    if (isProgramacao(dataFormatada)){
        gerarCardsProgramacao(dataFormatada)
    }
}

function isProgramacao(data){
    return datas_escala.includes(data);
}

function gerarCardsProgramacao(dataFormatada){
    cards_programacao.innerHTML = '';
    programacao = escalaList[0].data.find(a => Object.keys(a)[0] == dataFormatada)[dataFormatada]
    programacao.forEach(p => {
        h1Tag = `<h1 class="main__section__calendario__programacao__card__titulo">${p.nome}</h1>`;
        liTagDescricao = ''
        pTag = ''

        if (p.descricao != null && p.descricao.length > 0) {
            liTagDescricao = `<li class="main__section__calendario__programacao__card__ul__li"><p>${p.descricao}</p></li>`
        }
        if (p.horario != null && p.horario.length > 0) {
            liTagHorario = `<li class="main__section__calendario__programacao__card__ul__li"><p><strong>Horário: </strong>${p.horario}</p></li>`
        }
        if (p.obs != null && p.obs.length > 0){
            pTag = `<p class="main__section__calendario__programacao__card__p">Obs: ${p.obs}</p>`
        }

        ulTag = `<ul class="main__section__calendario__programacao__card__ul">${liTagDescricao}${liTagHorario}</ul>`
        divTag = `<div class="main__section__calendario__programacao__card">${h1Tag}${ulTag}${pTag}</div>`;
        cards_programacao.innerHTML += divTag
    })
}