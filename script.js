function optimizeGrid(width, height, numCells){
    // console.log(width, height, numCells)
    for(let cols = numCells; cols > 0; cols--){
        let p_rows = Math.ceil(numCells / cols);
        let p_height = width / cols * cellRatio * p_rows
        
        // console.log(p_height, height, cols, cellRatio)
        if(p_height > height){
            return cols+1;
        }

    }

    return 5;
}

function loadGrid(){
    console.log('load grid')
    table.empty();

    const win = $('#content');
    const pad = $('#padding');
    const w = win.width();
    const h = win.height() + pad.height();
    // console.log('h: ' + h);
    // return;
    cols = optimizeGrid(w,h,numCells)
    console.log('cols: ' + cols);
    const cellWidth = Math.floor(w / cols)
    const cellHeight = cellWidth * cellRatio
    
    
    if(hasLoadedImages){
        $('#content .cell img').attr({
            width: cellWidth + 'px',
            height: cellHeight + 'px'
        });
    } else {
        projOrder = projects.concat(duplicateProjects ? projects : []).sort(() => Math.random() > 0.5 ? 1 : -1)
    
        for(let i = 0; i < numCells; i++) {
            let proj = projOrder[i];
            let src = `./thumbnails/${projOrder[i].thumbnail}`;
            let cell = $(
                `<div class='cell ${proj.type}' id='p${proj.id}'>` +
                    `<img src=${src} width='${cellWidth}px' height='${cellHeight}px'>` + 
                `</div>`
            );
                // .css('width', cellHeight + 'px')
                // .css('max-height', Math.floor(w / cols * cellHeight) + 'px');
    
            cell.on('click', (e) => {
                e.preventDefault();

                console.log(e.currentTarget)
                loadProject($(e.currentTarget));
                modal.modal('show');
            });
    
            win.append(cell);
        }
        hasLoadedImages = true;
        win.css('flex', '0 1 auto');
    }
}

$('#filter button').click((e) => {
    console.log(e.target.id);
    $(e.target).addClass('btn-secondary').removeClass('btn-outline-secondary')
        .siblings().removeClass('btn-secondary').addClass('btn-outline-secondary');

    if(e.target.id === '4') {
        $('#content .cell').removeClass('hidden');
        return;    
    };

    $('#content .cell').addClass('hidden');
    if(e.target.id === '1'){
        $('#content .cell.video').removeClass('hidden');
    } else if(e.target.id === '2') {
        $('#content .cell.audio').removeClass('hidden');
    } else if(e.target.id === '3') {
        $('#content .cell.episodic').removeClass('hidden');
    }
});

function loadProject(projCell){
    console.log(projCell)
    let projID = projCell.attr('id').substring(1);
    let proj = projects[projID % projects.length];
    modal.attr('content-type', proj.type);
    switch (proj.type){
        case "video":
            modal.find('.video-wrapper iframe').attr('src', proj.content);
            break;
        case "audio":
            modal.find('.audio-wrapper audio source').attr('src', proj.content);
            break;
        case "episodic":
            proj.content.forEach(v => {

            })
            break;
    }
    modal.find('.modal-header').text(proj.name);
    modal.find('#desc').html(proj.description);
}

const table = $('#content table');
const duplicateProjects = true;
const cellRatio = 9.0 / 16.0;
var cols = 0;
var hasLoadedImages = false;
const modal = $('#content-player');
const projects = config.projects;
const numCells = projects.length * (duplicateProjects ? 2 : 1);

$(window).ready(() => {
    console.log("window ready")
    
    loadGrid();
    
})

$(window).resize(() => {
    loadGrid()
});

// loadGrid();

