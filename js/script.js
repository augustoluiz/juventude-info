click = {
    'quem_somos_texto': false,
    'nossos_lideres_texto': false,
    'programacoes_texto': false
};

function expandir_info(id_div) {
    const div = document.getElementById(id_div);
    if (!click[id_div]) {
        div.style.height = "auto";
        div.style.visibility = "visible";
        click[id_div] = true
    } else {
        div.style.height = "0px";
        div.style.visibility = "hidden";
        click[id_div] = false;
    }
}